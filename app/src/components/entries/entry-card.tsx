import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, CalendarDays, Tag } from "lucide-react";

import { formatCurrencyFromCents } from "@/lib/utils/currency";
import { formatEntryDate } from "@/lib/utils/date";

type EntryCardProps = {
  entry: {
    id: string;
    type: "income" | "expense";
    amountCents: number;
    description: string;
    entryDate: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string | null;
  };
};

export function EntryCard({ entry }: EntryCardProps) {
  const isIncome = entry.type === "income";

  return (
    <Link
      href={`/entries/${entry.id}/edit`}
      className="block rounded-[1.5rem] border border-white/10 bg-black/10 p-4 transition hover:border-white/16 hover:bg-white/8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8"
              style={{ color: entry.categoryColor }}
            >
              {isIncome ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
            </span>

            <div className="min-w-0">
              <p className="truncate font-medium text-[var(--text-primary)]">{entry.description}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1">
                  <Tag className="size-3" />
                  {entry.categoryName}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3" />
                  {formatEntryDate(entry.entryDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`font-mono text-base font-semibold ${
              isIncome ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {isIncome ? "+" : "-"}
            {formatCurrencyFromCents(entry.amountCents)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {isIncome ? "Receita" : "Despesa"}
          </p>
        </div>
      </div>
    </Link>
  );
}
