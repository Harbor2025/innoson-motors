"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Btn, EYEBROW, ROUTES } from "./ui";
import { useInView } from "./useInView";

/**
 * "Special offer" card.
 * Figma: desktop 943:458 (card 720 tall) / tablet 958:515 (620) / mobile 957:478 (640).
 * Replaces both the old HottestDealCard (mobile/tablet) and the old desktop-only SpecialOfferCard.
 */

type Props = {
  label?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  quoteHref?: string;
  moreHref?: string;
};

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default function SpecialOfferCard({
  label = "Special offer",
  title = "So it’s time for a new ride.",
  description = "Brand-new, made in Nigeria, with Access Bank financing available.",
  price = "₦28,000,000",
  image = "/images/home/v2/offer.png",
  quoteHref = ROUTES.quote,
  moreHref = ROUTES.vehicles,
}: Props) {
  const { ref, visible } = useInView<HTMLElement>(0.3);

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="mx-auto w-full max-w-[1440px] px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8"
    >
      <div className="relative flex h-[640px] flex-col items-start justify-end gap-3 overflow-hidden bg-ivm-ink px-6 pb-7 text-white md:h-[620px] md:gap-[14px] md:px-0 md:pb-10 md:pl-10 lg:h-[720px] lg:gap-4 lg:pb-16 lg:pl-16">
        <div className="hv-settle absolute inset-0">
          <Image src={image} alt="" fill sizes="(min-width: 1440px) 1376px, 100vw" className="object-cover" />
        </div>

        {/* Mobile: dark from the bottom. Tablet/desktop: dark from the left. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_30%,rgba(0,0,0,0.8)_75%,rgba(0,0,0,0.9)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0)_70%)] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_55%)]" />

        <p className={`hv-rise relative text-ivm-lime ${EYEBROW}`} style={i(0)}>
          {label}
        </p>
        <h2
          className="hv-rise relative max-w-[310px] text-[24px] font-semibold leading-[1.2] md:max-w-[360px] md:text-[32px] lg:max-w-[440px] lg:text-[48px]"
          style={i(1)}
        >
          {title}
        </h2>
        <p
          className="hv-rise relative max-w-[310px] text-[14px] leading-[1.4] md:max-w-[340px] md:text-[16px] lg:max-w-[480px] lg:text-[20px]"
          style={i(2)}
        >
          {description}
        </p>

        <div className="hv-rise relative flex flex-col md:gap-[2px]" style={i(3)}>
          <p className="text-[12px] leading-[1.4] md:text-[14px] lg:text-[16px]">Starting from</p>
          <p className="whitespace-nowrap text-[28px] font-semibold leading-[1.2] md:text-[48px] lg:text-[56px] lg:leading-[1.1]">
            {price}
          </p>
        </div>

        <div
          className="hv-rise relative flex w-full flex-col gap-[10px] md:w-auto md:flex-row md:gap-3 lg:gap-4"
          style={i(4)}
        >
          <Btn href={quoteHref} className="w-full md:w-[180px] lg:w-[200px]">
            Get a Quote
          </Btn>
          <Btn href={moreHref} variant="secondary" className="w-full md:w-[180px] lg:w-[200px]">
            Discover More
          </Btn>
        </div>
      </div>
    </section>
  );
}