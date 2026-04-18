"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompactCurrencyFromCents, formatCurrencyFromCents } from "@/lib/utils/currency";
import { formatMonthShortLabel } from "@/lib/utils/date";

type MonthlyTrendChartProps = {
  points: Array<{
    month: string;
    income: number;
    expense: number;
    balance: number;
  }>;
};

export function MonthlyTrendChart({ points }: MonthlyTrendChartProps) {
  const hasData = points.some((point) => point.income > 0 || point.expense > 0 || point.balance !== 0);

  if (!hasData) {
    return (
      <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tendência mensal</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Quando houver histórico suficiente, esta área mostrará a evolução de entradas, saídas e
            saldo ao longo dos meses.
          </p>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 p-6 text-center">
          <p className="text-base font-medium text-[var(--text-primary)]">Histórico insuficiente no momento</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Continue registrando movimentações para liberar uma leitura mais analítica da evolução mensal.
          </p>
        </div>
      </section>
    );
  }

  const chartData = points.map((point) => ({
    ...point,
    label: formatMonthShortLabel(point.month),
  }));

  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Tendência mensal</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Compare receitas, despesas e saldo dos últimos meses para identificar aceleração de gasto,
          estabilidade de receita e evolução do caixa pessoal.
        </p>
      </div>

      <div
        className="mt-5 h-80 rounded-[1.5rem] border border-white/10 bg-black/10 p-3 md:p-5"
        role="img"
        aria-label="Gráfico com receitas, despesas e saldo dos últimos meses"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.45)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.45)"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value: number) => formatCompactCurrencyFromCents(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(8,16,27,0.96)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "18px",
                color: "rgba(241,245,249,1)",
              }}
              labelStyle={{ color: "rgba(226,232,240,1)", fontWeight: 600 }}
              formatter={(value, name) => {
                const labels = {
                  income: "Receitas",
                  expense: "Despesas",
                  balance: "Saldo",
                } as const;

                return [formatCurrencyFromCents(Number(value ?? 0)), labels[String(name) as keyof typeof labels] ?? String(name)];
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(148,163,184,1)" }} />
            <Bar
              dataKey="income"
              name="Receitas"
              radius={[8, 8, 0, 0]}
              fill="rgba(52,211,153,0.65)"
              isAnimationActive={false}
            />
            <Bar
              dataKey="expense"
              name="Despesas"
              radius={[8, 8, 0, 0]}
              fill="rgba(251,113,133,0.6)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Saldo"
              stroke="rgba(125,211,252,1)"
              strokeWidth={3}
              dot={{ r: 3, fill: "rgba(125,211,252,1)" }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="sr-only">
        <h3>Resumo textual do gráfico</h3>
        <ul>
          {chartData.map((point) => (
            <li key={point.month}>
              {point.label}: receitas de {formatCurrencyFromCents(point.income)}, despesas de {formatCurrencyFromCents(point.expense)} e saldo de {formatCurrencyFromCents(point.balance)}.
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
