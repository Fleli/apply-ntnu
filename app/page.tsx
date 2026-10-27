import Link from "next/link";
import { ArrowUpRight, Check, CalendarDays } from "lucide-react";
import BrandCircles from "@/components/BrandCircles";
import CtaRow from "@/components/CtaRow";
import EventRow from "@/components/EventRow";
import { listEvents } from "@/lib/db/queries";

const benefits = [
  { title: "Et sted å begynne.", text: "Vi finner aktuelle bedrifter og frister sammen. Du trenger ikke ha en plan før du kommer." },
  { title: "Noen å spørre.", text: "Få et nytt blikk på CV-en, del erfaringer og hjelp hverandre med søknadene." },
  { title: "En grunn til å trykke send.", text: "Et fast tidspunkt, folk rundt bordet og litt pizza. Plutselig er søknaden sendt." },
];

export default async function Home() {
  const events = await listEvents({ limit: 3 });
  return (
    <main id="main-content" className="flex-1">
      <section className="overflow-hidden bg-brand-light">
        <div className="container-x grid items-center gap-10 pb-12 pt-14 sm:pt-16 lg:grid-cols-[1.65fr_1fr] lg:gap-4 lg:pb-14 lg:pt-16">
          <div className="relative z-10">
            <p className="eyebrow flex items-center gap-2.5 text-brand"><span className="h-2 w-2 rounded-full bg-brand" />Et studentfellesskap ved NTNU</p>
            <h1 className="heading-display mt-7 text-[clamp(2.3rem,10.5vw,4.5rem)] leading-[0.96] text-ink lg:text-[clamp(4.2rem,6.1vw,5.5rem)]">
              <span className="whitespace-nowrap">Søk internship</span><br /><span className="text-brand">sammen,</span><br />ikke alene.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink-soft sm:text-xl">Søknadskvelder, CV-hjelp og et fellesskap for NTNU-studenter. Kom som du er. Vi søker sammen.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/bli-medlem" className="btn-primary gap-3 px-6 py-4">Bli med – det er gratis <ArrowUpRight className="h-5 w-5" aria-hidden="true" /></Link>
              <Link href="/arrangementer" className="btn-ghost gap-2 px-3 py-4 text-ink">Finn en søknadskveld <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="relative hidden self-center lg:block">
            <BrandCircles className="w-full -rotate-12" />
            <div className="mx-auto mt-8 max-w-[16rem] text-center">
              <p className="heading-display text-3xl leading-tight text-ink">Flere hoder.<br />Flere muligheter.</p>
              <p className="mt-3 text-sm text-ink-soft">Det er hele ideen bak Apply.</p>
            </div>
          </div>
        </div>
        <div className="container-x">
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-brand/15 py-6 text-sm font-medium text-ink-soft">
            {["Gratis medlemskap", "Alle studieprogram", "Kom som du er"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand" aria-hidden="true" />{item}</p>)}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="eyebrow text-brand">Hvorfor Apply?</p>
          <h2 className="heading-display mt-5 max-w-md text-4xl leading-[1.04] text-ink sm:text-5xl">Jobbsøking er bedre<br />med selskap.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">Du skal ikke måtte finne ut av alt på egen hånd. Vi samler NTNU-studenter rundt samme bord, så vi kan komme videre sammen.</p>
          <Link href="/hvorfor" className="link mt-7 inline-flex items-center gap-2">Bli kjent med ideen <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <ol className="divide-y divide-line border-t border-line">
          {benefits.map(({ title, text }, index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-5 py-6 sm:gap-7">
            <span className="pt-1 text-sm font-bold tabular-nums text-brand">0{index + 1}</span>
            <div><h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h3><p className="mt-2 leading-relaxed text-ink-soft">{text}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="bg-canvas">
        <div className="container-x py-16 sm:py-20">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div><p className="eyebrow text-brand">Sett av en kveld</p><h2 className="heading-display mt-4 text-4xl text-ink sm:text-5xl">Vi ses rundt bordet.</h2></div>
            <Link href="/arrangementer" className="link inline-flex items-center gap-2">Alle arrangementer <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          {events.length ? <ul className="space-y-4">{events.map((event) => <EventRow key={event.slug} event={event} compact />)}</ul> : (
            <div className="card grid items-center gap-6 p-7 sm:grid-cols-[auto_1fr_auto] sm:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand"><CalendarDays className="h-6 w-6" aria-hidden="true" /></span>
              <div><h3 className="text-xl font-bold text-ink">Neste søknadskveld er på vei.</h3><p className="mt-2 max-w-xl leading-relaxed text-ink-soft">Vi legger ut nye datoer her så snart de er klare. I mellomtiden kan du bli kjent med hvordan en kveld foregår.</p></div>
              <Link href="/slik-fungerer-det" className="btn-outline justify-self-start whitespace-nowrap">Slik fungerer det <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          )}
        </div>
      </section>

      <CtaRow title="Din neste søknad starter her." text="Ta med laptop. Vi tar med fellesskapet. Gratis og åpent for alle NTNU-studenter." href="/bli-medlem" label="Bli med i Apply" />
    </main>
  );
}
