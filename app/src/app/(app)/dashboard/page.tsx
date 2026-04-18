import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DashboardCategoryBreakdown } from "@/components/dashboard/dashboard-category-breakdown";
import { DashboardMonthFilter } from "@/components/dashboard/dashboard-month-filter";
import { DashboardRecentEntries } from "@/components/dashboard/dashboard-recent-entries";
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";
import { requireUser } from "@/lib/auth/guards";
import { getCategoryBreakdown } from "@/lib/db/queries/dashboard";
import { getMonthlySummary, getRecentEntries } from "@/lib/db/queries/entries";
import { appRoutes } from "@/lib/constants/routes";
import { formatMonthLabel, getCurrentMonthValue, getMonthRange } from "@/lib/utils/date";

export default async function DashboardPage({
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

  const [summary, recentEntries, expenseBreakdown, incomeBreakdown] = await Promise.all([
    getMonthlySummary(user.id, monthRange.start, monthRange.end),
    getRecentEntries(user.id, 5),
    getCategoryBreakdown(user.id, monthRange.start, monthRange.end, "expense"),
    getCategoryBreakdown(user.id, monthRange.start, monthRange.end, "income"),
  ]);

  const isMonthInvalid = Boolean(requestedMonth && !requestedRange);
  const isMonthEmpty = summary.income === 0 && summary.expense === 0;

  return (
    <div id="main-content" className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)]">Visão geral</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Dashboard mensal real
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Acompanhe o saldo do mês, revise seus últimos lançamentos e identifique com clareza
              onde entram e saem os valores.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm text-[var(--text-muted)]">
            {formatMonthLabel(selectedMonth)}
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        {isMonthInvalid ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            O mês informado era inválido. O dashboard voltou automaticamente para o mês atual.
          </div>
        ) : null}

        <div className="mt-8">
          <DashboardStatCards summary={summary} />
        </div>
      </section>

      <DashboardMonthFilter month={selectedMonth} />

      {isMonthEmpty ? (
        <section className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 p-8 text-center backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Ainda não há movimentações neste mês
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            Registre receitas ou despesas para começar a visualizar o resumo mensal e os
            breakdowns por categoria.
          </p>
          <div className="mt-6">
            <Link
              href={`${appRoutes.entries}/new`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
            >
              Novo lançamento
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DashboardRecentEntries entries={recentEntries} />

        <div className="space-y-6">
          <DashboardCategoryBreakdown
            title="Despesas por categoria"
            description="Categorias ordenadas do maior gasto para o menor dentro do mês selecionado."
            emptyTitle="Nenhuma despesa neste mês"
            emptyDescription="Assim que você registrar saídas, elas aparecerão aqui com total e participação no mês."
            items={expenseBreakdown}
          />

          <DashboardCategoryBreakdown
            title="Receitas por categoria"
            description="Categorias ordenadas do maior valor recebido para o menor dentro do mês selecionado."
            emptyTitle="Nenhuma receita neste mês"
            emptyDescription="Assim que você registrar entradas, elas aparecerão aqui com total e participação no mês."
            items={incomeBreakdown}
          />
        </div>
      </section>
    </div>
  );
}
