import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Action = { href: string; label: string };

type Props = {
  title: string;
  text: string;
  primary: Action;
  secondary?: Action;
};

export default function CtaCard({ title, text, primary, secondary }: Props) {
  return (
    <div className="card flex flex-col items-start gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold tracking-tight text-ink">{title}</h2>
        <p className="mt-3 text-lg text-ink-soft">{text}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={primary.href} className="btn-primary px-6 py-3">
          {primary.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {secondary && (
          <Link href={secondary.href} className="btn-outline px-6 py-3">
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}
