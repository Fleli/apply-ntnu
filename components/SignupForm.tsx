"use client";

import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import { signUp } from "@/app/account-actions";
import { accountInput, accountLabel, initialAccountFormState } from "@/lib/account-forms";
import { AvatarInput, FieldError, FormFeedback } from "./ProfileForm";

type Props = { events: { slug: string; title: string }[]; preselected?: string };

export default function SignupForm({ events, preselected }: Props) {
  const [state, submit, pending] = useActionState(signUp, initialAccountFormState);
  const errors = state.errors ?? {};
  const [eventSlug, setEventSlug] = useState(preselected ?? "");
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const avatar = event.currentTarget.querySelector<HTMLInputElement>('input[name="avatar"]');
    if (avatar && !avatar.validity.valid) { avatar.reportValidity(); return; }
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  if (state.status === "ok") return (
    <div className="card p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-ink">Velkommen til Apply NTNU!</h2>
      <FormFeedback state={state} />
      <Link href="/min-side" className="btn-primary mt-6 px-6 py-3">Gå til Min side</Link>
    </div>
  );
  const loginHref = eventSlug ? `/logg-inn?arrangement=${encodeURIComponent(eventSlug)}` : "/logg-inn";
  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Opprett konto</h2>
      <p className="mt-1 text-sm text-ink-soft">Gratis medlemskap. Felt merket med * er obligatoriske.</p>
      <FormFeedback state={state} />
      <fieldset disabled={pending} className="mt-6 space-y-5">
        <div>
          <label htmlFor="signup-name" className={accountLabel}>Navn *</label>
          <input id="signup-name" name="name" autoComplete="name" required maxLength={120} defaultValue={state.values?.name}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "signup-name-error" : undefined} className={accountInput(errors.name)} />
          <FieldError id="signup-name-error" text={errors.name} />
        </div>
        <div>
          <label htmlFor="signup-email" className={accountLabel}>E-post *</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="navn@stud.ntnu.no" defaultValue={state.values?.email}
            aria-invalid={!!errors.email} aria-describedby={`signup-email-help${errors.email ? " signup-email-error" : ""}`} className={accountInput(errors.email)} />
          <FieldError id="signup-email-error" text={errors.email} />
          <p id="signup-email-help" className="mt-1.5 text-xs text-ink-soft">Bruk gjerne NTNU-adressen din, men det er ikke et krav.</p>
        </div>
        <div>
          <label htmlFor="signup-password" className={accountLabel}>Passord *</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}
            aria-invalid={!!errors.password} aria-describedby={`signup-password-help${errors.password ? " signup-password-error" : ""}`} className={accountInput(errors.password)} />
          <p id="signup-password-help" className="mt-1.5 text-xs text-ink-soft">Bruk mellom 12 og 128 tegn. Du kan gjerne bruke en lang passordfrase.</p>
          <FieldError id="signup-password-error" text={errors.password} />
        </div>
        <div className="border-t border-line pt-5">
          <label htmlFor="signup-phone" className={accountLabel}>Telefon <span className="font-normal text-ink-soft">(valgfritt)</span></label>
          <input id="signup-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} defaultValue={state.values?.phone}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "signup-phone-error" : undefined} className={accountInput(errors.phone)} />
          <FieldError id="signup-phone-error" text={errors.phone} />
        </div>
        <AvatarInput error={errors.avatar} disabled={pending} />
        {events.length > 0 ? <div className="border-t border-line pt-5">
          <label htmlFor="signup-event" className={accountLabel}>Meld deg på et arrangement samtidig <span className="font-normal text-ink-soft">(valgfritt)</span></label>
          <select id="signup-event" name="eventSlug" value={eventSlug} onChange={(event) => setEventSlug(event.target.value)}
            aria-invalid={!!errors.eventSlug} aria-describedby={errors.eventSlug ? "signup-event-error" : undefined} className={accountInput(errors.eventSlug)}>
            <option value="">Bare medlemskap foreløpig</option>
            {events.map((event) => <option key={event.slug} value={event.slug}>{event.title}</option>)}
          </select>
          <FieldError id="signup-event-error" text={errors.eventSlug} />
        </div> : <input type="hidden" name="eventSlug" value={preselected ?? ""} />}
      </fieldset>
      <p className="mt-6 text-xs leading-relaxed text-ink-soft">Vi lagrer opplysningene dine for å administrere medlemskapet og påmeldingene dine. Profilbildet og telefonnummeret ditt er private.</p>
      <button type="submit" disabled={pending} className="btn-primary mt-5 w-full px-6 py-3 disabled:opacity-60">{pending ? "Oppretter konto …" : "Bli medlem"}</button>
      <p className="mt-5 text-center text-sm text-ink-soft">Har du allerede konto? <Link href={loginHref} className="link">Logg inn</Link></p>
    </form>
  );
}
