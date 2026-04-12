"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type CategoryOption = {
  id: string;
  name: string;
  type: "income" | "expense";
  isArchived: boolean;
};

type EntryFiltersProps = {
  categories: CategoryOption[];
  initialValues: {
    month: string;
    type: "income" | "expense" | "";
    categoryId: string;
    query: string;
  };
};

export function EntryFilters({ categories, initialValues }: EntryFiltersProps) {
  const [selectedType, setSelectedType] = useState(initialValues.type);

  const visibleCategories = useMemo(() => {
    if (!selectedType) {
      return categories;
    }

    return categories.filter((category) => category.type === selectedType);
  }, [categories, selectedType]);

  useEffect(() => {
    if (!initialValues.categoryId) {
      return;
    }

    const exists = visibleCategories.some((category) => category.id === initialValues.categoryId);

    if (!exists) {
      const categoryField = document.getElementById("entry-filter-category") as HTMLSelectElement | null;

      if (categoryField) {
        categoryField.value = "";
      }
    }
  }, [initialValues.categoryId, visibleCategories]);

  return (
    <form className="rounded-[2rem] border border-white/12 bg-white/7 p-4 backdrop-blur-xl md:p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
        <SlidersHorizontal className="size-4" />
        Filtros
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[160px_160px_minmax(220px,1fr)_minmax(220px,1fr)_auto]">
        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Mês
          <input
            name="month"
            type="month"
            defaultValue={initialValues.month}
            className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Tipo
          <select
            name="type"
            defaultValue={initialValues.type}
            onChange={(event) => setSelectedType(event.target.value as "income" | "expense" | "")}
            className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
          >
            <option value="">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Categoria
          <select
            id="entry-filter-category"
            name="categoryId"
            defaultValue={initialValues.categoryId}
            className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
          >
            <option value="">Todas</option>
            {visibleCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isArchived ? " (arquivada)" : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Buscar por descrição
          <div className="flex h-12 items-center gap-2 rounded-2xl border border-white/12 bg-black/10 px-4 focus-within:border-white/24">
            <Search className="size-4 text-[var(--text-muted)]" />
            <input
              name="query"
              defaultValue={initialValues.query}
              placeholder="Ex.: mercado, salário"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
        </label>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="h-12 rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
          >
            Filtrar
          </button>
          <a
            href="/entries"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
          >
            Limpar
          </a>
        </div>
      </div>
    </form>
  );
}
