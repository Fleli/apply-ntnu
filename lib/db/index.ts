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
 * DATABASE_AUTH_TOKEN. Vercels Turso-integrasjon kan i stedet bruke
 * TURSO_DATABASE_URL og TURSO_AUTH_TOKEN. Migrasjoner i ./drizzle kjøres automatisk.
 */
const url = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL ?? "file:./data/apply.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || undefined;

type Cache = {
  client?: Client;
  db?: Db;
  ready?: Promise<Db>;
  opening?: boolean;
  warned?: boolean;
  /** mtime for migrasjonsjournalen da migrasjonene sist ble kjørt (kun i utvikling) */
  journalMtime?: number;
};

const migrationsFolder = path.join(process.cwd(), "drizzle");

/** I utvikling: har det kommet nye migrasjoner siden sist? */
function journalChanged(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  try {
    const mtime = fs.statSync(path.join(migrationsFolder, "meta", "_journal.json")).mtimeMs;
    return mtime !== cache.journalMtime;
  } catch {
    return false;
  }
}
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
    await migrate(db, { migrationsFolder });
    try {
      cache.journalMtime = fs.statSync(
        path.join(migrationsFolder, "meta", "_journal.json"),
      ).mtimeMs;
    } catch {
      /* ingen journal – ingenting å følge med på */
    }
    return db;
  } catch (err) {
    if (!cache.warned) {
      cache.warned = true;
      const hint = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL
        ? ""
        : " DATABASE_URL og TURSO_DATABASE_URL er ikke satt, så en lokal fil ble forsøkt. Sett DATABASE_URL og DATABASE_AUTH_TOKEN, eller bruk Vercels Turso-integrasjon med TURSO_DATABASE_URL og TURSO_AUTH_TOKEN.";
      console.error(`[db] Kunne ikke åpne databasen.${hint}`, err);
    }
    throw new DatabaseUnavailableError(err);
  }
}

/**
 * Gir en tilkobling med migrasjoner kjørt, én gang per prosess (i utvikling
 * kjøres de på nytt når det kommer nye migrasjoner, uten omstart).
 * Kaster DatabaseUnavailableError hvis databasen ikke kan åpnes; da prøves
 * det på nytt ved neste kall.
 */
export function ensureDb(): Promise<Db> {
  // Concurrent layout/page reads must share an unfinished migration, even when
  // its journal timestamp has not yet been recorded or a new journal is present.
  if (cache.ready && !cache.opening && journalChanged()) cache.ready = undefined;
  if (!cache.ready) {
    cache.opening = true;
    const attempt = open();
    cache.ready = attempt;
    attempt.then(
      () => { cache.opening = false; },
      () => {
        cache.opening = false;
        if (cache.ready === attempt) cache.ready = undefined;
      },
    );
  }
  return cache.ready;
}

export { schema };
