import Link from "next/link";
import CtaRow from "@/components/CtaRow";
import EventRow from "@/components/EventRow";
import { listEvents } from "@/lib/db/queries";

export default async function Home() {
  const events = await listEvents({ limit: 3 });

  return (
    <main className="flex-1">
      <section className="border-b border-line">
        <div className="container-x py-20 lg:py-28">
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Søk på internships – <span className="text-brand">sammen</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            Jobbsøking er kjedelig og vanskelig når du sitter alene. Apply NTNU
            samler studenter til søknadskvelder der vi finner bedrifter,
            skriver søknader og trykker send – side om side.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/bli-medlem" className="btn-primary px-6 py-3">
              Bli medlem – det er gratis
            </Link>
            <Link href="/slik-fungerer-det" className="link">
              Slik fungerer det →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_2fr] lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Hva er Apply NTNU?
          </h2>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              En studentorganisasjon ved NTNU for alle som skal søke internship
              eller sommerjobb. Vi møtes på Gløshaugen, går gjennom hvilke
              frister som nærmer seg, og skriver søknader sammen til de er
              sendt.
            </p>
            <p>
              Det er gratis, åpent for alle studieprogram, og du trenger verken
              CV eller plan for å komme. Ta med laptop – vi tar med pizza.
            </p>
            <p>
              <Link href="/hvorfor" className="link">
                Hvorfor vi gjør dette →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-14 lg:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Neste søknadskvelder
            </h2>
            {events.length > 0 && (
              <Link href="/arrangementer" className="link text-sm whitespace-nowrap">
                Alle arrangementer →
              </Link>
            )}
          </div>
          {events.length > 0 ? (
            <ul className="mt-6">
              {events.map((event) => (
                <EventRow key={event.slug} event={event} compact />
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-xl text-ink-soft">
              Ingen arrangementer er lagt ut ennå. Bli medlem, så får du beskjed
              så snart neste søknadskveld er klar.
            </p>
          )}
        </div>
      </section>

      <CtaRow
        title="Klar for å søke sammen?"
        text="Medlemskap er gratis og tar under ett minutt."
        href="/bli-medlem"
        label="Bli medlem"
      />
    </main>
  );
}
