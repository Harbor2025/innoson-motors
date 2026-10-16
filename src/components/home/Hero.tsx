"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { RevealWords } from "@/components/RevealWord";

// Figma: desktop 766:401 (1440x1024) / mobile 773:1738 (393x530)
// `mobileImage` is optional: the mobile design uses a different crop/photo for slide 1.
const SLIDES = [
  {
    id: 1,
    image: "/images/home/hero-1.png",
    mobileImage: "/images/home/hero-1-mobile.png",
    subtitle: "Africa’s largest",
    title: "Automobile Company",
    alt: "IVM pickup truck at sunset",
  },
  {
    id: 2,
    image: "/images/4041.jpg",
    subtitle: "Built for Africa",
    title: "Unmatched Strength & Durability",
    alt: "Featured IVM vehicle showpiece",
  },
  {
    id: 4,
    image: "/images/interior-hero.jpg",
    subtitle: "Quality & Reliability",
    title: "Engineered for Perfection",
    alt: "IVM vehicle in action",
  },
];

const AUTOPLAY_DELAY = 10000;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) (diffX > 0 ? nextSlide : prevSlide)();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative h-[740px] w-full overflow-hidden md:h-[720px] lg:h-[720px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {SLIDES.map((slide, index) => {
        const isActive = activeSlide === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "slide-active z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {slide.mobileImage ? (
              <>
                <Image
                  src={slide.mobileImage}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover md:hidden"
                />
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="hidden object-cover md:block"
                />
              </>
            ) : (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-black/30" />

            {/*
              Mobile: small eyebrow (Roboto 14, caps) over big Playfair title (24, caps).
              Desktop: the two lines swap roles — first line is the 56px Inter headline,
              second line is the 20px regular sub-line (as in the Figma).
            */}
            <div className="absolute inset-x-0 top-[116px] flex flex-col items-center gap-4 px-5 text-center text-white md:top-[160px] lg:top-[227px] lg:gap-6">
              <p className="text-[14px] uppercase leading-[normal] font-[family-name:var(--font-inter)] md:text-[16px] lg:text-[56px] lg:font-bold lg:capitalize lg:font-[family-name:var(--font-inter)]">
                <span className="reveal-subtitle">{slide.subtitle}</span>
              </p>
              <h1 className="max-w-[1105px] text-[24px] font-bold uppercase leading-[normal] font-[family-name:var(--font-google-sans)] md:text-[40px] lg:text-[20px] lg:font-normal lg:capitalize lg:font-[family-name:var(--font-inter)]">
                <RevealWords text={slide.title} />
              </h1>
            </div>
          </div>
        );
      })}

      {/* Pagination: 16px solid dots, active = white, inactive = #6c6c6c */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 lg:bottom-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeSlide === index}
            onClick={() => setActiveSlide(index)}
            className={`size-4 rounded-full transition-colors duration-300 ${
              activeSlide === index ? "bg-white" : "bg-[#6c6c6c]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
