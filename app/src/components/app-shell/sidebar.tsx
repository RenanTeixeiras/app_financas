import Link from "next/link";
import { BarChart3, CreditCard, LayoutDashboard, Settings, Tags, Wallet } from "lucide-react";

import { appRoutes } from "@/lib/constants/routes";

const items = [
  { href: appRoutes.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: appRoutes.entries, label: "Lançamentos", icon: CreditCard },
  { href: appRoutes.categories, label: "Categorias", icon: Tags },
  { href: appRoutes.reports, label: "Relatórios", icon: BarChart3 },
  { href: appRoutes.settings, label: "Ajustes", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100dvh-3rem)] w-72 shrink-0 rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-[0_20px_80px_rgba(8,15,30,0.45)] backdrop-blur-xl md:flex md:flex-col">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] text-slate-950 shadow-[0_12px_30px_rgba(93,211,255,0.35)]">
          <Wallet className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Finanças Pessoais</p>
          <p className="text-xs text-[var(--text-muted)]">Minimalista premium</p>
        </div>
      </div>

      <nav aria-label="Navegação principal" className="mt-8 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-muted)] transition hover:bg-white/8 hover:text-[var(--text-primary)] hover:translate-x-0.5"
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
        <p className="text-sm font-medium text-[var(--text-primary)]">MVP em construção</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Dashboard, lançamentos, categorias e relatórios já estão ativos. Agora o foco é o acabamento final.
        </p>
      </div>
    </aside>
  );
}
