"use client";

import { useEffect, useRef } from "react";
import Container from "../layout/Container";

// Figma: node 773:1477 (1340x606). Left = history, right = today + handwritten quote.
const HISTORY = [
  "The year was 1978; a commercial town situated in the Eastern part of Nigeria, called Nnewi was the central hub for motorcycle importation. As it is today for tokunbo (foreign used) cars, so it was then for tokunbo motorcycles, they were the status quo.",
  "By 1987, a brand new motorcycle sold for N150,000 and a tokunbo one sold for N100,000 – N90,000. Things would have continued this way to this day, but for the intervention of a 25 years old Nigerian, named Innocent Chukwuma, the founder of Innoson Motors (IVM).",
  "Driven by his passion for people and his core business philosophy of bringing down costs and passing the gain to customers, he pioneered the first Made-in-Nigeria Motorcycle brand that sold for as low as N60,000. By year 2002, he had successfully driven out tokunbo (foreign used) motorcycles out of Nigeria forever!",
];

const TODAY = [
  "We are manufacturing durable and affordable brand new automobiles for Africans. Our brand new automobiles are selling for almost the cost of their tokunbo equivalents. And they are as good as any foreign automobile brand you know.",
  "The statistics are alarming, according to a recent research by PricewatershouseCoopers (PwC), the ratio of brand new automobiles to foreign used ones on Nigerian road is 1 : 131. Meaning that for every brand new car bought, there are 131 tokunbo ones!",
];

const QUOTE = "we’ve done it before for motorcycles; we are doing it again for automobiles!";

const BODY =
  "sw-ink-y text-[14px] leading-[27px] text-[#1e1e1e] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[20px] lg:font-[family-name:var(--font-inter)]";

export default function MadeInNigeria() {
  const ref = useRef<HTMLElement>(null);

  // Plays once when the section scrolls into view (same pattern as the other sections).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="mt-10 lg:mt-20">
      <Container className="grid gap-8 lg:grid-cols-[642px_643px] lg:justify-between lg:gap-0">
        <div>
          <p
            className="sw-fade text-[14px] capitalize leading-[31px] text-[#878383] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[20px] lg:font-[family-name:var(--font-inter)]"
            style={{ "--d": "0.1s" } as React.CSSProperties}
          >
            our story
          </p>
          <h2
            className="sw-ink-x mt-2 text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:mt-[18px] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            Made in Nigeria
          </h2>
          <div className="mt-6 flex flex-col gap-[25px] lg:mt-[101px] lg:w-[629px]">
            {HISTORY.map((p, i) => (
              <p key={i} className={BODY} style={{ "--d": `${0.7 + i * 0.3}s` } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:pt-[190px]">
          <div className="flex flex-col gap-[25px]">
            {TODAY.map((p, i) => (
              <p key={i} className={BODY} style={{ "--d": `${1.0 + i * 0.3}s` } as React.CSSProperties}>
                {p}
              </p>
            ))}
          </div>
          <p
            className="sw-fade mt-6 max-w-[464px] text-[20px] leading-[36px] text-[#002a52] font-[family-name:var(--font-beth-ellen,cursive)] lg:mt-9 lg:text-[23px]"
            style={{ "--d": "1.8s" } as React.CSSProperties}
          >
            {QUOTE}
          </p>
        </div>
      </Container>
    </section>
  );
}
