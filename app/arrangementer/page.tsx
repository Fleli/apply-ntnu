import type { Metadata } from "next";
import Link from "next/link";
import CtaRow from "@/components/CtaRow";
import EventList from "@/components/EventList";
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
        title="Arrangementer"
        lead="Alle søknadskvelder og workshops dette semesteret. Alt er gratis og åpent for alle NTNU-studenter – men meld deg på, så vi vet hvor mye pizza vi skal bestille."
      />

      <section>
        <div className="container-x py-10 lg:py-14">
          <p className="mb-8 text-sm text-ink-soft">
            Ny her?{" "}
            <Link href="/slik-fungerer-det" className="link">
              Se hvordan en søknadskveld foregår
            </Link>
            .
          </p>
          <EventList events={events} />
          <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
            Har du forslag til et tema, en bransje eller en bedrift?{" "}
            <a href="mailto:post@applyntnu.no" className="link">
              Send oss en e-post
            </a>
            .
          </p>
        </div>
      </section>

      <CtaRow
        title="Ikke medlem enda?"
        text="Medlemmer får beskjed om nye arrangementer først. Det er gratis."
        href="/bli-medlem"
        label="Bli medlem"
      />
    </main>
  );
}
