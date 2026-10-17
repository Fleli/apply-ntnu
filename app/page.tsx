import Link from "next/link";
import {
  AlarmClock,
  ArrowRight,
  Check,
  Coffee,
  Laptop,
  Lightbulb,
  MessageCircle,
  PartyPopper,
  Repeat2,
  Send,
  ThumbsUp,
  UserPlus,
  Users,
} from "lucide-react";
import EventCard from "@/components/EventCard";
import { formatLongDate, upcomingEvents } from "@/lib/events";

// TODO: Plassholdertall – oppdater med ekte statistikk.
const stats = [
  { value: "350+", label: "søknader sendt på våre kvelder" },
  { value: "120+", label: "medlemmer" },
  { value: "8", label: "arrangementer i semesteret" },
  { value: "0 kr", label: "i medlemskontingent" },
];

const reasons = [
  {
    icon: Coffee,
    title: "Det er kjedelig",
    text: "Å sitte alene med fjorten søknader en søndag kveld er ingen drøm. Vi gjør det til en sosial greie – med kaffe, boller og folk i samme situasjon.",
  },
  {
    icon: Lightbulb,
    title: "Det er vanskelig",
    text: "Hva skal man egentlig skrive? Hvem søker man til? På søknadskveldene hjelper vi hverandre, deler tips og leser korrektur på hverandres tekster.",
  },
  {
    icon: AlarmClock,
    title: "Det blir utsatt",
    text: "Fristene kommer alltid for fort. Et fast tidspunkt i kalenderen gjør at søknadene faktisk blir skrevet – og sendt.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Meld deg på",
    text: "Finn en søknadskveld som passer deg, og meld deg på. Det er gratis og uforpliktende.",
  },
  {
    icon: Laptop,
    title: "Ta med laptop",
    text: "Du trenger ikke ha noe klart på forhånd. Vi har maler for CV og søknadsbrev, og eksempler du kan la deg inspirere av.",
  },
  {
    icon: Users,
    title: "Vi søker sammen",
    text: "Vi går gjennom aktuelle bedrifter og frister, skriver søknader side om side og gir hverandre tilbakemeldinger.",
  },
  {
    icon: PartyPopper,
    title: "Trykk send – og feir",
    text: "Hver søknad som blir sendt er en liten seier. Vi feirer med pizza og teller opp hvor mange vi fikk ut døra.",
  },
];

// TODO: Plassholdersitater – bytt ut med ekte medlemmer som har gitt samtykke.
const testimonials = [
  {
    initials: "IH",
    name: "Ingrid",
    meta: "Indøk, 3. år",
    text: "Jeg hadde utsatt søknadene i ukevis. På én kveld hos Apply NTNU sendte jeg fire – og fikk intervju på to av dem.",
  },
  {
    initials: "SB",
    name: "Sander",
    meta: "Datateknologi, 2. år",
    text: "Det beste er at man ikke føler seg alene i prosessen. Alle sitter i samme båt, og det er lav terskel for å spørre om hjelp.",
  },
  {
    initials: "AK",
    name: "Amina",
    meta: "Kybernetikk og robotikk, 4. år",
    text: "Fikk kjempegode tilbakemeldinger på CV-en min fra noen som hadde vært gjennom det samme året før. Det hadde jeg aldri fått ellers.",
  },
];

export default function Home() {
  const nextEvents = upcomingEvents(3);
  const next = nextEvents[0];

  return (
    <main className="flex-1">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="eyebrow">Studentorganisasjon ved NTNU</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Søk på internships – <span className="text-brand">sammen</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Jobbsøking er kjedelig og vanskelig når du sitter alene. Apply
              NTNU samler studenter til søknadskvelder der vi finner bedrifter,
              skriver søknader og trykker send – side om side.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/bli-medlem" className="btn-primary px-6 py-3">
                Bli medlem – det er gratis
              </Link>
              <Link href="/arrangementer" className="btn-outline px-6 py-3">
                Se arrangementer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              {["Gratis", "Åpent for alle NTNU-studenter", "Ingen forkunnskaper"].map(
                (item) => (
                  <li key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Illustrasjon: et «innlegg» i LinkedIn-stil */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="card p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    Apply NTNU
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    1 240 følgere
                  </p>
                  <p className="text-xs text-ink-faint">2 t · Trondheim</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                I kveld sendte 38 studenter 112 søknader fra R5 🎉 Takk til alle
                som kom! Neste søknadskveld er torsdag kl. 17:00 – vi har pizza
                og plass til flere.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                    <ThumbsUp className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  96
                </span>
                <span>14 kommentarer · 3 delinger</span>
              </div>
              <div className="mt-2 grid grid-cols-4 border-t border-line pt-1 text-xs font-semibold text-ink-soft">
                {[
                  { icon: ThumbsUp, label: "Lik" },
                  { icon: MessageCircle, label: "Kommenter" },
                  { icon: Repeat2, label: "Del" },
                  { icon: Send, label: "Send" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md py-2 hover:bg-black/5"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {next && (
              <div className="card relative -mt-3 ml-6 p-4 sm:ml-10 sm:p-5">
                <p className="eyebrow text-xs">Neste arrangement</p>
                <p className="mt-1 font-semibold leading-snug text-ink">
                  {next.title}
                </p>
                <p className="mt-1 text-sm capitalize text-ink-soft">
                  {formatLongDate(next.date)} · kl. {next.startTime}
                </p>
                <Link
                  href="/arrangementer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                >
                  Meld deg på
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Hvorfor ──────────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Hvorfor Apply NTNU?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Å søke jobb alene er kjedelig. Og vanskelig.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Vi har kjent det på kroppen selv. Derfor startet vi Apply NTNU.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Slik fungerer det ────────────────────────────────── */}
      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Slik fungerer det</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Fra «jeg burde søke» til «søknad sendt» på én kveld
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Kommende arrangementer ───────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Kommende arrangementer</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Bli med på neste søknadskveld
              </h2>
            </div>
            <Link
              href="/arrangementer"
              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              Se alle arrangementer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {nextEvents.map((event) => (
              <EventCard key={event.slug} event={event} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tall ─────────────────────────────────────────────── */}
      <section className="bg-brand py-14 text-white">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                {value}
              </p>
              <p className="mt-2 text-sm text-white/80">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Medlemmene sier ──────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Medlemmene sier</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Det funker faktisk
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map(({ initials, name, meta, text }) => (
              <figure key={name} className="card flex flex-col p-6">
                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
                  «{text}»
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand-dark">
                    {initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {name}
                    </span>
                    <span className="block text-xs text-ink-soft">{meta}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container-x">
          <div className="card flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-ink">
                Klar for å søke sammen?
              </h2>
              <p className="mt-3 text-lg text-ink-soft">
                Medlemskap er gratis og tar under ett minutt. Du får beskjed om
                alle søknadskvelder og tilgang til malene våre.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/bli-medlem" className="btn-primary px-6 py-3">
                Bli medlem
              </Link>
              <Link href="/om-oss" className="btn-outline px-6 py-3">
                Les om oss
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
