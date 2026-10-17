export type EventType = "Søknadskveld" | "Workshop" | "Sosialt";

export type ApplyEvent = {
  slug: string;
  title: string;
  type: EventType;
  /** ISO-dato, f.eks. "2026-10-22" */
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  spots: number;
  registered: number;
  /** Bransjer/kategorier det søkes på denne kvelden */
  tags: string[];
};

// TODO: Dette er plassholderdata. Bytt ut med ekte arrangementer (eller koble til et CMS).
export const events: ApplyEvent[] = [
  {
    slug: "kickoff-sommerjobb-2027",
    title: "Søknadskveld: Kickoff for sommerjobb 2027",
    type: "Søknadskveld",
    date: "2026-10-22",
    startTime: "17:00",
    endTime: "20:00",
    location: "Realfagbygget R5, Gløshaugen",
    description:
      "Vi går gjennom hvilke bedrifter som har søknadsfrist i oktober og november, deler maler for CV og søknad, og setter oss ned og søker – sammen. Gratis pizza til alle påmeldte.",
    spots: 60,
    registered: 41,
    tags: ["Alle bransjer", "CV", "Søknadsbrev"],
  },
  {
    slug: "cv-og-soknadsworkshop",
    title: "Workshop: CV og søknadsbrev som faktisk blir lest",
    type: "Workshop",
    date: "2026-10-29",
    startTime: "16:15",
    endTime: "18:00",
    location: "Gamle elektro EL6, Gløshaugen",
    description:
      "Hva ser en rekrutterer etter på de første ti sekundene? Vi inviterer en gjest fra næringslivet, og du får konkrete tilbakemeldinger på din egen CV.",
    spots: 40,
    registered: 37,
    tags: ["CV", "Søknadsbrev", "Tilbakemelding"],
  },
  {
    slug: "konsulent-og-finans",
    title: "Søknadskveld: Konsulent og finans",
    type: "Søknadskveld",
    date: "2026-11-05",
    startTime: "17:00",
    endTime: "20:00",
    location: "Sentralbygg 2, S2, Gløshaugen",
    description:
      "Tidlige frister og mange søkere. Vi kartlegger hvilke selskaper som rekrutterer til sommerinternship, og hjelper hverandre med å skille seg ut.",
    spots: 50,
    registered: 22,
    tags: ["Konsulent", "Finans", "Case"],
  },
  {
    slug: "tech-og-utvikling",
    title: "Søknadskveld: Tech og utvikling",
    type: "Søknadskveld",
    date: "2026-11-12",
    startTime: "17:00",
    endTime: "20:00",
    location: "Realfagbygget R5, Gløshaugen",
    description:
      "For deg som vil ha sommerjobb som utvikler, data scientist eller innen IT-sikkerhet. Vi ser på GitHub-profiler, prosjekter og hvordan du beskriver det du har bygget.",
    spots: 60,
    registered: 18,
    tags: ["Utvikling", "Data", "Sikkerhet"],
  },
  {
    slug: "siste-frist-foer-jul",
    title: "Søknadskveld: Siste frist før jul",
    type: "Søknadskveld",
    date: "2026-11-26",
    startTime: "17:00",
    endTime: "20:30",
    location: "Realfagbygget R5, Gløshaugen",
    description:
      "Siste store søknadskveld i semesteret. Vi rydder opp i alt som ligger halvferdig, trykker send – og tar en pepperkake eller to.",
    spots: 60,
    registered: 9,
    tags: ["Alle bransjer", "Sosialt"],
  },
  {
    slug: "nyttaars-kickoff",
    title: "Søknadskveld: Nyttårs-kickoff",
    type: "Søknadskveld",
    date: "2027-01-14",
    startTime: "17:00",
    endTime: "20:00",
    location: "Sentralbygg 2, S2, Gløshaugen",
    description:
      "Nytt år, nye frister. Mange bedrifter åpner søknadsportalene i januar – vi starter semesteret med å få søknadene ut døra.",
    spots: 60,
    registered: 4,
    tags: ["Alle bransjer"],
  },
  {
    slug: "intervjutrening",
    title: "Workshop: Intervjutrening og case",
    type: "Workshop",
    date: "2027-01-28",
    startTime: "16:15",
    endTime: "18:30",
    location: "Gamle elektro EL6, Gløshaugen",
    description:
      "Søknadene er sendt – nå kommer intervjuene. Vi øver på de vanligste spørsmålene og løser et case i grupper.",
    spots: 40,
    registered: 2,
    tags: ["Intervju", "Case"],
  },
  {
    slug: "vaarens-store-soknadskveld",
    title: "Vårens store søknadskveld",
    type: "Søknadskveld",
    date: "2027-02-11",
    startTime: "17:00",
    endTime: "21:00",
    location: "Studentersamfundet, Klubben",
    description:
      "Vi flytter søknadskvelden til Samfundet. Lange bord, god stemning og mange frister som nærmer seg. Åpent for alle NTNU-studenter.",
    spots: 120,
    registered: 0,
    tags: ["Alle bransjer", "Sosialt"],
  },
];

export function sortedEvents(): ApplyEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export function upcomingEvents(limit?: number): ApplyEvent[] {
  const list = sortedEvents();
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export function getEvent(slug: string): ApplyEvent | undefined {
  return events.find((e) => e.slug === slug);
}

const nb = "nb-NO";

/** «torsdag 22. oktober 2026» */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat(nb, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
}

/** «22» */
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat(nb, { day: "numeric" }).format(
    new Date(`${iso}T12:00:00`),
  );
}

/** «okt» */
export function formatMonthShort(iso: string): string {
  return new Intl.DateTimeFormat(nb, { month: "short" })
    .format(new Date(`${iso}T12:00:00`))
    .replace(".", "");
}

/** «tor» */
export function formatWeekdayShort(iso: string): string {
  return new Intl.DateTimeFormat(nb, { weekday: "short" })
    .format(new Date(`${iso}T12:00:00`))
    .replace(".", "");
}
