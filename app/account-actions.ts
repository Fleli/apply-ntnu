"use server";

import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { APIError } from "better-auth/api";
import { getAuth } from "@/lib/auth";
import { getAccount, requireAccount, updateAccount, registerAccountForEvent } from "@/lib/account";
import { normalizeAvatar, AvatarValidationError, type NormalizedAvatar } from "@/lib/avatar";
import { ensureDb } from "@/lib/db";
import { profileImages } from "@/lib/db/schema";
import { listEvents } from "@/lib/db/queries";
import type { AccountFormState } from "@/lib/account-forms";

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
};
const password = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
};
const passwordError = (value: string) => value.length < 12 || value.length > 128 ? "Bruk mellom 12 og 128 tegn." : undefined;

function authMessage(error: unknown, fallback: string) {
  if (!(error instanceof APIError)) return fallback;
  const code = error.body?.code;
  if (code === "INVALID_EMAIL_OR_PASSWORD" || code === "INVALID_PASSWORD") return "E-postadressen eller passordet er feil.";
  if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "Denne e-postadressen er allerede registrert. Logg inn i stedet.";
  if (code === "TOO_MANY_REQUESTS" || error.status === "TOO_MANY_REQUESTS") return "For mange forsøk. Vent litt før du prøver igjen.";
  // Application validation hooks only use these Norwegian messages; other errors remain private.
  if (error.message === "E-posten er allerede registrert. Kontakt oss for å få tilgang til det eksisterende medlemskapet.") return error.message;
  return fallback;
}

async function eventIntent(form: FormData) {
  const slug = text(form, "eventSlug");
  if (!slug) return { slug: "" };
  if (slug.length > 160 || !(await listEvents()).some((event) => event.slug === slug)) {
    return { slug: "", error: "Arrangementet er ikke tilgjengelig for påmelding. Velg på nytt." };
  }
  return { slug };
}

async function storeAvatar(userId: string, avatar: NormalizedAvatar) {
  const db = await ensureDb();
  const updatedAt = new Date();
  await db.insert(profileImages).values({ userId, ...avatar, updatedAt }).onConflictDoUpdate({
    target: profileImages.userId,
    set: { ...avatar, updatedAt },
  });
}

export async function signUp(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const values = { name: text(form, "name"), email: text(form, "email").toLowerCase(), phone: text(form, "phone"), eventSlug: text(form, "eventSlug") };
  const secret = password(form, "password");
  const errors: Record<string, string> = {};
  if (!values.name || values.name.length > 120 || /[\p{Cc}]/u.test(values.name)) errors.name = "Skriv inn navnet ditt, med høyst 120 tegn.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) errors.email = "Skriv inn en gyldig e-postadresse.";
  if (values.phone && !/^[+\d ()-]{3,40}$/.test(values.phone)) errors.phone = "Skriv inn et gyldig telefonnummer, med høyst 40 tegn.";
  const invalidPassword = passwordError(secret);
  if (invalidPassword) errors.password = invalidPassword;
  const intent = await eventIntent(form);
  if (intent.error) errors.eventSlug = intent.error;
  let avatar: NormalizedAvatar | null = null;
  try { avatar = await normalizeAvatar(form.get("avatar")); }
  catch (error) { errors.avatar = error instanceof AvatarValidationError ? error.message : "Bildet kunne ikke leses."; }
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const requestHeaders = new Headers(await headers());
  if (await getAccount(requestHeaders)) return { status: "error", message: "Du er allerede logget inn. Åpne Min side for å endre profilen din.", values };
  let userId: string;
  try {
    const auth = await getAuth();
    const result = await auth.api.signUpEmail({ headers: requestHeaders, body: { name: values.name, email: values.email, password: secret, phone: values.phone || null } });
    userId = result.user.id;
  } catch (error) {
    return { status: "error", message: authMessage(error, "Kontoen kunne ikke opprettes. Prøv igjen om litt."), values };
  }

  // The account now exists. Failures in optional follow-up work must never invite another signup.
  let avatarFailed = false;
  let eventFailed = false;
  if (avatar) {
    try { await storeAvatar(userId, avatar); } catch { avatarFailed = true; }
  }
  if (intent.slug) {
    try {
      const signedInHeaders = new Headers(requestHeaders);
      signedInHeaders.set("cookie", (await cookies()).toString());
      await registerAccountForEvent(signedInHeaders, intent.slug);
    } catch { eventFailed = true; }
  }
  revalidatePath("/", "layout");
  const status = avatarFailed && eventFailed ? "created-avatar-event-error" : avatarFailed ? "created-avatar-error" : eventFailed ? "created-event-error" : "created";
  redirect(`/min-side?status=${status}${eventFailed && intent.slug ? `&arrangement=${encodeURIComponent(intent.slug)}` : ""}`);
}

