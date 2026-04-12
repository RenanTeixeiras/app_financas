# Current Project Status

## Overview

This document summarizes everything completed so far in the `app_financas` project, which technical decisions were applied, what is already ready in the code and in the database, and the current state of the product.

The goal is to leave a clear record of the accumulated progress after the completion of Sprint 3 and the planning of Sprint 4.

---

## Repository Structure

The repository is organized like this:

- `app/`: executable application code
- `DOCS/`: planning, schema, and sprint documentation

This organization separates well:

- implementation
- planning
- technical documentation

---

## Defined Product Direction

The app was defined as a personal finance web application focused on:

- logging income and expenses quickly
- tracking the monthly balance
- understanding income sources
- understanding where the money went
- working well on mobile in daily use
- keeping the architecture simple and ready to grow

Chosen visual direction:

- minimal premium
- luxurious, but restrained
- modern glassmorphism
- dark-first

---

## Finalized Stack

Consolidated stack:

- `Next.js`
- `TypeScript`
- `Tailwind CSS v4`
- `Supabase`
- `Supabase Auth`
- `Drizzle ORM`
- `Zod`
- `Server Actions`
- `PWA`

Core dependencies already added to the project:

- `@supabase/ssr`
- `@supabase/supabase-js`
- `drizzle-orm`
- `drizzle-kit`
- `zod`
- `next-themes`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `lucide-react`
- `dotenv`
- `postgres`
- `react-hook-form`
- `@hookform/resolvers`

---

## Applied Architectural Decisions

Adopted pattern:

- `modular monolith`

Planned main modules:

- `auth`
- `dashboard`
- `entries`
- `categories`
- `reports`
- `settings`

The current technical structure follows that direction.

---

## Sprint 1 - Foundation

### Sprint 1 Goals

1. create the base project with Next.js and TypeScript
2. configure Tailwind, tokens, and dark/light theme
3. configure Supabase Auth
4. structure App Router and private layout
5. define the initial schema with Drizzle
6. prepare the base PWA

### What Was Delivered

#### Project base

- Next.js project created inside `app/`
- TypeScript configured
- App Router working
- `dev`, `build`, `lint`, and `db:*` scripts configured

#### Theme and visual base

- visual tokens created in `app/src/styles/tokens.css`
- `globals.css` adjusted to the product theme
- typography with `Inter` and `JetBrains Mono`
- initial premium visual shell created

#### Layout structure

- root layout configured in `app/src/app/layout.tsx`
- `ThemeProvider` integrated
- private layout created in `app/src/app/(app)/layout.tsx`
- desktop sidebar created
- mobile bottom nav created

#### Base routes created

- `/`
- `/login`
- `/dashboard`
- `/entries`
- `/categories`
- `/reports`
- `/settings`

#### Base PWA

- manifest created in `app/src/app/manifest.ts`

#### Base Drizzle

- `drizzle.config.ts` created
- `.env.example` created
- base schema created in:
  - `app/src/lib/db/schema/enums.ts`
  - `app/src/lib/db/schema/profiles.ts`
  - `app/src/lib/db/schema/categories.ts`
  - `app/src/lib/db/schema/entries.ts`
  - `app/src/lib/db/schema/relations.ts`
  - `app/src/lib/db/schema/index.ts`

### Sprint 1 Status

- **Sprint 1 successfully closed**

---

## Sprint 2 - Categories and Data Layer

### Sprint 2 Goals

1. create `profiles` table
2. create `categories` table
3. create default categories seed
4. implement categories CRUD
5. validate rules by type
6. apply RLS to the tables

### What Was Delivered in Code

#### Real Supabase integration

- integration adjusted to use:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- support added for:
  - `DATABASE_URL`
  - `DATABASE_MIGRATE_URL`

Related files:

- `app/src/lib/supabase/client.ts`
- `app/src/lib/supabase/server.ts`
- `app/drizzle.config.ts`

#### Authentication

Implemented:

- magic-link login
- callback at `/auth/callback`
- server-side session
- server-side guard in the private layout

Files:

- `app/src/actions/auth/sign-in.ts`
- `app/src/app/auth/callback/route.ts`
- `app/src/lib/auth/session.ts`
- `app/src/lib/auth/guards.ts`
- `app/src/app/(auth)/login/page.tsx`
- `app/src/app/(app)/layout.tsx`

#### Database client

- `app/src/lib/db/client.ts`

#### Validations

Zod validations created for:

- categories
- entries

Files:

- `app/src/lib/validations/category.ts`
- `app/src/lib/validations/entry.ts`

#### Queries

Base queries implemented for:

- visible categories
- user-editable category
- category usage check
- category validation for entry creation
- entry listing
- lookup by ID
- recent entries
- monthly summary

Files:

- `app/src/lib/db/queries/categories.ts`
- `app/src/lib/db/queries/entries.ts`

#### Server Actions

Implemented category actions:

- create
- update
- archive
- delete

Implemented entry actions:

- create
- update
- delete

Files:

- `app/src/actions/categories/create-category.ts`
- `app/src/actions/categories/update-category.ts`
- `app/src/actions/categories/archive-category.ts`
- `app/src/actions/categories/delete-category.ts`
- `app/src/actions/entries/create-entry.ts`
- `app/src/actions/entries/update-entry.ts`
- `app/src/actions/entries/delete-entry.ts`

#### Manual Supabase SQL

Created in:

- `app/supabase/001_updated_at.sql`
- `app/supabase/002_rls.sql`
- `app/supabase/003_policies.sql`
- `app/supabase/004_seed_categories.sql`

#### Minimal functional category UI

The categories page stopped being a placeholder and started allowing:

- custom category creation
- custom category editing
- archive/unarchive
- deletion of unused categories
- display of global categories as read-only

File:

