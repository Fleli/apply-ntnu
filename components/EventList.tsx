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
        className="flex gap-6 border-b border-line text-sm"
      >
        {types.map((type) => {
          const active = type === filter;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              aria-pressed={active}
              className={`-mb-px border-b-2 pb-3 font-semibold transition-colors ${
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <ul className="mt-2">
        {visible.map((event) => (
          <EventRow key={event.slug} event={event} />
        ))}
      </ul>
    </div>
  );
}
