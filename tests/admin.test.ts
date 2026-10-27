import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, rm, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { createAuth } from "../lib/auth";
import { createAccountService } from "../lib/account";
import { AdminError, createAdminService, type EventInput } from "../lib/admin";
import { bootstrapFirstAdmin } from "../lib/admin-bootstrap";
import { todayInOslo } from "../lib/dates";

let directory: string;
let client: ReturnType<typeof createClient>;
let db: ReturnType<typeof drizzle<typeof schema>>;
let auth: ReturnType<typeof createAuth>;
let service: ReturnType<typeof createAdminService>;
const origin = "http://localhost:3000";
const secret = "admin-test-secret-with-more-than-thirty-two-characters";
const password = "a-strong-test-password-123";
const run = promisify(execFile);
const validEvent: EventInput = {
  title: "Søknadskveld på campus", type: "Søknadskveld", date: "2099-02-28",
  startTime: "18:00", endTime: "20:00", location: "Campus Gløshaugen",
  description: "Ta med CV.\nVi hjelper deg i gang.", spots: "25",
};
async function signup(email: string, extra: Record<string, unknown> = {}, database = db) {
  const instance = database === db ? auth : createAuth(database, { baseURL: origin, secret, rateLimit: false });
  const response = await instance.handler(new Request(`${origin}/api/auth/sign-up/email`, {
    method: "POST", headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ name: "Test Member", email, password, ...extra }),
  }));
  assert.equal(response.status, 200, await response.clone().text());
  const headers = new Headers({ cookie: response.headers.get("set-cookie")!.split(";")[0] });
  const account = await createAccountService(database, instance).requireAccount(headers);
  return { headers, account };
}
async function administrator(email: string) {
  const identity = await signup(email);
  await db.insert(schema.adminGrants).values({ userId: identity.account.id });
  return identity;
}
async function freshDatabase(name: string) {
  const connection = createClient({ url: `file:${directory}/${name}.db` });
  await connection.execute("PRAGMA foreign_keys = ON");
  const database = drizzle(connection, { schema });
  await migrate(database, { migrationsFolder: path.resolve("drizzle") });
  return { connection, database };
}
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "apply-admin-"));
  ({ connection: client, database: db } = await freshDatabase("test"));
  auth = createAuth(db, { baseURL: origin, secret, rateLimit: false });
  service = createAdminService(db, auth);
});
after(async () => { client?.close(); if (directory) await rm(directory, { recursive: true, force: true }); });

test("new accounts remain members with forged signup, profile and direct auth role fields", async () => {
  const { headers, account } = await signup("forged-role@example.com", { isAdmin: true, role: "admin", admin: true });
  assert.equal(account.isAdmin, false);
  const updated = await createAccountService(db, auth).updateAccount(headers, {
    name: "Still a Member", ...{ isAdmin: true, role: "admin" },
  });
  assert.equal(updated.isAdmin, false);
  const response = await auth.handler(new Request(`${origin}/api/auth/update-user`, {
    method: "POST", headers: { origin, "content-type": "application/json", cookie: headers.get("cookie")! },
    body: JSON.stringify({ isAdmin: true, role: "admin" }),
  }));
  assert.ok(response.status >= 400);
  assert.equal((await createAccountService(db, auth).requireAccount(headers)).isAdmin, false);
  assert.equal((await db.select().from(schema.adminGrants).where(eq(schema.adminGrants.userId, account.id))).length, 0);
});

test("anonymous and ordinary members cannot access any admin operation or input details", async () => {
  const member = await signup("ordinary@example.com");
  const beforeEvents = (await db.select().from(schema.events)).length;
  const beforeGrants = (await db.select().from(schema.adminGrants)).length;
  for (const headers of [new Headers(), member.headers]) {
    for (const operation of [
      () => service.requireAdmin(headers),
      () => service.findUserByEmail(headers, "ordinary@example.com"),
      () => service.findUserByEmail(headers, {}),
      () => service.promoteUser(headers, member.account.id),
      () => service.promoteUser(headers, {}),
      () => service.createEvent(headers, validEvent),
      () => service.createEvent(headers, {} as EventInput),
    ]) await assert.rejects(operation(), (error: unknown) => error instanceof AdminError && !error.errors);
  }
  assert.equal((await db.select().from(schema.events)).length, beforeEvents);
  assert.equal((await db.select().from(schema.adminGrants)).length, beforeGrants);
});

