import type { Metadata } from "next";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Hvorfor Apply NTNU?",
  description:
    "Å søke jobb alene er kjedelig og vanskelig. Les hvorfor vi startet Apply NTNU, og hva vi gjør annerledes.",
};

const reasons = [
  {
    title: "Det er kjedelig",
    text: "Å sitte alene med fjorten søknader en søndag kveld er ingen drøm. Vi gjør det til en sosial greie – med kaffe, boller og folk i samme situasjon.",
  },
  {
    title: "Det er vanskelig",
    text: "Hva skal man egentlig skrive? Hvem søker man til? På søknadskveldene hjelper vi hverandre, deler tips og leser korrektur på hverandres tekster.",
  },
  {
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
        title="Å søke jobb alene er kjedelig. Og vanskelig."
        lead="Vi har kjent det på kroppen selv: fristene som kommer for fort, dokumentet som aldri blir ferdig, følelsen av at alle andre har kontroll. Derfor startet vi Apply NTNU."
      />

      <section className="border-b border-line">
        <div className="container-x py-14 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Tre grunner til at søknadene ikke blir sendt
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {reasons.map(({ title, text }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-14 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Alene på hybelen – eller sammen på søknadskveld
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Vi forandrer ikke på hva du må gjøre. Vi forandrer på hvordan det
            føles å gjøre det.
          </p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Alene
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {alone.map((item) => (
                  <li key={item} className="py-3 text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-brand">
                Sammen
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {together.map((item) => (
                  <li key={item} className="py-3 font-medium text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaRow
        title="Vil du se hvordan en kveld foregår?"
        text="Fire steg, ett fast tidspunkt og null krav til forkunnskaper."
        href="/slik-fungerer-det"
        label="Slik fungerer det"
      />
    </main>
  );
}
