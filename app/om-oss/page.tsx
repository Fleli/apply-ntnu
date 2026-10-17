import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Mail, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Apply NTNU er en studentorganisasjon som gjør jobbsøking sosialt. Les om hvem vi er, hva vi tror på og hvordan du kan bli med.",
};

const values = [
  {
    icon: Users,
    title: "Sammen",
    text: "Alt vi gjør handler om å ikke sitte alene. Søknader skrives bedre – og faktisk ferdig – når man har folk rundt seg.",
  },
  {
    icon: HeartHandshake,
    title: "Lav terskel",
    text: "Du trenger ikke CV, erfaring eller en plan. Du trenger bare å møte opp. Alle var nye en gang.",
  },
  {
    icon: Target,
    title: "Konkret",
    text: "Vi snakker ikke om jobbsøking – vi gjør det. Målet for hver kveld er enkelt: flere sendte søknader enn da vi kom.",
  },
];

// TODO: Plassholdere – legg inn ekte styremedlemmer (navn, rolle og gjerne bilde).
const board = [
  { initials: "LE", name: "Leder", role: "Leder", study: "Studieprogram" },
  { initials: "NE", name: "Nestleder", role: "Nestleder", study: "Studieprogram" },
  { initials: "AR", name: "Arrangement", role: "Arrangementsansvarlig", study: "Studieprogram" },
  { initials: "BE", name: "Bedrift", role: "Bedriftskontakt", study: "Studieprogram" },
  { initials: "MA", name: "Marked", role: "Markedsansvarlig", study: "Studieprogram" },
  { initials: "ØK", name: "Økonomi", role: "Økonomiansvarlig", study: "Studieprogram" },
];

const faq = [
  {
    q: "Koster det noe å være medlem?",
    a: "Nei. Medlemskap i Apply NTNU er gratis, og det samme er alle arrangementene våre. Vi dekker pizza og lokaler gjennom støtte og samarbeidspartnere.",
  },
  {
    q: "Må jeg være medlem for å komme på en søknadskveld?",
    a: "Nei, alle NTNU-studenter er velkomne. Men som medlem får du beskjed om nye arrangementer først, og tilgang til malene og ressursene våre.",
  },
  {
    q: "Jeg har ikke CV enda. Kan jeg likevel komme?",
    a: "Absolutt – det er nettopp da du bør komme. Vi har maler, eksempler og folk som gjerne hjelper deg med å lage en fra bunnen av.",
  },
  {
    q: "Hvilke studieprogram er dette for?",
    a: "Alle. De fleste medlemmene våre studerer teknologi, økonomi eller realfag, men søknadskveldene passer for alle som skal søke internship eller sommerjobb.",
  },
  {
    q: "Hvordan kan jeg engasjere meg i styret?",
    a: "Vi tar opp nye styremedlemmer hvert semester. Send oss en e-post eller ta en prat med en av oss på neste søknadskveld.",
  },
];

export default function OmOssPage() {
  return (
    <main className="flex-1">
      <section className="border-b border-line bg-surface">
        <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Om oss</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Vi gjør jobbsøking til en lagsport
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
              Apply NTNU er en studentorganisasjon ved NTNU i Trondheim. Vi
              startet fordi vi var lei av å sitte alene med søknader som aldri
              ble sendt – og fant ut at det ble både enklere og morsommere når
              vi gjorde det sammen.
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="text-base font-semibold text-ink">Kort fortalt</h2>
            <dl className="mt-4 divide-y divide-line text-sm">
              {[
                ["Hva", "Søknadskvelder og workshops for studenter som skal søke internship og sommerjobb"],
                ["Hvem", "Alle NTNU-studenter, uavhengig av studieprogram og årstrinn"],
                ["Hvor", "NTNU Gløshaugen, Trondheim"],
                ["Pris", "Gratis"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[72px_1fr] gap-3 py-3">
                  <dt className="font-semibold text-brand">{k}</dt>
                  <dd className="text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Det vi tror på</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Tre ting som styrer alt vi gjør
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">Styret</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Menneskene bak Apply NTNU
              </h2>
            </div>
            <a
              href="mailto:post@applyntnu.no"
              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              Vil du bli med i styret?
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {board.map(({ initials, name, role, study }) => (
              <li key={role} className="card flex items-center gap-4 p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-tint text-base font-bold text-brand-dark">
                  {initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">{name}</span>
                  <span className="block text-sm text-brand">{role}</span>
                  <span className="block text-xs text-ink-soft">{study}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Vanlige spørsmål</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Lurer du på noe?
            </h2>
            <p className="mt-4 text-ink-soft">
              Finner du ikke svaret her, er det bare å sende oss en melding.
            </p>
            <a
              href="mailto:post@applyntnu.no"
              className="btn-outline mt-6 px-5 py-2.5 text-sm"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Kontakt oss
            </a>
          </div>
          <div className="card divide-y divide-line">
            {faq.map(({ q, a }) => (
              <details key={q} className="group px-6 py-4 open:bg-brand-light/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-none">
                  {q}
                  <span className="shrink-0 text-brand transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <div className="card flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Bli med på neste søknadskveld
              </h2>
              <p className="mt-3 text-lg text-ink-soft">
                Enkleste måten å bli kjent med oss på er å møte opp. Ta med
                laptop – vi tar med pizza.
              </p>
            </div>
            <Link href="/arrangementer" className="btn-primary px-6 py-3">
              Se arrangementer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