test("admin lookup uses exact normalized email and returns only public administration fields", async () => {
  const admin = await administrator("lookup-admin@example.com");
  const target = await signup("lookup-target@example.com", { phone: "+47 12345678" });
  const found = await service.findUserByEmail(admin.headers, "  LOOKUP-TARGET@EXAMPLE.COM  ");
  assert.deepEqual(found, { id: target.account.id, name: "Test Member", email: "lookup-target@example.com", isAdmin: false });
  assert.equal(await service.findUserByEmail(admin.headers, "missing@example.com"), null);
  for (const invalid of ["", "target", "@example.com", "a b@example.com", "x".repeat(255), 4, {}, null]) {
    await assert.rejects(service.findUserByEmail(admin.headers, invalid), (error: unknown) => error instanceof AdminError && Boolean(error.errors?.email));
  }
});

test("promotion is immediately visible to an existing session and preserves original grant provenance", async () => {
  const first = await administrator("first-promoter@example.com");
  const second = await administrator("second-promoter@example.com");
  const member = await signup("promoted@example.com");
  await assert.rejects(service.requireAdmin(member.headers), AdminError);
  const result = await service.promoteUser(first.headers, member.account.id);
  assert.deepEqual(result, { id: member.account.id, name: "Test Member", email: "promoted@example.com", isAdmin: true });
  assert.equal((await service.requireAdmin(member.headers)).isAdmin, true);
  assert.equal((await createAccountService(db, auth).requireAccount(member.headers)).isAdmin, true);
  // A prior timestamp makes a mistaken regrant observable even within one second.
  await db.update(schema.adminGrants).set({ grantedAt: new Date("2001-02-03T04:05:06Z") }).where(eq(schema.adminGrants.userId, member.account.id));
  const [original] = await db.select().from(schema.adminGrants).where(eq(schema.adminGrants.userId, member.account.id));
  assert.equal(original.grantedBy, first.account.id);
  assert.ok(original.grantedAt instanceof Date);
  await service.promoteUser(second.headers, member.account.id);
  const [repeated] = await db.select().from(schema.adminGrants).where(eq(schema.adminGrants.userId, member.account.id));
  assert.deepEqual(repeated, original);
  await db.delete(schema.users).where(eq(schema.users.id, first.account.id));
  const [retained] = await db.select().from(schema.adminGrants).where(eq(schema.adminGrants.userId, member.account.id));
  assert.equal(retained.grantedBy, null);
  assert.deepEqual(retained.grantedAt, original.grantedAt);
  assert.equal((await service.requireAdmin(member.headers)).isAdmin, true);
  for (const id of [null, {}, "", "x".repeat(201), "missing-user"]) await assert.rejects(service.promoteUser(second.headers, id), AdminError);
});

test("revoked grants and expired or tampered sessions cannot use admin services", async () => {
  const admin = await administrator("revoked@example.com");
  assert.equal((await service.requireAdmin(admin.headers)).isAdmin, true);
  await db.delete(schema.adminGrants).where(eq(schema.adminGrants.userId, admin.account.id));
  assert.equal((await createAccountService(db, auth).requireAccount(admin.headers)).isAdmin, false);
  await assert.rejects(service.requireAdmin(admin.headers), AdminError);
  await assert.rejects(service.createEvent(admin.headers, validEvent), AdminError);
  await assert.rejects(service.promoteUser(admin.headers, admin.account.id), AdminError);
  await assert.rejects(service.findUserByEmail(admin.headers, "ordinary@example.com"), AdminError);
  await db.insert(schema.adminGrants).values({ userId: admin.account.id });
  await db.update(schema.sessions).set({ expiresAt: new Date(0) }).where(eq(schema.sessions.userId, admin.account.id));
  await assert.rejects(service.requireAdmin(admin.headers), AdminError);
  await assert.rejects(service.createEvent(admin.headers, validEvent), AdminError);
  await assert.rejects(service.promoteUser(admin.headers, admin.account.id), AdminError);
  await assert.rejects(service.findUserByEmail(admin.headers, admin.account.email), AdminError);
  const tampered = new Headers(admin.headers); tampered.set("cookie", `${tampered.get("cookie")}tampered`);
  await assert.rejects(service.requireAdmin(tampered), AdminError);
});

