"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, FormHTMLAttributes } from "react";

import { formatCurrencyInput, parseCurrencyInputToCents } from "@/lib/utils/currency";

type CategoryOption = {
  id: string;
  name: string;
  type: "income" | "expense";
  isArchived: boolean;
  isSystem: boolean;
};

type EntryFormProps = {
  categories: CategoryOption[];
  action: NonNullable<FormHTMLAttributes<HTMLFormElement>["action"]>;
  submitLabel: string;
  initialValues?: {
    id?: string;
    type: "income" | "expense";
    categoryId: string;
    amountInput: string;
    description: string;
    notes: string;
    entryDate: string;
  };
};

type FormErrors = {
  amount?: string;
  categoryId?: string;
};

const defaultInitialValues = {
  id: undefined,
  type: "expense" as const,
  categoryId: "",
  amountInput: "",
  description: "",
  notes: "",
  entryDate: new Date().toISOString().slice(0, 10),
};

export function EntryForm({ categories, action, submitLabel, initialValues }: EntryFormProps) {
  const values = initialValues ?? defaultInitialValues;
  const [type, setType] = useState<"income" | "expense">(values.type);
  const [amountInput, setAmountInput] = useState(values.amountInput);
  const [errors, setErrors] = useState<FormErrors>({});
  const categoryRef = useRef<HTMLSelectElement>(null);
  const amountCentsRef = useRef<HTMLInputElement>(null);

  const visibleCategories = useMemo(
    () => categories.filter((category) => category.type === type && !category.isArchived),
    [categories, type],
  );

  useEffect(() => {
    const currentCategoryId = categoryRef.current?.value;

    if (!currentCategoryId) {
      return;
    }

    const exists = visibleCategories.some((category) => category.id === currentCategoryId);

    if (!exists && categoryRef.current) {
      categoryRef.current.value = "";
    }
  }, [visibleCategories]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors: FormErrors = {};

    try {
      if (!amountCentsRef.current) {
        throw new Error("Informe um valor.");
      }

      amountCentsRef.current.value = String(parseCurrencyInputToCents(amountInput));
    } catch (error) {
      nextErrors.amount = error instanceof Error ? error.message : "Informe um valor válido.";
    }

    if (!categoryRef.current?.value) {
      nextErrors.categoryId = "Selecione uma categoria.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-5">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <input ref={amountCentsRef} type="hidden" name="amountCents" defaultValue="" />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Tipo
          <select
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as "income" | "expense")}
            className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Categoria
          <select
            ref={categoryRef}
            name="categoryId"
            defaultValue={values.categoryId}
            onChange={() => {
              if (errors.categoryId) {
                setErrors((current) => ({ ...current, categoryId: undefined }));
              }
            }}
            className={`h-12 rounded-2xl border bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24 ${
              errors.categoryId ? "border-rose-400/30" : "border-white/12"
            }`}
          >
            <option value="">Selecione uma categoria</option>
            {visibleCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {category.isSystem ? "" : " (personalizada)"}
              </option>
            ))}
          </select>
          {errors.categoryId ? <span className="text-xs text-rose-200">{errors.categoryId}</span> : null}
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Valor
          <input
            inputMode="numeric"
            value={amountInput}
            onChange={(event) => {
              setAmountInput(formatCurrencyInput(event.target.value));
              if (errors.amount) {
                setErrors((current) => ({ ...current, amount: undefined }));
              }
            }}
            placeholder="0,00"
            className={`h-12 rounded-2xl border bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24 ${
              errors.amount ? "border-rose-400/30" : "border-white/12"
            }`}
          />
          {errors.amount ? <span className="text-xs text-rose-200">{errors.amount}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-[var(--text-muted)]">
          Data
          <input
            name="entryDate"
            type="date"
            defaultValue={values.entryDate}
            required
            className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-[var(--text-muted)]">
        Descrição
        <input
          name="description"
          defaultValue={values.description}
          required
          maxLength={120}
          placeholder="Ex.: Mercado da semana"
          className="h-12 rounded-2xl border border-white/12 bg-black/10 px-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24"
        />
      </label>

      <label className="grid gap-2 text-sm text-[var(--text-muted)]">
        Notas
        <textarea
          name="notes"
          defaultValue={values.notes}
          rows={4}
          maxLength={1000}
          placeholder="Observações opcionais"
          className="rounded-[1.5rem] border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
        >
          {submitLabel}
        </button>
        <a
          href="/entries"
          className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
