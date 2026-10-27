"use client";

import { useMemo, useState } from "react";
import EventRow from "./EventRow";
import type { EventWithCount } from "@/lib/db/queries";
import type { EventType } from "@/lib/db/schema";

type Filter = "Alle" | EventType;

export default function EventList({ events }: { events: EventWithCount[] }) {
  const [filter, setFilter] = useState<Filter>("Alle");

  const types = useMemo<Filter[]>(() => {
    const present = Array.from(new Set(events.map((e) => e.type)));
    return ["Alle", ...present];
  }, [events]);

  const visible =
    filter === "Alle" ? events : events.filter((e) => e.type === filter);

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrer arrangementer etter type"
        className="flex flex-wrap gap-2 text-sm"
      >
        {types.map((type) => {
          const active = type === filter;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              aria-pressed={active}
              className={`rounded-full border px-5 py-2.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                active
                  ? "border-brand-fill bg-brand-fill text-on-brand"
                  : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 space-y-4">
        {visible.map((event) => (
          <EventRow key={event.slug} event={event} />
        ))}
      </ul>
    </div>
  );
}
