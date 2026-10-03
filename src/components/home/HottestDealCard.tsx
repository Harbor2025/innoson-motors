"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * "Hottest Deal" hero — IVM Caris (responsive)
 * Figma: IVM-website — mobile node 745:329 (353x558), desktop node 745:246 (755 tall)
 *
 * The section fills 100% of its parent (no max-width), so any padding/container
 * around it controls the margin. Height: 558px on mobile, 755px from md up.
 *
 * Assets in /public/hottest-deal/:
 *  mobile : caris-bg.png, ellipse-top.svg, ellipse-bottom.svg
 *  desktop: caris-bg-desktop.png, ellipse-desktop.svg
 *  shared : icon-engine.svg, icon-safety.svg, icon-seat.svg, icon-wifi.svg
 *
 * Animations are Tailwind-only. The section is a `group`; once it scrolls into
 * view the observer sets data-visible="true" and every `group-data-[visible=true]:`
 * class flips on.
 */

// Reusable reveal states (full class names so Tailwind can detect them)
const RISE =
  "opacity-0 translate-y-4 blur-[3px] transition-[opacity,translate,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:opacity-100 group-data-[visible=true]:translate-y-0 group-data-[visible=true]:blur-none";

const SLIDE =
  "opacity-0 -translate-x-6 blur-[4px] transition-[opacity,translate,filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:opacity-100 group-data-[visible=true]:translate-x-0 group-data-[visible=true]:blur-none";

const GLOW =
  "opacity-0 transition-opacity duration-[3200ms] delay-500 ease-out motion-reduce:transition-none group-data-[visible=true]:opacity-100";

const BG =
  "scale-110 brightness-[0.6] transition-[scale,filter] duration-[2800ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:scale-100 group-data-[visible=true]:brightness-100";

const FEATURE_DELAYS = ["delay-[1500ms]", "delay-[1650ms]", "delay-[1800ms]", "delay-[1950ms]"];

const features = [
  { icon: "/hottest-deal/icon-engine.svg", label: "Powerful engine" },
  {
    icon: "/hottest-deal/icon-safety.svg",
    label: "Advanced & Safety features",
    nested: true, // this SVG is a group exported with Figma's inner insets
  },
  { icon: "/hottest-deal/icon-seat.svg", label: "Spacious interior" },
  { icon: "/hottest-deal/icon-wifi.svg", label: "Smart connectivity" },
];

function FeatureIcon({ src, nested }: { src: string; nested?: boolean }) {
  return (
    <div className="relative size-[13.641px] shrink-0 overflow-clip md:size-10">
      {nested ? (
        <div className="absolute inset-[8.33%_12.5%]">
          <div className="absolute inset-[-3.75%_-4.17%]">
            <Image alt="" src={src} fill unoptimized />
          </div>
        </div>
      ) : (
        <Image alt="" src={src} fill unoptimized />
      )}
    </div>
  );
}

type HottestDealCardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  price?: string;
  href?: string;
};

