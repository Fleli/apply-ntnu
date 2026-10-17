import Link from "next/link";
import Logo from "./Logo";
import { getSettings } from "@/lib/db/queries";
import { membershipPage, sitePages } from "@/lib/pages";

const links = [...sitePages, membershipPage];

export default async function Footer() {
  const s = await getSettings();
  const contact = [
    s.contact_email && { href: `mailto:${s.contact_email}`, label: s.contact_email },
    s.instagram_url && { href: s.instagram_url, label: "Instagram" },
    s.linkedin_url && { href: s.linkedin_url, label: "LinkedIn" },
  ].filter((c): c is { href: string; label: string } => Boolean(c));

  return (
    <footer className="mt-auto border-t border-line">
      <div className="container-x py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Studentorganisasjon ved NTNU som gjør jobbsøking sosialt.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-ink-soft hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Apply NTNU · Trondheim</p>
          {contact.length > 0 && (
            <p className="flex flex-wrap gap-x-4">
              {contact.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="hover:text-ink"
                >
                  {label}
                </a>
              ))}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