export async function logIn(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const values = { email: text(form, "email").toLowerCase(), eventSlug: text(form, "eventSlug") };
  const secret = password(form, "password");
  const intent = await eventIntent(form);
  if (intent.error) return { status: "error", errors: { eventSlug: intent.error }, values };
  if (!values.email || !secret || values.email.length > 254 || secret.length > 128) return { status: "error", message: "Skriv inn e-postadressen og passordet ditt.", values };
  try {
    await (await getAuth()).api.signInEmail({ headers: new Headers(await headers()), body: { email: values.email, password: secret } });
  } catch (error) {
    return { status: "error", message: authMessage(error, "Kunne ikke logge inn. Kontroller e-postadresse og passord."), values };
  }
  revalidatePath("/", "layout");
  redirect(`/min-side${intent.slug ? `?arrangement=${encodeURIComponent(intent.slug)}` : ""}`);
}

export async function saveProfile(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const requestHeaders = new Headers(await headers());
  const account = await getAccount(requestHeaders);
  if (!account) return { status: "error", message: "Logg inn på nytt for å endre profilen din." };
  const values = { name: text(form, "name"), phone: text(form, "phone") };
  const errors: Record<string, string> = {};
  if (!values.name || values.name.length > 120 || /[\p{Cc}]/u.test(values.name)) errors.name = "Skriv inn navnet ditt, med høyst 120 tegn.";
  if (values.phone && !/^[+\d ()-]{3,40}$/.test(values.phone)) errors.phone = "Skriv inn et gyldig telefonnummer, med høyst 40 tegn.";
  let avatar: NormalizedAvatar | null = null;
  try { avatar = await normalizeAvatar(form.get("avatar")); }
  catch (error) { errors.avatar = error instanceof AvatarValidationError ? error.message : "Bildet kunne ikke leses."; }
  if (Object.keys(errors).length) return { status: "error", errors, values };
  try { await updateAccount(requestHeaders, { name: values.name, phone: values.phone || null }); }
  catch { return { status: "error", message: "Profilen kunne ikke lagres. Prøv igjen.", values }; }
  let message = "Profilen din er oppdatert.";
  try {
    if (avatar) await storeAvatar(account.id, avatar);
    else if (text(form, "removeAvatar") === "true") await (await ensureDb()).delete(profileImages).where(eq(profileImages.userId, account.id));
  } catch { message = "Navn og telefon er lagret, men bildet kunne ikke oppdateres. Prøv bildet på nytt."; }
  revalidatePath("/", "layout");
  return { status: "ok", message, values };
}

export async function changePassword(_previous: AccountFormState, form: FormData): Promise<AccountFormState> {
  const requestHeaders = new Headers(await headers());
  if (!(await getAccount(requestHeaders))) return { status: "error", message: "Logg inn på nytt for å endre passordet ditt." };
  const currentPassword = password(form, "currentPassword");
  const newPassword = password(form, "newPassword");
  const errors: Record<string, string> = {};
  if (!currentPassword || currentPassword.length > 128) errors.currentPassword = "Skriv inn det nåværende passordet ditt.";
  const invalidPassword = passwordError(newPassword);
  if (invalidPassword) errors.newPassword = invalidPassword;
  if (Object.keys(errors).length) return { status: "error", errors };
  try { await (await getAuth()).api.changePassword({ headers: requestHeaders, body: { currentPassword, newPassword, revokeOtherSessions: true } }); }
  catch (error) { return { status: "error", message: authMessage(error, "Passordet kunne ikke endres. Kontroller nåværende passord og prøv igjen.") }; }
  // Better Auth rotates the session cookie. Navigate using the new cookie instead
  // of rendering this action response with its now-revoked incoming session.
  revalidatePath("/", "layout");
  redirect("/min-side?status=password-changed");
}

export async function logOut(): Promise<void> {
  await (await getAuth()).api.signOut({ headers: new Headers(await headers()) });
  revalidatePath("/", "layout");
  redirect("/logg-inn");
}

export async function registerForEvent(form: FormData): Promise<void> {
  const requestHeaders = new Headers(await headers());
  const intent = await eventIntent(form);
  if (!intent.slug) redirect("/min-side?status=event-error");
  if (!(await getAccount(requestHeaders))) redirect(`/logg-inn?arrangement=${encodeURIComponent(intent.slug)}`);
  await requireAccount(requestHeaders);
  let status = "event-error";
  try { status = (await registerAccountForEvent(requestHeaders, intent.slug)).status === "venteliste" ? "waitlisted" : "registered"; }
  catch { /* Keep a retry link for a failed, separately submitted registration. */ }
  revalidatePath("/min-side");
  revalidatePath("/arrangementer");
  redirect(`/min-side?status=${status}${status === "event-error" ? `&arrangement=${encodeURIComponent(intent.slug)}` : ""}`);
}
