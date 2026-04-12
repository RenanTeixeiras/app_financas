"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { categoryHasEntries, getUserEditableCategory } from "@/lib/db/queries/categories";
import { appRoutes } from "@/lib/constants/routes";
import { deleteCategorySchema, type DeleteCategoryInput } from "@/lib/validations/category";

export async function deleteCategory(input: DeleteCategoryInput) {
  const user = await requireUser();
  const data = deleteCategorySchema.parse(input);

  const currentCategory = await getUserEditableCategory(data.id, user.id);

  if (!currentCategory) {
    throw new Error("Categoria não encontrada ou sem permissão de exclusão.");
  }

  const hasEntries = await categoryHasEntries(data.id);

  if (hasEntries) {
    throw new Error("Essa categoria já foi usada. Arquive em vez de excluir.");
  }

  await db
    .delete(categories)
    .where(and(eq(categories.id, data.id), eq(categories.userId, user.id), eq(categories.isSystem, false)));

  revalidatePath(appRoutes.categories);

  return { success: true };
}
