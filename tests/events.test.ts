import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "../lib/db/schema";
import { createAuth } from "../lib/auth";
import { createAccountService } from "../lib/account";
let directory: string;
let client: ReturnType<typeof createClient>;
let db: ReturnType<typeof drizzle<typeof schema>>;
let service: ReturnType<typeof createAccountService>;
let identities: Headers[];
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "apply-events-"));
  client = createClient({ url: `file:${directory}/test.db` });
  await client.execute("PRAGMA foreign_keys = ON");
  db = drizzle(client, { schema });
  // Existing rows must survive rebuilding nullable membership columns, including FKs.
  const initial = await readFile("drizzle/0000_init.sql", "utf8");
  for (const statement of initial.split("--> statement-breakpoint")) if (statement.trim()) await client.execute(statement);
  await client.execute("INSERT INTO members(id,first_name,last_name,email,study_program,year) VALUES(77,'Legacy','Owner','legacy@test.no','Data','3')");
  await client.execute("INSERT INTO events(id,slug,title,date,start_time,end_time,location) VALUES(88,'legacy','Legacy','2020-01-01','18:00','20:00','Campus')");
  await client.execute("INSERT INTO registrations(id,event_id,member_id) VALUES(99,88,77)");
  // Mark initial migration applied without rerunning it.
  await client.execute('CREATE TABLE __drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at numeric)');
  await client.execute("INSERT INTO __drizzle_migrations(hash,created_at) VALUES('initial',1792246782885)");
  await migrate(db, { migrationsFolder: path.resolve("drizzle") });
  const auth = createAuth(db, { baseURL: "http://localhost:3000", secret: "test-secret-with-more-than-thirty-two-characters", rateLimit: false });
  service = createAccountService(db, auth);
  identities = [];
  for (let index = 0; index < 4; index++) {
    const response = await auth.handler(new Request("http://localhost:3000/api/auth/sign-up/email", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: JSON.stringify({ name: `Member ${index}`, email: `member${index}@test.no`, password: "test-password-long-enough" }) }));
    assert.equal(response.status, 200, await response.clone().text());
    identities.push(new Headers({ cookie: response.headers.get("set-cookie")!.split(";")[0] }));
  }
});
after(async () => { client?.close(); if (directory) await rm(directory, { recursive: true, force: true }); });
test("migration preserves legacy IDs and event foreign keys", async () => {
  const rows = await client.execute("SELECT * FROM registrations WHERE id=99");
  assert.equal(rows.rows[0].member_id, 77);
  assert.deepEqual((await client.execute("PRAGMA foreign_key_check")).rows, []);
});
test("registrations require a session and current published event; duplicates stay idempotent", async () => {
  await db.insert(schema.events).values([
    { slug: "open", title: "Open", date: "2099-01-01", startTime: "18:00", endTime: "20:00", location: "Campus", spots: 1 },
    { slug: "hidden", title: "Hidden", date: "2099-01-01", startTime: "18:00", endTime: "20:00", location: "Campus", published: false },
  ]);
  await assert.rejects(service.registerAccountForEvent(new Headers(), "open"));
  for (const slug of ["hidden", "legacy", "missing"]) await assert.rejects(service.registerAccountForEvent(identities[0], slug));
  assert.equal((await service.registerAccountForEvent(identities[0], "open")).status, "påmeldt");
  assert.equal((await service.registerAccountForEvent(identities[0], "open")).status, "påmeldt");
  assert.equal((await service.registerAccountForEvent(identities[1], "open")).status, "venteliste");
  assert.equal((await service.listAccountRegistrations(identities[0])).length, 1);
  assert.equal((await service.listAccountRegistrations(identities[2])).length, 0);
});
test("simultaneous attempts at final seat never overbook", async () => {
  await db.insert(schema.events).values({ slug: "last-seat", title: "Last seat", date: "2099-01-01", startTime: "18:00", endTime: "20:00", location: "Campus", spots: 1 });
  const results = await Promise.all(identities.map(headers => service.registerAccountForEvent(headers, "last-seat")));
  assert.equal(results.filter(result => result.status === "påmeldt").length, 1);
  assert.equal(results.filter(result => result.status === "venteliste").length, 3);
});

test("independent database connections serialize final-seat requests", async () => {
  await db.insert(schema.events).values({ slug: "shared-seat", title: "Shared seat", date: "2099-01-01", startTime: "18:00", endTime: "20:00", location: "Campus", spots: 1 });
  const connections = identities.map(() => createClient({ url: `file:${directory}/test.db` }));
  try {
    const services = connections.map(connection => {
      const database = drizzle(connection, { schema });
      return createAccountService(database, createAuth(database, { baseURL: "http://localhost:3000", secret: "test-secret-with-more-than-thirty-two-characters", rateLimit: false }));
    });
    const results = await Promise.all(services.map((instance, index) => instance.registerAccountForEvent(identities[index], "shared-seat")));
    assert.equal(results.filter(result => result.status === "påmeldt").length, 1);
  } finally { connections.forEach(connection => connection.close()); }
});
