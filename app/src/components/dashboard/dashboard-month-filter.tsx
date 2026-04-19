import { CalendarRange } from "lucide-react";

import { appRoutes } from "@/lib/constants/routes";

type DashboardMonthFilterProps = {
  month: string;
};

export function DashboardMonthFilter({ month }: DashboardMonthFilterProps) {
  return (
    <form className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <CalendarRange className="size-4" />
            Mês do dashboard
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Troque o mês para atualizar o resumo, os breakdowns e manter a leitura rápida do período.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[420px]">
          <label className="grid gap-2 text-sm text-[var(--text-muted)] lg:flex-1">
            Mês
            <input
              name="month"
              type="month"
              defaultValue={month}
              className="h-12 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
            <button
              type="submit"
              className="h-12 rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105 sm:flex-1 lg:flex-none"
            >
              Atualizar
            </button>

            <a
              href={appRoutes.dashboard}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12 sm:flex-1 lg:flex-none"
            >
              Atual
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}