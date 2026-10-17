import type { Metadata } from "next";
import { Check, Laptop, PartyPopper, UserPlus, Users } from "lucide-react";
import CtaCard from "@/components/CtaCard";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Slik fungerer det",
  description:
    "Fire steg fra «jeg burde søke» til «søknad sendt». Se hvordan en søknadskveld hos Apply NTNU foregår, og hva du bør ta med.",
};

const steps = [
  {
    icon: UserPlus,
    title: "Meld deg på",
    text: "Finn en søknadskveld som passer deg, og meld deg på. Det er gratis og uforpliktende – men gi beskjed, så vi vet hvor mye pizza vi skal bestille.",
  },
  {
    icon: Laptop,
    title: "Ta med laptop",
    text: "Du trenger ikke ha noe klart på forhånd. Vi har maler for CV og søknadsbrev, og eksempler du kan la deg inspirere av.",
  },
  {
    icon: Users,
    title: "Vi søker sammen",
    text: "Vi går gjennom aktuelle bedrifter og frister, skriver søknader side om side og gir hverandre tilbakemeldinger underveis.",
  },
  {
    icon: PartyPopper,
    title: "Trykk send – og feir",
    text: "Hver søknad som blir sendt er en liten seier. Vi feirer med pizza og teller opp hvor mange vi fikk ut døra.",
  },
];

const schedule = [
  { time: "17:00", text: "Dørene åpner – kaffe og noe å bite i" },
  { time: "17:15", text: "Kort intro: hvilke frister nærmer seg?" },
  { time: "17:30", text: "Vi søker! Hjelp og tilbakemelding underveis" },
  { time: "19:00", text: "Pizzapause" },
  { time: "19:45", text: "Oppsummering: hvor mange søknader fikk vi ut?" },
  { time: "20:00", text: "Takk for i kveld – og lykke til" },
];

const bring = [
  "Laptop og lader",
  "CV – hvis du har en",
  "Karakterutskrift (kan lastes ned fra Studentweb)",
  "En liste over bedrifter du har lyst til å søke hos",
  "Godt humør",
];

export default function SlikFungererDetPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Slik fungerer det"
        title="Fra «jeg burde søke» til «søknad sendt» på én kveld"
        lead="Vi har gjort det så enkelt som mulig. Fire steg, ett fast tidspunkt og null krav til forkunnskaper."
      />

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Fire steg</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Det er hele oppskriften
            </h2>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="card flex gap-5 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">{title}</h3>
                    <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">En typisk søknadskveld</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Slik ser kvelden ut
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink">Programmet</h3>
              <ol className="mt-5 space-y-0">
                {schedule.map(({ time, text }, i) => (
                  <li key={time} className="relative flex gap-5 pb-5 last:pb-0">
                    {i < schedule.length - 1 && (
                      <span
                        className="absolute left-[7px] top-5 h-full w-0.5 bg-brand-tint"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-[3px] border-brand bg-surface"
                      aria-hidden="true"
                    />
                    <span className="w-14 shrink-0 pt-0.5 font-semibold text-brand">
                      {time}
                    </span>
                    <span className="pt-0.5 text-ink-soft">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink">Ta med</h3>
              <ul className="mt-5 space-y-3">
                {bring.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-soft">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-md bg-brand-light px-4 py-3 text-sm text-brand-dark">
                Har du ingenting av dette? Kom likevel. Laptop kan du låne, og
                CV lager vi sammen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <CtaCard
            title="Finn en kveld som passer"
            text="Vi arrangerer søknadskvelder gjennom hele semesteret, med ekstra trykk rundt de store fristene."
            primary={{ href: "/arrangementer", label: "Se arrangementer" }}
            secondary={{ href: "/bli-medlem", label: "Bli medlem" }}
          />
        </div>
      </section>

      <NextPageLink current="/slik-fungerer-det" />
    </main>
  );
}
