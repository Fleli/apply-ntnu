import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const eventTypes = ["Søknadskveld", "Workshop", "Sosialt"] as const;
export type EventType = (typeof eventTypes)[number];

/** Arrangementer. Antall påmeldte beregnes fra `registrations`. */
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  type: text("type", { enum: eventTypes }).notNull().default("Søknadskveld"),
  /** ISO-dato, f.eks. 2026-10-22 */
  date: text("date").notNull(),
  /** HH:MM */
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull().default(""),
  spots: integer("spots").notNull().default(50),
  /** Upubliserte arrangementer vises ikke på nettsiden */
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

/** Medlemmer, registrert via skjemaet på /bli-medlem. */
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  studyProgram: text("study_program").notNull(),
  year: text("year").notNull(),
  consentAt: text("consent_at").notNull().default(sql`(current_timestamp)`),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

export const registrationStatuses = ["påmeldt", "venteliste"] as const;
export type RegistrationStatus = (typeof registrationStatuses)[number];

/** Påmeldinger: hvilket medlem som er meldt på hvilket arrangement. */
export const registrations = sqliteTable(
  "registrations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    memberId: integer("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "cascade" }),
    status: text("status", { enum: registrationStatuses })
      .notNull()
      .default("påmeldt"),
    createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  },
  (t) => [uniqueIndex("registrations_event_member").on(t.eventId, t.memberId)],
);

/** Styret, vist på /om-oss. */
export const boardMembers = sqliteTable("board_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  studyProgram: text("study_program"),
  email: text("email"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

/** Sitater fra medlemmer, vist på /erfaringer når de er godkjent. */
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  /** F.eks. «Indøk, 3. år» */
  meta: text("meta").notNull(),
  quote: text("quote").notNull(),
  approved: integer("approved", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
});

/**
 * Nøkkel/verdi-innstillinger. Brukte nøkler:
 * contact_email, instagram_url, linkedin_url, applications_sent
 */
export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type Event = typeof events.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type BoardMember = typeof boardMembers.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
