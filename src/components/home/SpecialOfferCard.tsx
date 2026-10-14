"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

/**
 * Desktop "Special offer" banner (lg and up).
 * Figma: node 768:563 (1340x811) + children 843:402 / 848:255 / 848:259 / 848:260.
 *
 * In the desktop frame the old "Hottest Deal" layers sit underneath a full-size photo,
 * so only this banner is visible. Mobile still shows the Hottest Deal card.
 */

const RISE =
  "opacity-0 translate-y-4 blur-[3px] transition-[opacity,translate,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:opacity-100 group-data-[visible=true]:translate-y-0 group-data-[visible=true]:blur-none";

type SpecialOfferCardProps = {
  label?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
};

export default function SpecialOfferCard({
  label = "Special offer",
  title = "So It’s Time for a New Ride.",
  description = "Find the perfect electric vehicle designed for performance, efficiency, and sustainability",
  price = "N28,000,000",
  image = "/images/home/special-offer-bg.png",
}: SpecialOfferCardProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="group mx-auto mt-20 hidden w-full max-w-[1440px] px-[50px] lg:block rounded-md"
    >
      <div className="relative h-[811px] w-full overflow-hidden bg-[#1e1e1e]">
        <Image
          src={image}
          alt=""
          fill
          sizes="1340px"
          className="scale-110 object-cover transition-transform duration-[2600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:scale-100"
        />

        <div className="absolute left-[75px] top-[409px] flex w-[399px] flex-col text-white">
          <p
            className={`text-[20px] capitalize leading-[31px] text-[#878383] delay-[300ms] font-[family-name:var(--font-inter)] ${RISE}`}
          >
            {label}
          </p>
          <h2
            className={`text-[40px] font-semibold capitalize leading-[44px] delay-[500ms] font-[family-name:var(--font-inter)] ${RISE}`}
          >
            {title}
          </h2>
          <p
            className={`mt-4 text-[20px] font-light leading-[normal] delay-[700ms] font-[family-name:var(--font-inter)] ${RISE}`}
          >
            {description}
          </p>
          <p
            className={`mt-6 text-[56px] font-semibold capitalize leading-[normal] delay-[900ms] font-[family-name:var(--font-inter)] ${RISE}`}
          >
            {price}
          </p>
        </div>
      </div>
    </section>
  );
}
