# Database Schema

## Visao Geral

Schema planejado para o MVP do app de financas pessoais com foco em:

- `Supabase Postgres`
- categorias globais do sistema + categorias personalizadas do usuario
- receitas e despesas em uma unica tabela de lancamentos
- `RLS` para isolamento por usuario
- exclusao de categoria personalizada apenas quando nao houver uso

## Decisoes de Modelagem

- usar `uuid` como chave primaria
- usar `amount_cents integer` para valores monetarios
- usar `date` em `entry_date` para relatorios financeiros
- usar uma unica tabela `entries` para receitas e despesas
- usar categorias globais do sistema e categorias privadas por usuario
- impedir exclusao de categoria em uso com `on delete restrict`
- permitir exclusao fisica apenas para categorias personalizadas sem uso

## Entidades

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

## Tabela `profiles`

Responsavel por guardar preferencias e dados basicos do usuario autenticado.

Campos:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null unique`
- `display_name text`
- `currency text not null default 'BRL'`
- `locale text not null default 'pt-BR'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Regras:

- `user_id` referencia `auth.users(id)`
- `currency` deve ter 3 caracteres

## Tabela `categories`

Suporta dois escopos:

- categoria global do sistema
- categoria personalizada do usuario

Campos:

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

Regra de escopo:

- se `is_system = true`, `user_id` deve ser `null`
- se `is_system = false`, `user_id` deve ser o dono da categoria

Regras de negocio:

- categorias globais sao somente leitura para usuarios comuns
- categorias personalizadas podem ser editadas pelo dono
- categorias personalizadas sem uso podem ser deletadas
- categorias personalizadas com uso nao podem ser deletadas, apenas arquivadas

## Tabela `entries`

Tabela unica para todos os lancamentos financeiros do MVP.

Campos:

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

Regras de negocio:

- `amount_cents` sempre positivo
- `description` obrigatoria
- `entry_date` dirige relatorios
- categoria obrigatoria
- categoria deve ser global ou do proprio usuario
- categoria deve ter o mesmo `type` do lancamento
- categorias arquivadas nao devem receber novos lancamentos

## Integridade e Trade-offs

O Postgres, com essa modelagem simples, nao garante sozinho que:

- `entries.type = categories.type`
- `entries.user_id = categories.user_id` quando a categoria nao for global

Por isso, a estrategia recomendada e:

1. validar isso na aplicacao ao criar/editar `entries`
2. reforcar com `RLS`
3. manter opcao de adicionar `trigger` futuramente, se necessario

## Estrategia de Exclusao de Categoria

Regras:

1. se `is_system = true`: bloquear exclusao
2. se categoria personalizada tiver lancamentos: bloquear exclusao e oferecer arquivamento
3. se categoria personalizada nao tiver lancamentos: permitir exclusao fisica

Motivo:

- preservar historico
- evitar referencias quebradas
- manter banco limpo para categorias criadas por engano

## Indices

Indices planejados:

- `entries(user_id, entry_date desc)`
- `entries(user_id, type, entry_date desc)`
- `entries(user_id, category_id, entry_date desc)`
- `categories(type, is_archived, name)` para globais
- `categories(user_id, type, is_archived, name)` para categorias do usuario

Indices unicos parciais:

- categorias globais nao podem duplicar por `type + lower(name)`
- categorias do usuario nao podem duplicar por `user_id + type + lower(name)`

## RLS

Todas as tabelas de dominio devem ter `row level security enabled`.

### `profiles`

Usuario pode:

- ler apenas o proprio profile
- inserir apenas o proprio profile
- atualizar apenas o proprio profile

Condicao:

- `auth.uid() = user_id`

### `categories`

Usuario pode:

- ler categorias globais
- ler categorias proprias
- inserir apenas categorias proprias
- atualizar apenas categorias proprias
- deletar apenas categorias proprias

Usuarios nao podem:

- editar categorias globais
- deletar categorias globais

### `entries`

Usuario pode:

- ler apenas os proprios lancamentos
- inserir apenas os proprios lancamentos
- atualizar apenas os proprios lancamentos
- deletar apenas os proprios lancamentos

## Categorias Globais do Sistema

### Receitas

- `Salario`
- `Freelance`
- `Investimentos`
- `Presentes`
- `Reembolsos`
- `Outros`

### Despesas

- `Moradia`
- `Alimentacao`
- `Transporte`
- `Saude`
- `Lazer`
- `Educacao`
- `Assinaturas`
- `Contas`
- `Compras`
- `Impostos`
- `Outros`

## Validacao Recomendada na Aplicacao

Ao criar ou editar um lancamento, validar:

1. a categoria existe
2. a categoria e global ou pertence ao usuario autenticado
3. `category.type = entry.type`
4. `is_archived = false`

Consulta logica:

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

## Validacao Recomendada para Delete de Categoria

Antes de deletar uma categoria personalizada, verificar se existe uso:

```sql
select exists (
  select 1
  from public.entries
  where category_id = $1
);
```

Se existir uso:

- nao deletar
- oferecer arquivamento

## DDL SQL Completo

```sql
-- Extensoes
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

-- Seed de categorias globais
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

## Observacoes Finais

- `on delete restrict` em `entries.category_id` protege o historico
- categorias globais sao imutaveis para usuarios comuns
- categorias personalizadas sem uso podem ser removidas
- para blindagem extra futura, pode ser adicionada `trigger` validando compatibilidade entre `entries` e `categories`

## Proximo Passo Natural

Gerar a versao equivalente em:

1. `Drizzle schema`
2. validacoes `Zod`
3. funcoes de consulta para dashboard e relatorios
