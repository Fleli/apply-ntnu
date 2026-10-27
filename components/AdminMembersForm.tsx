"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { grantAdmin, lookupMember } from "@/app/admin/actions";
import { initialMemberLookupState } from "@/lib/admin-forms";
import { accountInput, accountLabel } from "@/lib/account-forms";
import type { AdminUser } from "@/lib/admin";
import { FieldError, FormFeedback } from "./ProfileForm";

function Promotion({ user }: { user: AdminUser }) {
  const [state, submit, pending] = useActionState(grantAdmin, initialMemberLookupState);
  const isAdmin = user.isAdmin || state.user?.isAdmin;
  return (
    <div className="mt-6 border-t border-line pt-6">
      <div role="status" className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-ink">{user.name}</h3>
          <p className="mt-1 break-all text-sm text-ink-soft">{user.email}</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">{isAdmin ? "Administrator" : "Medlem"}</span>
      </div>
      <FormFeedback state={state} />
      {isAdmin ? <p className="mt-4 text-sm text-ink-soft">Denne kontoen har tilgang til adminpanelet.</p> : (
        <form action={submit} aria-busy={pending}>
          <input type="hidden" name="userId" value={user.id} />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">E-postadresser bekreftes ikke automatisk. Kontroller at kontoen tilhører riktig person. En administrator kan publisere arrangementer og gi andre administratortilgang.</p>
          <button type="submit" disabled={pending} className="btn-outline mt-4 w-full disabled:opacity-60">{pending ? "Gir tilgang …" : "Gi administratortilgang"}</button>
        </form>
      )}
    </div>
  );
}

export default function AdminMembersForm() {
  const [state, submit, pending] = useActionState(lookupMember, initialMemberLookupState);
  const [email, setEmail] = useState("");
  // Hide an old result while another address is being entered or looked up.
  const [submittedEmail, setSubmittedEmail] = useState("");
  const normalizedEmail = email.trim().toLowerCase();
  const resultIsCurrent = !pending && normalizedEmail === submittedEmail;
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedEmail(normalizedEmail);
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  }
  return (
    <section className="card p-6 sm:p-8" aria-labelledby="admin-members-heading">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-brand" aria-hidden="true" />
        <h2 id="admin-members-heading" className="text-xl font-bold text-ink">Administratortilgang</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">Finn en eksisterende konto med e-postadressen. Du får se kontoen før du gir tilgang.</p>
      <form onSubmit={onSubmit} noValidate aria-busy={pending} className="mt-6">
        <label htmlFor="admin-member-email" className={accountLabel}>Medlemmets e-postadresse</label>
        <input id="admin-member-email" name="email" type="email" required maxLength={254} autoComplete="off" value={email}
          onChange={(event) => setEmail(event.target.value)} disabled={pending}
          aria-invalid={resultIsCurrent && !!state.errors?.email} aria-describedby={resultIsCurrent && state.errors?.email ? "admin-member-email-error" : undefined}
          className={accountInput(resultIsCurrent ? state.errors?.email : undefined)} />
        {resultIsCurrent && <FieldError id="admin-member-email-error" text={state.errors?.email} />}
        <button type="submit" disabled={pending} className="btn-outline mt-4 w-full disabled:opacity-60 sm:w-auto">{pending ? "Søker …" : "Finn konto"}</button>
      </form>
      {resultIsCurrent && state.status === "error" && <FormFeedback state={state} />}
      {resultIsCurrent && state.user && <Promotion key={state.user.id} user={state.user} />}
    </section>
  );
}
