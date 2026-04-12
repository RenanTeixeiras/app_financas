import { EntryCard } from "@/components/entries/entry-card";

type EntryListProps = {
  entries: Array<{
    id: string;
    type: "income" | "expense";
    amountCents: number;
    description: string;
    entryDate: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string | null;
  }>;
  hasFilters: boolean;
};

export function EntryList({ entries, hasFilters }: EntryListProps) {
  if (!entries.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/12 bg-white/5 p-8 text-center backdrop-blur-xl">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {hasFilters ? "Nenhum lançamento encontrado" : "Nenhum lançamento por aqui ainda"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
          {hasFilters
            ? "Ajuste os filtros para ampliar a busca ou limpe os campos para ver todo o histórico."
            : "Crie sua primeira receita ou despesa para começar a acompanhar suas movimentações."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
