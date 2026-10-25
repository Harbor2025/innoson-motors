import Link from "next/link";
import { Eye, Globe, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import ResponsiveImage from "@/components/revamp/ResponsiveImage";
import {
  PILLARS,
  PULL_QUOTE,
  STATEMENT_IMAGES,
  STORY_BEGINNING,
  STORY_PRESENT,
} from "./about-data";

const EYEBROW = "text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px]";
const H2 =
  "text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]";

/* -------------------------------- Our story -------------------------------- */

export function OurStory() {
  return (
    <section
      aria-labelledby="story-title"
      className="flex flex-col gap-[14px] px-6 pt-16 md:gap-5 md:pt-24 xl:gap-10 xl:px-24 xl:pt-28"
    >
      <div className="flex flex-col gap-[10px] xl:gap-3">
        <p className={`${EYEBROW} text-ivm-blue`}>Our story</p>
        <h2 id="story-title" className={H2}>
          Made in Nigeria
        </h2>
      </div>

      <div className="contents xl:flex xl:items-start xl:gap-20">
        <div className="contents xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-4">
          <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
            In the beginning
          </h3>
          {STORY_BEGINNING.map((p) => (
            <p key={p} className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">
              {p}
            </p>
          ))}
        </div>

        <div className="contents xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-4">
          <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
            The present
          </h3>
          {STORY_PRESENT.map((p) => (
            <p key={p} className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">
              {p}
            </p>
          ))}
          <blockquote className="w-full border-l-3 border-ivm-blue py-[6px] pl-5 xl:py-2 xl:pl-6">
            <p className="text-[20px] font-medium italic leading-[1.4] text-ivm-blue md:text-[24px] md:leading-[1.2]">
              {PULL_QUOTE}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Why we exist ------------------------------- */

export function WhyWeExist() {
  return (
    <section className="px-6 pt-16 md:pt-24 xl:px-8 xl:pt-28" aria-labelledby="why-title">
      <div className="relative flex h-[420px] flex-col items-start justify-end gap-[10px] overflow-hidden rounded-[12px] bg-ivm-n900 px-5 pb-6 md:h-[480px] md:px-10 md:pb-10 xl:h-[600px] xl:gap-3 xl:pb-16 xl:pl-16 xl:pr-0">
        <ResponsiveImage srcs={STATEMENT_IMAGES} />
        {/* Bottom-weighted on tablet/mobile; left-weighted on desktop */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden xl:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
        <p className={`${EYEBROW} relative text-white`}>Why we exist</p>
        <h2
          id="why-title"
          className="relative text-[24px] font-semibold leading-[1.2] text-white md:text-[32px] xl:w-[620px] xl:text-[48px]"
        >
          To end Africa’s reliance on tokunbo, by building brand-new vehicles here.
        </h2>
      </div>
    </section>
  );
}

/* ------------------------- Mission, vision, objective ----------------------- */

// Stand-ins for the three Figma pillar icons (lucide, matched by meaning)
const PILLAR_ICON: Record<(typeof PILLARS)[number]["id"], ReactNode> = {
  mission: <Globe aria-hidden="true" />,
  vision: <Eye aria-hidden="true" />,
  objective: <ShieldCheck aria-hidden="true" />,
};

export function Pillars() {
  return (
    <section
      aria-labelledby="pillars-title"
      className="flex flex-col gap-5 px-6 pt-16 md:pt-24 xl:gap-10 xl:px-8 xl:pt-28"
    >
      <div className="flex flex-col gap-[10px] xl:gap-3 xl:pl-16">
        <p className={`${EYEBROW} text-ivm-blue`}>What drives us</p>
        <h2 id="pillars-title" className={H2}>
          Built for African roads
        </h2>
      </div>

      <div className="contents xl:flex xl:items-stretch xl:gap-8">
        {PILLARS.map((pillar) => (
          <article
            key={pillar.id}
            className="flex flex-col gap-3 rounded-[12px] bg-ivm-n50 p-6 xl:min-w-0 xl:flex-1 xl:gap-4 xl:p-8"
          >
            <span className="text-ivm-blue [&>svg]:size-[26px] xl:[&>svg]:size-7 [&>svg]:stroke-[1.75]">
              {PILLAR_ICON[pillar.id]}
            </span>
            <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
              {pillar.title}
            </h3>
            <p className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">{pillar.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- Final CTA -------------------------------- */

export function AboutCta() {
  const btn =
    "flex h-11 items-center justify-center whitespace-nowrap rounded-[4px] text-[14px] font-semibold leading-[1.4] transition-opacity hover:opacity-90";
  return (
    <section className="px-6 py-16 md:py-24 xl:px-8 xl:py-28" aria-labelledby="cta-title">
      <div className="flex flex-col items-center gap-3 rounded-[12px] bg-ivm-n50 px-6 py-10 xl:px-0 xl:py-20">
        <h2
          id="cta-title"
          className="w-full text-center text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
        >
          Drive something made at home
        </h2>
        <p className="w-full text-center text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px] xl:text-[20px]">
          Explore the range, or visit a showroom near you.
        </p>
        <div className="flex w-full flex-col gap-[10px] pt-2 md:flex-row md:gap-3 xl:w-auto xl:gap-4 xl:pt-4">
          <Link
            href="/vehicles"
            className={`${btn} w-full bg-ivm-blue text-white md:flex-1 xl:w-[220px] xl:flex-none`}
          >
            Explore Vehicles
          </Link>
          <Link
            href="/contact#showrooms"
            className={`${btn} w-full border border-ivm-n200 bg-white text-ivm-n900 md:flex-1 xl:w-[220px] xl:flex-none`}
          >
            Find a Showroom
          </Link>
        </div>
      </div>
    </section>
  );
}
