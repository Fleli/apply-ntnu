import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { createAuth } from "../lib/auth";
import { createAccountService } from "../lib/account";

let directory: string;
let client: ReturnType<typeof createClient>;
let db: ReturnType<typeof drizzle<typeof schema>>;
let auth: ReturnType<typeof createAuth>;
let service: ReturnType<typeof createAccountService>;
const origin = "http://localhost:3000";
const password = "a-strong-test-password-123";
async function request(route: string, body?: object, cookie?: string) {
  return auth.handler(new Request(`${origin}/api/auth/${route}`, {
    method: body ? "POST" : "GET", headers: { origin, "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }));
}
function sessionHeaders(response: Response) {
  return new Headers({ cookie: response.headers.get("set-cookie")!.split(";")[0] });
}
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "apply-accounts-"));
  client = createClient({ url: `file:${directory}/test.db` });
  db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: path.resolve("drizzle") });
  auth = createAuth(db, { baseURL: origin, secret: "test-secret-with-more-than-thirty-two-characters", rateLimit: false });
  service = createAccountService(db, auth);
});
after(async () => { client?.close(); if (directory) await rm(directory, { recursive: true, force: true }); });

test("signup normalizes identity, creates linked membership, hashes password and authenticates", async () => {
  const response = await request("sign-up/email", { name: "  Ada  Lovelace ", email: "ADA@EXAMPLE.COM", password });
  assert.equal(response.status, 200, await response.clone().text());
  const headers = sessionHeaders(response);
  const account = await service.requireAccount(headers);
  assert.equal(account.name, "Ada Lovelace"); assert.equal(account.email, "ada@example.com");
  assert.equal(account.phone, null); assert.equal(account.image, null); assert.equal(typeof account.id, "string");
  const [member] = await db.select().from(schema.members).where(eq(schema.members.userId, account.id));
  assert.equal(member.studyProgram, null); assert.equal(member.year, null);
  const [credential] = await db.select().from(schema.accounts).where(eq(schema.accounts.userId, account.id));
  assert.notEqual(credential.password, password); assert.ok(credential.password!.length > 50);
  await assert.rejects(service.updateAccount(new Headers(), { name: "Intruder", phone: null }));
  await service.updateAccount(headers, { name: "Ada Byron", phone: "+47 12345678" });
  assert.equal((await service.requireAccount(headers)).phone, "+47 12345678");
  await assert.rejects(service.updateAccount(headers, { name: " ", phone: "x" }));
  const duplicate = await request("sign-up/email", { name: "Other", email: "ada@example.com", password });
  assert.ok(duplicate.status >= 400);
  const logout = await request("sign-out", {}, headers.get("cookie")!); assert.equal(logout.status, 200);
  assert.equal(await service.getAccount(headers), null);
  const login = await request("sign-in/email", { email: "ADA@EXAMPLE.COM", password });
  assert.equal(login.status, 200); assert.equal((await service.requireAccount(sessionHeaders(login))).id, account.id);
  const wrong = await request("sign-in/email", { email: "ada@example.com", password: "incorrect-password" });
  const absent = await request("sign-in/email", { email: "absent@example.com", password: "incorrect-password" });
  assert.equal(wrong.status, absent.status); assert.equal((await wrong.json()).message, (await absent.json()).message);
});

test("direct auth requests enforce bounded fields and protect legacy membership", async () => {
  await db.insert(schema.members).values({ firstName: "Legacy", lastName: "Owner", email: "Legacy@Example.com", studyProgram: "Data", year: "3" });
  for (const body of [
    { name: "Attacker", email: "legacy@example.com", password },
    { name: " ", email: "empty@example.com", password },
    { name: "x".repeat(121), email: "long@example.com", password },
    { name: "Phone", email: "phone@example.com", password, phone: "x".repeat(41) },
    { name: "Image", email: "image@example.com", password, image: "https://attacker.example/pixel" },
  ]) {
    const response = await request("sign-up/email", body);
    assert.ok(response.status >= 400, JSON.stringify(body));
  }
  const [legacy] = await db.select().from(schema.members).where(eq(schema.members.email, "Legacy@Example.com"));
  assert.equal(legacy.firstName, "Legacy"); assert.equal(legacy.userId, null);
  const response = await request("sign-up/email", { name: "Phone Owner", email: "valid-phone@example.com", password, phone: "  +47 12345678  " });
  assert.equal(response.status, 200, await response.clone().text());
  const headers = sessionHeaders(response);
  assert.equal((await service.requireAccount(headers)).phone, "+47 12345678");
  const update = await request("update-user", { name: "Overwrite", image: "https://attacker.example/pixel" }, headers.get("cookie")!);
  assert.ok(update.status >= 400); assert.equal((await service.requireAccount(headers)).name, "Phone Owner");
  assert.equal((await request("change-email", { newEmail: "other@example.com" }, headers.get("cookie")!)).status, 404);
});

