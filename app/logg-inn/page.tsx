import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import LoginForm from "@/components/LoginForm";
import { getAccount } from "@/lib/account";
import { listEvents } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Logg inn", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ arrangement?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { arrangement } = await searchParams;
  const event = arrangement ? (await listEvents()).find(({ slug }) => slug === arrangement) : undefined;
  if (await getAccount(new Headers(await headers()))) redirect(`/min-side${event ? `?arrangement=${encodeURIComponent(event.slug)}` : ""}`);

  return (
    <main id="main-content" className="flex-1">
      <PageHeader title="Velkommen tilbake" lead="Logg inn for å se profilen din og melde deg på arrangementer." />
      <section className="container-x py-14 lg:py-20">
        <div className="mx-auto max-w-xl">
          {event && <p className="mb-6 text-ink-soft">Etter innlogging kan du bekrefte påmelding til <strong className="text-ink">{event.title}</strong>.</p>}
          <LoginForm eventSlug={event?.slug} />
        </div>
      </section>
    </main>
  );
}
