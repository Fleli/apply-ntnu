"use server";

import { DatabaseUnavailableError } from "@/lib/db";
import {
  getEventBySlug,
  registerForEvent,
  upsertMember,
} from "@/lib/db/queries";
import {
  years,
  type SignupErrors,
  type SignupState,
  type SignupValues,
} from "@/lib/signup";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, name: string) {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

/** Server action for skjemaet på /bli-medlem. */
export async function registerMember(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const values: SignupValues = {
    firstName: field(formData, "fornavn"),
    lastName: field(formData, "etternavn"),
    email: field(formData, "epost").toLowerCase(),
    studyProgram: field(formData, "studie"),
    year: field(formData, "aar"),
    eventSlug: field(formData, "arrangement"),
  };
  const consent = formData.get("samtykke") === "on";

  const errors: SignupErrors = {};
  if (!values.firstName) errors.firstName = "Skriv inn fornavnet ditt.";
  if (!values.lastName) errors.lastName = "Skriv inn etternavnet ditt.";
  if (!EMAIL.test(values.email)) errors.email = "Skriv inn en gyldig e-postadresse.";
  if (!values.studyProgram) errors.studyProgram = "Skriv inn studieprogrammet ditt.";
  if (!(years as readonly string[]).includes(values.year)) errors.year = "Velg årstrinn.";
  if (!consent) errors.consent = "Du må samtykke for at vi skal kunne lagre opplysningene dine.";

  const event = values.eventSlug ? await getEventBySlug(values.eventSlug) : undefined;
  if (values.eventSlug && !event) errors.eventSlug = "Fant ikke arrangementet. Velg på nytt.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  try {
    const member = await upsertMember({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      studyProgram: values.studyProgram,
      year: values.year,
    });

    let registration: Extract<SignupState, { status: "ok" }>["registration"];
    if (event) {
      const status = await registerForEvent(member.id, event.id, event.spots);
      registration = { status, eventTitle: event.title };
    }

    return { status: "ok", firstName: member.firstName, registration };
  } catch (err) {
    const unavailable = err instanceof DatabaseUnavailableError;
    if (!unavailable) console.error("Kunne ikke lagre medlem:", err);
    return {
      status: "error",
      message: unavailable
        ? "Registreringen er dessverre ikke tilgjengelig akkurat nå. Prøv igjen senere."
        : "Noe gikk galt da vi skulle lagre registreringen. Prøv igjen om litt.",
      errors: {},
      values,
    };
  }
}
