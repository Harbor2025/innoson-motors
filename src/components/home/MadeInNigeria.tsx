"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Btn, EYEBROW, ROUTES } from "./ui";
import { useInView } from "./useInView";

/**
 * "Built in Nnewi, for Africa."
 * Figma: desktop 948:452 / tablet 958:715 / mobile 957:678.
 *
 * The numbers are odometers: each digit is a vertical strip (0-9, then 0..digit) that rolls up
 * when the section scrolls into view. Strip length, delays and durations come from the Figma
 * motion data (columns start 120 ms apart and run 1.6s + 150 ms per column).
 */

function Digit({ digit, col, base }: { digit: number; col: number; base: number }) {
  // 0..9 then 0..digit  ->  target index is 10 + digit, same as the Figma strips
  const items = Array.from({ length: 11 + digit }, (_, k) => k % 10);
  return (
    <span className="relative block h-[1.2em] w-[0.6em] overflow-hidden" aria-hidden>
      <span
        className="hv-strip flex flex-col items-center"
        style={
          {
            "--t": 10 + digit,
            "--dl": `${(base + col * 0.12).toFixed(2)}s`,
            "--du": `${(1.6 + col * 0.15).toFixed(2)}s`,
          } as CSSProperties
        }
      >
        {items.map((n, k) => (
          <span key={k} className="block h-[1.2em] leading-[1.2em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function Counter({ value, base, plus = false }: { value: string; base: number; plus?: boolean }) {
  return (
    <span
      className="flex text-[24px] font-semibold leading-[1.2] text-ivm-ink md:text-[32px]"
      role="img"
      aria-label={`${value}${plus ? "+" : ""}`}
    >
      {value.split("").map((d, col) => (
        <Digit key={col} digit={Number(d)} col={col} base={base} />
      ))}
      {plus && (
        <span className="hv-plus" aria-hidden>
          +
        </span>
      )}
    </span>
  );
}

const LABEL = "text-[12px] leading-[1.4] text-ivm-muted md:text-[14px]";

export default function MadeInNigeria({ image = "/images/home/v2/factory.png" }: { image?: string }) {
  const { ref, visible } = useInView<HTMLElement>(0.3);

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pt-[72px] md:px-6 md:pt-24 lg:flex-row lg:gap-0 lg:px-8 lg:pt-28"
    >
      <div className="relative h-[260px] w-full overflow-hidden md:h-[400px] lg:h-[720px] lg:w-[49.4%] lg:shrink-0">
        <div className="hv-settle absolute inset-0">
          <Image src={image} alt="IVM production line at the Nnewi plant" fill sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
        </div>
      </div>

      {/* Tablet has an extra 4px spacer under the photo */}
      <div className="hidden h-1 md:block lg:hidden" aria-hidden />

      <div className="flex min-w-0 flex-col items-start gap-5 lg:flex-1 lg:justify-center lg:gap-6 lg:pl-12 lg:pr-8 xl:pl-20">
        <p className={`hv-rise text-ivm-blue ${EYEBROW}`}>Made in Nnewi, Nigeria</p>
        <h2
          className="hv-rise text-[24px] font-semibold leading-[1.2] text-ivm-ink md:max-w-[720px] md:text-[32px] lg:max-w-[528px] lg:text-[48px]"
          style={{ "--i": 1 } as CSSProperties}
        >
          Built in Nnewi, for Africa.
        </h2>
        <p
          className="hv-rise text-[14px] leading-[1.4] text-ivm-muted md:max-w-[600px] md:text-[20px] lg:max-w-[528px]"
          style={{ "--i": 2 } as CSSProperties}
        >
          Designed and built at our plant in Nnewi, Anambra State - brand-new vehicles engineered for African
          roads, backed by local parts and service.
        </p>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 md:gap-4 lg:max-w-[528px] lg:grid-cols-2 lg:gap-6">
          <div className="flex min-w-0 flex-col gap-[2px] md:gap-1">
            <Counter value="2007" base={0.4} />
            <p className={LABEL}>Founded in Nnewi</p>
          </div>
          <div className="flex min-w-0 flex-col gap-[2px] md:gap-1">
            <Counter value="2010" base={0.45} />
            <p className={LABEL}>
              <span className="hidden lg:inline">Vehicle plant commissioned</span>
              <span className="lg:hidden">Plant commissioned</span>
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-[2px] md:gap-1">
            <p className="text-[24px] font-semibold leading-[1.2] text-ivm-ink md:text-[32px]">CNG</p>
            <p className={LABEL}>
              <span className="hidden lg:inline">Gas-powered buses since 2022</span>
              <span className="lg:hidden">Gas buses since 2022</span>
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-[2px] md:gap-1">
            <Counter value="7" plus base={0.5} />
            <p className={LABEL}>African export markets</p>
          </div>
        </div>

        <Btn href="/about" className="w-full md:w-[200px] lg:w-[264px]">
          Our Story
        </Btn>
      </div>
    </section>
  );
}