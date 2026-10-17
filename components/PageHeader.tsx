import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Valgfritt innhold til høyre for tittelen på store skjermer */
  aside?: ReactNode;
};

/** Hvit toppseksjon som alle undersider deler. */
export default function PageHeader({ eyebrow, title, lead, aside }: Props) {
  return (
    <section className="border-b border-line bg-surface">
      <div
        className={`container-x py-12 lg:py-16 ${
          aside ? "grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center" : ""
        }`}
      >
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {lead}
            </p>
          )}
        </div>
        {aside}
      </div>
    </section>
  );
}
