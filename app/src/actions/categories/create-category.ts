"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { listVisibleCategories } from "@/lib/db/queries/categories";
import { appRoutes } from "@/lib/constants/routes";
import { createCategorySchema, type CreateCategoryInput } from "@/lib/validations/category";

export async function createCategory(input: CreateCategoryInput) {
  const user = await requireUser();
  const data = createCategorySchema.parse(input);

  const visibleCategories = await listVisibleCategories(user.id, data.type);
  const duplicated = visibleCategories.some(
    (category) => category.name.trim().toLowerCase() === data.name.trim().toLowerCase(),
  );

  if (duplicated) {
    throw new Error("Já existe uma categoria com esse nome para este tipo.");
  }

  const [category] = await db
    .insert(categories)
    .values({
      userId: user.id,
      name: data.name,
      type: data.type,
      color: data.color,
      icon: data.icon,
      isSystem: false,
    })
    .returning();

  revalidatePath(appRoutes.categories);

  return category;
}
