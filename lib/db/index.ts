import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

/**
 * Databasetilkobling.
 *
 * Standard er en lokal SQLite-fil (data/apply.db). Sett DATABASE_URL til en
 * libsql://-adresse (f.eks. Turso) og DATABASE_AUTH_TOKEN for hosting.
 * Migrasjoner i ./drizzle kjøres automatisk første gang databasen brukes.
 */
const url = process.env.DATABASE_URL ?? "file:./data/apply.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

type Cache = {
  client?: Client;
  db?: ReturnType<typeof drizzle<typeof schema>>;
  ready?: Promise<void>;
};

// Én tilkobling per prosess, også ved hot reload i utvikling.
const cache = (globalThis as unknown as { __applyDb?: Cache }).__applyDb ?? {};
(globalThis as unknown as { __applyDb?: Cache }).__applyDb = cache;

function connect() {
  if (url.startsWith("file:")) {
    fs.mkdirSync(path.dirname(url.slice("file:".length)), { recursive: true });
  }
  cache.client = createClient({ url, authToken });
  cache.db = drizzle(cache.client, { schema });
  return cache.db;
}

export const db = cache.db ?? connect();

/** Sørger for at tabellene finnes. Kalles av alle spørringer. */
export function ensureDb() {
  cache.ready ??= migrate(db, {
    migrationsFolder: path.join(process.cwd(), "drizzle"),
  });
  return cache.ready;
}

export { schema };
