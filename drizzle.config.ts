import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "file:./data/apply.db";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: url.startsWith("libsql://") ? "turso" : "sqlite",
  dbCredentials: {
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  },
});
