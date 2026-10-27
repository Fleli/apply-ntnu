import type { Metadata } from "next";
import ContactSentence from "@/components/ContactSentence";
import CtaRow from "@/components/CtaRow";
import PageHeader from "@/components/PageHeader";
import { getSettings, listBoard } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Apply NTNU er en studentorganisasjon som gjør jobbsøking sosialt. Les om hvem vi er, hva vi tror på og hvordan du kan bli med.",
};

const facts = [
  ["Hva", "Søknadskvelder og workshops for studenter som skal søke internship og sommerjobb"],
  ["Hvem", "Alle NTNU-studenter, uavhengig av studieprogram og årstrinn"],
  ["Hvor", "NTNU Gløshaugen, Trondheim"],
  ["Pris", "Gratis"],
];

const values = [
  {
    title: "Sammen",
    text: "Alt vi gjør handler om å ikke sitte alene. Søknader skrives bedre – og faktisk ferdig – når man har folk rundt seg.",
  },
  {
    title: "Lav terskel",
    text: "Du trenger ikke CV, erfaring eller en plan. Du trenger bare å møte opp. Alle var nye en gang.",
  },
  {
    title: "Konkret",
    text: "Vi snakker ikke om jobbsøking – vi gjør det. Målet for hver kveld er enkelt: flere sendte søknader enn da vi kom.",
  },
];

export default async function OmOssPage() {
  const [board, settings] = await Promise.all([listBoard(), getSettings()]);

  return (
    <main id="main-content" className="flex-1">
      <PageHeader
        title="Vi gjør jobbsøking til en lagsport"
        lead="Apply NTNU er en studentorganisasjon ved NTNU i Trondheim. Vi startet fordi vi var lei av å sitte alene med søknader som aldri ble sendt – og fant ut at det ble både enklere og morsommere når vi gjorde det sammen."
      />

      <section className="border-b border-line">
        <div className="container-x grid items-start gap-10 py-16 lg:grid-cols-[1fr_2fr] lg:py-24">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-ink sm:text-4xl">
            Kort fortalt
          </h2>
          <dl className="divide-y divide-line rounded-card bg-brand-light px-7 py-3 sm:px-10 sm:py-5">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[56px_1fr] gap-4 py-5 sm:grid-cols-[80px_1fr]">
                <dt className="font-bold text-brand">{k}</dt>
                <dd className="leading-relaxed text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-line bg-canvas">
        <div className="container-x py-16 lg:py-24">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-ink sm:text-4xl">
            Det vi tror på
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {values.map(({ title, text }, index) => (
              <div key={title} className="border-t-2 border-brand pt-6">
                <span aria-hidden="true" className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand">0{index + 1}</span>
                <h3 className="text-2xl font-bold tracking-tight text-ink">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-16 lg:py-24">
          <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-ink sm:text-4xl">Styret</h2>
          {board.length > 0 ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {board.map(({ id, name, role, studyProgram }) => (
                <li key={id} className="rounded-card border border-line p-6">
                  <span aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-lg font-bold text-brand">{name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}</span>
                  <p className="text-lg font-bold tracking-tight text-ink">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {role}
                    {studyProgram ? ` · ${studyProgram}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-xl text-ink-soft">
              Styret for dette semesteret presenteres her snart.
            </p>
          )}
          <ContactSentence
            email={settings.contact_email}
            before="Vil du være med i styret? Vi tar opp nye medlemmer hvert semester."
            label="Send oss en e-post"
            className="mt-10 border-t border-line pt-6"
          />
        </div>
      </section>

      <CtaRow
        title="Bli med på neste søknadskveld"
        text="Enkleste måten å bli kjent med oss på er å møte opp."
        href="/arrangementer"
        label="Se arrangementer"
      />
    </main>
  );
}
