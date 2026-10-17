"use client";

import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import type { ApplyEvent, EventType } from "@/lib/events";

type Filter = "Alle" | EventType;

export default function EventList({ events }: { events: ApplyEvent[] }) {
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
        className="flex flex-wrap gap-2"
      >
        {types.map((type) => {
          const active = type === filter;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-surface text-ink-soft hover:border-ink-soft hover:text-ink"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {visible.length === 1
          ? "1 arrangement"
          : `${visible.length} arrangementer`}
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {visible.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
}
