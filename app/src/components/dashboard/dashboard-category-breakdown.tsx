import { formatCurrencyFromCents } from "@/lib/utils/currency";

type DashboardCategoryBreakdownProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  items: Array<{
    categoryId: string;
    name: string;
    color: string;
    total: number;
    share: number;
  }>;
};

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function DashboardCategoryBreakdown({
  title,
  description,
  emptyTitle,
  emptyDescription,
  items,
}: DashboardCategoryBreakdownProps) {
  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>

      {!items.length ? (
        <div className="mt-5 rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 p-6 text-center">
          <p className="text-base font-medium text-[var(--text-primary)]">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{emptyDescription}</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <article key={item.categoryId} className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="size-3 shrink-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="truncate font-medium text-[var(--text-primary)]">{item.name}</p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(item.share * 100, item.share > 0 ? 6 : 0)}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-base font-semibold text-[var(--text-primary)]">
                    {formatCurrencyFromCents(item.total)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {percentFormatter.format(item.share)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
