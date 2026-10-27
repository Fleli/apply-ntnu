# Member accounts

The user requested real accounts with required name, email and password, plus optional phone number and profile picture. They authorized proceeding with the assumed scope of profile editing and event registration ("just build iy").

## Experience

- Replace the current membership form with account signup. Keep Norwegian copy and the existing visual design. Study programme and year are no longer required for new accounts.
- Add login, logout and a private profile page. A member can edit their name and optional phone/photo, change their password, and see their event registrations. Email is displayed read-only initially; verified email changes and email recovery need a delivery service and are outside this increment.
- Keep event links and their selected event through signup/login. An authenticated member confirms registration without entering personal details again. Capacity and waitlist status remain visible. Repeated registration does not duplicate records.
- Photos are actual uploads, with a preview, replace/remove controls, JPEG/PNG/WebP input, a 2 MiB input limit, and server-side conversion to a bounded 256px WebP. Store the small normalized bytes in SQLite/Turso for durability; return only an image route URL in user/session data. Profile/photo access is private to the owner.

## Architecture and safeguards (implementation decisions)

- Use Better Auth with its Drizzle SQLite adapter for credentials, hashing, persistent sessions, CSRF/origin protection and database-backed rate limiting. Use a configured stable secret in production; do not expose credentials or password hashes in UI or logs.
- Preserve existing member IDs and registrations. New auth tables hold credentials and sessions; a unique nullable member-to-auth-user link joins new accounts to membership. Existing unclaimed member emails must not be claimed solely by entering that email: block with a clear contact message until a verified recovery workflow exists. No legacy records are overwritten.
- Authenticate on the server for every profile/photo/password/event operation. Derive identity from the session rather than posted IDs or email. Remove the existing unauthenticated email-based member upsert entry point.
- Keep optional phone private and validate bounded lengths. Default to no profile photo, using initials in the UI.
- Validate event publication/date/capacity in the registration transaction. Preserve membership if a separately attempted event registration fails, explain the separate outcome, and allow safe retry.
- Limit redirect targets to local known account/event destinations. Avoid exposing personal data in public page rendering or caching.
- Test only with disposable databases. No production configuration, database, deployment, messages or real user accounts are changed during implementation.

## Completion

Automated integration checks cover signup/login/logout, hashing, duplicate and legacy emails, unauthorized profile mutation, validation and optional fields, password change, valid/invalid avatars, and event/waitlist idempotence and eligibility. TypeScript and a production build must pass. Inspect the rendered signup, login and profile pages at desktop/mobile widths where tooling permits.
