"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminError, createEvent, findUserByEmail, promoteUser } from "@/lib/admin";
import type { AdminFormState, MemberLookupState } from "@/lib/admin-forms";

function failure(error: unknown, fallback: string): AdminFormState {
  return error instanceof AdminError
    ? { status: "error", message: error.message, errors: error.errors }
    : { status: "error", message: fallback };
}

export async function publishEvent(_previous: AdminFormState, form: FormData): Promise<AdminFormState> {
  let event;
  try {
    event = await createEvent(new Headers(await headers()), {
      title: form.get("title"), type: form.get("type"), date: form.get("date"),
      startTime: form.get("startTime"), endTime: form.get("endTime"),
      location: form.get("location"), description: form.get("description"), spots: form.get("spots"),
    });
  } catch (error) {
    return failure(error, "Arrangementet kunne ikke publiseres. Prøv igjen om litt.");
  }
  revalidatePath("/");
  revalidatePath("/arrangementer");
  revalidatePath("/admin");
  redirect(`/admin?created=${encodeURIComponent(event.slug)}`);
}

export async function lookupMember(_previous: MemberLookupState, form: FormData): Promise<MemberLookupState> {
  try {
    const user = await findUserByEmail(new Headers(await headers()), form.get("email"));
    return user
      ? { status: "ok", user }
      : { status: "error", message: "Ingen konto funnet. Personen må registrere seg før du kan gi administratortilgang." };
  } catch (error) {
    return failure(error, "Kontoen kunne ikke hentes. Prøv igjen om litt.");
  }
}

export async function grantAdmin(_previous: MemberLookupState, form: FormData): Promise<MemberLookupState> {
  let user;
  try {
    user = await promoteUser(new Headers(await headers()), form.get("userId"));
  } catch (error) {
    return failure(error, "Tilgangen kunne ikke oppdateres. Prøv igjen om litt.");
  }
  revalidatePath("/", "layout");
  return { status: "ok", message: `${user.name} har nå administratortilgang.`, user };
}
