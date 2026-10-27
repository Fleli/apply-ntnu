# Member Accounts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Turn membership signup into persistent user accounts with editable private profiles and event registration.

**Architecture:** Better Auth owns credentials and sessions in the existing Drizzle/libsql database. A server account service connects authenticated users to member records; native Next server actions expose only safe profile and event operations. Small processed profile photos live in the database.

**Tech Stack:** Next.js 16.4, React 19.3, Tailwind 4, Drizzle/libsql, Better Auth 1.7, sharp, Node test runner with tsx.

**Spec:** `docs/superpowers/specs/2026-10-27-member-accounts-design.md`

## Global Constraints

- Keep Norwegian copy and the current visual design.
- Required name/email/password, optional phone/photo; no study/year requirement for new accounts.
- Read local Next guides before coding; use isolated temporary databases for tests/builds.
- Preserve all existing member IDs and registrations. Never claim legacy membership by email alone.
- No publishing, real emails, or production migrations in this task.

## Review Focus

- Direct auth endpoints must not bypass profile/legacy validation.
- Anonymous and cross-user profile/avatar/event requests must be rejected.
- Concurrent final-seat registrations must not overbook.
- Bad avatar bytes/large dimensions must not reach storage.
- Account creation with failed event signup must remain recoverable.

## Task 1: Account/data backend

**Files:** `lib/auth.ts`, `lib/account.ts`, `lib/db/schema.ts`, `lib/db/queries.ts`, `drizzle/*`, `app/api/auth/[...all]/route.ts`, `tests/accounts.test.ts`, `tests/events.test.ts`, `.env.example`.

**Interfaces:** `getAuth()` returns configured Better Auth instance asynchronously; `getAccount(headers: Headers)` returns `{id,name,email,phone,image}` or null (id is the auth user ID, image is URL or null). `requireAccount(headers)` throws on no session. `updateAccount(headers,{name,phone})` updates only current account. `registerAccountForEvent(headers,slug)` returns `{status,eventTitle}`; `listAccountRegistrations(headers)` returns rows `{id,title,date,startTime,location,status}`. Reusable `createAuth(db, options)` may support integration testing. UI uses the server action contract from Task 3.

- [x] Write and run real database/auth-handler tests for new signup, duplicate/legacy rejection, session lifecycle, password hashes, optional phone and authenticated-only updates.
- [x] Implement migrations, auth adapter/hooks and account service. Remove public upsert identity writes. Return only safe data to consumers.
- [x] Write and run event tests for current published events, waitlists, repeats and concurrency; implement transactional event registration based on authenticated identity.
- [x] Run focused tests and report exact contract changes to the controller.

## Task 2: Forms and navigation

**Files:** `components/SignupForm.tsx`, `components/LoginForm.tsx`, `components/ProfileForm.tsx`, `components/PasswordForm.tsx`, `components/Navbar.tsx`, `lib/signup.ts`, `lib/account-forms.ts`.

**Interfaces:** Types live in `lib/account-forms.ts`. `AccountFormState` is `{status:'idle'|'error'|'ok',message?:string,errors?:Record<string,string>}`. Server actions `signUp(prev,formData)`, `logIn(prev,formData)`, `saveProfile(prev,formData)`, `changePassword(prev,formData)` exported from `app/account-actions.ts`; `logOut()` takes no arguments. Forms use field names `name,email,password,phone,avatar,removeAvatar,currentPassword,newPassword,eventSlug`. Signup keeps props `events: {slug,title}[]` and `preselected?:string`. Login gets `eventSlug?:string`. Profile gets `{account:{name,email,phone:string|null,image:string|null}}`. Navbar gets optional `account:{name:string,image:string|null}|null`.

- [x] Build accessible pending/error/success forms with actual optional photo upload and preview; preserve non-password values on validation errors.
- [x] Add login/profile/logout navigation for desktop/mobile. Keep spacing and visual hierarchy consistent.
- [x] Use semantic browser checks for labels, optional inputs, photo removal and navigation; use typechecking for the action interfaces.

## Task 3: Avatar, actions and page integration

**Files:** `lib/avatar.ts`, `tests/avatar.test.ts`, `app/api/profile/avatar/route.ts`, `app/account-actions.ts`, `app/logg-inn/page.tsx`, `app/min-side/page.tsx`, `app/bli-medlem/page.tsx`, `app/bli-medlem/actions.ts`, `app/layout.tsx`, `README.md`, `package.json`.

- [x] Test invalid bytes, MIME, size, dimensions, normalized output and no-file behavior; implement avatar validation/storage without local upload files.
- [x] Wire forms to Better Auth and account service with per-action session checks. Process optional photo before saving; prevent partial errors from looking like failed account creation.
- [x] Build login and protected profile pages, event confirmation/history, and preserve selected event across login/signup. Read email only; support authenticated password changes.
- [x] Document configuration and explicit limits (email verification/recovery and legacy claims require follow-up email integration).
- [x] Run all integration tests, typecheck and build using a disposable database; inspect UI, then request independent final review and fix actionable findings.
