import { and, asc, eq, or, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { categories, entries } from "@/lib/db/schema";
import type { CategoryType } from "@/lib/validations/category";

export async function listVisibleCategories(userId: string, type?: CategoryType) {
  const filters = [or(eq(categories.isSystem, true), eq(categories.userId, userId))];

  if (type) {
    filters.push(eq(categories.type, type));
  }

  return db
    .select()
    .from(categories)
    .where(and(...filters))
    .orderBy(asc(categories.isSystem), asc(categories.name));
}

export async function getCategoryById(id: string) {
  const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return category ?? null;
}

export async function getUserEditableCategory(id: string, userId: string) {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId), eq(categories.isSystem, false)))
    .limit(1);

  return category ?? null;
}

export async function categoryHasEntries(categoryId: string) {
  const [result] = await db
    .select({ exists: sql<number>`1` })
    .from(entries)
    .where(eq(entries.categoryId, categoryId))
    .limit(1);

  return Boolean(result);
}

export async function getVisibleCategoryForEntry(input: {
  categoryId: string;
  userId: string;
  type: CategoryType;
}) {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.type, input.type),
        eq(categories.isArchived, false),
        or(eq(categories.isSystem, true), eq(categories.userId, input.userId)),
      ),
    )
    .limit(1);

  return category ?? null;
}
