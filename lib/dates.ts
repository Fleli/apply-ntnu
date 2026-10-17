const nb = "nb-NO";
const at = (iso: string) => new Date(`${iso}T12:00:00`);

/** «Torsdag 22. oktober 2026» – kun første bokstav stor, slik norsk skrives */
export function formatLongDate(iso: string): string {
  const s = new Intl.DateTimeFormat(nb, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(at(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** «22» (nb-NO gir «22.», vi fjerner punktumet) */
export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat(nb, { day: "numeric" })
    .format(at(iso))
    .replace(".", "");
}

/** «okt» */
export function formatMonthShort(iso: string): string {
  return new Intl.DateTimeFormat(nb, { month: "short" })
    .format(at(iso))
    .replace(".", "");
}

/** «tor» */
export function formatWeekdayShort(iso: string): string {
  return new Intl.DateTimeFormat(nb, { weekday: "short" })
    .format(at(iso))
    .replace(".", "");
}

/** Dagens dato i Norge som YYYY-MM-DD */
export function todayInOslo(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
