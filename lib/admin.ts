import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createAccountService, type Account } from "./account";
import { createAuth, getAuth } from "./auth";
import { ensureDb, type Db } from "./db";
import { adminGrants, events, eventTypes, users, type EventType } from "./db/schema";
import { todayInOslo } from "./dates";

export type AdminUser = { id: string; name: string; email: string; isAdmin: boolean };
export class AdminError extends Error {
  constructor(message: string, public readonly errors?: Record<string, string>) {
    super(message);
    this.name = "AdminError";
  }
}
export type EventInput = {
  title: unknown; type: unknown; date: unknown; startTime: unknown;
  endTime: unknown; location: unknown; description: unknown; spots: unknown;
};

function normalizeEmail(input: unknown): string {
  if (typeof input !== "string") throw new AdminError("Skriv inn en gyldig e-postadresse.", { email: "Skriv inn en gyldig e-postadresse." });
  const email = input.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AdminError("Skriv inn en gyldig e-postadresse.", { email: "Skriv inn en gyldig e-postadresse." });
  }
  return email;
}

function validateEvent(input: EventInput) {
  const errors: Record<string, string> = {};
  function text(value: unknown, field: string, max: number, required = true) {
    if (!required && value == null) return "";
    if (typeof value !== "string") { errors[field] = "Skriv inn tekst."; return ""; }
    const result = value.trim();
    if ((required && !result) || result.length > max) errors[field] = `Feltet må være ${required ? "mellom 1 og" : "maksimalt"} ${max} tegn.`;
    const controls = field === "description" ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/ : /[\p{Cc}]/u;
    if (controls.test(result)) errors[field] = "Teksten inneholder ugyldige tegn.";
    return result;
  }
  const title = text(input.title, "title", 160);
  const location = text(input.location, "location", 200);
  const description = text(input.description, "description", 5000, false);
  if (!eventTypes.includes(input.type as EventType)) errors.type = "Velg en gyldig arrangementstype.";
  const date = typeof input.date === "string" ? input.date : "";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00Z`) : new Date(NaN);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date || date < todayInOslo()) {
    errors.date = "Velg en gyldig dato i dag eller senere.";
  }
  const startTime = typeof input.startTime === "string" ? input.startTime : "";
  const endTime = typeof input.endTime === "string" ? input.endTime : "";
  const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  if (!timePattern.test(startTime)) errors.startTime = "Bruk et gyldig klokkeslett (TT:MM).";
  if (!timePattern.test(endTime)) errors.endTime = "Bruk et gyldig klokkeslett (TT:MM).";
  else if (timePattern.test(startTime) && endTime <= startTime) errors.endTime = "Sluttiden må være etter starttiden samme dag.";
  const spots = typeof input.spots === "number" ? input.spots
    : typeof input.spots === "string" && /^\d{1,5}$/.test(input.spots.trim()) ? Number(input.spots.trim()) : NaN;
  if (!Number.isInteger(spots) || spots < 1 || spots > 10000) errors.spots = "Antall plasser må være et heltall mellom 1 og 10 000.";
  if (Object.keys(errors).length) throw new AdminError("Kontroller feltene og prøv igjen.", errors);
  return { title, type: input.type as EventType, date, startTime, endTime, location, description, spots };
}

const userProjection = { id: users.id, name: users.name, email: users.email, adminId: adminGrants.userId };
const denied = () => new AdminError("Du har ikke tilgang til administrasjon.");

export function createAdminService(db: Db, auth: ReturnType<typeof createAuth>) {
  const accounts = createAccountService(db, auth);
  async function authenticatedAccount(headers: Headers): Promise<Account> {
    const account = await accounts.getAccount(headers);
    if (!account) throw new AdminError("Du må logge inn for å fortsette.");
    return account;
  }
  async function requireAdmin(headers: Headers): Promise<Account> {
    const account = await authenticatedAccount(headers);
    if (!account.isAdmin) throw denied();
    return account;
  }
  async function findUserByEmail(headers: Headers, email: unknown): Promise<AdminUser | null> {
    await requireAdmin(headers);
    const normalized = normalizeEmail(email);
    const [row] = await db.select(userProjection).from(users)
      .leftJoin(adminGrants, eq(adminGrants.userId, users.id))
      .where(eq(users.email, normalized)).limit(1);
    return row ? { id: row.id, name: row.name, email: row.email, isAdmin: row.adminId !== null } : null;
  }
  async function promoteUser(headers: Headers, userId: unknown): Promise<AdminUser> {
    const account = await authenticatedAccount(headers);
    return db.transaction(async (tx) => {
      // Libsql write transactions begin IMMEDIATE. Recheck under the writer lock
      // before looking up the target, so a revoked grant cannot authorize a write.
      const [grant] = await tx.select({ userId: adminGrants.userId }).from(adminGrants).where(eq(adminGrants.userId, account.id)).limit(1);
      if (!grant) throw denied();
      if (typeof userId !== "string" || !userId || userId.length > 200) throw new AdminError("Velg en gyldig konto.");
      const [user] = await tx.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
      if (!user) throw new AdminError("Kontoen finnes ikke lenger.");
      await tx.insert(adminGrants).values({ userId: user.id, grantedBy: account.id }).onConflictDoNothing({ target: adminGrants.userId });
      return { ...user, isAdmin: true };
    }, { behavior: "immediate" });
  }
  async function createEvent(headers: Headers, input: EventInput): Promise<{ id: number; slug: string; title: string }> {
    const account = await authenticatedAccount(headers);
    return db.transaction(async (tx) => {
      const [grant] = await tx.select({ userId: adminGrants.userId }).from(adminGrants).where(eq(adminGrants.userId, account.id)).limit(1);
      if (!grant) throw denied();
      const event = validateEvent(input);
      const prefix = event.title.toLowerCase().replaceAll("æ", "ae").replaceAll("ø", "o")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
      const slug = `${prefix || "arrangement"}-${randomUUID()}`;
      const [created] = await tx.insert(events).values({ ...event, slug, published: true })
        .returning({ id: events.id, slug: events.slug, title: events.title });
      return created;
    }, { behavior: "immediate" });
  }
  return { requireAdmin, findUserByEmail, promoteUser, createEvent };
}

async function service() { return createAdminService(await ensureDb(), await getAuth()); }
export async function requireAdmin(headers: Headers) { return (await service()).requireAdmin(headers); }
export async function findUserByEmail(headers: Headers, email: unknown) { return (await service()).findUserByEmail(headers, email); }
export async function promoteUser(headers: Headers, userId: unknown) { return (await service()).promoteUser(headers, userId); }
export async function createEvent(headers: Headers, input: EventInput) { return (await service()).createEvent(headers, input); }
