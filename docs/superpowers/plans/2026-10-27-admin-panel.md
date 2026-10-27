# Admin panel implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Let existing administrators publish events and promote registered members.
**Architecture:** A separate admin grant table and authenticated data service enforce permissions. Server actions feed a protected page with creation and promotion forms; an operator CLI bootstraps the first grant.
**Tech Stack:** Existing Next.js, React, Better Auth, Drizzle and libsql.
**Spec:** `docs/superpowers/specs/2026-10-27-admin-panel-design.md`

## Global Constraints

- Preserve Norwegian UI, existing light/dark tokens, accounts and migrations.
- Read installed Next.js documentation before writing framework code.
- Never accept caller-supplied identity or role as authorization.
- Only disposable databases for tests; do not grant a real account until user identifies it.

## Review Focus

- Direct requests by guests and members must not read users or write grants/events.
- Existing sessions must see fresh role changes; stale grants cannot authorize writes.
- Bootstrap races must produce one first admin; normal signup never grants access.
- Calendar/time/capacity validation and slug collisions must not create broken public events.
- Small screens, long email addresses and pending/error feedback remain usable in both themes.

### Task 1: Authorization, event creation and bootstrap

**Files:** `lib/db/schema.ts`, generated `drizzle/` migration, `lib/account.ts`, new `lib/admin.ts`, `lib/admin-bootstrap.ts`, `scripts/bootstrap-admin.ts`, `tests/admin.test.ts`, `package.json`.

**Interfaces:**
- Extend `Account` with `isAdmin: boolean`, read from the new grant table.
- Export `AdminUser = { id: string; name: string; email: string; isAdmin: boolean }` and `AdminError extends Error` with optional `errors: Record<string,string>` from `lib/admin.ts`.
- Export `EventInput` with unknown-valued title/type/date/startTime/endTime/location/description/spots fields.
- `createAdminService(db, auth)` returns `requireAdmin(headers): Promise<Account>`, `findUserByEmail(headers, email: unknown): Promise<AdminUser|null>`, `promoteUser(headers, userId: unknown): Promise<AdminUser>`, `createEvent(headers, input: EventInput): Promise<{id:number;slug:string;title:string}>`.
- Export matching lazy wrappers for those four service methods, using ensureDb/getAuth.
- `bootstrapFirstAdmin(db, email: unknown): Promise<AdminUser>` in an operator-only module; npm script `admin:bootstrap -- <email>` loads project env using normal Next conventions.

- [x] Write failing real DB/session tests for denied anonymous/member operations, forged role signup/profile fields, successful creation/promotion, repeat promotion preserving provenance, permission changes in existing sessions, expired sessions, bootstrap exact account/missing account/existing admin/concurrent attempts, valid event roundtrip, invalid dates/times/types/capacity/text and duplicate event titles producing different slugs.
- [x] Run the new tests to confirm missing-feature failures.
- [x] Implement grant migration, live account role, bounded service validation, explicit projections and transactional bootstrap. Use ON DELETE SET NULL for the granting user; keep grants on repeated promotions. Validate event fields per spec and always publish new events.
- [x] Run new tests and full npm test; report results and interface changes to the UI implementer.

### Task 2: Protected page, forms and navigation

**Files:** new `app/admin/page.tsx`, `app/admin/actions.ts`, `components/AdminEventForm.tsx`, `components/AdminMembersForm.tsx`, `lib/admin-forms.ts`; modify layout/Navbar and README.

- [x] Build server actions consuming Task 1 wrappers and converting only known AdminError messages into accessible feedback. Never trust previous action state.
- [x] Guard page before fetching data. Add event form with preserved input on errors and redirect-after-success. Add email lookup followed by separately confirmed promotion and current role status; preserve target only from verified server results.
- [x] Add admin-only links on desktop/mobile and explain the operator bootstrap command in README. Reuse existing semantic colors and form feedback.
- [x] Run typecheck and production build against a disposable database.

### Task 3: End-to-end verification and review

- [x] Bootstrap only a synthetic account in the disposable DB, verify admin UI, create a test event, promote another synthetic user and see the panel available to that session.
- [x] Verify ordinary/anonymous visitors lack access, public event visibility, mobile layout and both themes. Save a preview screenshot.
- [x] Obtain independent security/code review; resolve actionable findings and run covering checks.
- [x] Commit the implementation; real first-admin assignment is pending the user's account choice and database availability.
