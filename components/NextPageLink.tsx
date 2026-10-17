import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { nextPage } from "@/lib/pages";

/** «Les videre»-lenke nederst på hver underside. */
export default function NextPageLink({ current }: { current: string }) {
  const page = nextPage(current);
  const Icon = page.icon;

  return (
    <div className="container-x pb-20">
      <Link
        href={page.href}
        className="card card-hover group flex items-center gap-4 p-5 sm:p-6"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Les videre
          </span>
          <span className="block text-lg font-semibold text-ink group-hover:text-brand">
            {page.title}
          </span>
          <span className="block truncate text-sm text-ink-soft">
            {page.description}
          </span>
        </span>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-brand transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
