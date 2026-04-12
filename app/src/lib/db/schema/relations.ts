import { relations } from "drizzle-orm";

import { categories } from "@/lib/db/schema/categories";
import { entries } from "@/lib/db/schema/entries";
import { profiles } from "@/lib/db/schema/profiles";

export const profilesRelations = relations(profiles, () => ({}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  category: one(categories, {
    fields: [entries.categoryId],
    references: [categories.id],
  }),
}));
