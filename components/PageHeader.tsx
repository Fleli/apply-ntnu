import BrandCircles from "./BrandCircles";

type Props = { title: string; lead?: string };

export default function PageHeader({ title, lead }: Props) {
  return (
    <header className="relative overflow-hidden bg-brand-light">
      <div className="container-x relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_180px] lg:items-center lg:py-20">
        <div className="relative z-10">
          <p className="eyebrow mb-5 text-brand">Apply NTNU</p>
          <h1 className="heading-display max-w-4xl text-4xl leading-[1.03] text-ink sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{lead}</p>}
        </div>
        <BrandCircles className="hidden w-44 -rotate-12 opacity-75 lg:block" />
      </div>
    </header>
  );
}
