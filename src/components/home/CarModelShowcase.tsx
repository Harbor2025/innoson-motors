"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import type { Vehicle } from "@/components/vehicles/vehicles-data";

// Figma: desktop 766:467 (1340 wide, 752 tall stage) / mobile 773:1815 (353 wide, 308 stage)

interface CarModel {
  id: string;
  name: string;
  watermark: string;
  image: string;
  slug?: string;
}

const FALLBACK: CarModel[] = [
  { id: "fb-1", name: "Innoson Caris", watermark: "IVM", image: "/images/car-model-side.png", slug: "caris" },
  { id: "fb-2", name: "Innoson Capa", watermark: "IVM", image: "/images/car-model-side.png" },
  { id: "fb-3", name: "Innoson G80", watermark: "IVM", image: "/images/car-model-side.png" },
];

function watermarkFromName(name: string): string {
  const t = name.trim().toUpperCase();
  const tokens = t.split(/\s+/).filter(Boolean);
  if (tokens[0] === "INNOSON") tokens.shift();
  if (tokens.length === 0) return "IVM";
  if (tokens.length === 1) {
    const w = tokens[0];
    return w.length > 3 ? w.slice(0, 3) : w;
  }
  return (tokens[0]?.[0] ?? "") + (tokens[1]?.[0] ?? "") + (tokens[2]?.[0] ?? "M");
}

const AVENIR = "font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif]";

export default function CarModelShowcase({
  initialVehicles,
}: {
  initialVehicles?: Vehicle[];
}) {
  const models: CarModel[] =
    initialVehicles && initialVehicles.length > 0
      ? initialVehicles.slice(0, 12).map((v) => ({
          id: v.id,
          name: v.name,
          watermark: watermarkFromName(v.name) || "IVM",
          image: v.image,
          slug: "slug" in v ? String((v as { slug?: string }).slug) : undefined,
        }))
      : FALLBACK;

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
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

  const count = models.length;
  const goPrev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const goNext = () => setActiveIndex((i) => (i + 1) % count);
  const progress = `${((activeIndex + 1) / count) * 100}%`;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  return (
    <section ref={sectionRef} className="cs-root mt-10 w-full lg:mt-20">
      <Container className="flex flex-col gap-6 lg:gap-10">
        {/* Heading row */}
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3 lg:w-[781px]">
            <h2
              className={`text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:font-semibold lg:capitalize lg:leading-[58px] ${AVENIR} lg:font-[family-name:var(--font-inter)]`}
            >
              Explore our Car Model
            </h2>
            <p
              className={`text-[14px] leading-[normal] text-black lg:text-[20px] lg:font-light ${AVENIR} lg:font-[family-name:var(--font-inter)]`}
            >
              Find the perfect electric vehicle designed for performance, efficiency, and
              sustainability
            </p>
          </div>

          <Link
            href="/vehicles"
            className="flex w-fit shrink-0 items-center gap-[9px] rounded-[4px] bg-[#005eb8] px-[9px] py-[7px] text-white transition-transform hover:scale-105 lg:gap-4 lg:px-4 lg:py-3"
          >
            <span className="whitespace-nowrap text-[13.714px] font-semibold leading-normal font-[family-name:var(--font-lato)] lg:text-[24px]">
              See All Model
            </span>
            <span className="flex size-[18.286px] items-center justify-center rounded-full bg-white lg:size-8">
              <Image
                src="/icons/icon-arrow-up-right.svg"
                alt=""
                width={16}
                height={16}
                className="size-[8.777px] lg:size-[15.36px]"
              />
            </span>
          </Link>
        </div>

        {/* Stage */}
        <div
          className="relative h-[308px] w-full overflow-hidden rounded-[2px] bg-[#e4e4e4] md:h-[520px] lg:h-[752px] lg:rounded-[4px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {models.map((model, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={model.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? "cs-active z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                }`}
              >
                {/* Watermark exists on mobile only in the design */}
                <span
                  className={`cs-mark absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[97px] font-extrabold leading-none text-white opacity-40 md:text-[220px] lg:hidden ${AVENIR}`}
                >
                  {model.watermark}
                </span>

                <div className="absolute left-1/2 top-[44%] w-[98.5%] max-w-[961px] -translate-x-1/2 -translate-y-1/2 lg:top-[47.4%] lg:w-[71.7%]">
                  <Image
                    src={model.image}
                    alt={model.name}
                    width={961}
                    height={483}
                    priority={index === 0}
                    className="cs-car h-auto w-full rounded-[4px] object-contain lg:rounded-[10px]"
                  />
                </div>

                <p
                  className={`cs-name absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[24px] font-extrabold uppercase leading-none text-[#1e1e1e] md:bottom-[10%] lg:bottom-[68px] lg:text-[40px] lg:font-semibold lg:normal-case lg:text-black ${AVENIR} lg:font-[family-name:var(--font-inter)]`}
                >
                  {model.name}
                </p>
              </div>
            );
          })}

          {/* Desktop: arrows + progress live inside the stage */}
          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="absolute left-10 top-1/2 z-20 hidden size-16 -translate-y-1/2 items-center justify-center transition-transform hover:scale-110 lg:flex"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
          </button>
          <button
            type="button"
            aria-label="Next model"
            onClick={goNext}
            className="absolute right-10 top-1/2 z-20 hidden size-16 -translate-y-1/2 rotate-180 items-center justify-center transition-transform hover:scale-110 lg:flex"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
          </button>
          <div className="absolute inset-x-10 bottom-[37px] z-20 hidden h-2 bg-white lg:block">
            <div
              className="h-full bg-[#1e1e1e] transition-[width] duration-500 ease-out"
              style={{ width: progress }}
            />
          </div>
        </div>

        {/* Mobile / tablet: controls sit under the stage */}
        <div className="flex items-center justify-between gap-[10px] lg:hidden">
          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="size-8 shrink-0"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={32} height={32} className="size-full" />
          </button>
          <div className="h-1 flex-1 bg-[#e9e9e9]">
            <div
              className="h-full bg-[#1e1e1e] transition-[width] duration-500 ease-out"
              style={{ width: progress }}
            />
          </div>
          <button
            type="button"
            aria-label="Next model"
            onClick={goNext}
            className="size-8 shrink-0 rotate-180"
          >
            <Image src="/icons/icon-chevron.svg" alt="" width={32} height={32} className="size-full" />
          </button>
        </div>
      </Container>
    </section>
  );
}
