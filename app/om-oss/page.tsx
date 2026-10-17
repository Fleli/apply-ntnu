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
    <main className="flex-1">
      <PageHeader
        title="Vi gjør jobbsøking til en lagsport"
        lead="Apply NTNU er en studentorganisasjon ved NTNU i Trondheim. Vi startet fordi vi var lei av å sitte alene med søknader som aldri ble sendt – og fant ut at det ble både enklere og morsommere når vi gjorde det sammen."
      />

      <section className="border-b border-line">
        <div className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_2fr] lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Kort fortalt
          </h2>
          <dl className="max-w-2xl divide-y divide-line">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[80px_1fr] gap-4 py-3">
                <dt className="font-semibold text-ink">{k}</dt>
                <dd className="text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-14 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Det vi tror på
          </h2>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {values.map(({ title, text }) => (
              <div key={title}>
                <h3 className="text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-14 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Styret</h2>
          {board.length > 0 ? (
            <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
              {board.map(({ id, name, role, studyProgram }) => (
                <li key={id}>
                  <p className="font-semibold text-ink">{name}</p>
                  <p className="text-sm text-ink-soft">
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
