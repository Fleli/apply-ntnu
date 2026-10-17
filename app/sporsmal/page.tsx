import type { Metadata } from "next";
import ContactSentence from "@/components/ContactSentence";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";
import { getSettings } from "@/lib/db/queries";

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
    a: "Nei. Mange bedrifter tar inn sommerstudenter allerede etter første eller andre år, og det er aldri for tidlig å lære seg å skrive en god søknad.",
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

export default async function SporsmalPage() {
  const settings = await getSettings();

  return (
    <main className="flex-1">
      <PageHeader
        title="Lurer du på noe?"
        lead="Her er svarene på det folk oftest spør om før de kommer første gang."
      />

      <section>
        <div className="container-x py-10 lg:py-14">
          <div className="max-w-3xl divide-y divide-line border-b border-line">
            {faq.map(({ q, a }) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-ink marker:content-none">
                  {q}
                  <span
                    className="shrink-0 text-2xl font-light leading-none text-brand transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
          <ContactSentence
            email={settings.contact_email}
            before="Fant du ikke svaret?"
            label="Send oss en e-post"
            after="eller spør oss på neste søknadskveld"
            className="mt-6"
          />
        </div>
      </section>

      <CtaRow
        title="Klar for å prøve?"
        text="Medlemskap er gratis og tar under ett minutt."
        href="/bli-medlem"
        label="Bli medlem"
      />
    </main>
  );
}