- `app/src/app/(app)/categories/page.tsx`

### What Was Delivered in the Database

#### Drizzle migration applied

Generated and registered migration:

- `app/drizzle/0000_dashing_doctor_doom.sql`

Confirmed tables in the database:

- `profiles`
- `categories`
- `entries`

Confirmed Drizzle control table:

- `drizzle.__drizzle_migrations`

#### Confirmed triggers

`updated_at` triggers applied:

- `set_profiles_updated_at`
- `set_categories_updated_at`
- `set_entries_updated_at`

#### Confirmed RLS

RLS active on:

- `profiles`
- `categories`
- `entries`

#### Confirmed policies

Created policies:

- `profiles_select_own`
- `profiles_insert_own`
- `profiles_update_own`
- `categories_select_visible`
- `categories_insert_own`
- `categories_update_own`
- `categories_delete_own`
- `entries_select_own`
- `entries_insert_own`
- `entries_update_own`
- `entries_delete_own`

#### Confirmed seed

Inserted global categories:

- `income`: 6
- `expense`: 11

### Important technical adjustment

It was necessary to separate runtime URL from migration URL:

- `DATABASE_URL`
- `DATABASE_MIGRATE_URL`

Reason:

- the `db.<project>.supabase.co` host was resolving to IPv6 in the environment
- this caused `drizzle-kit migrate` to hang
- the migration became viable using the pooler URL in `DATABASE_MIGRATE_URL`

### Sprint 2 Status

- **Sprint 2 successfully closed**

---

## Sprint 3 - Entries

### Sprint 3 Goals

1. implement the real entries listing
2. create the creation form
3. create the editing form
4. allow UI deletion
5. implement filters by month, type, and category
6. add description search
7. guarantee mobile-first experience

### What Was Delivered in Code

#### Real entries page

The `/entries` route stopped being a placeholder and started using real database queries, with:

- functional header
- new entry button
- query-string filters
- visual error and success messages
- empty state without data
- filtered empty state

File:

- `app/src/app/(app)/entries/page.tsx`

#### Entries components

The base module components were created:

- `entry-form.tsx`
- `entry-filters.tsx`
- `entry-list.tsx`
- `entry-card.tsx`

Files:

- `app/src/components/entries/entry-form.tsx`
- `app/src/components/entries/entry-filters.tsx`
- `app/src/components/entries/entry-list.tsx`
- `app/src/components/entries/entry-card.tsx`

#### Creation and editing routes

The following routes were implemented:

- `/entries/new`
- `/entries/[id]/edit`

With that, the user can now:

- create income
- create expense
- edit an existing entry
- delete an entry from the edit screen

Files:

- `app/src/app/(app)/entries/new/page.tsx`
- `app/src/app/(app)/entries/[id]/edit/page.tsx`

#### Functional filters

Implemented filters:

- month
- type
- category
- description search

Month-to-range conversion was added before querying the database.

#### User-friendly monetary field

A user-friendly BRL amount field was implemented, with:

- typing-time formatting
- conversion to `amountCents`
- correct prefilling during editing

Files:

- `app/src/lib/utils/currency.ts`
- `app/src/components/entries/entry-form.tsx`

#### Date utilities

Utilities were added for:

- calculating the selected month range
- formatting list dates

File:

- `app/src/lib/utils/date.ts`

#### Local database connection adjustment

The `DATABASE_LOCAL_URL` variable was introduced to stabilize local runtime in environments where the direct Supabase connection had IPv6 problems.

Applied rule:

- local development prioritizes `DATABASE_LOCAL_URL`
- production continues using `DATABASE_URL`
- migrations continue using `DATABASE_MIGRATE_URL`

Files:

- `app/src/lib/db/client.ts`
- `app/.env.example`

#### Redirect flow fix

The issue where `redirect()` was caught by `try/catch` and surfaced as a `NEXT_REDIRECT` UI error was fixed.

This adjustment was applied to:

- `entries` flow
- `categories` flow

### Sprint 3 Status

- **Sprint 3 successfully closed**

---

## Current Database State

Current Supabase database:

- tables created
- triggers applied
- RLS active
- policies applied
- global category seed applied

That means the application's infrastructure is already functional in the real environment.

---

## Current App State

Today the app already has:

- initial landing page
- magic-link login
- authentication callback
- server-side protection for private routes
- base dashboard
- functional categories page
- functional entries page backed by real data
- entry creation
- entry editing
- entry deletion from the edit screen
- month, type, category, and description filters
- reports page still as a visual placeholder
- settings page still as a visual placeholder

---

## What Has Not Been Done Yet

Main remaining items:

### Sprint 4

- real dashboard with database data
- income and expense summary
- net balance
- recent entries
- category breakdown

### Sprint 5

- more complete reports
- better empty states
- loading states
- additional visual polish

### Sprint 6

- final PWA refinement
- microinteractions
- accessibility
- final performance review
- final deployment preparation

---

## Documentation Created So Far

Existing files in `DOCS/`:

- `STACK_FINAL_FINANCAS.md`
- `PLANEJAMENTO_APP_FINANCAS.md`
- `DATABASE_SCHEMA.md`
- `DRIZZLE_SCHEMA.md`
- `SUPABASE_INFO_PROMPT.md`
- `SPRINT_3.md`
- `SPRINT_4.md`
- `STATUS_SPRINT_3.md`

This file complements that documentation with a consolidated view of progress.

---

## Conclusion

Current project situation:

- architecture defined
- stack consolidated
- Sprint 1 completed
- Sprint 2 completed
- Sprint 3 completed
- real database provisioned on Supabase
- authentication working in code
- categories working in code and database
- entries working in code, UI, and database

In summary, the project has left the planning and infrastructure stage and entered the real functional implementation stage of the product, with the entries module operational.
