import { pgEnum } from "drizzle-orm/pg-core";

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);
export const entryTypeEnum = pgEnum("entry_type", ["income", "expense"]);
