# Apply NTNU

Nettside for Apply NTNU – en studentorganisasjon ved NTNU som arrangerer
søknadskvelder der studenter søker på internships og sommerjobber sammen.

## Kom i gang

```bash
npm install
npm run dev
```

Siden kjører på [http://localhost:3000](http://localhost:3000).

## Teknologi

- [Next.js](https://nextjs.org) (App Router) og React
- [Tailwind CSS v4](https://tailwindcss.com) – designtokens ligger i `app/globals.css`
- [lucide-react](https://lucide.dev) for ikoner

## Struktur

| Sti | Innhold |
| --- | --- |
| `app/page.tsx` | Forside |
| `app/arrangementer/` | Oversikt over arrangementer med filter |
| `app/om-oss/` | Om organisasjonen, styret og FAQ |
| `app/bli-medlem/` | Medlemsregistrering |
| `components/` | Navbar, footer, arrangementskort, skjema |
| `lib/events.ts` | Arrangementsdata (plassholdere) og datoformatering |

## Gjenstår

- Ekte arrangementsdata (eventuelt fra et CMS)
- Kobling av medlemsskjemaet til en backend
- Ekte tall, sitater, styremedlemmer og kontaktinfo
