import Image from "next/image";
import type { CSSProperties } from "react";

type RevealWordsProps = {
  text: string;
  /** Delay before the first word starts, in ms */
  delay?: number;
  /** Gap between each word, in ms */
  stagger?: number;
};

function RevealWords({ text, delay = 0, stagger = 90 }: RevealWordsProps) {
  const words = text.split(" ");

  return (
    <span
      aria-label={text}
      style={
        {
          "--base": `${delay}ms`,
          "--stagger": `${stagger}ms`,
        } as CSSProperties
      }
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="reveal-mask">
            <span
              className="reveal-word"
              style={{ "--i": i } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

// Figma: node 773:1352 (1440x1024) + title block 773:1472. The header floats over the top 80px.
export default function AboutHero() {
  return (
    <section className="relative h-[530px] w-full overflow-hidden md:h-[720px] lg:h-[1024px]">
      <Image
        src="/images/about/hero.png"
        alt="IVM sedan"
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover object-[50%_75%]"
      />
      <div className="absolute inset-x-0 top-[150px] flex flex-col items-center gap-3 px-5 text-center text-white md:top-[200px] lg:top-[227px]">
        <h1 className="text-[32px] font-bold capitalize leading-[normal] md:text-[44px] lg:text-[56px] font-[family-name:var(--font-inter)]">
          <RevealWords text="About IVM" delay={250} />
        </h1>

        <span className="hero-line h-px w-12 bg-white/70" aria-hidden="true" />

        <p className="text-[14px] leading-[normal] md:text-[17px] lg:text-[20px] font-[family-name:var(--font-inter)]">
          <RevealWords text="The pride of Africa" delay={750} stagger={70} />
        </p>
      </div>
    </section>
  );
}