"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { getUserEditableCategory, listVisibleCategories } from "@/lib/db/queries/categories";
import { appRoutes } from "@/lib/constants/routes";
import { updateCategorySchema, type UpdateCategoryInput } from "@/lib/validations/category";

export async function updateCategory(input: UpdateCategoryInput) {
  const user = await requireUser();
  const data = updateCategorySchema.parse(input);

  const currentCategory = await getUserEditableCategory(data.id, user.id);

  if (!currentCategory) {
    throw new Error("Categoria não encontrada ou sem permissão de edição.");
  }

  const visibleCategories = await listVisibleCategories(user.id, currentCategory.type);
  const duplicated = visibleCategories.some(
    (category) =>
      category.id !== currentCategory.id &&
      category.name.trim().toLowerCase() === data.name.trim().toLowerCase(),
  );

  if (duplicated) {
    throw new Error("Já existe uma categoria com esse nome para este tipo.");
  }

  const [category] = await db
    .update(categories)
    .set({
      name: data.name,
      color: data.color,
      icon: data.icon,
      isArchived: data.isArchived ?? currentCategory.isArchived,
    })
    .where(and(eq(categories.id, data.id), eq(categories.userId, user.id), eq(categories.isSystem, false)))
    .returning();

  revalidatePath(appRoutes.categories);

  return category;
}
