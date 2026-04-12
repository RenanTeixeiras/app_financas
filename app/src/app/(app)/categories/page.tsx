import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { archiveCategory } from "@/actions/categories/archive-category";
import { createCategory } from "@/actions/categories/create-category";
import { deleteCategory } from "@/actions/categories/delete-category";
import { updateCategory } from "@/actions/categories/update-category";
import { requireUser } from "@/lib/auth/guards";
import { categoryHasEntries, listVisibleCategories } from "@/lib/db/queries/categories";

const typeOptions = [
  { value: "income", label: "Receitas", defaultColor: "#34d399" },
  { value: "expense", label: "Despesas", defaultColor: "#fb7185" },
] as const;

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

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const message = getMessage(params);

  let incomeCategories = [] as Awaited<ReturnType<typeof listVisibleCategories>>;
  let expenseCategories = [] as Awaited<ReturnType<typeof listVisibleCategories>>;
  let loadError: string | null = null;

  try {
    [incomeCategories, expenseCategories] = await Promise.all([
      listVisibleCategories(user.id, "income"),
      listVisibleCategories(user.id, "expense"),
    ]);
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Não foi possível carregar as categorias.";
  }

  async function createCategoryFromForm(formData: FormData) {
    "use server";

    try {
      await createCategory({
        name: String(formData.get("name") ?? ""),
        type: String(formData.get("type") ?? "expense") as "income" | "expense",
        color: String(formData.get("color") ?? "#94a3b8"),
        icon: String(formData.get("icon") ?? "").trim() || null,
      });

      redirect("/categories?success=Categoria%20criada%20com%20sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a categoria.";
      redirect(`/categories?error=${encodeURIComponent(message)}`);
    }
  }

  async function updateCategoryFromForm(formData: FormData) {
    "use server";

    try {
      await updateCategory({
        id: String(formData.get("id") ?? ""),
        name: String(formData.get("name") ?? ""),
        color: String(formData.get("color") ?? "#94a3b8"),
        icon: String(formData.get("icon") ?? "").trim() || null,
        isArchived: String(formData.get("isArchived") ?? "false") === "true",
      });

      redirect("/categories?success=Categoria%20atualizada%20com%20sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível atualizar a categoria.";
      redirect(`/categories?error=${encodeURIComponent(message)}`);
    }
  }

  async function toggleArchiveFromForm(formData: FormData) {
    "use server";

    try {
      await archiveCategory({
        id: String(formData.get("id") ?? ""),
        isArchived: String(formData.get("isArchived") ?? "false") === "true",
      });

      revalidatePath("/categories");
      redirect("/categories?success=Categoria%20atualizada%20com%20sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível arquivar a categoria.";
      redirect(`/categories?error=${encodeURIComponent(message)}`);
    }
  }

  async function deleteCategoryFromForm(formData: FormData) {
    "use server";

    try {
      await deleteCategory({
        id: String(formData.get("id") ?? ""),
      });

      redirect("/categories?success=Categoria%20excluída%20com%20sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível excluir a categoria.";
      redirect(`/categories?error=${encodeURIComponent(message)}`);
    }
  }

  const sections = [
    { title: "Receitas", value: "income", defaultColor: "#34d399", items: incomeCategories },
    { title: "Despesas", value: "expense", defaultColor: "#fb7185", items: expenseCategories },
  ] as const;

  const sectionsWithUsage = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      items: await Promise.all(
        section.items.map(async (category) => ({
          category,
          hasEntries: !category.isSystem ? await categoryHasEntries(category.id) : false,
        })),
      ),
    })),
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">Categorias</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Gerencie categorias globais do sistema e crie suas categorias personalizadas para receitas
          e despesas.
        </p>

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

        {loadError ? (
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            {loadError}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {typeOptions.map((option) => (
          <article key={option.value} className="rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Nova categoria</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Adicione uma categoria personalizada em {option.label.toLowerCase()}.</p>
              </div>
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: option.defaultColor }}
              />
            </div>

            <form action={createCategoryFromForm} className="mt-6 space-y-4">
              <input type="hidden" name="type" value={option.value} />

              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <label className="mb-2 block text-sm text-[var(--text-muted)]">Nome</label>
                  <input
                    name="name"
                    required
                    placeholder={option.value === "income" ? "Ex.: Bônus" : "Ex.: Pets"}
                    className="w-full rounded-2xl border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-[var(--text-muted)]">Cor</label>
                  <input
                    name="color"
                    type="color"
                    defaultValue={option.defaultColor}
                    className="h-[50px] w-full min-w-20 rounded-2xl border border-white/12 bg-black/10 px-2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--text-muted)]">Ícone</label>
                <input
                  name="icon"
                  placeholder="Ex.: wallet, car, house"
                  className="w-full rounded-2xl border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
              >
                Criar categoria
              </button>
            </form>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {sectionsWithUsage.map((section) => (
          <article key={section.value} className="rounded-[2rem] border border-white/12 bg-white/7 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{section.title}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Categorias globais aparecem como leitura. As personalizadas podem ser editadas.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-[var(--text-muted)]">
                {section.items.length} itens
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {section.items.map(({ category, hasEntries }) => (
                <div key={category.id} className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="size-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{category.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {category.isSystem ? "Global do sistema" : "Personalizada"}
                          {category.isArchived ? " • Arquivada" : ""}
                          {category.icon ? ` • ${category.icon}` : ""}
                        </p>
                      </div>
                    </div>
                    {category.isSystem ? (
                      <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-[var(--text-muted)]">
                        Somente leitura
                      </span>
                    ) : null}
                  </div>

                  {category.isSystem ? null : (
                    <div className="mt-4 grid gap-3">
                      <form action={updateCategoryFromForm} className="grid gap-3 md:grid-cols-[1fr_96px_1fr_auto]">
                        <input type="hidden" name="id" value={category.id} />
                        <input type="hidden" name="isArchived" value={String(category.isArchived)} />
                        <input
                          name="name"
                          defaultValue={category.name}
                          required
                          className="rounded-2xl border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-white/24"
                        />
                        <input
                          name="color"
                          type="color"
                          defaultValue={category.color}
                          className="h-[50px] rounded-2xl border border-white/12 bg-black/10 px-2"
                        />
                        <input
                          name="icon"
                          defaultValue={category.icon ?? ""}
                          placeholder="Ícone"
                          className="rounded-2xl border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-white/24"
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
                        >
                          Salvar
                        </button>
                      </form>

                      <div className="flex flex-wrap gap-3">
                        <form action={toggleArchiveFromForm}>
                          <input type="hidden" name="id" value={category.id} />
                          <input type="hidden" name="isArchived" value={String(!category.isArchived)} />
                          <button
                            type="submit"
                            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-white/10"
                          >
                            {category.isArchived ? "Desarquivar" : "Arquivar"}
                          </button>
                        </form>

                        <form action={deleteCategoryFromForm}>
                          <input type="hidden" name="id" value={category.id} />
                          <button
                            type="submit"
                            disabled={hasEntries}
                            className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition enabled:hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Excluir
                          </button>
                        </form>
                      </div>

                      {hasEntries ? (
                        <p className="text-xs text-amber-200">
                          Essa categoria já possui lançamentos e só pode ser arquivada.
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