test("mutations recheck the grant after entering their real write transaction", async () => {
  const admin = await administrator("transaction-admin@example.com");
  const member = await signup("transaction-member@example.com");
  // Revoke between the verified session read and BEGIN IMMEDIATE. The query and
  // transaction remain real; this seam only makes the race deterministic.
  const boundaryDb = new Proxy(db, { get(target, property, receiver) {
    if (property === "transaction") return async (...args: Parameters<typeof db.transaction>) => {
      await db.delete(schema.adminGrants).where(eq(schema.adminGrants.userId, admin.account.id));
      return target.transaction(...args);
    };
    return Reflect.get(target, property, receiver);
  } });
  const instance = createAdminService(boundaryDb, auth);
  const before = (await db.select().from(schema.events)).length;
  await assert.rejects(instance.createEvent(admin.headers, validEvent), AdminError);
  assert.equal((await db.select().from(schema.events)).length, before);
  await db.insert(schema.adminGrants).values({ userId: admin.account.id });
  await assert.rejects(instance.promoteUser(admin.headers, member.account.id), AdminError);
  assert.equal((await db.select().from(schema.adminGrants).where(eq(schema.adminGrants.userId, member.account.id))).length, 0);
});

test("created events roundtrip publicly with normalized text and unique server-generated slugs", async () => {
  const admin = await administrator("event-admin@example.com");
  const first = await service.createEvent(admin.headers, { ...validEvent, title: "  Søknadskveld på campus  ", location: " Campus Gløshaugen ", ...{ published: false, slug: "forged-slug", id: 99 } });
  const second = await service.createEvent(admin.headers, validEvent);
  assert.equal(first.title, "Søknadskveld på campus");
  assert.notEqual(first.slug, second.slug);
  assert.notEqual(first.slug, "forged-slug");
  assert.match(first.slug, /^[a-z0-9-]+$/);
  assert.ok(first.slug.length <= 200);
  const [saved] = await db.select().from(schema.events).where(eq(schema.events.slug, first.slug));
  assert.equal(saved.id, first.id);
  assert.equal(saved.published, true);
  assert.equal(saved.title, "Søknadskveld på campus");
  assert.equal(saved.type, "Søknadskveld");
  assert.equal(saved.date, "2099-02-28");
  assert.equal(saved.startTime, "18:00");
  assert.equal(saved.endTime, "20:00");
  assert.equal(saved.location, "Campus Gløshaugen");
  assert.equal(saved.description, "Ta med CV.\nVi hjelper deg i gang.");
  assert.equal(saved.spots, 25);
  const member = await signup("event-attendee@example.com");
  assert.equal((await createAccountService(db, auth).registerAccountForEvent(member.headers, first.slug)).status, "påmeldt");
});

test("event validation rejects invalid text, calendar dates, times, types and capacities before writes", async () => {
  const admin = await administrator("validation-admin@example.com");
  const cases: [keyof EventInput, unknown][] = [
    ["title", ""], ["title", "   "], ["title", "x".repeat(161)], ["title", {}], ["title", "Bad\u0000title"],
    ["type", "Unknown"], ["type", null], ["date", "2099-02-29"], ["date", "2099-04-31"],
    ["date", "2099-2-01"], ["date", "2020-01-01"], ["date", "2099-01-01T12:00"], ["date", null],
    ["startTime", "24:00"], ["startTime", "18:60"], ["startTime", "9:00"], ["startTime", 1800],
    ["endTime", "18:00"], ["endTime", "17:00"], ["endTime", "25:00"], ["endTime", null],
    ["location", ""], ["location", "x".repeat(201)], ["location", {}], ["location", "Bad\u0000place"],
    ["description", "x".repeat(5001)], ["description", {}], ["description", "Bad\u0000text"],
    ["spots", ""], ["spots", "0"], ["spots", "-1"], ["spots", "1.5"], ["spots", "10001"],
    ["spots", "1e2"], ["spots", "0x10"], ["spots", {}], ["spots", true], ["spots", Number.NaN], ["spots", Infinity],
  ];
  const before = (await db.select().from(schema.events)).length;
  for (const [field, value] of cases) {
    await assert.rejects(service.createEvent(admin.headers, { ...validEvent, [field]: value }),
      (error: unknown) => error instanceof AdminError && Boolean(error.errors?.[field]), `${field}: ${String(value)}`);
  }
  assert.equal((await db.select().from(schema.events)).length, before);
});

