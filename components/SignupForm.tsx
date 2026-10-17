"use client";

import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { registerMember } from "@/app/bli-medlem/actions";
import { years, type SignupState } from "@/lib/signup";

type Props = {
  events: { slug: string; title: string }[];
  /** Forvalgt arrangement fra ?arrangement=slug */
  preselected?: string;
};

const initial: SignupState = { status: "idle" };

export default function SignupForm({ events, preselected }: Props) {
  const [state, submit, pending] = useActionState(registerMember, initial);

  // Vi kaller action manuelt i stedet for <form action>, slik at React ikke
  // nullstiller feltene når valideringen feiler.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => submit(data));
  }

  if (state.status === "ok") {
    const reg = state.registration;
    return (
      <div className="card p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-ink">Velkommen, {state.firstName}!</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Du er nå registrert som medlem i Apply NTNU.
          {reg?.status === "påmeldt" && (
            <> Du er også meldt på <strong className="text-ink">{reg.eventTitle}</strong>.</>
          )}
          {reg?.status === "venteliste" && (
            <>
              {" "}
              <strong className="text-ink">{reg.eventTitle}</strong> er fullt, så du
              står på venteliste. Vi sender e-post hvis det blir ledig plass.
            </>
          )}
        </p>
        <Link href="/arrangementer" className="btn-primary mt-6 px-6 py-3">
          Se arrangementer
        </Link>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : undefined;
  const errors = state.status === "error" ? state.errors : {};

  const label = "block text-sm font-semibold text-ink";
  const input = (bad?: string) =>
    `mt-1.5 block w-full rounded-md border bg-surface px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:outline-2 focus:outline-offset-0 ${
      bad
        ? "border-red-600 focus:border-red-600 focus:outline-red-600/30"
        : "border-line focus:border-brand focus:outline-brand/40"
    }`;
  const Err = ({ id, text }: { id: string; text?: string }) =>
    text ? (
      <p id={id} className="mt-1.5 text-sm text-red-700">
        {text}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Registrer deg</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Tar under ett minutt. Felt merket med * er obligatoriske.
      </p>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.message}
        </p>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fornavn" className={label}>Fornavn *</label>
          <input id="fornavn" name="fornavn" type="text" autoComplete="given-name" required
            defaultValue={values?.firstName} aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "fornavn-feil" : undefined} className={input(errors.firstName)} />
          <Err id="fornavn-feil" text={errors.firstName} />
        </div>
        <div>
          <label htmlFor="etternavn" className={label}>Etternavn *</label>
          <input id="etternavn" name="etternavn" type="text" autoComplete="family-name" required
            defaultValue={values?.lastName} aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "etternavn-feil" : undefined} className={input(errors.lastName)} />
          <Err id="etternavn-feil" text={errors.lastName} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="epost" className={label}>E-post *</label>
        <input id="epost" name="epost" type="email" autoComplete="email" required placeholder="navn@stud.ntnu.no"
          defaultValue={values?.email} aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "epost-feil" : "epost-hjelp"} className={input(errors.email)} />
        <Err id="epost-feil" text={errors.email} />
        <p id="epost-hjelp" className="mt-1.5 text-xs text-ink-soft">
          Bruk gjerne NTNU-adressen din, men det er ikke et krav.
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_140px]">
        <div>
          <label htmlFor="studie" className={label}>Studieprogram *</label>
          <input id="studie" name="studie" type="text" required placeholder="F.eks. Datateknologi"
            defaultValue={values?.studyProgram} aria-invalid={!!errors.studyProgram}
            aria-describedby={errors.studyProgram ? "studie-feil" : undefined} className={input(errors.studyProgram)} />
          <Err id="studie-feil" text={errors.studyProgram} />
        </div>
        <div>
          <label htmlFor="aar" className={label}>Årstrinn *</label>
          <select id="aar" name="aar" required defaultValue={values?.year ?? ""} aria-invalid={!!errors.year}
            aria-describedby={errors.year ? "aar-feil" : undefined} className={input(errors.year)}>
            <option value="" disabled>Velg</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Err id="aar-feil" text={errors.year} />
        </div>
      </div>

      {events.length > 0 && (
        <div className="mt-5">
          <label htmlFor="arrangement" className={label}>
            Vil du melde deg på et arrangement samtidig?
          </label>
          <select id="arrangement" name="arrangement" defaultValue={values?.eventSlug ?? preselected ?? ""}
            aria-invalid={!!errors.eventSlug} className={input(errors.eventSlug)}>
            <option value="">Nei, bare medlemskap</option>
            {events.map((e) => (
              <option key={e.slug} value={e.slug}>{e.title}</option>
            ))}
          </select>
          <Err id="arrangement-feil" text={errors.eventSlug} />
        </div>
      )}

      <label className="mt-6 flex items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="samtykke" required aria-invalid={!!errors.consent}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brand" />
        <span>
          Jeg samtykker til at Apply NTNU lagrer opplysningene mine for å sende
          meg informasjon om arrangementer. Du kan melde deg av når som helst. *
        </span>
      </label>
      <Err id="samtykke-feil" text={errors.consent} />

      <button type="submit" disabled={pending} className="btn-primary mt-6 w-full px-6 py-3 disabled:opacity-60">
        {pending ? "Sender …" : "Bli medlem"}
      </button>
    </form>
  );
}
