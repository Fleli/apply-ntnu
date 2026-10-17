import type { ReactNode } from "react";

type Props = {
  /** Kontakt-e-post fra innstillingene. Uten e-post vises ingenting. */
  email?: string;
  /** Tekst før lenken, f.eks. «Fant du ikke svaret?» */
  before: ReactNode;
  /** Lenketekst, f.eks. «Send oss en e-post» */
  label: string;
  /** Tekst etter lenken (uten punktum) */
  after?: ReactNode;
  subject?: string;
  className?: string;
};

/** En setning med mailto-lenke, brukt nederst på flere sider. */
export default function ContactSentence({
  email,
  before,
  label,
  after,
  subject,
  className = "",
}: Props) {
  if (!email) return null;
  const href = subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
  return (
    <p className={`text-sm text-ink-soft ${className}`}>
      {before}{" "}
      <a href={href} className="link">
        {label}
      </a>
      {after ? <>, {after}</> : null}.
    </p>
  );
}
