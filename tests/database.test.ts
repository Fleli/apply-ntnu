import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";

const run = promisify(execFile);

test("concurrent development database requests share an in-flight first migration", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "apply-db-startup-"));
  try {
    // A fresh process isolates ensureDb's module/global caches and environment.
    const script = `
      import assert from "node:assert/strict";
      import { ensureDb } from "./lib/db";
      async function verify() {
        const requests = [ensureDb(), ensureDb(), ensureDb()];
        const databases = await Promise.all(requests);
        assert.strictEqual(requests[0], requests[1]);
        assert.strictEqual(requests[1], requests[2]);
        assert.strictEqual(databases[0], databases[1]);
        assert.strictEqual(await ensureDb(), databases[0]);
        console.log("Shared migration completed");
      }
      verify().catch(error => { console.error(error); process.exitCode = 1; });
    `;
    const result = await run(process.execPath, [path.resolve("node_modules/tsx/dist/cli.mjs"), "--eval", script], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: "development", DATABASE_URL: `file:${directory}/test.db`, DATABASE_AUTH_TOKEN: "" },
    });
    assert.match(result.stdout, /Shared migration completed/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
