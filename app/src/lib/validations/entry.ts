import { z } from "zod";

export const entryTypeSchema = z.enum(["income", "expense"]);

export const createEntrySchema = z.object({
  categoryId: z.string().uuid(),
  type: entryTypeSchema,
  amountCents: z.coerce.number().int().positive("O valor deve ser positivo."),
  description: z.string().trim().min(1, "Informe uma descrição.").max(120),
  notes: z.string().trim().max(1000).nullish().transform((value) => value ?? null),
  entryDate: z.iso.date(),
});

export const updateEntrySchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid(),
  type: entryTypeSchema,
  amountCents: z.coerce.number().int().positive("O valor deve ser positivo."),
  description: z.string().trim().min(1, "Informe uma descrição.").max(120),
  notes: z.string().trim().max(1000).nullish().transform((value) => value ?? null),
  entryDate: z.iso.date(),
});

export const deleteEntrySchema = z.object({
  id: z.string().uuid(),
});

export const entryFiltersSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  type: entryTypeSchema.optional(),
  categoryId: z.string().uuid().optional(),
  query: z.string().trim().max(120).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type DeleteEntryInput = z.infer<typeof deleteEntrySchema>;
