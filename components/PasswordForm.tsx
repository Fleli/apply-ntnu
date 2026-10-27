"use client";

import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { changePassword } from "@/app/account-actions";
import { accountInput, accountLabel, initialAccountFormState } from "@/lib/account-forms";
import { FieldError, FormFeedback } from "./ProfileForm";

export default function PasswordForm() {
  const [state, submit, pending] = useActionState(changePassword, initialAccountFormState);
  const form = useRef<HTMLFormElement>(null);
  const errors = state.errors ?? {};
  useEffect(() => { if (state.status === "ok") form.current?.reset(); }, [state]);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  return (
    <form ref={form} onSubmit={onSubmit} noValidate aria-busy={pending} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Endre passord</h2>
      <FormFeedback state={state} />
      <fieldset disabled={pending} className="mt-6 space-y-5">
        <div>
          <label htmlFor="password-current" className={accountLabel}>Nåværende passord *</label>
          <input id="password-current" name="currentPassword" type="password" autoComplete="current-password" required maxLength={128}
            aria-invalid={!!errors.currentPassword} aria-describedby={errors.currentPassword ? "password-current-error" : undefined} className={accountInput(errors.currentPassword)} />
          <FieldError id="password-current-error" text={errors.currentPassword} />
        </div>
        <div>
          <label htmlFor="password-new" className={accountLabel}>Nytt passord *</label>
          <input id="password-new" name="newPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128}
            aria-invalid={!!errors.newPassword} aria-describedby={`password-new-help${errors.newPassword ? " password-new-error" : ""}`} className={accountInput(errors.newPassword)} />
          <p id="password-new-help" className="mt-1.5 text-xs text-ink-soft">Bruk mellom 12 og 128 tegn.</p>
          <FieldError id="password-new-error" text={errors.newPassword} />
        </div>
      </fieldset>
      <button type="submit" disabled={pending} className="btn-outline mt-6 w-full px-6 py-3 disabled:opacity-60 sm:w-auto">{pending ? "Endrer passord …" : "Endre passord"}</button>
    </form>
  );
}
