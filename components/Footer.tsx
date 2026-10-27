import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { getSettings } from "@/lib/db/queries";
import { membershipPage, sitePages } from "@/lib/pages";

const links = [...sitePages, membershipPage];

export default async function Footer() {
  const settings = await getSettings();
  const contact = [
    settings.contact_email && { href: `mailto:${settings.contact_email}`, label: settings.contact_email },
    settings.instagram_url && { href: settings.instagram_url, label: "Instagram" },
    settings.linkedin_url && { href: settings.linkedin_url, label: "LinkedIn" },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="mt-auto bg-brand-deep text-white">
      <div className="container-x pt-14 pb-7 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Logo size="lg" tone="dark" />
            <p className="heading-display mt-7 max-w-sm text-3xl sm:text-4xl">Søk sammen.<br />Kom videre.</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-lavender/80">Et studentfellesskap ved NTNU som gjør jobbsøking litt enklere. Og mye mer sosialt.</p>
          </div>
          <div className="grid gap-9 sm:grid-cols-2">
            <div>
              <h2 className="eyebrow text-lilac">Utforsk</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {links.map(({ href, label }) => (
                  <li key={href}><Link href={href} className="font-semibold text-lavender hover:text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilac">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-lilac">Bli med</h2>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-lavender/80">Alle studieprogram. Ingen kontingent. Bare møt opp som du er.</p>
              <Link href="/bli-medlem" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilac">Bli medlem <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              {contact.length > 0 && <ul className="mt-8 space-y-3 text-sm">
                {contact.map(({ href, label }) => <li key={href}>
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="break-words font-semibold text-lavender hover:text-white hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lilac">{label}</a>
                </li>)}
              </ul>}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-lavender/70 lg:mt-16">
          <p>© {new Date().getFullYear()} Apply NTNU</p>
          <p>For studenter, av studenter · Trondheim</p>
        </div>
      </div>
    </footer>
  );
}
