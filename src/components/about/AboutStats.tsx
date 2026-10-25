"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "./about-data";

/** Digit-column window width (em) from Figma: 33px at 48px type. */
const COL_W = "0.6875em";

/**
 * One digit: a window showing a strip of 0-9 repeated, rolled up to the final
 * digit. The strip travels one full 0-9 turn plus the digit itself.
 */
function DigitColumn({
  digit,
  delay,
  duration,
  rolling,
}: {
  digit: number;
  delay: number;
  duration: number;
  rolling: boolean;
}) {
  const rows = 10 + digit; // rows travelled
  return (
    <span className="relative block h-[1.2em] overflow-hidden" style={{ width: COL_W }}>
      <span
        className={`ivm-strip flex flex-col items-center ${rolling ? "is-rolling" : ""}`}
        style={
          {
            "--ivm-n": rows,
            "--ivm-delay": `${delay.toFixed(2)}s`,
            "--ivm-dur": `${duration.toFixed(2)}s`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        {Array.from({ length: rows + 1 }, (_, k) => (
          <span key={k} className="block h-[1.2em] leading-[1.2]">
            {k % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

function Counter({
  value,
  statIndex,
  rolling,
}: {
  value: string;
  statIndex: number;
  rolling: boolean;
}) {
  let col = 0;
  return (
    <div className="flex items-start overflow-clip">
      <span className="sr-only">{value}</span>
      {value.split("").map((ch, i) => {
        if (/\d/.test(ch)) {
          // Figma timeline: columns start 0.12s apart (stats 0.05s apart) from 0.4s,
          // and each column takes 0.15s longer than the one before it.
          const c = col++;
          return (
            <DigitColumn
              key={i}
              digit={Number(ch)}
              delay={0.4 + 0.05 * statIndex + 0.12 * c}
              duration={1.6 + 0.15 * c}
              rolling={rolling}
            />
          );
        }
        // "+" fades up after the digits settle (1.87s, 0.5s long, 12px rise)
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`block ${rolling ? "ivm-rise" : "opacity-0"}`}
            style={
              {
                "--ivm-delay": "1.87s",
                "--ivm-dur": "0.5s",
                "--ivm-y": "12px",
              } as React.CSSProperties
            }
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Figma: "Section – Stats". Counters roll up when the section scrolls into
 * view (the design plays them from page load; on desktop that is the same
 * moment, but on shorter screens they would finish before being seen).
 */
export default function AboutStats() {
  const ref = useRef<HTMLElement>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: just show the final numbers
      const id = requestAnimationFrame(() => setRolling(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRolling(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="IVM at a glance"
      className="flex flex-wrap gap-x-4 gap-y-6 border-b border-ivm-n100 px-6 py-8 md:flex-nowrap md:justify-between md:gap-x-6 md:py-10 xl:px-24 xl:py-12"
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="flex w-[calc(50%-8px)] flex-col items-start gap-1 md:w-[162px] xl:w-auto"
        >
          <div className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[40px] xl:text-[48px]">
            <Counter value={stat.value} statIndex={i} rolling={rolling} />
          </div>
          <p className="text-[14px] leading-[1.4] text-ivm-n600 xl:whitespace-nowrap xl:text-[16px]">
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}
