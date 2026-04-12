# Database Schema

## Overview

Planned schema for the personal finance app MVP focused on:

- `Supabase Postgres`
- global system categories + user custom categories
- income and expenses in a single entries table
- `RLS` for user isolation
- deleting custom categories only when they are unused

## Modeling Decisions

- use `uuid` as the primary key
- use `amount_cents integer` for monetary values
- use `date` in `entry_date` for financial reports
- use a single `entries` table for both income and expenses
- use both global system categories and private user categories
- prevent deletion of used categories with `on delete restrict`
- allow physical deletion only for unused custom categories

## Entities

1. `profiles`
2. `categories`
3. `entries`

## Enums

### `category_type`

- `income`
- `expense`

### `entry_type`

- `income`
- `expense`

## `profiles` Table

Responsible for storing authenticated user preferences and basic data.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null unique`
- `display_name text`
- `currency text not null default 'BRL'`
- `locale text not null default 'pt-BR'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- `user_id` references `auth.users(id)`
- `currency` must have 3 characters

## `categories` Table

Supports two scopes:

- global system category
- user custom category

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid null`
- `name text not null`
- `type category_type not null`
- `color text not null`
- `icon text`
- `is_archived boolean not null default false`
- `is_system boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Scope rule:

- if `is_system = true`, `user_id` must be `null`
- if `is_system = false`, `user_id` must be the owner of the category

Business rules:

- global categories are read-only for regular users
- custom categories can be edited by the owner
- unused custom categories can be deleted
- custom categories with usage cannot be deleted, only archived

## `entries` Table

Single table for all financial entries in the MVP.

Fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null`
- `category_id uuid not null`
- `type entry_type not null`
- `amount_cents integer not null`
- `description text not null`
- `notes text`
- `entry_date date not null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Business rules:

- `amount_cents` is always positive
- `description` is required
- `entry_date` drives reports
- category is required
- category must be global or belong to the current user
- category must have the same `type` as the entry
- archived categories must not receive new entries

## Integrity and Trade-Offs

With this simple modeling, Postgres alone does not guarantee that:

- `entries.type = categories.type`
- `entries.user_id = categories.user_id` when the category is not global

Because of that, the recommended strategy is:

1. validate this in the application when creating/updating `entries`
2. reinforce it with `RLS`
3. keep the option to add a trigger later if needed

## Category Deletion Strategy

Rules:

1. if `is_system = true`: block deletion
2. if a custom category already has entries: block deletion and offer archiving
3. if a custom category has no entries: allow physical deletion

Reason:

- preserve history
- avoid broken references
- keep the database clean for categories created by mistake

## Indexes

Planned indexes:

- `entries(user_id, entry_date desc)`
- `entries(user_id, type, entry_date desc)`
- `entries(user_id, category_id, entry_date desc)`
- `categories(type, is_archived, name)` for global categories
- `categories(user_id, type, is_archived, name)` for user categories

Partial unique indexes:

- global categories cannot be duplicated by `type + lower(name)`
- user categories cannot be duplicated by `user_id + type + lower(name)`

## RLS

All domain tables must have `row level security enabled`.

### `profiles`

The user can:

- read only their own profile
- insert only their own profile
- update only their own profile

Condition:

- `auth.uid() = user_id`

### `categories`

The user can:

- read global categories
- read their own categories
- insert only their own categories
- update only their own categories
- delete only their own categories

Users cannot:

- edit global categories
- delete global categories

### `entries`

The user can:

- read only their own entries
- insert only their own entries
- update only their own entries
- delete only their own entries

## Global System Categories

### Income

- `Salary`
- `Freelance`
- `Investments`
- `Gifts`
- `Reimbursements`
- `Other`

### Expense

- `Housing`
- `Food`
- `Transport`
- `Health`
- `Leisure`
- `Education`
- `Subscriptions`
- `Bills`
- `Shopping`
- `Taxes`
- `Other`

## Recommended Application Validation

When creating or editing an entry, validate:

1. the category exists
2. the category is global or belongs to the authenticated user
3. `category.type = entry.type`
4. `is_archived = false`

Logical query:

```sql
select id
from public.categories
where id = $1
  and type = $2
  and is_archived = false
  and (
    is_system = true
    or user_id = auth.uid()
  );
```

## Recommended Validation for Category Delete

Before deleting a custom category, check whether it is used:

```sql
select exists (
  select 1
  from public.entries
  where category_id = $1
);
```

If usage exists:

- do not delete
- offer archiving instead

## Full SQL DDL

