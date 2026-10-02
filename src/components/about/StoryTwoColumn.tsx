"use client";

import { useEffect, useRef } from "react";
import Container from "../layout/Container";

const BODY = `We are manufacturing durable and affordable brand new automobiles for Africans. Our brand new automobiles are selling for almost the cost of their tokunbo equivalents. And they are as good as any foreign automobile brand you know. The statistics are alarming, according to a recent research by PricewatershouseCoopers (PwC), the ratio of brand new automobiles to foreign used ones on Nigerian road is 1 : 131. Meaning that for every brand new car bought, there are 131 tokunbo ones!`;

export default function StoryWithImage() {
  const ref = useRef<HTMLElement>(null);

  // Plays once when the section scrolls into view.
  // data-visible is set directly on the DOM so React re-renders never reset it.
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
    <section ref={ref} className="12 lg:py-16">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-[82px]">
        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:max-w-[741px] lg:gap-6">
          <p
            className="sw-fade text-[14px] leading-[normal] text-[#878383] lg:text-[17px] font-[family-name:var(--font-inter)]"
            style={{ "--d": "0.1s" } as React.CSSProperties}
          >
            OUR STORY
          </p>
          <h2
            className="sw-ink-x text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[62px] font-[family-name:var(--font-google-sans)]"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            Made in Nigeria
          </h2>
          <h3
            className="sw-ink-x text-[20px]  leading-[normal] text-[#1e1e1e] lg:text-[34px] lg:leading-[62px] font-[family-name:var(--font-google-sans)]"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            Present
          </h3>
          <p
            className="sw-ink-y text-[16px] leading-[27px] text-[#1e1e1e] lg:text-[19px] font-[family-name:var(--font-inter)]"
            style={{ "--d": "1s" } as React.CSSProperties}
          >
            {BODY}
          </p>
        </div>

        <div className="order-2 flex flex-col gap-4 lg:order-2 lg:max-w-[741px] lg:gap-6">
          <p
            className="sw-fade text-[14px] leading-[normal] text-[#878383] lg:text-[17px] font-[family-name:var(--font-inter)]"
            style={{ "--d": "0.1s" } as React.CSSProperties}
          ></p>
          <h3
            className="sw-ink-x text-[20px] leading-[normal] text-[#1e1e1e] lg:text-[34px] lg:leading-[62px] lg:mt-[100px] font-[family-name:var(--font-google-sans)]"
            style={{ "--d": "1.3s" } as React.CSSProperties}
          >
            Present
          </h3>
          <p
            className="sw-ink-y text-[16px] leading-[27px] text-[#1e1e1e] lg:text-[19px] font-[family-name:var(--font-inter)]"
            style={{ "--d": "1.6s" } as React.CSSProperties}
          >
            {BODY}
          </p>
        </div>
      </Container>
    </section>
  );
}