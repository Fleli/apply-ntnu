import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AdminEventForm from "@/components/AdminEventForm";
import AdminMembersForm from "@/components/AdminMembersForm";
import { getAccount } from "@/lib/account";
import { eventTypes } from "@/lib/db/schema";
import { listEvents } from "@/lib/db/queries";
import { formatLongDate, todayInOslo } from "@/lib/dates";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ created?: string | string[] }> };

export default async function AdminPage({ searchParams }: Props) {
  const account = await getAccount(new Headers(await headers()));
  if (!account) redirect("/logg-inn");
  if (!account.isAdmin) return (
    <main className="flex-1">
      <PageHeader title="Ingen administratortilgang" lead="Denne siden er for administratorer. Kontakt en eksisterende administrator hvis du trenger tilgang." />
      <div className="container-x py-12"><Link href="/min-side" className="btn-outline">Til Min side</Link></div>
    </main>
  );
  const upcoming = await listEvents();
  const { created } = await searchParams;
  const published = typeof created === "string" ? upcoming.find((event) => event.slug === created) : undefined;
  return (
    <main className="flex-1">
      <PageHeader title="Admin" lead="Samle flere rundt bordet. Opprett arrangementer og gi andre i teamet tilgang til å hjelpe til." />
      <div className="container-x space-y-8 py-10 lg:py-14">
        {published && <div role="status" className="card border-brand/20 bg-brand-light p-5 text-brand">
          <p className="font-semibold">{published.title} er publisert.</p>
          <Link href={`/arrangementer#${published.slug}`} className="mt-2 inline-block underline underline-offset-4">Se arrangementet på nettsiden</Link>
        </div>}
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <AdminEventForm key={published?.slug ?? "new"} today={todayInOslo()} eventTypes={eventTypes} />
          <div className="min-w-0 space-y-8">
            <AdminMembersForm />
            <section aria-labelledby="upcoming-admin-heading">
              <h2 id="upcoming-admin-heading" className="text-xl font-bold text-ink">Kommende arrangementer</h2>
              {upcoming.length ? <ul className="mt-4 divide-y divide-line">
                {upcoming.slice(0, 5).map((event) => <li key={event.id} className="py-4 first:pt-0">
                  <Link href={`/arrangementer#${event.slug}`} className="break-words font-semibold text-brand hover:underline">{event.title}</Link>
                  <p className="mt-1 text-sm text-ink-soft">{formatLongDate(event.date)} · {event.startTime}</p>
                  <p className="mt-1 text-xs text-ink-soft">{event.registered} påmeldt · {event.spots} plasser</p>
                </li>)}
              </ul> : <p className="mt-3 text-sm text-ink-soft">Ingen kommende arrangementer ennå.</p>}
              <Link href="/arrangementer" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">Se alle arrangementer →</Link>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
