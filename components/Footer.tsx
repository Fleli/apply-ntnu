import Link from "next/link";
import { Mail } from "lucide-react";
import Logo from "./Logo";

type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Hjem" },
  { href: "/arrangementer", label: "Arrangementer" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/bli-medlem", label: "Bli medlem" },
];

// TODO: Bytt ut med ekte e-post og sosiale medier.
const contact = [
  { href: "mailto:post@applyntnu.no", label: "post@applyntnu.no", icon: Mail },
  { href: "https://www.instagram.com/", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: LinkedinIcon },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            En studentorganisasjon ved NTNU som gjør jobbsøking sosialt. Vi
            møtes, skriver søknader og sender dem – sammen.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Sider</h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-ink-soft hover:text-brand hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Kontakt</h3>
          <ul className="mt-4 space-y-2.5">
            {contact.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-brand hover:underline"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Apply NTNU. Alle rettigheter forbeholdt.</p>
          <p>Studentorganisasjon ved NTNU, Trondheim</p>
        </div>
      </div>
    </footer>
  );
}
