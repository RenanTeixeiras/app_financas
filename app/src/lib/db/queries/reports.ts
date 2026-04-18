import { and, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { entries } from "@/lib/db/schema";
import { getCurrentMonthValue, getMonthRange, getRecentMonthValues } from "@/lib/utils/date";

export async function getMonthlyTrend(userId: string, months = 6, endMonth = getCurrentMonthValue()) {
  const normalizedMonths = Math.max(1, Math.trunc(months));
  const monthValues = getRecentMonthValues(endMonth, normalizedMonths);
  const startRange = getMonthRange(monthValues[0]);
  const endRange = getMonthRange(monthValues[monthValues.length - 1]);

  if (!startRange || !endRange) {
    return monthValues.map((month) => ({
      month,
      income: 0,
      expense: 0,
      balance: 0,
    }));
  }

  const rows = await db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${entries.entryDate}::timestamp), 'YYYY-MM')`.as("month"),
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
    .where(and(eq(entries.userId, userId), gte(entries.entryDate, startRange.start), lte(entries.entryDate, endRange.end)))
    .groupBy(sql`date_trunc('month', ${entries.entryDate}::timestamp)`)
    .orderBy(sql`date_trunc('month', ${entries.entryDate}::timestamp)`);

  const rowsByMonth = new Map(
    rows.map((row) => [row.month, { income: Number(row.income), expense: Number(row.expense) }] as const),
  );

  return monthValues.map((month) => {
    const totals = rowsByMonth.get(month) ?? { income: 0, expense: 0 };

    return {
      month,
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    };
  });
}
