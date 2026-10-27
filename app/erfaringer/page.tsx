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
    <main id="main-content" className="flex-1">
      <PageHeader
        title="Det funker faktisk"
        lead="Tall og historier fra studenter som har søkt sammen med oss."
      />

      {figures.length > 0 && (
        <section className="border-b border-line bg-brand-light">
          <dl className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4 lg:py-20">
            {figures.map(([value, label]) => (
              <div key={label} className="min-w-0 border-l-2 border-brand/30 pl-5">
                <dd className="break-words text-5xl font-black tracking-[-0.06em] text-brand sm:text-6xl">{value}</dd>
                <dt className="mt-3 max-w-[14rem] text-sm leading-relaxed text-ink-soft">{label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section>
        <div className="container-x py-16 lg:py-24">
          {quotes.length > 0 ? (
            <ul className="grid gap-6 lg:grid-cols-2">
              {quotes.map(({ id, name, meta, quote }) => (
                <li key={id} className="flex flex-col rounded-card bg-canvas p-7 sm:p-10">
                  <span aria-hidden="true" className="mb-3 text-6xl font-black leading-none text-brand">“</span>
                  <blockquote className="flex-1 text-xl font-semibold leading-relaxed tracking-tight text-ink sm:text-2xl">
                    «{quote}»
                  </blockquote>
                  <p className="mt-8 border-t border-line pt-5 text-sm text-ink-soft">
                    <span className="font-semibold text-ink">{name}</span>, {meta}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-3xl rounded-card bg-canvas p-8 text-lg leading-relaxed text-ink-soft sm:p-12">
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