test("direct server API login attempts use database-backed throttling", async () => {
  const limited = createAuth(db, { baseURL: origin, secret: "test-secret-with-more-than-thirty-two-characters" });
  for (let attempt = 0; attempt < 5; attempt++) {
    await assert.rejects(limited.api.signInEmail({ headers: new Headers({ "x-forwarded-for": "192.0.2.1" }), body: { email: "rate@example.com", password: "incorrect-password" } }), (error: any) => error.statusCode === 401);
  }
  await assert.rejects(limited.api.signInEmail({ headers: new Headers({ "x-forwarded-for": "192.0.2.1" }), body: { email: "RATE@example.com", password: "incorrect-password" } }), (error: any) => error.statusCode === 429);
  assert.ok((await db.select().from(schema.rateLimits)).length > 0);
});

test("password change verifies current password, revokes other sessions and expires sessions", async () => {
  const first = await request("sign-in/email", { email: "ada@example.com", password });
  const second = await request("sign-in/email", { email: "ada@example.com", password });
  const headers = sessionHeaders(first);
  const nextPassword = "a-new-strong-password-456";
  const wrong = await request("change-password", { currentPassword: "incorrect-password", newPassword: nextPassword }, headers.get("cookie")!);
  assert.ok(wrong.status >= 400);
  const changed = await request("change-password", { currentPassword: password, newPassword: nextPassword, revokeOtherSessions: true }, headers.get("cookie")!);
  assert.equal(changed.status, 200, await changed.clone().text());
  assert.equal(await service.getAccount(sessionHeaders(second)), null);
  assert.equal((await request("sign-in/email", { email: "ada@example.com", password })).status, 401);
  const fresh = await request("sign-in/email", { email: "ada@example.com", password: nextPassword });
  assert.equal(fresh.status, 200);
  const account = await service.requireAccount(sessionHeaders(fresh));
  await db.update(schema.sessions).set({ expiresAt: new Date(0) }).where(eq(schema.sessions.userId, account.id));
  assert.equal(await service.getAccount(sessionHeaders(fresh)), null);
  const tampered = sessionHeaders(fresh); tampered.set("cookie", `${tampered.get("cookie")}tampered`);
  assert.equal(await service.getAccount(tampered), null);
});

test("failed credential persistence rolls back auth user and linked membership", async () => {
  await client.execute("CREATE TRIGGER fail_test_credentials BEFORE INSERT ON auth_account WHEN NEW.account_id IS NOT NULL BEGIN SELECT RAISE(ABORT, 'test credential failure'); END");
  try {
    const response = await request("sign-up/email", { name: "Rollback Account", email: "rollback@example.com", password });
    assert.ok(response.status >= 400);
    assert.equal((await db.select().from(schema.users).where(eq(schema.users.email, "rollback@example.com"))).length, 0);
    assert.equal((await db.select().from(schema.members).where(eq(schema.members.email, "rollback@example.com"))).length, 0);
  } finally { await client.execute("DROP TRIGGER fail_test_credentials"); }
});

test("password-change throttling follows the verified user across IPs, sessions and entry points", async () => {
  const limited = createAuth(db, { baseURL: origin, secret: "test-secret-with-more-than-thirty-two-characters" });
  const users = [];
  for (let index = 0; index < 3; index++) {
    const email = `password-limit-${index}@example.com`;
    const signup = await request("sign-up/email", { name: `Password Limit ${index}`, email, password });
    assert.equal(signup.status, 200);
    const login = await request("sign-in/email", { email, password });
    assert.equal(login.status, 200);
    users.push({ primary: sessionHeaders(signup), secondary: sessionHeaders(login) });
  }
  const body = { currentPassword: "incorrect-password", newPassword: "valid-new-password-123" };
  for (let attempt = 0; attempt < 5; attempt++) {
    const headers = new Headers(attempt % 2 ? users[0].primary : users[0].secondary);
    headers.set("x-forwarded-for", `192.0.2.${attempt + 1}`);
    await assert.rejects(limited.api.changePassword({ headers, body }), (error: any) => error.statusCode === 400 && error.body.code === "INVALID_PASSWORD");
  }
  const sixth = new Headers(users[0].primary); sixth.set("x-forwarded-for", "192.0.2.6");
  await assert.rejects(limited.api.changePassword({ headers: sixth, body }), (error: any) => error.statusCode === 429);
  // Handler shares the same per-user bucket with direct server calls.
  const response = await limited.handler(new Request(`${origin}/api/auth/change-password`, {
    method: "POST", headers: { origin, "content-type": "application/json", cookie: users[0].secondary.get("cookie")!, "x-forwarded-for": "192.0.2.7" }, body: JSON.stringify(body),
  }));
  assert.equal(response.status, 429);
  // A different authenticated user can still change their own password.
  await limited.api.changePassword({ headers: users[1].primary, body: { ...body, currentPassword: password } });
  // Reproduce the same five-attempt limit starting through the HTTP handler.
  for (let attempt = 0; attempt < 6; attempt++) {
    const result = await limited.handler(new Request(`${origin}/api/auth/change-password`, {
      method: "POST", headers: { origin, "content-type": "application/json", cookie: users[2].primary.get("cookie")!, "x-forwarded-for": `198.51.100.${attempt + 1}` }, body: JSON.stringify(body),
    }));
    assert.equal(result.status, attempt < 5 ? 400 : 429);
  }
});
