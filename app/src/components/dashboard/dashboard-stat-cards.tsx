import { CircleDollarSign, PiggyBank, TrendingDown } from "lucide-react";

import { formatCurrencyFromCents } from "@/lib/utils/currency";

type DashboardStatCardsProps = {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
};

const items = [
  {
    key: "income",
    label: "Receitas no mês",
    accent: "var(--accent-income)",
    icon: CircleDollarSign,
    valueClassName: "text-emerald-300",
  },
  {
    key: "expense",
    label: "Despesas no mês",
    accent: "var(--accent-expense)",
    icon: TrendingDown,
    valueClassName: "text-rose-300",
  },
  {
    key: "balance",
    label: "Saldo líquido",
    accent: "var(--accent-primary)",
    icon: PiggyBank,
    valueClassName: "text-[var(--text-primary)]",
  },
] as const;

export function DashboardStatCards({ summary }: DashboardStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const value = summary[item.key];

        return (
          <article key={item.key} className="rounded-[1.5rem] border border-white/10 bg-black/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
              <Icon className="size-5" style={{ color: item.accent }} />
            </div>

            <p className={`mt-6 font-mono text-3xl font-semibold ${item.valueClassName}`}>
              {item.key === "balance" && value > 0 ? "+" : ""}
              {formatCurrencyFromCents(value)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