```sql
-- Extensions
create extension if not exists pgcrypto;

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'category_type') then
    create type public.category_type as enum ('income', 'expense');
  end if;

  if not exists (select 1 from pg_type where typname = 'entry_type') then
    create type public.entry_type as enum ('income', 'expense');
  end if;
end $$;

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  currency text not null default 'BRL',
  locale text not null default 'pt-BR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_currency_len_check check (char_length(currency) = 3)
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type public.category_type not null,
  color text not null,
  icon text,
  is_archived boolean not null default false,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (char_length(trim(name)) > 0),
  constraint categories_scope_check check (
    (is_system = true and user_id is null) or
    (is_system = false and user_id is not null)
  )
);

-- Entries
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  type public.entry_type not null,
  amount_cents integer not null,
  description text not null,
  notes text,
  entry_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entries_amount_positive check (amount_cents > 0),
  constraint entries_description_not_blank check (char_length(trim(description)) > 0)
);

-- Updated_at triggers
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_entries_updated_at on public.entries;
create trigger set_entries_updated_at
before update on public.entries
for each row
execute function public.set_updated_at();

-- Unique partial indexes for categories
create unique index if not exists categories_system_unique_idx
on public.categories (type, lower(name))
where is_system = true;

create unique index if not exists categories_user_unique_idx
on public.categories (user_id, type, lower(name))
where is_system = false;

-- Query indexes
create index if not exists entries_user_date_idx
on public.entries (user_id, entry_date desc);

create index if not exists entries_user_type_date_idx
on public.entries (user_id, type, entry_date desc);

create index if not exists entries_user_category_date_idx
on public.entries (user_id, category_id, entry_date desc);

create index if not exists categories_system_list_idx
on public.categories (type, is_archived, name)
where is_system = true;

create index if not exists categories_user_list_idx
on public.categories (user_id, type, is_archived, name)
where is_system = false;

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.entries enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Categories policies
drop policy if exists "categories_select_visible" on public.categories;
create policy "categories_select_visible"
on public.categories
for select
using (
  is_system = true or user_id = auth.uid()
);

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
on public.categories
for insert
with check (
  is_system = false and user_id = auth.uid()
);

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
on public.categories
for update
using (
  is_system = false and user_id = auth.uid()
)
with check (
  is_system = false and user_id = auth.uid()
);

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
on public.categories
for delete
using (
  is_system = false and user_id = auth.uid()
);

-- Entries policies
drop policy if exists "entries_select_own" on public.entries;
create policy "entries_select_own"
on public.entries
for select
using (user_id = auth.uid());

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own"
on public.entries
for insert
with check (user_id = auth.uid());

drop policy if exists "entries_update_own" on public.entries;
create policy "entries_update_own"
on public.entries
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_delete_own"
on public.entries
for delete
using (user_id = auth.uid());

-- Global categories seed
insert into public.categories (user_id, name, type, color, icon, is_archived, is_system)
values
  (null, 'Salário',       'income',  '#34d399', 'wallet',            false, true),
  (null, 'Freelance',     'income',  '#60a5fa', 'briefcase',         false, true),
  (null, 'Investimentos', 'income',  '#a78bfa', 'chart-column',      false, true),
  (null, 'Presentes',     'income',  '#f59e0b', 'gift',              false, true),
  (null, 'Reembolsos',    'income',  '#22c55e', 'receipt',           false, true),
  (null, 'Outros',        'income',  '#94a3b8', 'circle-ellipsis',   false, true),

  (null, 'Moradia',       'expense', '#fb7185', 'house',             false, true),
  (null, 'Alimentação',   'expense', '#f97316', 'utensils',          false, true),
  (null, 'Transporte',    'expense', '#38bdf8', 'car',               false, true),
  (null, 'Saúde',         'expense', '#ef4444', 'heart-pulse',       false, true),
  (null, 'Lazer',         'expense', '#8b5cf6', 'popcorn',           false, true),
  (null, 'Educação',      'expense', '#eab308', 'graduation-cap',    false, true),
  (null, 'Assinaturas',   'expense', '#6366f1', 'repeat',            false, true),
  (null, 'Contas',        'expense', '#06b6d4', 'file-text',         false, true),
  (null, 'Compras',       'expense', '#ec4899', 'shopping-bag',      false, true),
  (null, 'Impostos',      'expense', '#f43f5e', 'badge-percent',     false, true),
  (null, 'Outros',        'expense', '#94a3b8', 'circle-ellipsis',   false, true)
on conflict do nothing;
```

## Final Notes

- `on delete restrict` on `entries.category_id` protects history
- global categories are immutable for regular users
- unused custom categories can be removed
- for extra future protection, a trigger can be added to validate compatibility between `entries` and `categories`

## Natural Next Step

Generate the equivalent version for:

1. `Drizzle schema`
2. `Zod` validations
3. query functions for dashboard and reports
