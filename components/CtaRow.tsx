import Link from "next/link";

type Props = {
  title: string;
  text: string;
  href: string;
  label: string;
};

/** Én oppfordring nederst på siden. Ingen boks, bare en linje og en knapp. */
export default function CtaRow({ title, text, href, label }: Props) {
  return (
    <section className="border-t border-line">
      <div className="container-x flex flex-col gap-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
          <p className="mt-1 text-ink-soft">{text}</p>
        </div>
        <Link href={href} className="btn-primary shrink-0 px-6 py-3">
          {label}
        </Link>
      </div>
    </section>
  );
}
