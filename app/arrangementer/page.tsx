import type { Metadata } from "next";
import Link from "next/link";
import ContactSentence from "@/components/ContactSentence";
import CtaRow from "@/components/CtaRow";
import EventList from "@/components/EventList";
import PageHeader from "@/components/PageHeader";
import { getSettings, listEvents } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Arrangementer",
  description:
    "Alle søknadskvelder og workshops hos Apply NTNU dette semesteret. Gratis for alle NTNU-studenter.",
};

export default async function ArrangementerPage() {
  const [events, settings] = await Promise.all([listEvents(), getSettings()]);

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

          {events.length > 0 ? (
            <EventList events={events} />
          ) : (
            <p className="max-w-xl text-lg text-ink-soft">
              Ingen arrangementer er lagt ut ennå. Programmet for semesteret
              kommer her så snart det er klart – medlemmer får beskjed først.
            </p>
          )}

          <ContactSentence
            email={settings.contact_email}
            before="Har du forslag til et tema, en bransje eller en bedrift?"
            label="Send oss en e-post"
            className="mt-10 border-t border-line pt-6"
          />
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
