"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CreditCard, LayoutDashboard, Settings, Tags } from "lucide-react";

import { appRoutes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: appRoutes.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: appRoutes.entries, label: "Lançamentos", icon: CreditCard },
  { href: appRoutes.categories, label: "Categorias", icon: Tags },
  { href: appRoutes.reports, label: "Relatórios", icon: BarChart3 },
  { href: appRoutes.settings, label: "Ajustes", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal móvel"
      className="fixed inset-x-4 bottom-4 z-40 rounded-3xl border border-white/12 bg-white/8 p-2 shadow-[0_20px_60px_rgba(8,15,30,0.45)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium text-[var(--text-muted)] transition",
                  isActive &&
                    "bg-[var(--surface-glass-strong)] text-[var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
                  !isActive && "hover:-translate-y-0.5 hover:bg-white/8 hover:text-[var(--text-primary)]",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
