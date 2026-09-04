"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";

interface CarModel {
  id: number;
  name: string;
  watermark: string;
  image: string;
}

const MODELS: CarModel[] = [
  {
    id: 1,
    name: "INNOSON CARIS",
    watermark: "IVM",
    image: "/images/car-model-side.png",
  },
  {
    id: 2,
    name: "INNOSON CAPA",
    watermark: "IVM",
    image: "/images/image.webp",
  },
  {
    id: 3,
    name: "INNOSON G80",
    watermark: "IVM",
    image: "/images/image1.webp",
  },
];

export default function CarModelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ref to track touch start position for touch gestures on mobile
  const touchStartX = useRef<number | null>(null);

  const goPrev = () =>
    setActiveIndex((i) => (i - 1 + MODELS.length) % MODELS.length);
  const goNext = () =>
    setActiveIndex((i) => (i + 1) % MODELS.length);

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section className="font-[family-name:var(--font-google-sans)] w-full py-16 lg:py-[100px]">
      <Container className="flex flex-col gap-10 lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3 lg:gap-3">
            <h2 className="text-[24px] font-bold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[58px]">
              Explore our Car Model
            </h2>
            <p className="max-w-[781px] text-[14px] leading-[normal] text-black lg:text-[19px]">
              Find the perfect electric vehicle designed for performance, efficiency, and
              sustainability
            </p>
          </div>

          <Link
            href="/vehicles"
            className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-3 text-white lg:gap-4 transition-transform hover:scale-105"
          >
            <span className="text-[14px] font-semibold leading-normal lg:text-[19px]">
              See All Models
            </span>
            <span className="flex size-[18px] items-center justify-center rounded-full bg-white lg:size-8">
              <Image
                src="/icons/icon-arrow-up-right.svg"
                alt=""
                width={16}
                height={16}
                className="size-[9px] lg:size-4"
              />
            </span>
          </Link>
        </div>

        {/* Showcase Slider Container */}
        <div
          className="relative h-[360px] w-full overflow-hidden rounded-[4px] bg-[#e4e4e4] md:h-[520px] lg:h-[752px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {MODELS.map((model, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={model.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Watermark */}
                <span className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[110px] font-bold leading-none text-white opacity-40 md:text-[220px] lg:text-[375px]">
                  {model.watermark}
                </span>

                {/* Car Image */}
                <div className="absolute left-1/2 top-[36%] w-[85%] max-w-[961px] -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={model.image}
                    alt={model.name}
                    width={961}
                    height={483}
                    priority={index === 0}
                    className="h-auto w-full rounded-[10px] object-contain"
                  />
                </div>

                {/* Model Name */}
                <p className="absolute bottom-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[22px] font-bold leading-none text-black md:text-[36px] lg:text-[48px]">
                  {model.name}
                </p>
              </div>
            );
          })}

          {/* Navigation Controls */}
          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center transition-transform hover:scale-110 lg:left-10 lg:size-16"
          >
            <Image
              src="/icons/icon-chevron.svg"
              alt=""
              width={24}
              height={24}
              className="size-full"
            />
          </button>
          <button
            type="button"
            aria-label="Next model"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 flex size-10 -translate-y-1/2 rotate-180 items-center justify-center transition-transform hover:scale-110 lg:right-10 lg:size-16"
          >
            <Image
              src="/icons/icon-chevron.svg"
              alt=""
              width={24}
              height={24}
              className="size-full"
            />
          </button>
        </div>
      </Container>
    </section>
  );
}