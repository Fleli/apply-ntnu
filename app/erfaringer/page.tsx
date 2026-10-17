import type { Metadata } from "next";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Erfaringer",
  description:
    "Tall og historier fra studenter som har søkt på internships sammen med Apply NTNU.",
};

// TODO: Plassholdertall – oppdater med ekte statistikk.
const stats = [
  ["350+", "søknader sendt på våre kvelder"],
  ["120+", "medlemmer"],
  ["8", "arrangementer i semesteret"],
  ["0 kr", "i medlemskontingent"],
];

// TODO: Plassholdersitater – bytt ut med ekte medlemmer som har gitt samtykke.
const testimonials = [
  {
    name: "Ingrid",
    meta: "Indøk, 3. år",
    text: "Jeg hadde utsatt søknadene i ukevis. På én kveld hos Apply NTNU sendte jeg fire – og fikk intervju på to av dem.",
  },
  {
    name: "Sander",
    meta: "Datateknologi, 2. år",
    text: "Det beste er at man ikke føler seg alene i prosessen. Alle sitter i samme båt, og det er lav terskel for å spørre om hjelp.",
  },
  {
    name: "Amina",
    meta: "Kybernetikk og robotikk, 4. år",
    text: "Fikk kjempegode tilbakemeldinger på CV-en min fra noen som hadde vært gjennom det samme året før. Det hadde jeg aldri fått ellers.",
  },
];

export default function ErfaringerPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Det funker faktisk"
        lead="Tall og historier fra studenter som har søkt sammen med oss."
      />

      <section className="border-b border-line">
        <dl className="container-x grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <dd className="text-4xl font-bold tracking-tight text-ink">
                {value}
              </dd>
              <dt className="mt-1 text-sm text-ink-soft">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className="container-x py-14 lg:py-20">
          <ul className="max-w-3xl divide-y divide-line">
            {testimonials.map(({ name, meta, text }) => (
              <li key={name} className="py-8 first:pt-0 last:pb-0">
                <blockquote className="text-xl leading-relaxed text-ink sm:text-2xl">
                  «{text}»
                </blockquote>
                <p className="mt-4 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{name}</span>, {meta}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
            Fikk du jobb etter en søknadskveld?{" "}
            <a
              href="mailto:post@applyntnu.no?subject=Min%20erfaring%20med%20Apply%20NTNU"
              className="link"
            >
              Fortell oss om det
            </a>
            .
          </p>
        </div>
      </section>

      <CtaRow
        title="Bli den neste historien"
        text="Medlemskap er gratis, og neste søknadskveld er aldri langt unna."
        href="/bli-medlem"
        label="Bli medlem"
      />
    </main>
  );
}
