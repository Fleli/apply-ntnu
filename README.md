# Apply NTNU

Nettside for Apply NTNU – en studentorganisasjon ved NTNU som arrangerer
søknadskvelder der studenter søker på internships og sommerjobber sammen.

## Kom i gang

```bash
npm install
npm run dev
```

Terminalen viser hvilken port siden kjører på (vanligvis `http://localhost:3000`).
Databasen opprettes automatisk første gang siden lastes.

## Innhold og database

Alt innhold som endrer seg – arrangementer, styret, sitater, kontaktinfo og
medlemmer – ligger i en SQLite-database, ikke i koden. Lokalt er den filen
`data/apply.db` (ignorert av git).

**Legg inn innhold** med Drizzle Studio, et nettbasert redigeringsverktøy:

```bash
npm run db:studio
```

| Tabell | Hva | Vises hvor |
| --- | --- | --- |
| `events` | Arrangementer. `published` må være på, og `date` må være i dag eller senere for å vises. | Forsiden, `/arrangementer`, skjemaet på `/bli-medlem` |
| `board_members` | Styret. `active` styrer visning, `sort_order` rekkefølgen. | `/om-oss` |
| `testimonials` | Sitater. Vises kun når `approved` er på. | `/erfaringer` |
| `settings` | Nøkkel/verdi. Nøkler: `contact_email`, `instagram_url`, `linkedin_url`, `applications_sent`. | Footer, kontaktlenker, tallene på `/erfaringer` |
| `members` | Fylles av skjemaet på `/bli-medlem`. | – |
| `registrations` | Påmeldinger til arrangementer, med status `påmeldt` eller `venteliste`. | Antall påmeldte per arrangement |

Tallene på `/erfaringer` regnes ut fra databasen (medlemmer, arrangementer,
påmeldinger). Felt som er tomme eller null vises ikke.

**Hosting:** Sett `DATABASE_URL` til en [Turso](https://turso.tech)-database
(`libsql://…`) og `DATABASE_AUTH_TOKEN`, så fungerer alt likt. Se `.env.example`.

**Endre skjemaet** i `lib/db/schema.ts`, kjør `npm run db:generate` for å lage
en migrasjon i `drizzle/`, og commit den. Migrasjoner kjøres automatisk ved
oppstart.

## Teknologi

- [Next.js](https://nextjs.org) (App Router) og React
- [Tailwind CSS v4](https://tailwindcss.com) – designtokens i `app/globals.css`
- [Drizzle ORM](https://orm.drizzle.team) og [libsql](https://github.com/tursodatabase/libsql) (SQLite)

## Struktur

| Sti | Innhold |
| --- | --- |
| `app/` | Én mappe per side: `hvorfor`, `slik-fungerer-det`, `arrangementer`, `erfaringer`, `om-oss`, `sporsmal`, `bli-medlem` |
| `app/bli-medlem/actions.ts` | Server action som validerer og lagrer medlemskap og påmelding |
| `components/` | Navbar, footer, sidetopp, arrangementsrad, skjema |
| `lib/db/` | Databaseskjema, tilkobling og spørringer |
| `lib/pages.ts` | Liste over sidene, brukt av navigasjon og footer |
| `drizzle/` | SQL-migrasjoner |

## Gjenstår

- E-postbekreftelse til nye medlemmer og ved ledig plass fra ventelisten
- Et enkelt adminpanel, hvis styret ikke vil bruke Drizzle Studio
