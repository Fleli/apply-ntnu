import Link from "next/link";

type LogoProps = {
  /** Størrelse på logoen. "sm" i navbar, "lg" i footer/hero. */
  size?: "sm" | "lg";
};

/**
 * Ordmerke i stil med «Linked[in]»: «Apply» i mørk tekst
 * etterfulgt av «NTNU» i en blå, avrundet boks.
 */
export default function Logo({ size = "sm" }: LogoProps) {
  const text = size === "sm" ? "text-[22px]" : "text-[30px]";
  const badge =
    size === "sm"
      ? "px-1.5 py-[3px] text-[12px]"
      : "px-2 py-1 text-[15px]";

  return (
    <Link
      href="/"
      aria-label="Apply NTNU – til forsiden"
      className="inline-flex items-center gap-1.5 select-none"
    >
      <span className={`${text} font-bold tracking-tight text-ink`}>Apply</span>
      <span
        className={`${badge} rounded-[4px] bg-brand font-extrabold uppercase leading-none tracking-wider text-white`}
      >
        NTNU
      </span>
    </Link>
  );
}