export default function HottestDealCard({
  eyebrow = "Hottest Deal",
  title = "IVM Caris",
  description = "The IVM Caris blends modern design with advanced technology, giving you a smoother, safer and more exciting drive-every time",
  price = "N42,500,000",
  href = "/vehicles",
}: HottestDealCardProps) {
  const ref = useRef<HTMLElement>(null);

  // Plays once when the card scrolls into view.
  // data-visible is set directly on the DOM so React re-renders never reset it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: show the final state straight away (transitions are also disabled)
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
      className="group relative isolate min-h-[558px] w-[90%] overflow-hidden bg-white text-white md:min-h-[755px] mx-3 mt-5 mb-3"
      style={{ fontFamily: "Avenir, 'Avenir Next', 'Nunito Sans', sans-serif" }}
    >
      {/* Background photo — different crop per breakpoint. Slow push-in while it "warms up". */}
      <Image
        src="/hottest-deal/caris-bg.png"
        alt=""
        fill
        sizes="100vw"
        className={`-z-30 object-cover object-bottom md:hidden ${BG}`}
      />
      <Image
        src="/hottest-deal/caris-bg-desktop.png"
        alt=""
        fill
        sizes="100vw"
        className={`-z-30 hidden object-cover object-right md:block ${BG}`}
      />

      {/* Mobile glows */}
      <div
        className={`pointer-events-none absolute inset-0 -z-20 md:hidden ${GLOW}`}
        aria-hidden
      >
        <div className="absolute left-[-160px] top-[-210px] flex h-[630.835px] w-[585.682px] items-center justify-center">
          <div className="flex-none rotate-[86.97deg]">
            <div className="relative h-[554.65px] w-[602.39px]">
              <div className="absolute inset-[-22.41%_-20.63%]">
                <Image alt="" src="/hottest-deal/ellipse-top.svg" fill unoptimized />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[-100.07px] top-[470.67px] flex h-[395.341px] w-[497.425px] items-center justify-center">
          <div className="-scale-y-100 flex-none rotate-[-93.03deg]">
            <div className="relative h-[478.525px] w-[370.593px]">
              <div className="absolute inset-[-25.98%_-33.54%]">
                <Image alt="" src="/hottest-deal/ellipse-bottom.svg" fill unoptimized />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop glow */}
      <div
        className={`pointer-events-none absolute left-[-488px] top-[-115px] -z-20 hidden h-[1115.974px] w-[1212.029px] md:block ${GLOW}`}
        aria-hidden
      >
        <div className="absolute inset-[-11.14%_-10.26%]">
          <Image alt="" src="/hottest-deal/ellipse-desktop.svg" fill unoptimized />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-[inherit] flex-col px-4 pb-5 pt-4 md:px-[50px] md:pb-[53px] md:pt-20">
        <div className="flex max-w-[610px] flex-col gap-6 md:gap-[72px]">
          <div className="flex flex-col gap-3">
            {/* Eyebrow: flashes hot, then cools to its normal lime */}
            <p className="text-base font-extrabold uppercase leading-normal text-[#a4e41a] opacity-0 [text-shadow:0_0_32px_rgba(164,228,26,0.95)] transition-[opacity,text-shadow] delay-[400ms] duration-[1800ms] ease-out motion-reduce:transition-none group-data-[visible=true]:opacity-100 group-data-[visible=true]:[text-shadow:0_0_0_rgba(164,228,26,0)] md:text-2xl font-[family-name:var(--font-inter)]">
              {eyebrow}
            </p>
            <h2
              className={`text-[32px] font-extrabold uppercase leading-normal delay-[650ms] md:text-5xl md:leading-[58px] font-[family-name:var(--font-google-sans)] ${SLIDE}`}
            >
              {title}
            </h2>
            <p
              className={`text-base font-normal leading-normal delay-[950ms] md:text-2xl font-[family-name:var(--font-inter)] ${RISE}`}
            >
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 leading-normal">
            <p
              className={`text-base font-normal delay-[1150ms] md:text-2xl font-[family-name:var(--font-inter)] ${RISE}`}
            >
              Starting from
            </p>
            <p className="origin-left scale-95 text-2xl font-black opacity-0 transition-[opacity,scale] delay-[1300ms] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-data-[visible=true]:scale-100 group-data-[visible=true]:opacity-100 md:text-4xl font-[family-name:var(--font-google-sans)]">
              {price}
            </p>
          </div>
        </div>

        {/* Wrapper carries the reveal so the link's own hover transition stays instant */}
        <div className={`mt-[21px] w-fit delay-[1450ms] md:mt-9 ${RISE}`}>
          <Link
            href={href}
            className="block w-fit text-xl font-extrabold leading-normal underline underline-offset-[from-font] transition-colors duration-300 hover:text-[#a4e41a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4e41a] md:text-2xl font-[family-name:var(--font-inter)]"
          >
            Discover More
          </Link>
        </div>

        {/* Feature strip — pinned to the bottom */}
        <ul className="mt-auto flex w-full items-stretch pt-10 lg:w-auto lg:self-start">
          {features.map((f, i) => (
            <li
              key={f.label}
              className={`flex-none border-white/40 px-[13.641px] first:pl-0 last:pr-0 md:flex-1 md:px-6 lg:flex-none lg:px-10 [&:not(:first-child)]:border-l font-[family-name:var(--font-inter)] ${FEATURE_DELAYS[i] ?? ""} ${RISE}`}
            >
              <div className="flex w-[49.789px] flex-col gap-[5.456px] md:w-auto md:gap-4 lg:w-[146px]">
                <FeatureIcon src={f.icon} nested={f.nested} />
                <p className="text-[6.82px] font-normal leading-normal md:text-xl font-[family-name:var(--font-inter)]">
                  {f.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
