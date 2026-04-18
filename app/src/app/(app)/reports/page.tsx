import Link from "next/link";
import { ArrowUpRight, BarChart3 } from "lucide-react";

import { ReportsBreakdownSection } from "@/components/reports/reports-breakdown-section";
import { ReportsMonthFilter } from "@/components/reports/reports-month-filter";
import { ReportsStatCards } from "@/components/reports/reports-stat-cards";
import { MonthlyTrendChart } from "@/components/reports/monthly-trend-chart";
import { requireUser } from "@/lib/auth/guards";
import { getCategoryBreakdown } from "@/lib/db/queries/dashboard";
import { getMonthlySummary } from "@/lib/db/queries/entries";
import { getMonthlyTrend } from "@/lib/db/queries/reports";
import { appRoutes } from "@/lib/constants/routes";
import { formatMonthLabel, getCurrentMonthValue, getMonthRange } from "@/lib/utils/date";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const requestedMonth = params.month;
  const fallbackMonth = getCurrentMonthValue();
  const fallbackRange = getMonthRange(fallbackMonth);
  const requestedRange = requestedMonth ? getMonthRange(requestedMonth) : null;
  const selectedMonth = requestedRange && requestedMonth ? requestedMonth : fallbackMonth;
  const monthRange = requestedRange ?? fallbackRange;

  if (!monthRange) {
    throw new Error("Não foi possível calcular o intervalo do mês selecionado.");
  }

  const [summary, expenseBreakdown, incomeBreakdown, trend] = await Promise.all([
    getMonthlySummary(user.id, monthRange.start, monthRange.end),
    getCategoryBreakdown(user.id, monthRange.start, monthRange.end, "expense"),
    getCategoryBreakdown(user.id, monthRange.start, monthRange.end, "income"),
    getMonthlyTrend(user.id, 6, selectedMonth),
  ]);

  const isMonthInvalid = Boolean(requestedMonth && !requestedRange);
  const isMonthEmpty = summary.income === 0 && summary.expense === 0;

  return (
    <div id="main-content" className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)]">Camada analítica</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Relatórios mensais reais
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Entenda a evolução do seu caixa, enxergue tendências recentes e revise a composição
              das categorias do mês com uma leitura mais analítica do que no dashboard.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm text-[var(--text-muted)]">
            {formatMonthLabel(selectedMonth)}
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        {isMonthInvalid ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            O mês informado era inválido. Os relatórios voltaram automaticamente para o mês atual.
          </div>
        ) : null}

        <div className="mt-8">
          <ReportsStatCards summary={summary} />
        </div>
      </section>

      <ReportsMonthFilter month={selectedMonth} />

      {isMonthEmpty ? (
        <section className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-3xl border border-white/10 bg-white/8 text-[var(--accent-primary)]">
            <BarChart3 className="size-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">Sem movimentações no mês selecionado</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Registre novas receitas ou despesas para liberar comparativos mensais, breakdowns por categoria e leitura histórica.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`${appRoutes.entries}/new`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
            >
              Novo lançamento
            </Link>
            <Link
              href={appRoutes.dashboard}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
            >
              Ver dashboard
            </Link>
          </div>
        </section>
      ) : null}

      <MonthlyTrendChart points={trend} />

      <section className="grid gap-6 xl:grid-cols-2">
        <ReportsBreakdownSection
          title="Despesas por categoria"
          description="Categorias ordenadas pelo maior peso nas saídas do mês selecionado, ajudando a identificar concentração de gasto com mais rapidez."
          emptyTitle="Nenhuma despesa neste mês"
          emptyDescription="Assim que você registrar saídas, esta seção vai mostrar total e participação de cada categoria."
          items={expenseBreakdown}
        />

        <ReportsBreakdownSection
          title="Receitas por categoria"
          description="Categorias ordenadas pelo maior peso nas entradas do mês selecionado, facilitando a leitura das principais fontes de receita."
          emptyTitle="Nenhuma receita neste mês"
          emptyDescription="Assim que você registrar entradas, esta seção vai mostrar total e participação de cada categoria."
          items={incomeBreakdown}
        />
      </section>
    </div>
  );
}
