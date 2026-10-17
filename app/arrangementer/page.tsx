import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, Mail } from "lucide-react";
import EventList from "@/components/EventList";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";
import { sortedEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Arrangementer",
  description:
    "Alle søknadskvelder og workshops hos Apply NTNU dette semesteret. Gratis for alle NTNU-studenter.",
};

export default function ArrangementerPage() {
  const events = sortedEvents();

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Semesterprogram"
        title="Arrangementer"
        lead="Alle søknadskvelder og workshops dette semesteret. Alt er gratis og åpent for alle NTNU-studenter – men meld deg på, så vi vet hvor mye pizza vi skal bestille."
      />

      <section className="py-10 lg:py-14">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_320px]">
          <EventList events={events} />

          <aside className="space-y-5 lg:sticky lg:top-[76px] lg:self-start">
            <div className="card p-5">
              <div className="flex items-center gap-2 text-brand">
                <ListChecks className="h-5 w-5" aria-hidden="true" />
                <h2 className="text-base font-semibold text-ink">Ny her?</h2>
              </div>
              <p className="mt-3 text-sm text-ink-soft">
                Lurer du på hvordan en søknadskveld foregår, eller hva du bør
                ta med? Vi har samlet alt på én side.
              </p>
              <Link
                href="/slik-fungerer-det"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Slik fungerer det
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
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

      <NextPageLink current="/arrangementer" />
    </main>
  );
}
