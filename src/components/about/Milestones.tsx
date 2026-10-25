"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MILESTONES } from "./about-data";

/**
 * Figma: "Section – Milestones". A horizontally scrolling timeline (cards are
 * 240 / 260 / 300 wide) with prev/next arrows from tablet up. Arrows page by
 * one card and disable at either end; on mobile you swipe.
 */
export default function Milestones() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (card?.offsetWidth ?? 260), behavior: "smooth" });
  };

  const arrow =
    "flex size-11 items-center justify-center rounded-full border border-ivm-n200 text-ivm-n900 transition-opacity disabled:opacity-40";

  return (
    <section
      aria-labelledby="milestones-title"
      className="flex flex-col gap-6 px-6 pt-16 md:gap-10 md:pt-24 xl:px-24 xl:pt-28"
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-[10px] xl:gap-3">
          <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-blue">
            Milestones
          </p>
          <h2
            id="milestones-title"
            className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
          >
            Our journey so far
          </h2>
        </div>
        <div className="hidden gap-[10px] md:flex">
          <button
            type="button"
            aria-label="Previous milestones"
            disabled={atStart}
            onClick={() => page(-1)}
            className={arrow}
          >
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next milestones"
            disabled={atEnd}
            onClick={() => page(1)}
            className={arrow}
          >
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={update}
        tabIndex={0}
        role="region"
        aria-label="Company milestones, scroll sideways"
        className="flex overflow-x-auto [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivm-blue [&::-webkit-scrollbar]:hidden"
      >
        {MILESTONES.map((m) => (
          <article
            key={m.year}
            className="flex w-[240px] shrink-0 flex-col items-start gap-[10px] pr-6 md:w-[260px] xl:w-[300px]"
          >
            <div className="flex w-full items-center" aria-hidden="true">
              <span className="size-[14px] shrink-0 rounded-full bg-ivm-blue" />
              <span className="h-[2px] min-w-px flex-1 bg-ivm-n200" />
            </div>
            <p className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[32px] md:leading-[1.2]">
              {m.year}
            </p>
            <h3 className="text-[16px] font-bold leading-[1.4] text-ivm-n900">{m.title}</h3>
            <p className="text-[14px] leading-[1.4] text-ivm-n600">{m.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
