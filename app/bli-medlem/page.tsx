import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SignupForm from "@/components/SignupForm";
import { listEvents } from "@/lib/db/queries";
import { headers } from "next/headers";
import Link from "next/link";
import { getAccount } from "@/lib/account";

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
  const [upcoming, account] = await Promise.all([
    listEvents(),
    getAccount(new Headers(await headers())),
  ]);
  const chosen = upcoming.find((event) => event.slug === arrangement);
  const events = upcoming.map(({ slug, title }) => ({ slug, title }));
  const preselected = chosen?.slug;

  return (
    <main className="flex-1">
      <PageHeader
        title="Bli medlem i Apply NTNU"
        lead="Gratis, uforpliktende og åpent for alle NTNU-studenter. Opprett en konto og bli med i fellesskapet."
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

          {account ? (
            <div className="card bg-surface p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-ink">Du er allerede medlem</h2>
              <p className="mt-3 text-ink-soft">Du er logget inn som {account.name}. På Min side kan du endre profilen din og se påmeldingene dine.</p>
              {chosen && <p className="mt-3 text-ink-soft">Bekreft påmelding til {chosen.title} på Min side.</p>}
              <Link href={`/min-side${preselected ? `?arrangement=${encodeURIComponent(preselected)}` : ""}`} className="btn-primary mt-6 inline-flex px-6 py-3">Åpne Min side</Link>
            </div>
          ) : <SignupForm events={events} preselected={preselected} />}
        </div>
      </section>
    </main>
  );
}
