"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { entries } from "@/lib/db/schema";
import { getVisibleCategoryForEntry } from "@/lib/db/queries/categories";
import { appRoutes } from "@/lib/constants/routes";
import { createEntrySchema, type CreateEntryInput } from "@/lib/validations/entry";

export async function createEntry(input: CreateEntryInput) {
  const user = await requireUser();
  const data = createEntrySchema.parse(input);

  const category = await getVisibleCategoryForEntry({
    categoryId: data.categoryId,
    userId: user.id,
    type: data.type,
  });

  if (!category) {
    throw new Error("Categoria inválida para este lançamento.");
  }

  const [entry] = await db
    .insert(entries)
    .values({
      userId: user.id,
      categoryId: data.categoryId,
      type: data.type,
      amountCents: data.amountCents,
      description: data.description,
      notes: data.notes,
      entryDate: data.entryDate,
    })
    .returning();

  revalidatePath(appRoutes.entries);
  revalidatePath(appRoutes.dashboard);
  revalidatePath(appRoutes.reports);

  return entry;
}
