"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

type RevealTextProps = {
  text: string;
  /** Delay before the first letter starts, in ms */
  delay?: number;
  /** Gap between each letter, in ms */
  stagger?: number;
};

function RevealText({ text, delay = 0, stagger = 80 }: RevealTextProps) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        style={
          {
            "--base": `${delay}ms`,
            "--stagger": `${stagger}ms`,
          } as CSSProperties
        }
      >
        {words.map((word, w) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char) => {
                const i = charIndex++;
                return (
                  <span key={i} className="reveal-mask">
                    <span
                      className="reveal-char"
                      style={{ "--i": i } as CSSProperties}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

// Figma: node 773:1352 (1440x1024) + title block 773:1472. The header floats over the top 80px.
export default function AboutHero() {
  const [ready, setReady] = useState(false);

  // Start the animation only once the page is mounted and painted,
  // so the user actually sees it instead of it running during load.
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className={`hero relative h-[530px] w-full overflow-hidden md:h-[720px] lg:h-[1024px] ${
        ready ? "is-ready" : ""
      }`}
    >
      <Image
        src="/images/about/hero.png"
        alt="IVM sedan"
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover object-[50%_75%]"
      />

      <div
        aria-hidden="true"
        className="hero-overlay pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 top-[150px] flex flex-col items-center gap-4 px-5 text-center text-white md:top-[200px] lg:top-[227px]">
        <h1 className="hero-title text-[44px] font-bold capitalize leading-[normal] md:text-[60px] lg:text-[80px] font-[family-name:var(--font-inter)]">
          <RevealText text="About IVM" delay={400} stagger={80} />
        </h1>

   

        <p className="text-[15px] font-medium leading-[normal] md:text-[18px] lg:text-[22px] font-[family-name:var(--font-inter)]">
          <RevealText text="The pride of Africa" delay={1900} stagger={30} />
        </p>
      </div>
    </section>
  );
}