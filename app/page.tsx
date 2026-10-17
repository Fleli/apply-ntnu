import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageCircle,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import CtaCard from "@/components/CtaCard";
import { formatLongDate, upcomingEvents } from "@/lib/events";
import { sitePages } from "@/lib/pages";

export default function Home() {
  const next = upcomingEvents(1)[0];

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
                <p className="mt-1 text-sm text-ink-soft">
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

      {/* ─── Utforsk undersidene ──────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Utforsk</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Alt du trenger å vite
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sitePages.map(({ href, title, description, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-4 text-lg font-semibold text-ink group-hover:text-brand">
                    {title}
                  </span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Les mer
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container-x">
          <CtaCard
            title="Klar for å søke sammen?"
            text="Medlemskap er gratis og tar under ett minutt. Du får beskjed om alle søknadskvelder og tilgang til malene våre."
            primary={{ href: "/bli-medlem", label: "Bli medlem" }}
            secondary={{ href: "/hvorfor", label: "Hvorfor Apply NTNU?" }}
          />
        </div>
      </section>
    </main>
  );
}
