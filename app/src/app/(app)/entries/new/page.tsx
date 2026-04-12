import { redirect } from "next/navigation";

import { createEntry } from "@/actions/entries/create-entry";
import { EntryForm } from "@/components/entries/entry-form";
import { requireUser } from "@/lib/auth/guards";
import { listVisibleCategories } from "@/lib/db/queries/categories";

function getMessage(params: { error?: string }) {
  if (!params.error) {
    return null;
  }

  return decodeURIComponent(params.error);
}

export default async function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const [categories, query] = await Promise.all([listVisibleCategories(user.id), searchParams]);
  const message = getMessage(query);

  async function createEntryFromForm(formData: FormData) {
    "use server";

    try {
      await createEntry({
        categoryId: String(formData.get("categoryId") ?? ""),
        type: String(formData.get("type") ?? "expense") as "income" | "expense",
        amountCents: Number(formData.get("amountCents") ?? 0),
        description: String(formData.get("description") ?? ""),
        notes: String(formData.get("notes") ?? "").trim() || null,
        entryDate: String(formData.get("entryDate") ?? ""),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar o lançamento.";
      redirect(`/entries/new?error=${encodeURIComponent(message)}`);
    }

    redirect("/entries?success=Lançamento%20criado%20com%20sucesso.");
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">Novo lançamento</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Capture sua movimentação com valor amigável em reais e escolha apenas categorias válidas para o tipo selecionado.
        </p>

        {message ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {message}
          </div>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-xl md:p-8">
        <EntryForm
          action={createEntryFromForm}
          submitLabel="Salvar lançamento"
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            type: category.type,
            isArchived: category.isArchived,
            isSystem: category.isSystem,
          }))}
        />
      </section>
    </div>
  );
}
