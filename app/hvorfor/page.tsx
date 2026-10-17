import type { Metadata } from "next";
import { AlarmClock, Check, Coffee, Lightbulb, X } from "lucide-react";
import CtaCard from "@/components/CtaCard";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Hvorfor Apply NTNU?",
  description:
    "Å søke jobb alene er kjedelig og vanskelig. Les hvorfor vi startet Apply NTNU, og hva vi gjør annerledes.",
};

const reasons = [
  {
    icon: Coffee,
    title: "Det er kjedelig",
    text: "Å sitte alene med fjorten søknader en søndag kveld er ingen drøm. Vi gjør det til en sosial greie – med kaffe, boller og folk i samme situasjon.",
  },
  {
    icon: Lightbulb,
    title: "Det er vanskelig",
    text: "Hva skal man egentlig skrive? Hvem søker man til? På søknadskveldene hjelper vi hverandre, deler tips og leser korrektur på hverandres tekster.",
  },
  {
    icon: AlarmClock,
    title: "Det blir utsatt",
    text: "Fristene kommer alltid for fort. Et fast tidspunkt i kalenderen gjør at søknadene faktisk blir skrevet – og sendt.",
  },
];

const alone = [
  "Utsetter til «i morgen» – igjen",
  "Vet ikke hvor du skal begynne",
  "Ingen som leser over før du sender",
  "Gir opp etter to søknader",
];

const together = [
  "Fast tidspunkt i kalenderen",
  "Oversikt over bedrifter og frister",
  "Tilbakemelding fra andre studenter",
  "Pizza – og folk som heier på deg",
];

export default function HvorforPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Hvorfor Apply NTNU?"
        title="Å søke jobb alene er kjedelig. Og vanskelig."
        lead="Vi har kjent det på kroppen selv: fristene som kommer for fort, dokumentet som aldri blir ferdig, følelsen av at alle andre har kontroll. Derfor startet vi Apply NTNU."
      />

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Problemet</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Tre grunner til at søknadene ikke blir sendt
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Løsningen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Alene på hybelen – eller sammen på søknadskveld
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Vi forandrer ikke på hva du må gjøre. Vi forandrer på hvordan det
              føles å gjøre det.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink">Alene på hybelen</h3>
              <ul className="mt-5 space-y-3">
                {alone.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-soft">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border-2 border-brand bg-brand-light/50 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-brand-dark">
                På søknadskveld med Apply NTNU
              </h3>
              <ul className="mt-5 space-y-3">
                {together.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <CtaCard
            title="Vil du se hvordan en kveld foregår?"
            text="Vi har gjort det enkelt: fire steg, ett fast tidspunkt og null krav til forkunnskaper."
            primary={{ href: "/slik-fungerer-det", label: "Slik fungerer det" }}
            secondary={{ href: "/bli-medlem", label: "Bli medlem" }}
          />
        </div>
      </section>

      <NextPageLink current="/hvorfor" />
    </main>
  );
}
