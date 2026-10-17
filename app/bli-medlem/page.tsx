import type { Metadata } from "next";
import { Bell, Check, FileText, Users } from "lucide-react";
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
    icon: Bell,
    title: "Først i køen",
    text: "Du får beskjed om nye søknadskvelder og workshops før de legges ut åpent – og plassene går fort.",
  },
  {
    icon: FileText,
    title: "Maler og ressurser",
    text: "Tilgang til CV-maler, eksempler på søknadsbrev og oversikter over bedrifter og frister.",
  },
  {
    icon: Users,
    title: "Et fellesskap",
    text: "Folk som er i samme situasjon som deg – og noen som har vært der før og gjerne deler erfaringer.",
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
        eyebrow="Medlemskap"
        title="Bli medlem i Apply NTNU"
        lead="Gratis, uforpliktende og åpent for alle NTNU-studenter. Du melder deg av med ett klikk når du har fått jobben."
      />

      <section className="py-12 lg:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Dette får du
            </h2>
            <ul className="mt-6 space-y-6">
              {perks.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-card border border-brand/20 bg-brand-light/60 p-5">
              <p className="text-sm font-semibold text-ink">Helt kort:</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {[
                  "0 kr i kontingent",
                  "Ingen krav til CV eller erfaring",
                  "Alle studieprogram og årstrinn",
                  "Meld deg av når du vil",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <SignupForm events={events} preselected={preselected} />
        </div>
      </section>
    </main>
  );
}
