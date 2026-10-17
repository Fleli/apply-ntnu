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
    <main className="flex-1">
      <PageHeader
        title="Fra «jeg burde søke» til «søknad sendt» på én kveld"
        lead="Vi har gjort det så enkelt som mulig. Fire steg, ett fast tidspunkt og null krav til forkunnskaper."
      />

      <section className="border-b border-line">
        <div className="container-x py-14 lg:py-20">
          <ol className="grid gap-10 sm:grid-cols-2">
            {steps.map(({ title, text }, i) => (
              <li key={title}>
                <p className="text-4xl font-bold tabular-nums text-brand">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-lg font-semibold text-ink">{title}</h2>
                <p className="mt-2 max-w-md leading-relaxed text-ink-soft">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="container-x py-14 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Slik ser kvelden ut
          </h2>
          <div className="mt-8 grid gap-12 lg:grid-cols-[3fr_2fr]">
            <dl className="divide-y divide-line">
              {schedule.map(([time, text]) => (
                <div key={time} className="grid grid-cols-[64px_1fr] gap-4 py-3">
                  <dt className="font-semibold tabular-nums text-brand">{time}</dt>
                  <dd className="text-ink-soft">{text}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Ta med
              </h3>
              <ul className="mt-4 divide-y divide-line">
                {bring.map((item) => (
                  <li key={item} className="py-3 text-ink">
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
