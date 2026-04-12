# Drizzle Schema

## Overview

Documentation for the planned `drizzle-orm/pg-core` schema for the personal finance app.

Goals:

- mirror the schema defined in `DATABASE_SCHEMA.md`
- keep income and expenses in a single table
- support global system categories and user custom categories
- prepare the base for `Supabase + Drizzle + Next.js`

## Recommended File Structure

```txt
src/lib/db/schema/
  enums.ts
  profiles.ts
  categories.ts
  entries.ts
  relations.ts
```

## Proposed Schema

```ts
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);
export const entryTypeEnum = pgEnum("entry_type", ["income", "expense"]);

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().unique(),
    displayName: text("display_name"),
    currency: text("currency").notNull().default("BRL"),
    locale: text("locale").notNull().default("pt-BR"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("profiles_currency_len_check", sql`char_length(${table.currency}) = 3`),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id"),
    name: text("name").notNull(),
    type: categoryTypeEnum("type").notNull(),
    color: text("color").notNull(),
    icon: text("icon"),
    isArchived: boolean("is_archived").notNull().default(false),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "categories_name_not_blank",
      sql`char_length(trim(${table.name})) > 0`,
    ),
    check(
      "categories_scope_check",
      sql`(
        (${table.isSystem} = true and ${table.userId} is null) or
        (${table.isSystem} = false and ${table.userId} is not null)
      )`,
    ),
    uniqueIndex("categories_system_unique_idx")
      .on(table.type, sql`lower(${table.name})`)
      .where(sql`${table.isSystem} = true`),
    uniqueIndex("categories_user_unique_idx")
      .on(table.userId, table.type, sql`lower(${table.name})`)
      .where(sql`${table.isSystem} = false`),
    index("categories_system_list_idx")
      .on(table.type, table.isArchived, table.name)
      .where(sql`${table.isSystem} = true`),
    index("categories_user_list_idx")
      .on(table.userId, table.type, table.isArchived, table.name)
      .where(sql`${table.isSystem} = false`),
  ],
);

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    type: entryTypeEnum("type").notNull(),
    amountCents: integer("amount_cents").notNull(),
    description: text("description").notNull(),
    notes: text("notes"),
    entryDate: date("entry_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("entries_amount_positive", sql`${table.amountCents} > 0`),
    check(
      "entries_description_not_blank",
      sql`char_length(trim(${table.description})) > 0`,
    ),
    index("entries_user_date_idx").on(table.userId, table.entryDate),
    index("entries_user_type_date_idx").on(
      table.userId,
      table.type,
      table.entryDate,
    ),
    index("entries_user_category_date_idx").on(
      table.userId,
      table.categoryId,
      table.entryDate,
    ),
  ],
);
```

## Relations

```ts
import { relations } from "drizzle-orm";

export const profilesRelations = relations(profiles, () => ({}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  category: one(categories, {
    fields: [entries.categoryId],
    references: [categories.id],
  }),
}));
```

## Important Notes

1. `auth.users` is usually not modeled directly in the application Drizzle schema.
2. Because of that, `userId` can remain a plain `uuid` in the TypeScript schema.
3. Foreign keys to `auth.users(id)` can remain in manual SQL migrations.
4. The `updated_at` trigger should also stay in manual SQL migrations.
5. `RLS` and policies remain outside of the Drizzle schema and should be added in manual SQL.

## Proposed Zod Validations

```ts
import { z } from "zod";

export const entryTypeSchema = z.enum(["income", "expense"]);
export const categoryTypeSchema = z.enum(["income", "expense"]);

const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Invalid color");

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: categoryTypeSchema,
  color: hexColorSchema,
  icon: z.string().trim().min(1).max(50).nullable().optional(),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(60),
  color: hexColorSchema,
  icon: z.string().trim().min(1).max(50).nullable().optional(),
  isArchived: z.boolean().optional(),
});

export const archiveCategorySchema = z.object({
  id: z.string().uuid(),
  isArchived: z.boolean(),
});

export const createEntrySchema = z.object({
  categoryId: z.string().uuid(),
  type: entryTypeSchema,
  amountCents: z.number().int().positive(),
  description: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(1000).nullable().optional(),
  entryDate: z.string().date(),
});

export const updateEntrySchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: entryTypeSchema,
  amountCents: z.number().int().positive(),
  description: z.string().trim().min(1).max(120),
  notes: z.string().trim().max(1000).nullable().optional(),
  entryDate: z.string().date(),
});

export const entryFiltersSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  type: entryTypeSchema.optional(),
  categoryId: z.string().uuid().optional(),
  query: z.string().trim().max(120).optional(),
});
```

