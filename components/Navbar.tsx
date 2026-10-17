"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Home, Menu, Users, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Hjem", icon: Home },
  { href: "/arrangementer", label: "Arrangementer", icon: CalendarDays },
  { href: "/om-oss", label: "Om oss", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <nav className="container-x flex h-[56px] items-center justify-between gap-4">
        <Logo />

        {/* Desktop-navigasjon: ikon over tekst, slik LinkedIn gjør det */}
        <ul className="hidden items-stretch md:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative flex h-[56px] min-w-[88px] flex-col items-center justify-center gap-0.5 px-3 text-xs transition-colors ${
                    active
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
                  <span className={active ? "font-semibold" : ""}>{label}</span>
                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ink" />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-3 flex items-center">
            <Link href="/bli-medlem" className="btn-primary px-4 py-2 text-sm">
              Bli medlem
            </Link>
          </li>
        </ul>

        {/* Mobil: hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobilmeny"
          aria-label={open ? "Lukk meny" : "Åpne meny"}
          className="btn-ghost -mr-2 px-2 py-2 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobilmeny" className="border-t border-line bg-surface md:hidden">
          <ul className="container-x flex flex-col py-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-3 text-base ${
                      active
                        ? "bg-brand-light font-semibold text-brand"
                        : "text-ink hover:bg-black/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
            <li className="px-3 pb-2 pt-3">
              <Link
                href="/bli-medlem"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                Bli medlem
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
