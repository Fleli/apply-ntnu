import fs from "node:fs";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

/** Kastes når databasen ikke kan åpnes. Lesespørringer faller da tilbake til tomt innhold. */
export class DatabaseUnavailableError extends Error {
  constructor(cause: unknown) {
    super("Databasen er ikke tilgjengelig", { cause });
    this.name = "DatabaseUnavailableError";
  }
}

/**
 * Databasetilkobling.
 *
 * Standard er en lokal SQLite-fil (data/apply.db). Det fungerer lokalt, men
 * ikke på hosting med skrivebeskyttet filsystem (f.eks. Vercel). Der må
 * DATABASE_URL peke på en libsql://-database (f.eks. Turso) med
 * DATABASE_AUTH_TOKEN. Migrasjoner i ./drizzle kjøres automatisk.
 */
const url = process.env.DATABASE_URL ?? "file:./data/apply.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

type Cache = { client?: Client; db?: Db; ready?: Promise<Db>; warned?: boolean };
const g = globalThis as unknown as { __applyDb?: Cache };
const cache = (g.__applyDb ??= {});

function connect(): Db {
  if (cache.db) return cache.db;
  if (url.startsWith("file:")) {
    fs.mkdirSync(path.dirname(url.slice("file:".length)), { recursive: true });
  }
  cache.client = createClient({ url, authToken });
  cache.db = drizzle(cache.client, { schema });
  return cache.db;
}

async function open(): Promise<Db> {
  try {
    const db = connect();
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "drizzle"),
    });
    return db;
  } catch (err) {
    if (!cache.warned) {
      cache.warned = true;
      const hint = process.env.DATABASE_URL
        ? ""
        : " DATABASE_URL er ikke satt, så en lokal fil ble forsøkt. Sett DATABASE_URL og DATABASE_AUTH_TOKEN til en hostet database.";
      console.error(`[db] Kunne ikke åpne databasen.${hint}`, err);
    }
    throw new DatabaseUnavailableError(err);
  }
}

/**
 * Gir en tilkobling med migrasjoner kjørt, én gang per prosess.
 * Kaster DatabaseUnavailableError hvis databasen ikke kan åpnes; da prøves
 * det på nytt ved neste kall.
 */
export function ensureDb(): Promise<Db> {
  if (!cache.ready) {
    const attempt = open();
    cache.ready = attempt;
    attempt.catch(() => {
      if (cache.ready === attempt) cache.ready = undefined;
    });
  }
  return cache.ready;
}

export { schema };
