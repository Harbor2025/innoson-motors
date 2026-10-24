import Image from "next/image";
import { Landmark } from "lucide-react";
import FinButton from "./FinButton";
import { HERO_HOTLINE_HREF, QUOTE_HREF } from "./financing-data";

const HEADLINE = "Drive now. Pay over time.";

const motion = (delay: number, dur: number, y: number) =>
  ({
    "--ivm-delay": `${delay}s`,
    "--ivm-dur": `${dur}s`,
    "--ivm-y": `${y}px`,
  }) as React.CSSProperties;

/**
 * Figma: "Section – Hero" (720 / 640 / 600 tall). Plays the 9s motion timeline
 * once on load: media fade + slow settle, eyebrow, word-by-word headline,
 * subtitle, CTAs, partner line.
 *
 * Photos live in /public/images/financing (run scripts/fetch-financing-hero.mjs).
 */
export default function FinancingHero() {
  const words = HEADLINE.split(" ");

  return (
    <section className="relative flex h-[600px] flex-col items-start justify-end overflow-clip bg-[#0a0d12] px-4 pb-8 md:h-[640px] md:px-6 md:pb-12 xl:h-[720px] xl:px-24 xl:pb-20">
      <div className="ivm-hero-media absolute inset-0" aria-hidden="true">
        <Image
          src="/images/financing/hero-mobile.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src="/images/financing/hero-tablet.png"
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover md:block xl:hidden"
        />
        <Image
          src="/images/financing/hero-desktop.png"
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover xl:block"
        />
      </div>

      {/* Overlay: bottom-weighted on tablet/mobile, left-weighted on desktop */}
      <div
        className="absolute inset-0 xl:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden xl:block"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%), linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.05) 100%)",
        }}
      />
      {/* Nav scrim keeps the transparent nav legible over bright photos */}
      <div
        className="absolute inset-x-0 top-0 h-[160px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0))" }}
      />

      <div className="relative z-10 flex w-full flex-col items-start gap-3 md:gap-4 xl:w-[620px] xl:gap-5">
        <p
          className="ivm-rise text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-white"
          style={motion(0.45, 0.7, 16)}
        >
          Financing
        </p>

        <h1
          aria-label={HEADLINE}
          className="text-[28px] font-semibold leading-[1.2] text-white md:text-[40px] xl:text-[56px] xl:leading-[1.1]"
        >
          {words.map((word, i) => (
            <span key={i} aria-hidden="true">
              <span
                className="ivm-word"
                style={{ "--ivm-delay": `${(i * 0.1446).toFixed(4)}s` } as React.CSSProperties}
              >
                {word}
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        <p
          className="ivm-rise text-[14px] font-normal leading-[1.4] text-white md:text-[20px]"
          style={motion(1.18, 0.7, 16)}
        >
          Own a brand-new IVM vehicle with IVM Auto Finance from Access Bank, and spread your
          repayments over up to 36 months.
        </p>

        <div
          className="ivm-rise flex w-full flex-col gap-[10px] md:flex-row md:gap-3 xl:w-auto xl:pt-2"
          style={motion(1.36, 0.7, 24)}
        >
          <FinButton
            href={QUOTE_HREF}
            label="Get a Quote"
            variant="primary"
            className="w-full md:flex-1 xl:w-[200px] xl:flex-none"
          />
          <FinButton
            href={HERO_HOTLINE_HREF}
            label="Call finance hotline"
            variant="white"
            className="w-full md:flex-1 xl:w-[220px] xl:flex-none"
          />
        </div>

        <div
          className="ivm-rise flex items-center gap-[10px] xl:pt-2"
          style={motion(1.54, 0.7, 24)}
        >
          <Landmark size={18} strokeWidth={1.75} className="text-white" aria-hidden="true" />
          <p className="whitespace-nowrap text-[14px] font-semibold leading-[1.4] text-white">
            In partnership with Access Bank
          </p>
        </div>
      </div>
    </section>
  );
}
