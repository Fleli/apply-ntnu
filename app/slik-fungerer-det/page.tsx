import type { Metadata } from "next";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Slik fungerer det",
  description:
    "Fire steg fra «jeg burde søke» til «søknad sendt». Se hvordan en søknadskveld hos Apply NTNU foregår, og hva du bør ta med.",
};

const steps = [
  {
    title: "Meld deg på",
    text: "Finn en søknadskveld som passer deg, og meld deg på. Det er gratis og uforpliktende – men gi beskjed, så vi vet hvor mye pizza vi skal bestille.",
  },
  {
    title: "Ta med laptop",
    text: "Du trenger ikke ha noe klart på forhånd. Vi har maler for CV og søknadsbrev, og eksempler du kan la deg inspirere av.",
  },
  {
    title: "Vi søker sammen",
    text: "Vi går gjennom aktuelle bedrifter og frister, skriver søknader side om side og gir hverandre tilbakemeldinger underveis.",
  },
  {
    title: "Trykk send – og feir",
    text: "Hver søknad som blir sendt er en liten seier. Vi feirer med pizza og teller opp hvor mange vi fikk ut døra.",
  },
];

const schedule = [
  ["17:00", "Dørene åpner – kaffe og noe å bite i"],
  ["17:15", "Kort intro: hvilke frister nærmer seg?"],
  ["17:30", "Vi søker. Hjelp og tilbakemelding underveis"],
  ["19:00", "Pizzapause"],
  ["19:45", "Oppsummering: hvor mange søknader fikk vi ut?"],
  ["20:00", "Takk for i kveld"],
];

const bring = [
  "Laptop og lader",
  "CV, hvis du har en",
  "Karakterutskrift fra Studentweb",
  "En liste over bedrifter du vil søke hos",
];

export default function SlikFungererDetPage() {
  return (
    <main id="main-content" className="flex-1">
      <PageHeader
        title="Fra «jeg burde søke» til «søknad sendt» på én kveld"
        lead="Vi har gjort det så enkelt som mulig. Fire steg, ett fast tidspunkt og null krav til forkunnskaper."
      />

      <section className="border-b border-line">
        <div className="container-x py-16 lg:py-24">
          <ol className="grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {steps.map(({ title, text }, i) => (
              <li key={title} className="relative border-t border-line pt-8">
                <p aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand text-3xl font-black tabular-nums tracking-tight text-brand">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">{title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="container-x py-16 lg:py-24">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-ink sm:text-4xl">
            Slik ser kvelden ut
          </h2>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <dl className="divide-y divide-line border-t border-line">
              {schedule.map(([time, text]) => (
                <div key={time} className="grid grid-cols-[64px_1fr] gap-4 py-5">
                  <dt className="text-lg font-bold tabular-nums text-brand">{time}</dt>
                  <dd className="leading-relaxed text-ink-soft">{text}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-card bg-brand-light p-7 sm:p-9">
              <h3 className="text-2xl font-bold tracking-tight text-ink">
                Ta med
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {bring.map((item) => (
                  <li key={item} className="flex gap-3 py-3 text-ink">
                    <span aria-hidden="true" className="text-brand">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                Har du ingenting av dette? Kom likevel. Laptop kan du låne, og
                CV lager vi sammen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaRow
        title="Finn en kveld som passer"
        text="Vi arrangerer søknadskvelder gjennom hele semesteret."
        href="/arrangementer"
        label="Se arrangementer"
      />
    </main>
  );
}
