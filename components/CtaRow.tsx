import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BrandCircles from "./BrandCircles";

type Props = { title: string; text: string; href: string; label: string };

export default function CtaRow({ title, text, href, label }: Props) {
  return (
    <section className="bg-brand-deep text-white">
      <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_260px] lg:gap-20">
        <div>
          <p className="eyebrow text-lilac">Det begynner med å møte opp</p>
          <h2 className="heading-display mt-5 max-w-2xl text-4xl leading-[1.04] sm:text-5xl">{title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-lavender/85">{text}</p>
          <Link href={href} className="btn mt-8 gap-3 bg-lavender px-6 py-4 text-brand-deep hover:bg-white focus-visible:outline-lilac">{label}<ArrowUpRight className="h-5 w-5" aria-hidden="true" /></Link>
        </div>
        <BrandCircles inverted className="hidden w-full rotate-12 lg:block" />
      </div>
    </section>
  );
}