test("event boundaries accept today in Oslo, leap dates, all event types and optional plain text", async () => {
  const admin = await administrator("boundary-admin@example.com");
  const current = await service.createEvent(admin.headers, { ...validEvent, date: todayInOslo(), description: undefined, spots: 1 });
  const [saved] = await db.select().from(schema.events).where(eq(schema.events.id, current.id));
  assert.equal(saved.description, ""); assert.equal(saved.spots, 1);
  for (const type of ["Workshop", "Sosialt"]) {
    const result = await service.createEvent(admin.headers, { ...validEvent, type, title: "x".repeat(160), location: "x".repeat(200), date: "2096-02-29", startTime: "00:00", endTime: "23:59", spots: 10000, description: "x".repeat(5000) });
    assert.ok(result.id > 0);
  }
  const plain = await service.createEvent(admin.headers, { ...validEvent, description: "<b>Plain text</b>" });
  const [stored] = await db.select().from(schema.events).where(eq(schema.events.id, plain.id));
  assert.equal(stored.description, "<b>Plain text</b>");
});

test("bootstrap selects an exact registered account and refuses missing accounts or an established admin set", async () => {
  const { connection, database } = await freshDatabase("bootstrap");
  try {
    const first = await signup("first@example.com", {}, database);
    const other = await signup("other@example.com", {}, database);
    await assert.rejects(bootstrapFirstAdmin(database, "missing@example.com"), AdminError);
    await assert.rejects(bootstrapFirstAdmin(database, {}), AdminError);
    assert.equal((await database.select().from(schema.adminGrants)).length, 0);
    assert.deepEqual(await bootstrapFirstAdmin(database, " FIRST@EXAMPLE.COM "), { id: first.account.id, name: "Test Member", email: "first@example.com", isAdmin: true });
    const [grant] = await database.select().from(schema.adminGrants);
    assert.equal(grant.grantedBy, null);
    await assert.rejects(bootstrapFirstAdmin(database, first.account.email), AdminError);
    await assert.rejects(bootstrapFirstAdmin(database, other.account.email), AdminError);
    assert.deepEqual(await database.select().from(schema.adminGrants), [grant]);
  } finally { connection.close(); }
});

test("concurrent bootstrap attempts through independent connections create exactly one administrator", async () => {
  const { connection, database } = await freshDatabase("bootstrap-race");
  const second = createClient({ url: `file:${directory}/bootstrap-race.db` });
  const otherDb = drizzle(second, { schema });
  try {
    await signup("race-first@example.com", {}, database);
    await signup("race-second@example.com", {}, database);
    const results = await Promise.allSettled([
      bootstrapFirstAdmin(database, "race-first@example.com"),
      bootstrapFirstAdmin(otherDb, "race-second@example.com"),
    ]);
    assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
    const failure = results.find(result => result.status === "rejected");
    assert.ok(failure?.status === "rejected" && failure.reason instanceof AdminError, failure?.status === "rejected" ? String(failure.reason) : "No rejected bootstrap");
    assert.equal((await database.select().from(schema.adminGrants)).length, 1);
  } finally { connection.close(); second.close(); }
});

test("operator CLI loads Next environment files and refuses subsequent bootstraps", async () => {
  const cliDir = await mkdtemp(path.join(directory, "cli-"));
  const connection = createClient({ url: `file:${cliDir}/target.db` });
  const database = drizzle(connection, { schema });
  await migrate(database, { migrationsFolder: path.resolve("drizzle") });
  await signup("cli-owner@example.com", {}, database);
  await writeFile(path.join(cliDir, ".env"), "DATABASE_URL=file:./wrong.db\n");
  await writeFile(path.join(cliDir, ".env.local"), "DATABASE_URL=file:./target.db\n");
  await symlink(path.resolve("drizzle"), path.join(cliDir, "drizzle"));
  const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: "development" };
  delete env.DATABASE_URL; delete env.DATABASE_AUTH_TOKEN;
  try {
    const args = [path.resolve("node_modules/tsx/dist/cli.mjs"), path.resolve("scripts/bootstrap-admin.ts"), "CLI-OWNER@EXAMPLE.COM"];
    const result = await run(process.execPath, args, { cwd: cliDir, env });
    assert.match(result.stdout, /cli-owner@example.com/);
    assert.equal((await database.select().from(schema.adminGrants)).length, 1);
    await assert.rejects(run(process.execPath, args, { cwd: cliDir, env }), (error: unknown) => typeof error === "object" && error !== null && "code" in error && error.code === 1);
    assert.equal((await database.select().from(schema.adminGrants)).length, 1);
  } finally { connection.close(); }
});
