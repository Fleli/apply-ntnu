"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { logOut } from "@/app/account-actions";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { membershipPage, navPages } from "@/lib/pages";

type Props = { account?: { name: string; image: string | null; isAdmin: boolean } | null };
const primaryPages = navPages.filter(({ href }) => ["/slik-fungerer-det", "/arrangementer", "/om-oss", "/sporsmal"].includes(href));

function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`btn-ghost text-sm disabled:opacity-60 ${mobile ? "w-full justify-start px-4 py-3" : "px-3"}`}>{pending ? "Logger ut …" : "Logg ut"}</button>;
}

export default function Navbar({ account }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const initials = account?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatar = account?.image
    ? <img src={account.image} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
    : initials ? <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-light text-[10px] font-bold text-brand">{initials}</span> : <UserRound className="h-5 w-5" aria-hidden="true" />;

  async function mobileLogout() {
    setOpen(false);
    await logOut();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface"
      onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); } }}>
      <a href="#main-content" className="sr-only rounded-full bg-brand-fill px-5 py-3 font-bold text-on-brand focus:not-sr-only focus:absolute focus:left-5 focus:top-4 focus:z-50">Hopp til innhold</a>
      <nav aria-label="Hovedmeny" className="container-x flex h-20 items-center gap-4">
        <div onClick={() => setOpen(false)}><Logo /></div>
        <ul className="ml-auto hidden items-center gap-1 xl:flex">
          {primaryPages.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} aria-current={isActive(href) ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${isActive(href) ? "bg-brand-light text-brand" : "text-ink-soft hover:bg-hover hover:text-ink"}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-1 border-l border-line pl-3 xl:flex">
          {account ? <>
            {account.isAdmin && <Link href="/admin" aria-current={isActive("/admin") ? "page" : undefined} className={`btn-ghost gap-1.5 px-3 text-sm ${isActive("/admin") ? "bg-brand-light text-brand" : ""}`}><ShieldCheck className="h-4 w-4" aria-hidden="true" />Admin</Link>}
            <Link href="/min-side" aria-current={isActive("/min-side") ? "page" : undefined} className={`btn-ghost gap-1.5 px-3 text-sm whitespace-nowrap ${isActive("/min-side") ? "bg-brand-light text-brand" : ""}`}>{avatar}Min side</Link>
            <form action={logOut}><LogoutButton /></form>
          </> : <>
            <Link href="/logg-inn" aria-current={isActive("/logg-inn") ? "page" : undefined} className="btn-ghost px-3 text-sm whitespace-nowrap">Logg inn</Link>
            <Link href={membershipPage.href} className="btn-primary px-5 text-sm whitespace-nowrap">{membershipPage.label}</Link>
          </>}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0">
          <ThemeToggle />
          <button ref={menuButton} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobilmeny" aria-label={open ? "Lukk meny" : "Åpne meny"} className="btn-ghost -mr-2 h-11 w-11 p-0 xl:hidden">
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>
      {open && <nav id="mobilmeny" aria-label="Mobilmeny" className="border-t border-line bg-surface xl:hidden">
        <ul className="container-x flex max-h-[calc(100dvh-80px)] flex-col overflow-y-auto py-4">
          {navPages.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} aria-current={isActive(href) ? "page" : undefined}
                className={`flex rounded-xl px-4 py-3 text-base font-bold ${isActive(href) ? "bg-brand-light text-brand" : "text-ink hover:bg-hover"}`}>
                {label}
              </Link>
            </li>
          ))}
          {account ? <>
            {account.isAdmin && <li className="mt-3 border-t border-line pt-3"><Link href="/admin" onClick={() => setOpen(false)} aria-current={isActive("/admin") ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold ${isActive("/admin") ? "bg-brand-light text-brand" : "text-ink hover:bg-hover"}`}><ShieldCheck className="h-5 w-5" aria-hidden="true" />Admin</Link></li>}
            <li className={account.isAdmin ? "" : "mt-3 border-t border-line pt-3"}><Link href="/min-side" onClick={() => setOpen(false)} aria-current={isActive("/min-side") ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 font-bold ${isActive("/min-side") ? "bg-brand-light text-brand" : "text-ink hover:bg-hover"}`}>{avatar}Min side</Link></li>
            <li><form action={mobileLogout}><LogoutButton mobile /></form></li>
          </> : <>
            <li className="mt-3 border-t border-line pt-3"><Link href="/logg-inn" onClick={() => setOpen(false)} className="flex rounded-xl px-4 py-3 font-bold text-ink hover:bg-hover">Logg inn</Link></li>
            <li className="px-4 pb-2 pt-3"><Link href={membershipPage.href} onClick={() => setOpen(false)} className="btn-primary w-full">{membershipPage.label}</Link></li>
          </>}
        </ul>
      </nav>}
    </header>
  );
}
