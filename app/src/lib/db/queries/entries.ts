import { and, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { categories, entries } from "@/lib/db/schema";
import type { CategoryType } from "@/lib/validations/category";

export async function listEntries(
  userId: string,
  filters: {
    start?: string;
    end?: string;
    type?: CategoryType;
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
      categoryId: categories.id,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
    })
    .from(entries)
    .innerJoin(categories, eq(entries.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(entries.entryDate), desc(entries.createdAt));
}

export async function getEntryById(id: string, userId: string) {
  const [entry] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, id), eq(entries.userId, userId)))
    .limit(1);

  return entry ?? null;
}

export async function getRecentEntries(userId: string, limit = 10) {
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

export async function getMonthlySummary(userId: string, start: string, end: string) {
  const [row] = await db
    .select({
      income:
        sql<number>`coalesce(sum(case when ${entries.type} = 'income' then ${entries.amountCents} else 0 end), 0)`.as(
          "income",
        ),
      expense:
        sql<number>`coalesce(sum(case when ${entries.type} = 'expense' then ${entries.amountCents} else 0 end), 0)`.as(
          "expense",
        ),
    })
    .from(entries)
    .where(and(eq(entries.userId, userId), gte(entries.entryDate, start), lte(entries.entryDate, end)));

  const income = Number(row?.income ?? 0);
  const expense = Number(row?.expense ?? 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
}
