import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { categories, entries } from "@/lib/db/schema";
import type { CategoryType } from "@/lib/validations/category";

export async function getCategoryBreakdown(
  userId: string,
  start: string,
  end: string,
  type: CategoryType,
) {
  const totalAmount = sql<number>`coalesce(sum(${entries.amountCents}), 0)`;

  const rows = await db
    .select({
      categoryId: categories.id,
      name: categories.name,
      color: categories.color,
      total: totalAmount.as("total"),
    })
    .from(entries)
    .innerJoin(categories, eq(entries.categoryId, categories.id))
    .where(
      and(
        eq(entries.userId, userId),
        eq(entries.type, type),
        gte(entries.entryDate, start),
        lte(entries.entryDate, end),
      ),
    )
    .groupBy(categories.id, categories.name, categories.color)
    .orderBy(desc(totalAmount), categories.name);

  const overallTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

  return rows.map((row) => {
    const total = Number(row.total);

    return {
      categoryId: row.categoryId,
      name: row.name,
      color: row.color,
      total,
      share: overallTotal > 0 ? total / overallTotal : 0,
    };
  });
}
