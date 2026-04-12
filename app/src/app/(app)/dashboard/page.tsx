import { ArrowUpRight, CircleDollarSign, PiggyBank, TrendingDown } from "lucide-react";

const stats = [
  { label: "Receitas no mês", value: "R$ 0,00", accent: "var(--accent-income)", icon: CircleDollarSign },
  { label: "Despesas no mês", value: "R$ 0,00", accent: "var(--accent-expense)", icon: TrendingDown },
  { label: "Saldo líquido", value: "R$ 0,00", accent: "var(--accent-primary)", icon: PiggyBank },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--text-muted)]">Visão geral</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Dashboard premium do MVP
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm text-[var(--text-muted)]">
            Abril 2026
            <ArrowUpRight className="size-4" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className="rounded-[1.5rem] border border-white/10 bg-black/10 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                  <Icon className="size-5" style={{ color: item.accent }} />
                </div>
                <p className="mt-6 font-mono text-3xl font-semibold text-[var(--text-primary)]">
                  {item.value}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Próximos blocos</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
            <li>CRUD de categorias globais e personalizadas</li>
            <li>Lançamentos com receita e despesa</li>
            <li>Consultas reais para dashboard</li>
          </ul>
        </article>

        <article className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Estado atual</h2>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
            Shell visual, tema, estrutura de rotas, Drizzle schema e base PWA já prontos.
          </p>
        </article>
      </section>
    </div>
  );
}
