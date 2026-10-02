"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
    <section ref={ref} className=" w-full py-12 lg:py-16">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-[82px]">
        <div className="sw-door relative order-2 h-[300px] w-full shrink-0 overflow-hidden lg:order-1 lg:h-[450px] lg:w-[567px]">
          <Image
            src="/images/image-5.png"
            alt="IVM factory assembly line"
            fill
            sizes="(min-width: 1024px) 567px, 100vw"
            className="sw-door-img object-cover"
          />
        </div>

        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:max-w-[741px] lg:gap-6">
          <p
            className="sw-fade text-[14px] leading-[normal] text-[#878383] lg:text-[17px] font-[family-name:var(--font-inter)]"
            style={{ "--d": "0.2s" } as React.CSSProperties}
          >
            OUR STORY
          </p>
          <h2
            className="sw-ink-x text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[62px] font-[family-name:var(--font-google-sans)]"
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            Made in Nigeria
          </h2>
          <p
            className="sw-ink-y text-[16px] leading-[27px] text-[#1e1e1e] lg:text-[19px] font-[family-name:var(--font-inter)] mb-4"
            style={{ "--d": "0.9s" } as React.CSSProperties}
          >
            {BODY}
          </p>
        </div>
      </Container>
    </section>
  );
}