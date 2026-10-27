import { createHash } from "node:crypto";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware, getAuthoritativeSessionFromCtx } from "better-auth/api";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { and, isNull, sql } from "drizzle-orm";
import { ensureDb, type Db } from "./db";
import { accounts, members, rateLimits, sessions, users, verifications } from "./db/schema";

export function normalizeProfile(input: { name: unknown; phone?: unknown }) {
  if (typeof input.name !== "string") throw new Error("Skriv inn navnet ditt.");
  const name = input.name.trim().replace(/\s+/g, " ");
  if (!name || name.length > 120 || /[\p{Cc}]/u.test(name)) throw new Error("Navnet må være mellom 1 og 120 tegn.");
  if (input.phone != null && typeof input.phone !== "string") throw new Error("Ugyldig telefonnummer.");
  const phone = (input.phone as string | null | undefined)?.trim() || null;
  if (phone && (phone.length > 40 || !/^[+\d ()-]{3,40}$/.test(phone))) throw new Error("Skriv inn et gyldig telefonnummer (maks 40 tegn).");
  return { name, phone };
}

export type AuthOptions = { baseURL?: string; secret?: string; rateLimit?: boolean; nextCookies?: boolean };
export function createAuth(db: Db, options: AuthOptions = {}) {
  const secret = options.secret ?? process.env.BETTER_AUTH_SECRET;
  if ((secret && secret.length < 32) || (!secret && process.env.NODE_ENV !== "development")) {
    throw new Error("BETTER_AUTH_SECRET må være en stabil hemmelighet på minst 32 tegn.");
  }
  const auth = betterAuth({
    appName: "Apply NTNU",
    baseURL: options.baseURL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: secret ?? "apply-local-development-secret-not-for-production",
    database: drizzleAdapter(db, { provider: "sqlite", transaction: true, schema: {
      user: users, account: accounts, session: sessions, verification: verifications, rateLimit: rateLimits,
    } }),
    emailAndPassword: { enabled: true, minPasswordLength: 12, maxPasswordLength: 128 },
    user: { additionalFields: { phone: { type: "string", required: false, input: true } } },
    session: { cookieCache: { enabled: false } },
    rateLimit: { enabled: options.rateLimit ?? true, storage: "database", window: 60, max: 60 },
    disabledPaths: ["/update-user", "/change-email", "/delete-user", "/delete-user/callback", "/request-password-reset", "/reset-password", "/send-verification-email"],
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // Better Auth's router limiter does not execute for auth.api server calls.
        // This atomic DB limiter protects both entry points across app instances.
        if (options.rateLimit !== false && ["/sign-in/email", "/sign-up/email", "/change-password"].includes(ctx.path)) {
          const email = ctx.path !== "/change-password" && typeof ctx.body?.email === "string" ? ctx.body.email.trim().toLowerCase() : "";
          const ip = ctx.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || ctx.headers?.get("x-real-ip") || "unknown";
          // Read through Better Auth's verified session helper, not posted IDs,
          // headers or token text. The helper calls the session endpoint directly
          // and does not recursively dispatch this before-hook.
          const session = ctx.path === "/change-password" ? await getAuthoritativeSessionFromCtx(ctx) : null;
          const scopes = [`ip:${ip}`, ...(email ? [`email:${email}`] : []), ...(session ? [`user:${session.user.id}`] : [])];
          for (const scope of scopes) {
            const key = `account:${ctx.path}:${createHash("sha256").update(scope).digest("hex")}`;
            const now = Date.now();
            const [limit] = await db.insert(rateLimits).values({ id: key, key, count: 1, lastRequest: now }).onConflictDoUpdate({
              target: rateLimits.key,
              set: {
                count: sql`CASE WHEN ${rateLimits.lastRequest} < ${now - 60_000} THEN 1 ELSE ${rateLimits.count} + 1 END`,
                lastRequest: sql`CASE WHEN ${rateLimits.lastRequest} < ${now - 60_000} THEN ${now} ELSE ${rateLimits.lastRequest} END`,
              },
            }).returning({ count: rateLimits.count });
            const maximum = scope.startsWith("ip:") ? 30 : 5;
            if (limit.count > maximum) throw new APIError("TOO_MANY_REQUESTS", { message: "For mange forsøk. Vent et minutt og prøv igjen." });
          }
        }
        if (ctx.path === "/sign-up/email") {
          try {
            const profile = normalizeProfile(ctx.body);
            if (ctx.body.image != null) throw new Error("Last opp profilbilde fra profilsiden.");
            if (typeof ctx.body.email === "string" && ctx.body.email.trim().length > 254) throw new Error("E-postadressen er for lang.");
            ctx.body = { ...ctx.body, ...profile, ...(profile.phone === null ? { phone: undefined } : {}), email: typeof ctx.body.email === "string" ? ctx.body.email.trim().toLowerCase() : ctx.body.email };
            const legacy = await db.select({ id: members.id }).from(members).where(and(isNull(members.userId), sql`lower(trim(${members.email})) = ${ctx.body.email}`)).limit(1);
            if (legacy.length) throw new Error("E-posten er allerede registrert. Kontakt oss for å få tilgang til det eksisterende medlemskapet.");
          } catch (error) { throw new APIError("BAD_REQUEST", { message: error instanceof Error ? error.message : "Ugyldige opplysninger." }); }
        }
        if (ctx.path === "/sign-in/email" && typeof ctx.body.email === "string") ctx.body.email = ctx.body.email.trim().toLowerCase();
      }),
    },
    databaseHooks: { user: { create: { before: async (user) => {
      try {
        if (user.image != null) throw new Error("Last opp profilbilde fra profilsiden.");
        return { data: { ...normalizeProfile(user), email: user.email.trim().toLowerCase() } };
      } catch (error) { throw new APIError("BAD_REQUEST", { message: error instanceof Error ? error.message : "Ugyldige opplysninger." }); }
    } } } },
    plugins: options.nextCookies ? [nextCookies()] : [],
    // Adapter errors include bound credential values. Never pass them to logs.
    logger: { log: (level) => { if (level === "error") console.error("[auth] Authentication operation failed."); } },
    onAPIError: { throw: true },
  });
  return { ...auth, handler: async (request: Request) => {
    try { return await auth.handler(request); }
    catch {
      console.error("[auth] Authentication request failed.");
      return Response.json({ message: "Noe gikk galt. Prøv igjen senere." }, { status: 500 });
    }
  } };
}
let auth: ReturnType<typeof createAuth> | undefined;
export async function getAuth() { return auth ??= createAuth(await ensureDb(), { nextCookies: true }); }
