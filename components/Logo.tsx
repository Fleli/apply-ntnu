import Link from "next/link";

type LogoProps = {
  size?: "sm" | "lg";
  /** The footer always uses the supplied white wordmark on deep purple. */
  tone?: "auto" | "dark";
};

export default function Logo({ size = "sm", tone = "auto" }: LogoProps) {
  return (
    <Link href="/" aria-label="Apply NTNU – til forsiden"
      className={`inline-block shrink-0 rounded-sm select-none focus-visible:outline-2 focus-visible:outline-offset-4 ${tone === "dark" ? "focus-visible:outline-lilac" : "focus-visible:outline-brand"}`}>
      <span aria-hidden="true" className={`brand-logo ${size === "lg" ? "brand-logo-lg" : ""} ${tone === "auto" ? "brand-logo-auto" : ""}`}>
        {tone === "auto" && <img src="/brand/logo-light.png" alt="" width={1200} height={400} className="brand-logo-image brand-logo-light" />}
        <img src="/brand/logo-dark.png" alt="" width={1200} height={400} className="brand-logo-image brand-logo-dark" />
      </span>
    </Link>
  );
}
