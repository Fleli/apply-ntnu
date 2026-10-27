import Link from "next/link";

type LogoProps = {
  /** "sm" i navbar og footer, "lg" der logoen skal stå alene. */
  size?: "sm" | "lg";
};

/**
 * Logoen til Apply NTNU: «Apply» i blått, etterfulgt av «NTNU» i hvitt
 * på en blå, avrundet boks. Tegnet i HTML/CSS så den er skarp i alle
 * størrelser. Vektorversjon ligger i public/logo.svg.
 */
export default function Logo({ size = "sm" }: LogoProps) {
  const s =
    size === "sm"
      ? { text: "text-[22px]", badge: "h-[26px] rounded-[5px] px-2 text-[12px]" }
      : { text: "text-[32px]", badge: "h-[38px] rounded-[7px] px-3 text-[17px]" };

  return (
    <Link
      href="/"
      aria-label="Apply NTNU – til forsiden"
      className="inline-flex items-center gap-1.5 select-none"
    >
      <span className={`${s.text} font-bold leading-none tracking-tight text-brand`}>
        Apply
      </span>
      <span
        className={`${s.badge} inline-flex items-center bg-brand-fill font-extrabold uppercase leading-none tracking-wide text-on-brand`}
      >
        NTNU
      </span>
    </Link>
  );
}
