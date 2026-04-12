import { sql } from "drizzle-orm";
import { boolean, check, index, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { categoryTypeEnum } from "@/lib/db/schema/enums";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id"),
    name: text("name").notNull(),
    type: categoryTypeEnum("type").notNull(),
    color: text("color").notNull(),
    icon: text("icon"),
    isArchived: boolean("is_archived").notNull().default(false),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("categories_name_not_blank", sql`char_length(trim(${table.name})) > 0`),
    check(
      "categories_scope_check",
      sql`((${table.isSystem} = true and ${table.userId} is null) or (${table.isSystem} = false and ${table.userId} is not null))`,
    ),
    uniqueIndex("categories_system_unique_idx")
      .on(table.type, sql`lower(${table.name})`)
      .where(sql`${table.isSystem} = true`),
    uniqueIndex("categories_user_unique_idx")
      .on(table.userId, table.type, sql`lower(${table.name})`)
      .where(sql`${table.isSystem} = false`),
    index("categories_system_list_idx")
      .on(table.type, table.isArchived, table.name)
      .where(sql`${table.isSystem} = true`),
    index("categories_user_list_idx")
      .on(table.userId, table.type, table.isArchived, table.name)
      .where(sql`${table.isSystem} = false`),
  ],
);
