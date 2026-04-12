# Drizzle Schema

## Visao Geral

Documentacao do schema planejado em `drizzle-orm/pg-core` para o app de financas pessoais.

Objetivos:

- refletir o schema definido em `DATABASE_SCHEMA.md`
- manter receitas e despesas em uma unica tabela
- suportar categorias globais do sistema e categorias personalizadas do usuario
- preparar a base para `Supabase + Drizzle + Next.js`

## Estrutura Recomendada de Arquivos

```txt
src/lib/db/schema/
  enums.ts
  profiles.ts
  categories.ts
  entries.ts
  relations.ts
```

## Schema Proposto

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

## Relacoes

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

## Observacoes Importantes

1. `auth.users` normalmente nao e modelada diretamente no schema Drizzle da aplicacao.
2. Por isso, `userId` pode ficar como `uuid` simples no schema TypeScript.
3. Foreign keys para `auth.users(id)` podem ser mantidas em migration SQL manual.
4. `updated_at trigger` tambem deve ficar em migration SQL manual.
5. `RLS` e policies continuam fora do schema Drizzle e entram em SQL manual.

## Validacoes Zod Propostas

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

## Validacoes de Dominio Necessarias na Aplicacao

Ao criar ou editar `entries`, adicionar checagens extras alem do Zod:

1. categoria existe
2. categoria nao esta arquivada
3. categoria e global ou pertence ao usuario autenticado
4. `category.type === entry.type`

## Queries Base em Drizzle

### Resumo mensal

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

### Ultimos lancamentos

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

### Despesas por categoria

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

### Listagem com filtros

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

## Estrategia de Migrations

Recomendacao:

1. **Drizzle** para:
   - enums
   - tabelas
   - checks
   - indices simples

2. **SQL manual** para:
   - foreign keys para `auth.users`, se necessario
   - triggers de `updated_at`
   - `RLS`
   - policies
   - seeds globais
   - indices parciais mais especificos, se a versao do builder exigir ajuste

## Ordem Recomendada das Migrations

1. enums
2. tabelas
3. indices
4. funcao `set_updated_at`
5. triggers
6. `RLS`
7. policies
8. seed de categorias globais

## Observacoes Finais

- `userId` fica como `uuid` simples no schema TS, com integracao a `auth.users` resolvida nas migrations SQL
- `updated_at` automatico deve ser tratado no banco, nao apenas na aplicacao
- a consistencia entre `entries.type` e `categories.type` deve ser validada na aplicacao
- categorias globais permanecem somente leitura para usuarios comuns

## Proximo Passo Natural

1. criar os arquivos reais em `src/lib/db/schema/*`
2. montar as `server actions` de categorias e lancamentos
3. implementar queries do dashboard e relatorios
