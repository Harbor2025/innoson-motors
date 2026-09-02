"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";

interface CarModel {
  name: string;
  watermark: string;
  image: string;
}

const MODELS: CarModel[] = [
  {
    name: "INNOSON CARIS",
    watermark: "IVM",
    image: "/images/car-model-side.png",
  },
];

export default function CarModelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const model = MODELS[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i - 1 + MODELS.length) % MODELS.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % MODELS.length);

  return (
    <section className="font-avenir w-full py-16 lg:py-[100px]">
      <Container className="flex flex-col gap-10 lg:gap-10">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex flex-col gap-3 lg:gap-3">
            <h2 className="text-[24px] font-bold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[58px]">
              Explore our Car Model
            </h2>
            <p className="max-w-[781px] text-[14px] leading-[normal] text-black lg:text-[24px]">
              Find the perfect electric vehicle designed for performance, efficiency, and
              sustainability
            </p>
          </div>

          <Link
            href="/vehicles"
            className="flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-3 text-white lg:gap-4"
          >
            <span
              className="font-[family-name:var(--font-lato)] text-[14px] font-semibold leading-normal lg:text-[24px]"
            >
              See All Model
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

        <div className="relative h-[360px] w-full overflow-hidden rounded-[4px] bg-[#e4e4e4] md:h-[520px] lg:h-[752px]">
          <span className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[110px] font-bold leading-none text-white opacity-40 md:text-[220px] lg:text-[375px]">
            {model.watermark}
          </span>

          <div className="absolute left-1/2 top-[36%] w-[85%] max-w-[961px] -translate-x-1/2 -translate-y-1/2">
            <Image
              src={model.image}
              alt={model.name}
              width={961}
              height={483}
              className="h-auto w-full rounded-[10px] object-contain"
            />
          </div>

          <p className="absolute bottom-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[22px] font-bold leading-none text-black md:text-[36px] lg:text-[48px]">
            {model.name}
          </p>

          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center lg:left-10 lg:size-16"
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
            className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rotate-180 lg:right-10 lg:size-16"
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
