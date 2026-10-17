import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Target, Users } from "lucide-react";
import CtaCard from "@/components/CtaCard";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";

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

export default function OmOssPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Om oss"
        title="Vi gjør jobbsøking til en lagsport"
        lead="Apply NTNU er en studentorganisasjon ved NTNU i Trondheim. Vi startet fordi vi var lei av å sitte alene med søknader som aldri ble sendt – og fant ut at det ble både enklere og morsommere når vi gjorde det sammen."
        aside={
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
        }
      />

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
        <div className="container-x">
          <CtaCard
            title="Bli med på neste søknadskveld"
            text="Enkleste måten å bli kjent med oss på er å møte opp. Ta med laptop – vi tar med pizza."
            primary={{ href: "/arrangementer", label: "Se arrangementer" }}
            secondary={{ href: "/sporsmal", label: "Vanlige spørsmål" }}
          />
        </div>
      </section>

      <NextPageLink current="/om-oss" />
    </main>
  );
}
