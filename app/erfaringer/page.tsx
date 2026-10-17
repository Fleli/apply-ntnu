import type { Metadata } from "next";
import { Mail } from "lucide-react";
import CtaCard from "@/components/CtaCard";
import NextPageLink from "@/components/NextPageLink";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Erfaringer",
  description:
    "Tall og historier fra studenter som har søkt på internships sammen med Apply NTNU.",
};

// TODO: Plassholdertall – oppdater med ekte statistikk.
const stats = [
  { value: "350+", label: "søknader sendt på våre kvelder" },
  { value: "120+", label: "medlemmer" },
  { value: "8", label: "arrangementer i semesteret" },
  { value: "0 kr", label: "i medlemskontingent" },
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
  {
    initials: "JO",
    name: "Jonas",
    meta: "Bygg- og miljøteknikk, 3. år",
    text: "Jeg visste ikke engang hvilke bedrifter som tok inn sommerstudenter. Nå har jeg en liste – og tre søknader ute.",
  },
  {
    initials: "MT",
    name: "Mari",
    meta: "Fysikk og matematikk, 2. år",
    text: "Trodde jeg var for tidlig ute i andre klasse. Det var jeg ikke. Fikk sommerjobb etter første søknadskveld.",
  },
  {
    initials: "EL",
    name: "Elias",
    meta: "Industriell design, 4. år",
    text: "Pizza, folk og en frist samme kveld. Det er oppskriften som fungerer for meg.",
  },
];

export default function ErfaringerPage() {
  return (
    <main className="flex-1">
      <PageHeader
        eyebrow="Erfaringer"
        title="Det funker faktisk"
        lead="Tall og historier fra studenter som har søkt sammen med oss."
      />

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

      <section className="py-16 lg:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">Medlemmene sier</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Med egne ord
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

          <div className="mt-10 flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-ink">Har du en historie?</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Fikk du jobb etter en søknadskveld? Vi vil gjerne høre om det –
                og dele det, hvis du vil.
              </p>
            </div>
            <a
              href="mailto:post@applyntnu.no?subject=Min%20erfaring%20med%20Apply%20NTNU"
              className="btn-outline shrink-0 px-5 py-2.5 text-sm"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Del din erfaring
            </a>
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="container-x">
          <CtaCard
            title="Bli den neste historien"
            text="Medlemskap er gratis, og neste søknadskveld er aldri langt unna."
            primary={{ href: "/bli-medlem", label: "Bli medlem" }}
            secondary={{ href: "/arrangementer", label: "Se arrangementer" }}
          />
        </div>
      </section>

      <NextPageLink current="/erfaringer" />
    </main>
  );
}
