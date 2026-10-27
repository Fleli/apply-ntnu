/** The overlapping circles from the identity, drawn as a scalable decoration. */
export default function BrandCircles({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 440 280" fill="none" aria-hidden="true" className={className}>
      <circle cx="146" cy="140" r="122" className={inverted ? "fill-lilac" : "fill-brand"} />
      <circle cx="286" cy="140" r="130" strokeWidth="20" className={inverted ? "stroke-white" : "stroke-ink"} />
    </svg>
  );
}
