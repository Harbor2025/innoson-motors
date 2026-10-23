"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Btn, EYEBROW, ROUTES } from "./ui";
import { useInView } from "./useInView";

/**
 * "Drive now. Pay in flexible instalments."
 * Figma: desktop 943:665 (photo 680x520 beside copy) / tablet 958:768 (photo 340x420 beside copy,
 * buttons full width) / mobile 957:723 (stacked).
 */
export default function PaymentBanner({ image = "/images/home/v2/payment.png" }: { image?: string }) {
  const { ref, visible } = useInView<HTMLElement>(0.25);
  const i = (n: number) => ({ "--i": n }) as CSSProperties;

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-[72px] md:flex-row md:items-center md:gap-6 md:px-6 md:py-24 lg:gap-20 lg:px-8 lg:py-28"
    >
      <div className="relative h-[260px] w-full shrink-0 overflow-hidden md:h-[420px] md:w-[340px] lg:h-[520px] lg:w-[49.4%]">
        <div className="hv-settle absolute inset-0">
          <Image
            src={image}
            alt="Handing over the keys to a new IVM"
            fill
            sizes="(min-width: 1024px) 680px, (min-width: 768px) 340px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-start gap-4 md:flex-1 lg:max-w-[520px] lg:gap-5">
        <p className={`hv-rise text-ivm-blue ${EYEBROW}`}>Financing</p>
        <h2
          className="hv-rise text-[24px] font-semibold leading-[1.2] text-ivm-ink md:text-[32px] lg:text-[48px]"
          style={i(1)}
        >
          Drive now. Pay in flexible instalments.
        </h2>
        <p
          className="hv-rise text-[14px] leading-[1.4] text-ivm-muted md:text-[16px] lg:text-[20px]"
          style={i(2)}
        >
          Own a brand-new IVM vehicle with the Access Bank Auto Finance Plan, and spread your repayments over
          up to 36 months.
        </p>
        <div
          className="hv-rise flex w-full flex-col gap-[10px] md:gap-4 lg:w-auto lg:flex-row"
          style={i(3)}
        >
          <Btn href={ROUTES.financing} className="w-full lg:w-[200px]">
            See Payment Plans
          </Btn>
          <Btn href={ROUTES.quote} variant="outline" className="w-full lg:w-[160px]">
            Get a Quote
          </Btn>
        </div>
      </div>
    </section>
  );
}