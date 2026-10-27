"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Menu, UserRound, X } from "lucide-react";
import { logOut } from "@/app/account-actions";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { membershipPage, navPages } from "@/lib/pages";

type Props = { account?: { name: string; image: string | null } | null };

function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`btn-ghost text-sm disabled:opacity-60 ${mobile ? "w-full justify-start px-3 py-3" : "px-2.5 py-2"}`}>{pending ? "Logger ut …" : "Logg ut"}</button>;
}

export default function Navbar({ account }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const initials = account?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const avatar = account?.image
    ? <img src={account.image} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
    : initials ? <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-light text-[10px] font-semibold text-brand">{initials}</span> : <UserRound className="h-5 w-5" aria-hidden="true" />;

  async function mobileLogout() {
    setOpen(false);
    await logOut();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface">
      <nav aria-label="Hovedmeny" className="container-x flex h-[56px] max-w-6xl items-center justify-between gap-3">
        <Logo />
        <ul className="ml-auto hidden items-stretch xl:flex">
          {navPages.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined}
                className={`relative flex h-[56px] min-w-[60px] flex-col items-center justify-center gap-0.5 px-2 text-xs whitespace-nowrap transition-colors ${active ? "text-ink" : "text-ink-soft hover:text-ink"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={active ? 2.25 : 2} />
                <span className={active ? "font-semibold" : ""}>{label}</span>
                {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-ink" />}
              </Link>
            </li>;
          })}
          {account ? <>
            <li className="ml-2 flex items-center">
              <Link href="/min-side" aria-current={isActive("/min-side") ? "page" : undefined} className="btn-ghost gap-1.5 px-2.5 py-2 text-sm whitespace-nowrap">{avatar}Min side</Link>
            </li>
            <li className="flex items-center"><form action={logOut}><LogoutButton /></form></li>
          </> : <>
            <li className="ml-2 flex items-center"><Link href="/logg-inn" aria-current={isActive("/logg-inn") ? "page" : undefined} className="btn-ghost px-2.5 py-2 text-sm whitespace-nowrap">Logg inn</Link></li>
            <li className="ml-1 flex items-center"><Link href={membershipPage.href} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">{membershipPage.label}</Link></li>
          </>}
        </ul>
        <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0">
          <ThemeToggle />
          <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobilmeny" aria-label={open ? "Lukk meny" : "Åpne meny"} className="btn-ghost -mr-2 px-2 py-2 xl:hidden">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {open && <div id="mobilmeny" className="border-t border-line bg-surface xl:hidden">
        <ul className="container-x flex max-h-[calc(100dvh-56px)] flex-col overflow-y-auto py-2">
          {navPages.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-base ${active ? "bg-brand-light font-semibold text-brand" : "text-ink hover:bg-hover"}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />{label}
              </Link>
            </li>;
          })}
          {account ? <>
            <li className="mt-2 border-t border-line pt-2"><Link href="/min-side" onClick={() => setOpen(false)} aria-current={isActive("/min-side") ? "page" : undefined} className={`flex items-center gap-3 rounded-md px-3 py-3 ${isActive("/min-side") ? "bg-brand-light font-semibold text-brand" : "text-ink hover:bg-hover"}`}>{avatar}Min side</Link></li>
            <li><form action={mobileLogout}><LogoutButton mobile /></form></li>
          </> : <>
            <li className="mt-2 border-t border-line pt-2"><Link href="/logg-inn" onClick={() => setOpen(false)} className="flex rounded-md px-3 py-3 text-ink hover:bg-hover">Logg inn</Link></li>
            <li className="px-3 pb-2 pt-2"><Link href={membershipPage.href} onClick={() => setOpen(false)} className="btn-primary w-full">{membershipPage.label}</Link></li>
          </>}
        </ul>
      </div>}
    </header>
  );
}
