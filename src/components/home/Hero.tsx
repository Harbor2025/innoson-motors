"use client";

import { useState } from "react";
import Image from "next/image";

const SLIDE_COUNT = 4;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[640px] lg:h-[1024px]">
      <Image
        src="/images/hero-truck.png"
        alt="IVM pickup truck driving through a tunnel"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="font-avenir absolute inset-x-0 top-[64px] flex flex-col items-center gap-3 px-5 text-center uppercase text-white md:top-[100px] lg:top-[142px] lg:gap-6">
        <p className="text-[14px] leading-none md:text-[18px] lg:text-[24px] lg:leading-[normal]">
          Africa&rsquo;s largest
        </p>
        <h1 className="max-w-[1105px] text-[28px] font-bold leading-[1.15] md:text-[48px] lg:text-[70px] lg:leading-[normal]">
          Automobile Company
        </h1>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 lg:bottom-14">
        {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeSlide === index}
            onClick={() => setActiveSlide(index)}
            className="size-4 border-[0.5px] border-[#b1cbe8]"
          >
            {activeSlide === index && <span className="block size-full scale-75 bg-white" />}
          </button>
        ))}
      </div>
    </section>
  );
}
