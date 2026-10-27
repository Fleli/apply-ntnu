"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { saveProfile } from "@/app/account-actions";
import { accountInput, accountLabel, initialAccountFormState, type AccountFormState } from "@/lib/account-forms";

export function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? <p id={id} className="mt-1.5 text-sm text-error">{text}</p> : null;
}

export function FormFeedback({ state }: { state: AccountFormState }) {
  const summary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "error") summary.current?.focus();
  }, [state]);

  if (state.status === "idle") return null;
  const errors = [...new Set(Object.values(state.errors ?? {}))];
  return (
    <div ref={summary} tabIndex={-1} role={state.status === "error" ? "alert" : "status"}
      className={`mt-5 rounded-md border px-4 py-3 text-sm focus:outline-2 focus:outline-offset-2 ${state.status === "error" ? "border-error-line bg-error-surface text-error-strong focus:outline-error-focus" : "border-brand/20 bg-brand-light text-brand focus:outline-brand"}`}>
      <p>{state.message ?? (state.status === "error" ? "Se over feltene og prøv igjen." : "Endringene er lagret.")}</p>
      {errors.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </div>
  );
}

export function AvatarInput({ image, name, error, disabled }: { image?: string | null; name?: string; error?: string; disabled?: boolean }) {
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [localError, setLocalError] = useState<string>();
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = file ? preview : removed ? null : image;
  const initials = name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  const displayedError = localError ?? error;
  return (
    <div>
      <label htmlFor={id} className={accountLabel}>Profilbilde <span className="font-normal text-ink-soft">(valgfritt)</span></label>
      <div className="mt-3 flex items-start gap-4">
        {src ? <img src={src} width={64} height={64} alt="Forhåndsvisning av profilbildet" className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-light text-xl font-semibold text-brand">{initials}</span>}
        <div className="min-w-0 flex-1">
          <input ref={fileInput} id={id} name="avatar" type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled}
            aria-invalid={!!displayedError} aria-describedby={`${id}-help${displayedError ? ` ${id}-error` : ""}`}
            className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border file:border-brand file:bg-surface file:px-4 file:py-2 file:font-semibold file:text-brand hover:file:bg-brand-light focus-visible:outline-2 focus-visible:outline-brand"
            onChange={(event) => {
              const selected = event.currentTarget.files?.[0] ?? null;
              if (!selected) return;
              const problem = !["image/jpeg", "image/png", "image/webp"].includes(selected.type)
                ? "Velg et bilde i JPEG-, PNG- eller WebP-format."
                : selected.size > 2 * 1024 * 1024 ? "Bildet kan være maksimalt 2 MiB." : undefined;
              event.currentTarget.setCustomValidity(problem ?? "");
              setLocalError(problem);
              if (problem) { event.currentTarget.value = ""; setFile(null); setPreview(null); return; }
              setFile(selected);
              setRemoved(false);
            }} />
          <p id={`${id}-help`} className="mt-2 text-xs leading-relaxed text-ink-soft">JPEG, PNG eller WebP, maks. 2 MiB. Bildet lagres når du sender skjemaet.</p>
          {(file || localError || (image && !removed)) && <button type="button" disabled={disabled} className="mt-2 text-sm font-semibold text-brand hover:underline disabled:opacity-60"
            onClick={() => { setFile(null); setPreview(null); setRemoved(true); setLocalError(undefined); if (fileInput.current) { fileInput.current.value = ""; fileInput.current.setCustomValidity(""); } }}>Fjern bilde</button>}
          {removed && image && <button type="button" disabled={disabled} className="mt-2 text-sm font-semibold text-brand hover:underline disabled:opacity-60" onClick={() => setRemoved(false)}>Behold nåværende bilde</button>}
          <FieldError id={`${id}-error`} text={displayedError} />
          <input type="hidden" name="removeAvatar" value={removed ? "true" : "false"} />
        </div>
      </div>
    </div>
  );
}

type Props = { account: { name: string; email: string; phone: string | null; image: string | null } };

export default function ProfileForm({ account }: Props) {
  const [state, submit, pending] = useActionState(saveProfile, initialAccountFormState);
  const errors = state.errors ?? {};
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const avatar = event.currentTarget.querySelector<HTMLInputElement>('input[name="avatar"]');
    if (avatar && !avatar.validity.valid) { avatar.reportValidity(); return; }
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  return (
    <form onSubmit={onSubmit} noValidate aria-busy={pending} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Din profil</h2>
      <p className="mt-1 text-sm text-ink-soft">Oppdater opplysningene dine. Telefon og bilde er valgfritt.</p>
      <FormFeedback state={state} />
      <fieldset disabled={pending} className="mt-6 space-y-5">
        <div>
          <label htmlFor="profile-name" className={accountLabel}>Navn *</label>
          <input id="profile-name" name="name" autoComplete="name" required maxLength={120} defaultValue={state.values?.name ?? account.name}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "profile-name-error" : undefined} className={accountInput(errors.name)} />
          <FieldError id="profile-name-error" text={errors.name} />
        </div>
        <div>
          <label htmlFor="profile-email" className={accountLabel}>E-post</label>
          <input id="profile-email" type="email" autoComplete="email" readOnly value={account.email} aria-describedby="profile-email-help" className={`${accountInput()} read-only:bg-readonly text-ink-soft`} />
          <p id="profile-email-help" className="mt-1.5 text-xs text-ink-soft">E-postadressen kan foreløpig ikke endres.</p>
        </div>
        <div>
          <label htmlFor="profile-phone" className={accountLabel}>Telefon <span className="font-normal text-ink-soft">(valgfritt)</span></label>
          <input id="profile-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} defaultValue={state.values?.phone ?? account.phone ?? ""}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "profile-phone-error" : undefined} className={accountInput(errors.phone)} />
          <FieldError id="profile-phone-error" text={errors.phone} />
        </div>
        <AvatarInput image={account.image} name={account.name} error={errors.avatar} disabled={pending} />
      </fieldset>
      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full px-6 py-3 disabled:opacity-60 sm:w-auto">{pending ? "Lagrer …" : "Lagre profil"}</button>
    </form>
  );
}
