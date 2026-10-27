import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { formatDay, formatMonthShort, formatWeekdayShort } from "@/lib/dates";
import type { EventWithCount } from "@/lib/db/queries";

type Props = { event: EventWithCount; compact?: boolean };

export default function EventRow({ event, compact = false }: Props) {
  const left = Math.max(event.spots - event.registered, 0);
  const full = left === 0;
  return (
    <li id={event.slug} className="card grid scroll-mt-28 gap-5 p-5 sm:grid-cols-[84px_1fr_auto] sm:items-center sm:gap-7 sm:p-7">
      <div className="flex w-fit items-center gap-3 rounded-xl bg-brand-light px-4 py-3 text-brand sm:w-full sm:flex-col sm:gap-0.5 sm:px-2 sm:py-4">
        <p className="text-xs font-bold uppercase tracking-widest">{formatWeekdayShort(event.date)}</p>
        <p className="text-3xl font-extrabold leading-none tracking-tight sm:text-4xl">{formatDay(event.date)}</p>
        <p className="text-xs font-bold uppercase tracking-widest">{formatMonthShort(event.date)}</p>
      </div>
      <div className="min-w-0">
        <p className="eyebrow text-brand">{event.type}</p>
        <h3 className="mt-2 break-words text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">{compact ? <Link href={`/arrangementer#${event.slug}`} className="hover:text-brand">{event.title}</Link> : event.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
          <p className="flex items-center gap-1.5"><Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />{event.startTime}–{event.endTime}</p>
          <p className="flex min-w-0 items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="break-words">{event.location}</span></p>
        </div>
        {!compact && <p className="mt-4 max-w-2xl whitespace-pre-line break-words text-sm leading-relaxed text-ink-soft">{event.description}</p>}
        <p className="mt-3 text-xs font-medium text-ink-soft">{event.registered} påmeldt · {full ? <span className="text-ink">Fullt – venteliste</span> : `${left} plasser igjen`}</p>
      </div>
      <Link href={`/bli-medlem?arrangement=${event.slug}`} className="btn-outline gap-2 justify-self-start whitespace-nowrap px-4 py-3 text-sm">{full ? "Venteliste" : "Meld deg på"}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
    </li>
  );
}
