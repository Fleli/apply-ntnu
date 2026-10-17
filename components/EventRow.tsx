import Link from "next/link";
import { formatDay, formatMonthShort, formatWeekdayShort } from "@/lib/dates";
import type { EventWithCount } from "@/lib/db/queries";

type Props = {
  event: EventWithCount;
  /** Uten beskrivelse, brukes på forsiden */
  compact?: boolean;
};

export default function EventRow({ event, compact = false }: Props) {
  const left = Math.max(event.spots - event.registered, 0);
  const full = left === 0;

  return (
    <li
      id={event.slug}
      className="grid gap-4 border-t border-line py-6 scroll-mt-20 first:border-t-0 sm:grid-cols-[72px_1fr_auto] sm:gap-6"
    >
      <div className="flex items-baseline gap-2 sm:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {formatWeekdayShort(event.date)}
        </p>
        <p className="text-3xl font-bold leading-none text-ink">
          {formatDay(event.date)}
        </p>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft sm:mt-1">
          {formatMonthShort(event.date)}
        </p>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug text-ink">
          {compact ? (
            <Link href={`/arrangementer#${event.slug}`} className="hover:text-brand">
              {event.title}
            </Link>
          ) : (
            event.title
          )}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {event.type} · {event.startTime}–{event.endTime} · {event.location}
        </p>
        {!compact && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {event.description}
          </p>
        )}
        <p className="mt-3 text-xs text-ink-soft">
          {event.registered} påmeldt ·{" "}
          {full ? (
            <span className="font-semibold text-ink">Fullt – venteliste</span>
          ) : (
            `${left} plasser igjen`
          )}
        </p>
      </div>

      <div className="sm:pt-1">
        <Link
          href={`/bli-medlem?arrangement=${event.slug}`}
          className="btn-outline px-4 py-2 text-sm"
        >
          {full ? "Venteliste" : "Meld deg på"}
        </Link>
      </div>
    </li>
  );
}
