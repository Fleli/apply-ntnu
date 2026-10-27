# Admin panel

Existing administrators can create public events and promote registered accounts to administrator. The current Next.js, Better Auth, Drizzle, SQLite/libsql and Norwegian visual design remain in use, including both themes.

Store admin grants separately from authentication profile fields. A grant identifies the user, granting administrator (nullable for bootstrap/deleted issuer), and time. New signups are ordinary members regardless of submitted role fields. Read current permissions from the database for each protected operation.

`/admin` requires authentication and an admin grant. Anonymous visitors go to login; ordinary members see an access-denied page without admin data. Only admins receive the navigation link. Every server action independently verifies permissions through the data service.

The event form accepts title (1–160 characters), existing event type, real ISO date today or later in Europe/Oslo, start/end times (HH:MM, end after start on the same date), location (1–200), optional plain-text description (maximum 5000), and capacity (integer 1–10000). Publishing creates an immediately visible event with a server-generated unique slug. No event editing, deletion or draft workflow in this increment.

The member form looks up an exact normalized email and shows name, email and admin status before a separate explicit promotion. It exposes neither password/session data nor private phone/photo data. Email ownership is not verified by the current application, so the panel tells the admin to confirm the account belongs to the intended person. Repeated promotions preserve the original grant.

The first administrator is selected by an operator-only CLI using an already registered account email. Bootstrap refuses when any administrator already exists and handles concurrent attempts atomically. No public bootstrap route or first-signup privilege. The user has been asked which account to bootstrap; implementation and disposable test setup proceed independently.

Validate with real temporary databases and authenticated sessions, including unauthenticated/member denial, role-field injection, fresh permission reads, promotion idempotency, bootstrap races, and event validation. Verify desktop/mobile light/dark UI and public visibility of a created test event.
