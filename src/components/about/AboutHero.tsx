import ResponsiveImage from "@/components/revamp/ResponsiveImage";
import { HERO_IMAGES } from "./about-data";

const HEADLINE = "The Pride of African Roads";

const motion = (delay: number, dur: number, y: number) =>
  ({
    "--ivm-delay": `${delay}s`,
    "--ivm-dur": `${dur}s`,
    "--ivm-y": `${y}px`,
  }) as React.CSSProperties;

/**
 * Figma: "Hero" (720 / 680 / 600 tall). Plays the 9s motion timeline once on
 * load: photo fade + slow settle, eyebrow, word-by-word headline, subtitle.
 *
 * `id="home-hero"` is what the site Header watches to turn from transparent
 * to solid once the hero scrolls out of view.
 */
export default function AboutHero() {
  const words = HEADLINE.split(" ");

  return (
    <section
      id="home-hero"
      className="relative flex h-[600px] flex-col items-start justify-end gap-[10px] overflow-clip bg-[#0a0d12] px-6 pb-8 md:h-[680px] md:pb-14 xl:h-[720px] xl:gap-3 xl:pb-20 xl:pl-24 xl:pr-0"
    >
      <div className="ivm-hero-media absolute inset-0" aria-hidden="true">
        <ResponsiveImage srcs={HERO_IMAGES} priority />
      </div>

      {/* Overlay: bottom-weighted on tablet/mobile, starts a quarter of the way down on desktop */}
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
            "linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      {/* Nav scrim keeps the transparent header legible over bright photos */}
      <div
        className="absolute inset-x-0 top-0 h-[160px]"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0))" }}
      />

      <p
        className="ivm-rise relative text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-white"
        style={motion(0.45, 0.7, 16)}
      >
        About IVM
      </p>

      <h1
        aria-label={HEADLINE}
        className="relative text-[28px] font-semibold leading-[1.2] text-white md:text-[40px] xl:whitespace-nowrap xl:text-[56px] xl:leading-[1.1]"
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
        className="ivm-rise relative text-[14px] font-normal leading-[1.4] text-white md:text-[20px] xl:w-[560px]"
        style={motion(1.18, 0.7, 16)}
      >
        Nigeria’s first indigenous automobile manufacturer, building brand-new vehicles in Nnewi
        since 2007.
      </p>
    </section>
  );
}
