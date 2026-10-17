import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lightbulb, Mail } from "lucide-react";
import EventList from "@/components/EventList";
import { sortedEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Arrangementer",
  description:
    "Alle søknadskvelder og workshops hos Apply NTNU dette semesteret. Gratis for alle NTNU-studenter.",
};

const schedule = [
  { time: "17:00", text: "Dørene åpner – kaffe og noe å bite i" },
  { time: "17:15", text: "Kort intro: hvilke frister nærmer seg?" },
  { time: "17:30", text: "Vi søker! Hjelp og tilbakemelding underveis" },
  { time: "19:00", text: "Pizzapause" },
  { time: "19:45", text: "Oppsummering: hvor mange søknader fikk vi ut?" },
];

const bring = ["Laptop og lader", "CV – hvis du har en", "Studentkort", "Godt humør"];

export default function ArrangementerPage() {
  const events = sortedEvents();

  return (
    <main className="flex-1">
      <section className="border-b border-line bg-surface">
        <div className="container-x py-12 lg:py-16">
          <p className="eyebrow">Semesterprogram</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Arrangementer
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Alle søknadskvelder og workshops dette semesteret. Alt er gratis og
            åpent for alle NTNU-studenter – men meld deg på, så vi vet hvor mye
            pizza vi skal bestille.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_320px]">
          <EventList events={events} />

          <aside className="space-y-5 lg:sticky lg:top-[76px] lg:self-start">
            <div className="card p-5">
              <h2 className="text-base font-semibold text-ink">
                Slik foregår en søknadskveld
              </h2>
              <ol className="mt-4 space-y-3">
                {schedule.map(({ time, text }) => (
                  <li key={time} className="flex gap-3 text-sm">
                    <span className="w-12 shrink-0 font-semibold text-brand">
                      {time}
                    </span>
                    <span className="text-ink-soft">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="card p-5">
              <h2 className="text-base font-semibold text-ink">Ta med</h2>
              <ul className="mt-4 space-y-2">
                {bring.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 text-brand">
                <Lightbulb className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-base font-semibold text-ink">
                  Har du et forslag?
                </h2>
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Er det en bransje, bedrift eller et tema du vil at vi skal ta
                opp? Si ifra – vi lager programmet sammen med medlemmene.
              </p>
              <a
                href="mailto:post@applyntnu.no"
                className="btn-outline mt-4 w-full px-4 py-2 text-sm"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Send oss en e-post
              </a>
            </div>

            <div className="rounded-card bg-brand p-5 text-white">
              <h2 className="text-base font-semibold">Ikke medlem enda?</h2>
              <p className="mt-2 text-sm text-white/85">
                Medlemmer får beskjed om nye arrangementer først. Det er
                gratis.
              </p>
              <Link
                href="/bli-medlem"
                className="btn mt-4 w-full bg-white px-4 py-2 text-sm text-brand hover:bg-brand-light"
              >
                Bli medlem
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
