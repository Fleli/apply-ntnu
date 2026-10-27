import { and, asc, eq, sql } from "drizzle-orm";
import { createAuth, getAuth, normalizeProfile } from "./auth";
import { ensureDb, type Db } from "./db";
import { events, members, profileImages, registrations, users, type RegistrationStatus } from "./db/schema";
import { todayInOslo } from "./dates";

export type Account = { id: string; name: string; email: string; phone: string | null; image: string | null };
export function createAccountService(db: Db, auth: ReturnType<typeof createAuth>) {
  async function getAccount(headers: Headers): Promise<Account | null> {
    const session = await auth.api.getSession({ headers });
    if (!session) return null;
    const [row] = await db.select({ id: users.id, name: users.name, email: users.email, phone: users.phone, updatedAt: profileImages.updatedAt })
      .from(users).innerJoin(members, eq(members.userId, users.id)).leftJoin(profileImages, eq(profileImages.userId, users.id))
      .where(eq(users.id, session.user.id)).limit(1);
    return row ? { id: row.id, name: row.name, email: row.email, phone: row.phone, image: row.updatedAt ? `/api/profile/avatar?v=${row.updatedAt.getTime()}` : null } : null;
  }
  async function requireAccount(headers: Headers) {
    const account = await getAccount(headers);
    if (!account) throw new Error("Du må logge inn for å fortsette.");
    return account;
  }
  async function updateAccount(headers: Headers, input: { name: string; phone?: string | null }) {
    const account = await requireAccount(headers);
    const profile = normalizeProfile(input);
    await db.transaction(async (tx) => {
      const [member] = await tx.select().from(members).where(eq(members.userId, account.id)).limit(1);
      if (!member) throw new Error("Medlemskapet er ikke tilgjengelig.");
      const [user] = await tx.update(users).set({ ...profile, updatedAt: new Date() }).where(eq(users.id, account.id)).returning({ id: users.id });
      if (!user) throw new Error("Kontoen er ikke tilgjengelig.");
      const [firstName, ...rest] = profile.name.split(" ");
      await tx.update(members).set({ firstName, lastName: rest.join(" ") }).where(eq(members.id, member.id));
    });
    return requireAccount(headers);
  }
  async function registerAccountForEvent(headers: Headers, slug: string): Promise<{ status: RegistrationStatus; eventTitle: string }> {
    const account = await requireAccount(headers);
    if (typeof slug !== "string" || !slug || slug.length > 200) throw new Error("Ugyldig arrangement.");
    // Libsql write transactions begin IMMEDIATE: read/count/insert hold the writer lock.
    return db.transaction(async (tx) => {
      const [member] = await tx.select({ id: members.id }).from(members).innerJoin(users, eq(members.userId, users.id)).where(eq(users.id, account.id)).limit(1);
      if (!member) throw new Error("Medlemskapet er ikke tilgjengelig.");
      const [event] = await tx.select().from(events).where(eq(events.slug, slug)).limit(1);
      if (!event || !event.published || event.date < todayInOslo()) throw new Error("Arrangementet er ikke åpent for påmelding.");
      const [existing] = await tx.select().from(registrations).where(and(eq(registrations.memberId, member.id), eq(registrations.eventId, event.id))).limit(1);
      if (existing) return { status: existing.status, eventTitle: event.title };
      const [{ n }] = await tx.select({ n: sql<number>`count(*)`.mapWith(Number) }).from(registrations).where(and(eq(registrations.eventId, event.id), eq(registrations.status, "påmeldt")));
      const status = n >= Math.max(0, event.spots) ? "venteliste" : "påmeldt";
      await tx.insert(registrations).values({ memberId: member.id, eventId: event.id, status });
      return { status, eventTitle: event.title };
    }, { behavior: "immediate" });
  }
  async function listAccountRegistrations(headers: Headers) {
    const account = await requireAccount(headers);
    return db.select({ id: registrations.id, title: events.title, date: events.date, startTime: events.startTime, location: events.location, status: registrations.status })
      .from(registrations).innerJoin(members, eq(members.id, registrations.memberId)).innerJoin(events, eq(events.id, registrations.eventId))
      .where(eq(members.userId, account.id)).orderBy(asc(events.date), asc(events.startTime));
  }
  return { getAccount, requireAccount, updateAccount, registerAccountForEvent, listAccountRegistrations };
}
async function service() { return createAccountService(await ensureDb(), await getAuth()); }
export async function getAccount(headers: Headers) { return (await service()).getAccount(headers); }
export async function requireAccount(headers: Headers) { return (await service()).requireAccount(headers); }
export async function updateAccount(headers: Headers, input: { name: string; phone?: string | null }) { return (await service()).updateAccount(headers, input); }
export async function registerAccountForEvent(headers: Headers, slug: string) { return (await service()).registerAccountForEvent(headers, slug); }
export async function listAccountRegistrations(headers: Headers) { return (await service()).listAccountRegistrations(headers); }
