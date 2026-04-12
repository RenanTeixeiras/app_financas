"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { getUserEditableCategory } from "@/lib/db/queries/categories";
import { appRoutes } from "@/lib/constants/routes";
import { archiveCategorySchema, type ArchiveCategoryInput } from "@/lib/validations/category";

export async function archiveCategory(input: ArchiveCategoryInput) {
  const user = await requireUser();
  const data = archiveCategorySchema.parse(input);

  const currentCategory = await getUserEditableCategory(data.id, user.id);

  if (!currentCategory) {
    throw new Error("Categoria não encontrada ou sem permissão de edição.");
  }

  const [category] = await db
    .update(categories)
    .set({ isArchived: data.isArchived })
    .where(and(eq(categories.id, data.id), eq(categories.userId, user.id), eq(categories.isSystem, false)))
    .returning();

  revalidatePath(appRoutes.categories);

  return category;
}
