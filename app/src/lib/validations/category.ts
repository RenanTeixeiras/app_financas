import { z } from "zod";

export const categoryTypeSchema = z.enum(["income", "expense"]);

const hexColorSchema = z
  .string()
  .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, "Cor inválida.");

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(60),
  type: categoryTypeSchema,
  color: hexColorSchema,
  icon: z.string().trim().min(1).max(50).nullish().transform((value) => value ?? null),
});

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "Informe um nome.").max(60),
  color: hexColorSchema,
  icon: z.string().trim().min(1).max(50).nullish().transform((value) => value ?? null),
  isArchived: z.boolean().optional(),
});

export const archiveCategorySchema = z.object({
  id: z.uuid(),
  isArchived: z.boolean(),
});

export const deleteCategorySchema = z.object({
  id: z.string().uuid(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ArchiveCategoryInput = z.infer<typeof archiveCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
