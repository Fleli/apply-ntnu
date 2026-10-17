import type { Metadata } from "next";
import ContactSentence from "@/components/ContactSentence";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";
import { getSettings, getStats, listTestimonials } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Erfaringer",
  description:
    "Tall og historier fra studenter som har søkt på internships sammen med Apply NTNU.",
};

const nb = new Intl.NumberFormat("nb-NO");

export default async function ErfaringerPage() {
  const [stats, settings, quotes] = await Promise.all([
    getStats(),
    getSettings(),
    listTestimonials(),
  ]);

  const applicationsSent = Number(settings.applications_sent ?? 0);
  const figures = [
    applicationsSent > 0 && [nb.format(applicationsSent), "søknader sendt på våre kvelder"],
    stats.members > 0 && [nb.format(stats.members), stats.members === 1 ? "medlem" : "medlemmer"],
    stats.events > 0 && [nb.format(stats.events), stats.events === 1 ? "arrangement" : "arrangementer"],
    stats.registrations > 0 && [nb.format(stats.registrations), stats.registrations === 1 ? "påmelding" : "påmeldinger"],
  ].filter((f): f is [string, string] => Array.isArray(f));

  return (
    <main className="flex-1">
      <PageHeader
        title="Det funker faktisk"
        lead="Tall og historier fra studenter som har søkt sammen med oss."
      />

      {figures.length > 0 && (
        <section className="border-b border-line">
          <dl className="container-x grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
            {figures.map(([value, label]) => (
              <div key={label}>
                <dd className="text-4xl font-bold tracking-tight text-ink">{value}</dd>
                <dt className="mt-1 text-sm text-ink-soft">{label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section>
        <div className="container-x py-14 lg:py-20">
          {quotes.length > 0 ? (
            <ul className="max-w-3xl divide-y divide-line">
              {quotes.map(({ id, name, meta, quote }) => (
                <li key={id} className="py-8 first:pt-0 last:pb-0">
                  <blockquote className="text-xl leading-relaxed text-ink sm:text-2xl">
                    «{quote}»
                  </blockquote>
                  <p className="mt-4 text-sm text-ink-soft">
                    <span className="font-semibold text-ink">{name}</span>, {meta}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-xl text-lg text-ink-soft">
              Vi samler inn historier fra medlemmene våre. De første kommer her
              etter semesterets første søknadskvelder.
            </p>
          )}

          <ContactSentence
            email={settings.contact_email}
            before="Fikk du jobb etter en søknadskveld?"
            label="Fortell oss om det"
            subject="Min erfaring med Apply NTNU"
            className={quotes.length > 0 ? "mt-10 border-t border-line pt-6" : "mt-6"}
          />
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
