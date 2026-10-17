type Props = {
  title: string;
  lead?: string;
};

/** Toppen av hver underside: tittel og ingress, ikke noe mer. */
export default function PageHeader({ title, lead }: Props) {
  return (
    <header className="border-b border-line">
      <div className="container-x py-14 lg:py-20">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {lead}
          </p>
        )}
      </div>
    </header>
  );
}
