import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Vanlige spørsmål",
  description:
    "Svar på det folk lurer mest på om Apply NTNU: pris, medlemskap, hva du bør ta med og hvem søknadskveldene passer for.",
};

const faq = [
  {
    q: "Koster det noe å være medlem?",
    a: "Nei. Medlemskap i Apply NTNU er gratis, og det samme er alle arrangementene våre. Vi dekker pizza og lokaler gjennom støtte og samarbeidspartnere.",
  },
  {
    q: "Må jeg være medlem for å komme på en søknadskveld?",
    a: "Nei, alle NTNU-studenter er velkomne. Men som medlem får du beskjed om nye arrangementer først, og tilgang til malene og ressursene våre.",
  },
  {
    q: "Jeg har ikke CV enda. Kan jeg likevel komme?",
    a: "Absolutt – det er nettopp da du bør komme. Vi har maler, eksempler og folk som gjerne hjelper deg med å lage en fra bunnen av.",
  },
  {
    q: "Hvilke studieprogram er dette for?",
    a: "Alle. De fleste medlemmene våre studerer teknologi, økonomi eller realfag, men søknadskveldene passer for alle som skal søke internship eller sommerjobb.",
  },
  {
    q: "Er jeg for tidlig ute i første eller andre klasse?",
    a: "Nei. Mange bedrifter tar inn sommerstudenter allerede etter første eller andre år, og det er aldri for tidlig å lære seg å skrive en god søknad. Jo før du begynner, jo lettere blir det neste gang.",
  },
  {
    q: "Hva skjer hvis arrangementet er fullt?",
    a: "Da kan du sette deg på venteliste. Det er alltid noen som melder avbud, og vi sender beskjed på e-post så snart det blir ledig plass.",
  },
  {
    q: "Hjelper dere med intervjuer også?",
    a: "Ja, vi har egne workshops for intervjutrening og case. Se programmet under arrangementer.",
  },
  {
    q: "Hvordan kan jeg engasjere meg i styret?",
    a: "Vi tar opp nye styremedlemmer hvert semester. Send oss en e-post eller ta en prat med en av oss på neste søknadskveld.",
  },
];

export default function SporsmalPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Vanlige spørsmål"
        title="Lurer du på noe?"
        lead="Her er svarene på det folk oftest spør om før de kommer første gang. Finner du ikke svaret, er det bare å sende oss en melding."
      />

      <section className="py-12 lg:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="card divide-y divide-line">
            {faq.map(({ q, a }) => (
              <details key={q} className="group px-6 py-4 open:bg-brand-light/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-none">
                  {q}
                  <span
                    className="shrink-0 text-xl leading-none text-brand transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[76px] lg:self-start">
            <div className="card p-5">
              <h2 className="text-base font-semibold text-ink">
                Fant du ikke svaret?
              </h2>
              <p className="mt-3 text-sm text-ink-soft">
                Send oss en e-post, så svarer vi så fort vi kan. Du kan også
                spørre oss direkte på neste søknadskveld.
              </p>
              <a
                href="mailto:post@applyntnu.no"
                className="btn-outline mt-4 w-full px-4 py-2 text-sm"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Kontakt oss
              </a>
            </div>

            <div className="card p-5">
              <h2 className="text-base font-semibold text-ink">
                Vil du se hvordan en kveld foregår?
              </h2>
              <Link
                href="/slik-fungerer-det"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
              >
                Slik fungerer det
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <NextPageLink current="/sporsmal" />
    </main>
  );
}
