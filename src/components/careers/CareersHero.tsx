import Image from "next/image";
import FinButton from "@/components/financing/FinButton";

const HEADLINE = "Build what Nigeria drives";

const motion = (delay: number, dur: number, y: number) =>
  ({
    "--ivm-delay": `${delay}s`,
    "--ivm-dur": `${dur}s`,
    "--ivm-y": `${y}px`,
  }) as React.CSSProperties;

/**
 * Figma: "Section – Hero" (720 desktop / 600 mobile). Plays the revamp motion
 * timeline once on load: media fade + slow settle, eyebrow, word-by-word
 * headline, subtitle, CTAs.
 */
export default function CareersHero() {
  const words = HEADLINE.split(" ");

  return (
    <section className="relative flex h-[600px] flex-col items-start justify-end overflow-clip bg-[#0a0d12] px-4 pb-8 md:h-[640px] md:px-6 md:pb-12 xl:h-[720px] xl:px-24 xl:pb-20">
      <div className="ivm-hero-media absolute inset-0" aria-hidden="true">
        <Image
          src="/images/about/factory-poster.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
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

      <div className="relative z-10 flex w-full flex-col items-start gap-4 xl:w-[620px]">
        <p
          className="ivm-rise text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-white"
          style={motion(0.45, 0.7, 16)}
        >
          Careers
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
          Join the 8,000 people building brand-new vehicles in Nnewi and supporting customers across
          Nigeria. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a
          ante venenatis dapibus.
        </p>

        <div
          className="ivm-rise flex w-full flex-col gap-[10px] md:flex-row md:gap-3 xl:w-auto"
          style={motion(1.36, 0.7, 24)}
        >
          <FinButton
            href="#open-roles"
            label="View open roles"
            variant="primary"
            className="w-full md:flex-1 xl:w-[200px] xl:flex-none"
          />
          <FinButton
            href="#cv"
            label="Send us your CV"
            variant="white"
            className="w-full md:flex-1 xl:w-[200px] xl:flex-none"
          />
        </div>
      </div>
    </section>
  );
}
