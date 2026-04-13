import "server-only";

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";

type Database = PostgresJsDatabase<typeof schema>;

let cachedClient: ReturnType<typeof postgres> | null = null;
let cachedDb: Database | null = null;

export function getDrizzleDb() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to create a Drizzle database client.");
  }

  cachedClient = postgres(process.env.DATABASE_URL, {
    prepare: false,
  });
  cachedDb = drizzle(cachedClient, { schema });

  return cachedDb;
}

export type DrizzleDb = ReturnType<typeof getDrizzleDb>;
