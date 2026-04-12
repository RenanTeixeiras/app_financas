import Link from "next/link";

import { EntryFilters } from "@/components/entries/entry-filters";
import { EntryList } from "@/components/entries/entry-list";
import { requireUser } from "@/lib/auth/guards";
import { listVisibleCategories } from "@/lib/db/queries/categories";
import { listEntries } from "@/lib/db/queries/entries";
import { entryFiltersSchema } from "@/lib/validations/entry";
import { getCurrentMonthValue, getMonthRange } from "@/lib/utils/date";

function getMessage(params: { error?: string; success?: string }) {
  if (params.error) {
    return {
      tone: "error" as const,
      value: decodeURIComponent(params.error),
    };
  }

  if (params.success) {
    return {
      tone: "success" as const,
      value: decodeURIComponent(params.success),
    };
  }

  return null;
}

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; type?: string; categoryId?: string; query?: string; error?: string; success?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const message = getMessage(params);

  const parsedFilters = entryFiltersSchema.safeParse({
    month: params.month,
    type: params.type,
    categoryId: params.categoryId,
    query: params.query,
  });

  const currentMonth = parsedFilters.data?.month ?? getCurrentMonthValue();
  const monthRange = getMonthRange(currentMonth);
  const filters = parsedFilters.success
    ? {
        start: monthRange?.start,
        end: monthRange?.end,
        type: parsedFilters.data.type,
        categoryId: parsedFilters.data.categoryId,
        query: parsedFilters.data.query,
      }
    : {
        start: monthRange?.start,
        end: monthRange?.end,
      };

  const [entries, categories] = await Promise.all([
    listEntries(user.id, filters),
    listVisibleCategories(user.id),
  ]);

  const hasFilters = Boolean(filters.type || filters.categoryId || filters.query || params.month);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">Lançamentos</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Registre receitas e despesas, aplique filtros por mês, tipo e categoria, e revise
              suas movimentações com foco em uso rápido no celular.
            </p>
          </div>

          <Link
            href="/entries/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
          >
            Novo lançamento
          </Link>
        </div>

        {message ? (
          <div
            className={`mt-5 rounded-2xl border p-4 text-sm ${
              message.tone === "success"
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                : "border-rose-400/20 bg-rose-500/10 text-rose-200"
            }`}
          >
            {message.value}
          </div>
        ) : null}

        {!parsedFilters.success ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            Alguns filtros foram ignorados porque estavam em formato inválido.
          </div>
        ) : null}
      </section>

      <EntryFilters
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          type: category.type,
          isArchived: category.isArchived,
        }))}
        initialValues={{
          month: currentMonth,
          type: parsedFilters.success ? (parsedFilters.data.type ?? "") : "",
          categoryId: parsedFilters.success ? (parsedFilters.data.categoryId ?? "") : "",
          query: parsedFilters.success ? (parsedFilters.data.query ?? "") : "",
        }}
      />

      <EntryList entries={entries} hasFilters={hasFilters} />
    </div>
  );
}
