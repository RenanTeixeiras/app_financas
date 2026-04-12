"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { db } from "@/lib/db/client";
import { entries } from "@/lib/db/schema";
import { appRoutes } from "@/lib/constants/routes";
import { deleteEntrySchema, type DeleteEntryInput } from "@/lib/validations/entry";

export async function deleteEntry(input: DeleteEntryInput) {
  const user = await requireUser();
  const data = deleteEntrySchema.parse(input);

  await db.delete(entries).where(and(eq(entries.id, data.id), eq(entries.userId, user.id)));

  revalidatePath(appRoutes.entries);
  revalidatePath(appRoutes.dashboard);
  revalidatePath(appRoutes.reports);

  return { success: true };
}
