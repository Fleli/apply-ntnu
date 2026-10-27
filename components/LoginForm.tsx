"use client";

import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { logIn } from "@/app/account-actions";
import { accountInput, accountLabel, initialAccountFormState } from "@/lib/account-forms";
import { FieldError, FormFeedback } from "./ProfileForm";

export default function LoginForm({ eventSlug }: { eventSlug?: string }) {
  const [state, submit, pending] = useActionState(logIn, initialAccountFormState);
  const errors = state.errors ?? {};
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Logg inn</h2>
      <p className="mt-1 text-sm text-ink-soft">Se profilen din og meld deg på arrangementer.</p>
      <FormFeedback state={state} />
      <input type="hidden" name="eventSlug" value={eventSlug ?? ""} />
      <fieldset disabled={pending} className="mt-6 space-y-5">
        <div>
          <label htmlFor="login-email" className={accountLabel}>E-post *</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={state.values?.email}
            aria-invalid={!!errors.email} aria-describedby={errors.email ? "login-email-error" : undefined} className={accountInput(errors.email)} />
          <FieldError id="login-email-error" text={errors.email} />
        </div>
        <div>
          <label htmlFor="login-password" className={accountLabel}>Passord *</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required maxLength={128}
            aria-invalid={!!errors.password} aria-describedby={errors.password ? "login-password-error" : undefined} className={accountInput(errors.password)} />
          <FieldError id="login-password-error" text={errors.password} />
        </div>
      </fieldset>
      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full px-6 py-3 disabled:opacity-60">{pending ? "Logger inn …" : "Logg inn"}</button>
      <p className="mt-5 text-center text-sm text-ink-soft">Ny her? <Link href={eventSlug ? `/bli-medlem?arrangement=${encodeURIComponent(eventSlug)}` : "/bli-medlem"} className="link">Bli medlem</Link></p>
    </form>
  );
}
