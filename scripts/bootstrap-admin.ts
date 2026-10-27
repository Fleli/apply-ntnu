import { loadEnvConfig } from "@next/env";

async function main() {
  const [email, ...extra] = process.argv.slice(2);
  if (!email || extra.length) throw new Error("Bruk: npm run admin:bootstrap -- <e-postadresse>");
  loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
  // The database reads its configuration at module initialization, after env loading.
  const { ensureDb } = await import("../lib/db");
  const { bootstrapFirstAdmin } = await import("../lib/admin-bootstrap");
  const administrator = await bootstrapFirstAdmin(await ensureDb(), email);
  console.log(`Administrator opprettet: ${administrator.name} <${administrator.email}>`);
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Kunne ikke opprette administrator.");
  process.exitCode = 1;
});
