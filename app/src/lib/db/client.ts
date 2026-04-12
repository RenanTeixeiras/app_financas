import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "@/lib/db/schema";

const isProduction = process.env.NODE_ENV === "production";

const connectionString =
  !isProduction && process.env.DATABASE_LOCAL_URL
    ? process.env.DATABASE_LOCAL_URL
    : process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Database connection is not configured.");
}

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });
