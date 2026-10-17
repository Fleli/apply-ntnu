import {
  CalendarDays,
  CircleQuestionMark,
  Home,
  Lightbulb,
  ListChecks,
  MessageSquareQuote,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SitePage = {
  href: string;
  /** Kort tekst i navigasjonen */
  label: string;
  /** Lengre tittel brukt i kort og lenker */
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Undersidene i lesrekkefølge. Brukes av navbar, footer, forside og «neste side»-lenker. */
export const sitePages: SitePage[] = [
  {
    href: "/hvorfor",
    label: "Hvorfor",
    title: "Hvorfor Apply NTNU?",
    description:
      "Jobbsøking alene er kjedelig og vanskelig. Dette er problemet vi løser.",
    icon: Lightbulb,
  },
  {
    href: "/slik-fungerer-det",
    label: "Slik fungerer det",
    title: "Slik fungerer det",
    description:
      "Fra «jeg burde søke» til «søknad sendt» på én kveld – steg for steg.",
    icon: ListChecks,
  },
  {
    href: "/arrangementer",
    label: "Arrangementer",
    title: "Arrangementer",
    description: "Søknadskvelder og workshops dette semesteret. Meld deg på.",
    icon: CalendarDays,
  },
  {
    href: "/erfaringer",
    label: "Erfaringer",
    title: "Erfaringer",
    description: "Tall og historier fra studenter som har søkt sammen med oss.",
    icon: MessageSquareQuote,
  },
  {
    href: "/om-oss",
    label: "Om oss",
    title: "Om oss",
    description: "Hvem vi er, hva vi tror på og hvem som sitter i styret.",
    icon: Users,
  },
  {
    href: "/sporsmal",
    label: "Spørsmål",
    title: "Vanlige spørsmål",
    description: "Svar på det folk lurer mest på før de kommer første gang.",
    icon: CircleQuestionMark,
  },
];

export const homePage: SitePage = {
  href: "/",
  label: "Hjem",
  title: "Hjem",
  description: "Forsiden",
  icon: Home,
};

export const membershipPage: SitePage = {
  href: "/bli-medlem",
  label: "Bli medlem",
  title: "Bli medlem",
  description: "Gratis, uforpliktende og tar under ett minutt.",
  icon: UserPlus,
};

/** Alle sider i navigasjonen, med forsiden først. */
export const navPages: SitePage[] = [homePage, ...sitePages];

/** Siden som kommer etter `href` i lesrekkefølgen. Siste side peker til medlemskap. */
export function nextPage(href: string): SitePage {
  const i = sitePages.findIndex((p) => p.href === href);
  if (i === -1 || i === sitePages.length - 1) return membershipPage;
  return sitePages[i + 1];
}
