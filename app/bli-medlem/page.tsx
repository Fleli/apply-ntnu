import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SignupForm from "@/components/SignupForm";
import { getEvent, sortedEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Bli medlem",
  description:
    "Bli medlem i Apply NTNU. Det er gratis, tar under ett minutt og gir deg tilgang til alle søknadskvelder og ressurser.",
};

const perks = [
  {
    title: "Først i køen",
    text: "Du får beskjed om nye søknadskvelder og workshops før de legges ut åpent – og plassene går fort.",
  },
  {
    title: "Maler og ressurser",
    text: "CV-maler, eksempler på søknadsbrev og oversikter over bedrifter og frister.",
  },
  {
    title: "Et fellesskap",
    text: "Folk i samme situasjon som deg – og noen som har vært der før og gjerne deler erfaringer.",
  },
];

type Props = {
  searchParams: Promise<{ arrangement?: string }>;
};

export default async function BliMedlemPage({ searchParams }: Props) {
  const { arrangement } = await searchParams;
  const preselected = arrangement && getEvent(arrangement) ? arrangement : undefined;
  const events = sortedEvents().map(({ slug, title, date }) => ({
    slug,
    title,
    date,
  }));

  return (
    <main className="flex-1">
      <PageHeader
        title="Bli medlem i Apply NTNU"
        lead="Gratis, uforpliktende og åpent for alle NTNU-studenter. Du melder deg av med ett klikk når du har fått jobben."
      />

      <section>
        <div className="container-x grid gap-12 py-14 lg:grid-cols-[2fr_3fr] lg:gap-20 lg:py-20">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Dette får du
            </h2>
            <dl className="mt-6 divide-y divide-line">
              {perks.map(({ title, text }) => (
                <div key={title} className="py-4">
                  <dt className="font-semibold text-ink">{title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {text}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-ink-soft">
              Ingen kontingent. Ingen krav til CV eller erfaring. Alle
              studieprogram og årstrinn.
            </p>
          </div>

          <SignupForm events={events} preselected={preselected} />
        </div>
      </section>
    </main>
  );
}
