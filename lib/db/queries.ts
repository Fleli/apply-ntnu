import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  sql,
} from "drizzle-orm";
import { todayInOslo } from "@/lib/dates";
import { db, ensureDb } from "./index";
import {
  boardMembers,
  events,
  members,
  registrations,
  settings,
  testimonials,
  type Event,
  type RegistrationStatus,
} from "./schema";

export type EventWithCount = Event & { registered: number };

/** Antall bekreftede påmeldinger (ventelisten teller ikke). */
const registeredCount = sql<number>`coalesce(sum(case when ${registrations.status} = 'påmeldt' then 1 else 0 end), 0)`.mapWith(Number);

function eventsWithCount() {
  return db
    .select({ ...getTableColumns(events), registered: registeredCount })
    .from(events)
    .leftJoin(registrations, eq(registrations.eventId, events.id))
    .groupBy(events.id);
}

export async function listEvents(
  opts: { upcomingOnly?: boolean; limit?: number } = {},
): Promise<EventWithCount[]> {
  await ensureDb();
  const { upcomingOnly = true, limit } = opts;
  const where = upcomingOnly
    ? and(eq(events.published, true), gte(events.date, todayInOslo()))
    : eq(events.published, true);
  const q = eventsWithCount()
    .where(where)
    .orderBy(asc(events.date), asc(events.startTime));
  return limit ? q.limit(limit) : q;
}

export async function getEventBySlug(
  slug: string,
): Promise<EventWithCount | undefined> {
  await ensureDb();
  const rows = await eventsWithCount().where(eq(events.slug, slug)).limit(1);
  return rows[0];
}

export async function listBoard() {
  await ensureDb();
  return db
    .select()
    .from(boardMembers)
    .where(eq(boardMembers.active, true))
    .orderBy(asc(boardMembers.sortOrder), asc(boardMembers.name));
}

export async function listTestimonials() {
  await ensureDb();
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt));
}

export async function getSettings(): Promise<Record<string, string>> {
  await ensureDb();
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getStats() {
  await ensureDb();
  const [[m], [e], [r]] = await Promise.all([
    db.select({ n: count() }).from(members),
    db.select({ n: count() }).from(events).where(eq(events.published, true)),
    db
      .select({ n: count() })
      .from(registrations)
      .where(eq(registrations.status, "påmeldt")),
  ]);
  return { members: m.n, events: e.n, registrations: r.n };
}

/** Oppretter et medlem, eller oppdaterer opplysningene hvis e-posten finnes fra før. */
export async function upsertMember(input: {
  firstName: string;
  lastName: string;
  email: string;
  studyProgram: string;
  year: string;
}) {
  await ensureDb();
  const [row] = await db
    .insert(members)
    .values(input)
    .onConflictDoUpdate({
      target: members.email,
      set: {
        firstName: input.firstName,
        lastName: input.lastName,
        studyProgram: input.studyProgram,
        year: input.year,
      },
    })
    .returning();
  return row;
}

/**
 * Melder et medlem på et arrangement. Returnerer «påmeldt» eller
 * «venteliste», avhengig av om det er plass. Idempotent per medlem.
 */
export async function registerForEvent(
  memberId: number,
  eventId: number,
  spots: number,
): Promise<RegistrationStatus> {
  await ensureDb();
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.memberId, memberId),
        ),
      )
      .limit(1);
    if (existing) return existing.status;

    const [{ n }] = await tx
      .select({ n: count() })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.status, "påmeldt"),
        ),
      );
    const status: RegistrationStatus = n >= spots ? "venteliste" : "påmeldt";
    await tx.insert(registrations).values({ eventId, memberId, status });
    return status;
  });
}
