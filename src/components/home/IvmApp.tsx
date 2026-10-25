"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { ShaderFill } from "@/lib/custom-effect-runtime";
import {
  setup,
  render,
  manifest,
} from "@/lib/custom-effects/CodeComponentId_93ecbfdedee6a6c1f34240e09cff118812a71482_30a87b968f33c0fc28877befb5ed6da7019657b1";
import { EYEBROW } from "./ui";
import { useInView } from "./useInView";

/**
 * "Your IVM, always within reach." (app teaser)
 * Figma: desktop 1069:2821 / tablet 1069:2913 / mobile 1069:2956.
 *
 * Background = photo + animated "IVM Aurora" WebGPU shader + left-to-right dark gradient.
 * Without WebGPU the photo shows instead. Store badges are "coming soon", so they're not links.
 * Icons live in /public/images/home/v2/icons (fetched by scripts/download-home-assets.sh).
 */

// Parameters exactly as set in the Figma file
const AURORA = {
  setup,
  render,
  manifest,
  params: {
    glowColor: { r: 0.550000011920929, g: 0.8199999928474426, b: 1, a: 1 },
    grain: 0.029999999329447746,
    baseColor: { r: 0.019999999552965164, g: 0.07000000029802322, b: 0.18000000715255737, a: 1 },
    speed: 0.4000000059604645,
    midColor: { r: 0, g: 0.3700000047683716, b: 0.7200000286102295, a: 1 },
    glow: 0.800000011920929,
    scale: 2.200000047683716,
  },
};

const ICONS = "/images/home/v2/icons";

const FEATURES = [
  { icon: `${ICONS}/feature-service.svg`, label: "Book a service" },
  { icon: `${ICONS}/feature-warranty.svg`, label: "Warranty" },
  { icon: `${ICONS}/feature-manual.svg`, label: "Owner’s manual" },
  { icon: `${ICONS}/feature-dealer.svg`, label: "Find a dealer" },
];

const STORES = [
  { icon: `${ICONS}/store-apple.svg`, name: "App Store", w: 22 },
  { icon: `${ICONS}/store-google-play.svg`, name: "Google Play", w: 20 },
];

export default function IvmApp({
  background = "/images/home/v2/app-card.png",
  phones = "/images/home/v2/app-phones.png",
}: {
  background?: string;
  phones?: string;
}) {
  const { ref, visible } = useInView<HTMLElement>(0.2);
  const i = (n: number) => ({ "--i": n }) as CSSProperties;

  return (
    <section ref={ref} data-visible={visible} className="relative isolate w-full overflow-hidden">
      {/* Background stack: photo, shader, gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 lg:inset-auto lg:left-0 lg:top-[-15.22%] lg:h-[130.43%] lg:w-full">
          <Image src={background} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <ShaderFill className="absolute inset-0 size-full" shader={AURORA} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,10,31,0.85)_0%,rgba(3,10,31,0.35)_55%,rgba(3,10,31,0.1)_100%)]" />
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 pt-14 md:px-10 md:pt-[72px] lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:pt-24 xl:px-24">
        <div className="flex w-full min-w-0 flex-col items-start gap-5 lg:flex-1 lg:pb-24">
          <div className="hv-rise flex items-center gap-[10px]">
            <p className={`text-[#8cd1ff] ${EYEBROW}`}>IVM App</p>
            <span className={`rounded-full bg-ivm-blue px-[10px] py-1 text-white ${EYEBROW} leading-normal`}>
              Coming soon
            </span>
          </div>

          <h2
            className="hv-rise text-[24px] font-semibold leading-[1.2] text-white md:text-[32px] lg:text-[48px]"
            style={i(1)}
          >
            Your IVM, always within reach.
          </h2>
          <p
            className="hv-rise text-[14px] leading-[1.4] text-white/80 md:text-[20px]"
            style={i(2)}
          >
            Soon you’ll be able to manage your vehicle, book a service, check your warranty and find a dealer -
            all from your phone.
          </p>

          <ul className="hv-rise flex w-full flex-wrap gap-[10px] md:gap-x-3" style={i(3)}>
            {FEATURES.map((f) => (
              <li
                key={f.label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.12] px-[14px] py-[9px] text-[14px] font-semibold leading-[1.4] text-white"
              >
                <Image src={f.icon} alt="" width={18} height={18} unoptimized className="size-[18px]" />
                {f.label}
              </li>
            ))}
          </ul>

          <div className="hv-rise flex w-full flex-col gap-[10px] pt-2 md:w-auto md:flex-row" style={i(4)}>
            {STORES.map((s) => (
              <div
                key={s.name}
                role="img"
                aria-label={`${s.name}, coming soon`}
                className="flex items-center justify-center gap-[10px] rounded-[10px] border border-white/25 bg-black py-[9px] pl-4 pr-5 text-white opacity-75"
              >
                <Image
                  src={s.icon}
                  alt=""
                  width={s.w}
                  height={22}
                  unoptimized
                  className="h-[22px]"
                  style={{ width: s.w }}
                />
                <span className="flex flex-col items-start">
                  <span className="text-[10px] leading-[1.2]">Coming soon to the</span>
                  <span className="text-[20px] font-semibold leading-[1.3] md:leading-[1.4]">{s.name}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[300px] w-full shrink-0 md:h-[420px] lg:h-[440px] lg:w-[48%] lg:max-w-[600px]">
          <Image
            src={phones}
            alt="The IVM app on two phones"
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-contain lg:object-cover"
          />
        </div>
      </div>
    </section>
  );
}