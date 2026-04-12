import { sql } from "drizzle-orm";
import { check, date, index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { categories } from "@/lib/db/schema/categories";
import { entryTypeEnum } from "@/lib/db/schema/enums";

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    type: entryTypeEnum("type").notNull(),
    amountCents: integer("amount_cents").notNull(),
    description: text("description").notNull(),
    notes: text("notes"),
    entryDate: date("entry_date").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("entries_amount_positive", sql`${table.amountCents} > 0`),
    check("entries_description_not_blank", sql`char_length(trim(${table.description})) > 0`),
    index("entries_user_date_idx").on(table.userId, table.entryDate),
    index("entries_user_type_date_idx").on(table.userId, table.type, table.entryDate),
    index("entries_user_category_date_idx").on(table.userId, table.categoryId, table.entryDate),
  ],
);
