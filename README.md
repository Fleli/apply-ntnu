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
| `members` | Medlemskap knyttet til nye brukerkontoer; eksisterende medlemmer beholdes. | Privat profil og statistikk |
| `auth_user`, `auth_account`, `auth_session` | Better Auth-kontoer, passordhasher og innlogginger. | Innlogging og Min side |
| `profile_images` | Små behandlede profilbilder, bare tilgjengelig for eieren. | Min side og egen navigasjon |
| `admin_users` | Administratortilgang og hvem som ga tilgangen. | Privat adminpanel |
| `registrations` | Påmeldinger til arrangementer, med status `påmeldt` eller `venteliste`. | Antall påmeldte per arrangement |

Tallene på `/erfaringer` regnes ut fra databasen (medlemmer, arrangementer,
påmeldinger). Felt som er tomme eller null vises ikke.

**Hosting:** Sett `DATABASE_URL` til en [Turso](https://turso.tech)-database
(`libsql://…`) og `DATABASE_AUTH_TOKEN`, så fungerer alt likt. Se `.env.example`.

**Endre skjemaet** i `lib/db/schema.ts`, kjør `npm run db:generate` for å lage
en migrasjon i `drizzle/`, og commit den. Migrasjoner kjøres automatisk ved
oppstart.

## Medlemskontoer

`/bli-medlem` oppretter konto med navn, e-post og passord (12–128 tegn).
Telefon og bilde er valgfrie. `/logg-inn` gir tilgang til `/min-side`, der
medlemmet kan endre navn, telefon, bilde og passord, samt se påmeldinger.
Et valgt arrangement følger med gjennom registrering og innlogging. Allerede
innloggede medlemmer bekrefter påmelding fra kontoen sin.

Sett `BETTER_AUTH_URL` til nettstedets offentlige origin (f.eks.
`https://apply.example`) og `BETTER_AUTH_SECRET` til en stabil, tilfeldig
hemmelighet på minst 32 tegn. Hemmeligheten er påkrevd utenfor lokal
utvikling. Se `.env.example`; ekte hemmeligheter skal ikke inn i git.
Better Auth lagrer sesjoner i databasen og bruker HttpOnly-cookies.
Passordendring krever gjeldende passord og avslutter andre innlogginger.
Innlogging og konto-oppretting har databasebaserte forsøksgrenser.

Profilbilder må være JPEG, PNG eller WebP, maksimalt 2 MiB og 16 megapiksler.
Serveren dekoder filen, fjerner metadata og lagrer en 256×256 WebP i databasen.
Bilder hentes fra et privat endepunkt for innlogget eier med `no-store`.
Opplastinger krever ingen lokal mappe eller ekstern bildelagring.

Eksisterende medlemmer og påmeldinger bevares med opprinnelige ID-er. En e-post
som allerede finnes i medlemsregisteret kan ikke overtas ved å registrere en
ny konto. Disse medlemmene får beskjed om å kontakte organisasjonen. En trygg
flyt for å koble eldre medlemskap til en konto krever e-postbekreftelse og er
ikke implementert her.

Det sendes ingen e-post i denne løsningen. E-postbekreftelse, glemt passord,
endring av e-post og ventelistevarsler krever en egen e-postintegrasjon.
E-postadressen vises derfor som skrivebeskyttet på Min side. Hvis en valgfri
bildeopplasting eller arrangementspåmelding feiler etter konto-oppretting,
beholdes kontoen og medlemmet får en tydelig melding med mulighet for å prøve
igjen fra Min side.

## Administratorer

Administratorer får en **Admin**-lenke i menyen og tilgang til `/admin`.
Her kan de publisere nye arrangementer og finne en registrert konto med
e-postadressen for å gi administratortilgang. Et nytt arrangement blir straks
synlig på nettsiden og åpent for påmelding. Dato og klokkeslett gjelder norsk
tid, og arrangementet må starte og slutte samme dag.

Opprett den første administratoren fra terminalen etter at personen har
registrert kontoen sin:

```bash
npm run admin:bootstrap -- frederik@egelund.no
```

Kommandoen bruker prosjektets vanlige miljøfiler og `DATABASE_URL` (lokalt
`data/apply.db`). Kontroller at dette er databasen som nettstedet bruker.
Den nekter å fortsette hvis kontoen mangler eller det allerede finnes en
administrator. Senere administratorer legges til fra panelet. Kontoer får
aldri administratortilgang automatisk ved registrering.

Alle adminhandlinger sjekker en gyldig innlogging og gjeldende tilgang i
databasen. Adminpanelet viser bare navn, e-post og tilgangsstatus for den
oppsøkte kontoen. Siden e-postbekreftelse ennå ikke er satt opp, må den som
gir tilgang kontrollere at kontoen tilhører riktig person.

Redigering/sletting av arrangementer og fjerning av administratortilgang
inngår ikke i panelet ennå.

## Kontroller

```bash
npm test
npx tsc --noEmit
```

Testene bruker egne midlertidige databaser. Ved manuell utvikling eller bygg
med testdata må `DATABASE_URL` peke på en disponibel database; ikke bruk
produksjonsdatabasen til testing. Migrasjoner kjøres automatisk ved åpning
av den valgte databasen.

## Teknologi

- [Next.js](https://nextjs.org) (App Router) og React
- [Tailwind CSS v4](https://tailwindcss.com) – designtokens i `app/globals.css`
- [Drizzle ORM](https://orm.drizzle.team) og [libsql](https://github.com/tursodatabase/libsql) (SQLite)

## Struktur

| Sti | Innhold |
| --- | --- |
| `app/` | Én mappe per side: `hvorfor`, `slik-fungerer-det`, `arrangementer`, `erfaringer`, `om-oss`, `sporsmal`, `bli-medlem` |
| `app/account-actions.ts` | Innlogging, registrering, privat profil, passord og autentisert påmelding |
| `app/admin/`, `lib/admin.ts` | Beskyttet adminpanel, opprettelse av arrangementer og administratortilgang |
| `scripts/bootstrap-admin.ts` | Operatørkommando for første administrator |
| `app/api/profile/avatar/route.ts` | Privat bildeendepunkt som henter kun innlogget brukers bilde |
| `components/` | Navbar, footer, sidetopp, arrangementsrad, skjema |
| `lib/db/` | Databaseskjema, tilkobling og spørringer |
| `lib/pages.ts` | Liste over sidene, brukt av navigasjon og footer |
| `drizzle/` | SQL-migrasjoner |

## Gjenstår

- E-postintegrasjon for bekreftelse, passordgjenoppretting, kobling av eldre medlemskap og ledig plass fra ventelisten