## Required Domain Validations in the Application

When creating or editing `entries`, add extra checks beyond Zod:

1. category exists
2. category is not archived
3. category is global or belongs to the authenticated user
4. `category.type === entry.type`

## Base Queries in Drizzle

### Monthly Summary

```ts
import { and, eq, gte, lte, sql, desc } from "drizzle-orm";
import { entries, categories } from "../schema";

export async function getMonthlySummary(db: any, userId: string, start: string, end: string) {
  const [row] = await db
    .select({
      income: sql<number>`coalesce(sum(case when ${entries.type} = 'income' then ${entries.amountCents} else 0 end), 0)`,
      expense: sql<number>`coalesce(sum(case when ${entries.type} = 'expense' then ${entries.amountCents} else 0 end), 0)`,
    })
    .from(entries)
    .where(
      and(
        eq(entries.userId, userId),
        gte(entries.entryDate, start),
        lte(entries.entryDate, end),
      ),
    );

  return {
    income: row.income,
    expense: row.expense,
    balance: row.income - row.expense,
  };
}
```

### Recent Entries

```ts
export async function getRecentEntries(db: any, userId: string, limit = 10) {
  return db
    .select({
      id: entries.id,
      type: entries.type,
      amountCents: entries.amountCents,
      description: entries.description,
      entryDate: entries.entryDate,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(entries)
    .innerJoin(categories, eq(entries.categoryId, categories.id))
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.entryDate), desc(entries.createdAt))
    .limit(limit);
}
```

### Expense Breakdown

```ts
export async function getExpenseBreakdown(db: any, userId: string, start: string, end: string) {
  return db
    .select({
      categoryId: categories.id,
      name: categories.name,
      color: categories.color,
      total: sql<number>`sum(${entries.amountCents})`,
    })
    .from(entries)
    .innerJoin(categories, eq(entries.categoryId, categories.id))
    .where(
      and(
        eq(entries.userId, userId),
        eq(entries.type, "expense"),
        gte(entries.entryDate, start),
        lte(entries.entryDate, end),
      ),
    )
    .groupBy(categories.id, categories.name, categories.color)
    .orderBy(sql`sum(${entries.amountCents}) desc`);
}
```

### Filtered List

```ts
import { ilike } from "drizzle-orm";

export async function listEntries(
  db: any,
  userId: string,
  filters: {
    start?: string;
    end?: string;
    type?: "income" | "expense";
    categoryId?: string;
    query?: string;
  },
) {
  const conditions = [eq(entries.userId, userId)];

  if (filters.start) conditions.push(gte(entries.entryDate, filters.start));
  if (filters.end) conditions.push(lte(entries.entryDate, filters.end));
  if (filters.type) conditions.push(eq(entries.type, filters.type));
  if (filters.categoryId) conditions.push(eq(entries.categoryId, filters.categoryId));
  if (filters.query) conditions.push(ilike(entries.description, `%${filters.query}%`));

  return db
    .select({
      id: entries.id,
      type: entries.type,
      amountCents: entries.amountCents,
      description: entries.description,
      notes: entries.notes,
      entryDate: entries.entryDate,
      createdAt: entries.createdAt,
      categoryName: categories.name,
      categoryColor: categories.color,
    })
    .from(entries)
    .innerJoin(categories, eq(entries.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(entries.entryDate), desc(entries.createdAt));
}
```

## Migration Strategy

Recommendation:

1. **Drizzle** for:
   - enums
   - tables
   - checks
   - simple indexes

2. **Manual SQL** for:
   - foreign keys to `auth.users`, if needed
   - `updated_at` triggers
   - `RLS`
   - policies
   - global seeds
   - more specific partial indexes if the builder version requires adjustments

## Recommended Migration Order

1. enums
2. tables
3. indexes
4. `set_updated_at` function
5. triggers
6. `RLS`
7. policies
8. global category seed

## Final Notes

- `userId` stays as a plain `uuid` in the TypeScript schema, with `auth.users` integration handled in SQL migrations
- automatic `updated_at` should be handled in the database, not only in the application
- consistency between `entries.type` and `categories.type` must be validated in the application
- global categories remain read-only for regular users

## Natural Next Step

1. create the actual files in `src/lib/db/schema/*`
2. build category and entry `server actions`
3. implement dashboard and reporting queries
