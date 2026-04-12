"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { entries } from "@/lib/db/schema";
import { getVisibleCategoryForEntry } from "@/lib/db/queries/categories";
import { getEntryById } from "@/lib/db/queries/entries";
import { appRoutes } from "@/lib/constants/routes";
import { updateEntrySchema, type UpdateEntryInput } from "@/lib/validations/entry";

export async function updateEntry(input: UpdateEntryInput) {
  const user = await requireUser();
  const data = updateEntrySchema.parse(input);

  const currentEntry = await getEntryById(data.id, user.id);

  if (!currentEntry) {
    throw new Error("Lançamento não encontrado.");
  }

  const category = await getVisibleCategoryForEntry({
    categoryId: data.categoryId,
    userId: user.id,
    type: data.type,
  });

  if (!category) {
    throw new Error("Categoria inválida para este lançamento.");
  }

  const [entry] = await db
    .update(entries)
    .set({
      categoryId: data.categoryId,
      type: data.type,
      amountCents: data.amountCents,
      description: data.description,
      notes: data.notes,
      entryDate: data.entryDate,
    })
    .where(and(eq(entries.id, data.id), eq(entries.userId, user.id)))
    .returning();

  revalidatePath(appRoutes.entries);
  revalidatePath(appRoutes.dashboard);
  revalidatePath(appRoutes.reports);

  return entry;
}
