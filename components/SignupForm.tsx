"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { ApplyEvent } from "@/lib/events";

type Props = {
  events: Pick<ApplyEvent, "slug" | "title" | "date">[];
  /** Forvalgt arrangement fra ?arrangement=slug */
  preselected?: string;
};

const years = ["1. år", "2. år", "3. år", "4. år", "5. år", "Annet"];

export default function SignupForm({ events, preselected }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Koble til backend (Google Forms, Airtable, egen API-rute e.l.).
    // Foreløpig vises kun en bekreftelse i nettleseren.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card p-8 sm:p-10">
        <h2 className="text-2xl font-bold text-ink">
          Velkommen{name ? `, ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="mt-3 text-ink-soft">
          Du er nå registrert som medlem i Apply NTNU. Vi sender deg en e-post
          når neste søknadskveld nærmer seg.
        </p>
        <Link href="/arrangementer" className="btn-primary mt-6 px-6 py-3">
          Se kommende arrangementer
        </Link>
      </div>
    );
  }

  const field =
    "mt-1.5 block w-full rounded-md border border-line bg-surface px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-brand focus:outline-2 focus:outline-offset-0 focus:outline-brand/40";
  const label = "block text-sm font-semibold text-ink";

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold text-ink">Registrer deg</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Tar under ett minutt. Felt merket med * er obligatoriske.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fornavn" className={label}>
            Fornavn *
          </label>
          <input
            id="fornavn"
            name="fornavn"
            type="text"
            autoComplete="given-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="etternavn" className={label}>
            Etternavn *
          </label>
          <input
            id="etternavn"
            name="etternavn"
            type="text"
            autoComplete="family-name"
            required
            className={field}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="epost" className={label}>
          E-post *
        </label>
        <input
          id="epost"
          name="epost"
          type="email"
          autoComplete="email"
          required
          placeholder="navn@stud.ntnu.no"
          className={field}
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          Bruk gjerne NTNU-adressen din, men det er ikke et krav.
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_140px]">
        <div>
          <label htmlFor="studie" className={label}>
            Studieprogram *
          </label>
          <input
            id="studie"
            name="studie"
            type="text"
            required
            placeholder="F.eks. Datateknologi"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="aar" className={label}>
            Årstrinn *
          </label>
          <select id="aar" name="aar" required defaultValue="" className={field}>
            <option value="" disabled>
              Velg
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="arrangement" className={label}>
          Vil du melde deg på et arrangement samtidig?
        </label>
        <select
          id="arrangement"
          name="arrangement"
          defaultValue={preselected ?? ""}
          className={field}
        >
          <option value="">Nei, bare medlemskap</option>
          {events.map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          name="samtykke"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-brand"
        />
        <span>
          Jeg samtykker til at Apply NTNU lagrer opplysningene mine for å sende
          meg informasjon om arrangementer. Du kan melde deg av når som helst. *
        </span>
      </label>

      <button type="submit" className="btn-primary mt-6 w-full px-6 py-3">
        Bli medlem
      </button>
    </form>
  );
}
