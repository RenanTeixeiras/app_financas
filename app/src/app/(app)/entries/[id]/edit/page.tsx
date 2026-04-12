import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { deleteEntry } from "@/actions/entries/delete-entry";
import { updateEntry } from "@/actions/entries/update-entry";
import { EntryForm } from "@/components/entries/entry-form";
import { requireUser } from "@/lib/auth/guards";
import { listVisibleCategories } from "@/lib/db/queries/categories";
import { getEntryById } from "@/lib/db/queries/entries";
import { formatCentsToInputValue } from "@/lib/utils/currency";

function getMessage(params: { error?: string }) {
  if (!params.error) {
    return null;
  }

  return decodeURIComponent(params.error);
}

export default async function EditEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [entry, categories] = await Promise.all([
    getEntryById(id, user.id),
    listVisibleCategories(user.id),
  ]);

  if (!entry) {
    notFound();
  }

  const message = getMessage(query);

  async function updateEntryFromForm(formData: FormData) {
    "use server";

    try {
      await updateEntry({
        id,
        categoryId: String(formData.get("categoryId") ?? ""),
        type: String(formData.get("type") ?? entry.type) as "income" | "expense",
        amountCents: Number(formData.get("amountCents") ?? 0),
        description: String(formData.get("description") ?? ""),
        notes: String(formData.get("notes") ?? "").trim() || null,
        entryDate: String(formData.get("entryDate") ?? ""),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível atualizar o lançamento.";
      redirect(`/entries/${id}/edit?error=${encodeURIComponent(message)}`);
    }

    redirect("/entries?success=Lançamento%20atualizado%20com%20sucesso.");
  }

  async function deleteEntryFromForm() {
    "use server";

    try {
      await deleteEntry({ id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível excluir o lançamento.";
      redirect(`/entries/${id}/edit?error=${encodeURIComponent(message)}`);
    }

    redirect("/entries?success=Lançamento%20excluído%20com%20sucesso.");
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">Editar lançamento</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
              Atualize os dados da movimentação ou remova o item definitivamente se ele não fizer mais parte do histórico.
            </p>
          </div>

          <Link
            href="/entries"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/8 px-5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
          >
            Voltar para lançamentos
          </Link>
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {message}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-xl md:p-8">
          <EntryForm
            action={updateEntryFromForm}
            submitLabel="Salvar alterações"
            categories={categories.map((category) => ({
              id: category.id,
              name: category.name,
              type: category.type,
              isArchived: category.isArchived,
              isSystem: category.isSystem,
            }))}
            initialValues={{
              id: entry.id,
              type: entry.type,
              categoryId: entry.categoryId,
              amountInput: formatCentsToInputValue(entry.amountCents),
              description: entry.description,
              notes: entry.notes ?? "",
              entryDate: entry.entryDate,
            }}
          />
        </div>

        <aside className="rounded-[2rem] border border-rose-400/15 bg-rose-500/8 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Excluir lançamento</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Essa ação remove o lançamento do seu histórico. Use somente quando tiver certeza de que ele não deve mais existir.
          </p>

          <form action={deleteEntryFromForm} className="mt-5">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full border border-rose-400/20 bg-rose-500/12 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/18"
            >
              Excluir lançamento
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
}
