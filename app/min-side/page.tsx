import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";
import PasswordForm from "@/components/PasswordForm";
import { getAccount, listAccountRegistrations } from "@/lib/account";
import { listEvents } from "@/lib/db/queries";
import { formatLongDate } from "@/lib/dates";
import { registerForEvent, logOut } from "@/app/account-actions";

export const metadata: Metadata = { title: "Min side", robots: { index: false, follow: false } };

const notices: Record<string, string> = {
  created: "Kontoen din er opprettet. Velkommen til Apply NTNU!",
  "password-changed": "Passordet er endret. Andre innlogginger er logget ut.",
  "created-avatar-error": "Kontoen din er opprettet, men profilbildet kunne ikke lagres. Du kan laste det opp på nytt her.",
  "created-event-error": "Kontoen din er opprettet, men påmeldingen til arrangementet kunne ikke fullføres. Prøv påmeldingen på nytt nedenfor.",
  "created-avatar-event-error": "Kontoen din er opprettet. Profilbildet og påmeldingen kunne ikke lagres. Du kan prøve begge deler på nytt her.",
  registered: "Du er påmeldt arrangementet. Påmeldingen vises nedenfor.",
  waitlisted: "Du er satt på ventelisten. Påmeldingen vises nedenfor.",
  "event-error": "Påmeldingen kunne ikke fullføres. Arrangementet kan være avsluttet eller utilgjengelig. Prøv igjen eller velg et annet arrangement.",
};

type Props = { searchParams: Promise<{ arrangement?: string; status?: string }> };

export default async function AccountPage({ searchParams }: Props) {
  const { arrangement, status } = await searchParams;
  const requestHeaders = new Headers(await headers());
  const account = await getAccount(requestHeaders);
  if (!account) {
    const event = arrangement ? (await listEvents()).find(({ slug }) => slug === arrangement) : undefined;
    redirect(`/logg-inn${event ? `?arrangement=${encodeURIComponent(event.slug)}` : ""}`);
  }
  const [registrations, upcoming] = await Promise.all([listAccountRegistrations(requestHeaders), listEvents()]);
  const chosen = upcoming.find(({ slug }) => slug === arrangement);
  const notice = status ? notices[status] : undefined;

  return (
    <main id="main-content" className="flex-1">
      <PageHeader title="Min side" lead={`Hei, ${account.name}. Her finner du profilen din og arrangementene dine.`} />
      <div className="container-x space-y-12 py-14 lg:py-20">
        {notice && <p role="status" className="card bg-surface p-5 text-ink">{notice}</p>}
        {chosen && (
          <section className="card bg-surface p-6 sm:p-8" aria-labelledby="event-confirmation">
            <h2 id="event-confirmation" className="text-2xl font-bold text-ink">Bli med på {chosen.title}</h2>
            <p className="mt-3 text-ink-soft">{formatLongDate(chosen.date)} kl. {chosen.startTime} · {chosen.location}</p>
            <p className="mt-2 text-sm text-ink-soft">{chosen.registered >= chosen.spots ? "Arrangementet er fullt. Du kan sette deg på venteliste." : `${Math.max(0, chosen.spots - chosen.registered)} ledige plasser.`} Påmeldingen knyttes til kontoen din.</p>
            <form action={registerForEvent} className="mt-6">
              <input type="hidden" name="eventSlug" value={chosen.slug} />
              <button type="submit" className="btn-primary px-6 py-3">{chosen.registered >= chosen.spots ? "Bekreft venteliste" : "Bekreft påmelding"}</button>
            </form>
          </section>
        )}
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <section aria-label="Profilen din">
            <ProfileForm account={{ name: account.name, email: account.email, phone: account.phone, image: account.image }} />
          </section>
          <div className="space-y-10">
            <section aria-labelledby="registrations-heading">
              <h2 id="registrations-heading" className="text-2xl font-bold text-ink">Dine arrangementer</h2>
              {registrations.length ? (
                <ul className="mt-4 divide-y divide-line">
                  {registrations.map((registration) => (
                    <li key={registration.id} className="py-4">
                      <div className="flex items-start justify-between gap-4"><h3 className="font-semibold text-ink">{registration.title}</h3><span className="shrink-0 rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-ink">{registration.status === "venteliste" ? "Venteliste" : "Påmeldt"}</span></div>
                      <p className="mt-2 text-sm text-ink-soft">{formatLongDate(registration.date)} kl. {registration.startTime}</p>
                      <p className="mt-1 text-sm text-ink-soft">{registration.location}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-ink-soft">Du har ingen påmeldinger ennå.</p>}
              <Link href="/arrangementer" className="mt-5 inline-block font-semibold text-ink underline underline-offset-4">Se kommende arrangementer</Link>
            </section>
            <section aria-label="Endre passord">
              <PasswordForm />
            </section>
            <form action={logOut}><button type="submit" className="font-semibold text-ink underline underline-offset-4">Logg ut</button></form>
          </div>
        </div>
      </div>
    </main>
  );
}
