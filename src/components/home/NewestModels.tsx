"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Btn, Chevron } from "./ui";
import { useInView } from "./useInView";

/**
 * "What's New at IVM": promo tiles.
 * Figma: desktop 943:648 (tiles 560x520, 24 gap) / tablet 958:736 (300x420, 16 gap) /
 *        mobile 957:698 (300x400, 12 gap, swipe).
 *
 * Native horizontal scroll + snap (swipe on touch, arrows on md+). Dots and the arrows'
 * disabled state follow the scroll position.
 */

export interface NewestModelItem {
  id: string;
  title: string;
  description: string;
  /** Optional shorter line used on tablet/mobile (the design shortens some of them) */
  shortDescription?: string;
  image: string;
  href: string;
}

const FALLBACK: NewestModelItem[] = [
  {
    id: "n1",
    title: "Newest Car Model",
    description: "Comfort, technology and space - built in Nnewi.",
    shortDescription: "Comfort and space, built in Nnewi.",
    image: "/images/home/v2/promo-1.png",
    href: "/vehicles",
  },
  {
    id: "n2",
    title: "Electric Mobility",
    description: "The next chapter of made-in-Nigeria driving.",
    shortDescription: "Made-in-Nigeria driving, electric.",
    image: "/images/home/v2/promo-2.png",
    href: "/vehicles",
  },
  {
    id: "n3",
    title: "Explore the Range",
    description: "24 models, built in Nnewi.",
    image: "/images/home/v2/promo-3.png",
    href: "/vehicles",
  },
];

export default function NewestModels({ items = FALLBACK }: { items?: NewestModelItem[] }) {
  const { ref, visible } = useInView<HTMLElement>(0.2);
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = useCallback(() => {
    const tiles = scroller.current?.children;
    if (!tiles || tiles.length < 2) return 1;
    return (tiles[1] as HTMLElement).offsetLeft - (tiles[0] as HTMLElement).offsetLeft || 1;
  }, []);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft >= max - 2;
    setAtStart(start);
    setAtEnd(end);
    setActive(end ? items.length - 1 : Math.min(items.length - 1, Math.round(el.scrollLeft / step())));
  }, [items.length, step]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const behavior = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const by = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * step(), behavior: behavior() as ScrollBehavior });
  const to = (i: number) =>
    scroller.current?.scrollTo({ left: i * step(), behavior: behavior() as ScrollBehavior });

  if (items.length === 0) return null;

  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-ivm-line bg-white text-ivm-ink transition-opacity hover:bg-ivm-wash disabled:pointer-events-none disabled:opacity-40 lg:size-12";

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 pl-4 pt-[72px] md:gap-6 md:px-6 md:pt-24 lg:gap-8 lg:px-8 lg:pt-28"
      aria-roledescription="carousel"
      aria-label="What's new at IVM"
    >
      <div className="hv-rise flex items-center justify-between">
        <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-ink md:text-[32px] lg:text-[48px]">
          What’s New at IVM
        </h2>
        <div className="hidden gap-[10px] md:flex lg:gap-3">
          <button type="button" aria-label="Previous" disabled={atStart} onClick={() => by(-1)} className={arrow}>
            <Chevron dir="left" className="size-[18px] lg:size-5" />
          </button>
          <button type="button" aria-label="Next" disabled={atEnd} onClick={() => by(1)} className={arrow}>
            <Chevron dir="right" className="size-[18px] lg:size-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={sync}
        className="hv-noscrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pr-1 md:gap-4 md:pr-0 lg:gap-6"
      >
        {items.map((item, i) => (
          <article
            key={item.id}
            aria-label={item.title}
            className="hv-rise relative flex h-[400px] w-[300px] shrink-0 snap-start flex-col items-start justify-end gap-2 overflow-hidden rounded-lg px-5 pb-5 text-white md:h-[420px] md:px-6 md:pb-6 lg:h-[520px] lg:w-[560px] lg:px-10 lg:pb-10"
            style={{ "--i": Math.min(i, 3) } as React.CSSProperties}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 560px, 300px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.7)_100%)]" />

            <h3 className="relative text-[24px] font-bold leading-[1.2] md:text-[26px] lg:text-[32px] lg:font-semibold">
              {item.title}
            </h3>
            <p className="relative text-[16px] leading-[1.4]">
              {item.shortDescription ? (
                <>
                  <span className="hidden lg:inline">{item.description}</span>
                  <span className="lg:hidden">{item.shortDescription}</span>
                </>
              ) : (
                item.description
              )}
            </p>
            <div className="h-4" aria-hidden />
            {/* The whole tile is clickable: the link's ::after stretches over the (relative) article */}
            <div className="w-full max-w-[264px]">
              <Btn
                href={item.href}
                variant="secondary"
                compact
                className="w-full after:absolute after:inset-0 after:content-['']"
              >
                Read More
              </Btn>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pr-4 md:pr-0">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => to(i)}
            className={`relative size-2 rounded-full transition-colors duration-300 before:absolute before:-inset-2 before:content-[''] ${
              i === active ? "bg-ivm-ink" : "bg-ivm-line"
            }`}
          />
        ))}
      </div>
    </section>
  );
}