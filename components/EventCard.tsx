import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import {
  type ApplyEvent,
  formatDay,
  formatMonthShort,
  formatWeekdayShort,
} from "@/lib/events";

type Props = {
  event: ApplyEvent;
  /** Kompakt variant brukes på forsiden */
  compact?: boolean;
};

const typeStyles: Record<ApplyEvent["type"], string> = {
  Søknadskveld: "bg-brand-light text-brand",
  Workshop: "bg-amber-50 text-amber-800",
  Sosialt: "bg-emerald-50 text-emerald-800",
};

export default function EventCard({ event, compact = false }: Props) {
  const left = Math.max(event.spots - event.registered, 0);
  const full = left === 0;
  const fillPct = Math.min(
    100,
    Math.round((event.registered / event.spots) * 100),
  );

  return (
    <article
      id={event.slug}
      className="card card-hover flex flex-col overflow-hidden scroll-mt-20"
    >
      <div className="flex gap-4 p-5">
        {/* Datoflis */}
        <div
          className="flex h-[68px] w-[60px] shrink-0 flex-col items-center justify-center rounded-lg bg-brand-light text-brand"
          aria-hidden="true"
        >
          <span className="text-[11px] font-semibold uppercase leading-none">
            {formatWeekdayShort(event.date)}
          </span>
          <span className="mt-0.5 text-2xl font-bold leading-none">
            {formatDay(event.date)}
          </span>
          <span className="mt-0.5 text-[11px] font-semibold uppercase leading-none">
            {formatMonthShort(event.date)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeStyles[event.type]}`}
          >
            {event.type}
          </span>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug text-ink">
            <Link
              href={`/arrangementer#${event.slug}`}
              className="hover:text-brand hover:underline"
            >
              {event.title}
            </Link>
          </h3>

          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {event.startTime}–{event.endTime}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.location}</span>
            </li>
          </ul>
        </div>
      </div>

      {!compact && (
        <p className="px-5 text-sm leading-relaxed text-ink-soft">
          {event.description}
        </p>
      )}

      {!compact && event.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 px-5 pt-3">
          {event.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-2.5 py-0.5 text-xs text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto px-5 pb-5 pt-4">
        {/* Påmeldingsstatus */}
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {event.registered} påmeldt
          </span>
          <span className={full ? "font-semibold text-red-700" : ""}>
            {full ? "Fullt – venteliste" : `${left} plasser igjen`}
          </span>
        </div>
        <div
          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5"
          role="progressbar"
          aria-valuenow={event.registered}
          aria-valuemin={0}
          aria-valuemax={event.spots}
          aria-label="Antall påmeldte"
        >
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/bli-medlem?arrangement=${event.slug}`}
            className={`${full ? "btn-outline" : "btn-primary"} px-4 py-2 text-sm`}
          >
            {full ? "Sett meg på venteliste" : "Meld deg på"}
          </Link>
          {compact && (
            <Link
              href={`/arrangementer#${event.slug}`}
              className="btn-ghost px-3 py-2 text-sm"
            >
              Les mer
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
