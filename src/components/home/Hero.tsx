"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { RevealWords } from "@/components/RevealWord";



// Define structured content for each slide
const SLIDES = [
  {
    id: 1,
    image: "/images/pexels-hyundaimotorgroup-12163946.jpg",
    subtitle: "Africa’s largest",
    title: "Automobile Company",
    alt: "IVM pickup truck driving through a tunnel",
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

const AUTOPLAY_DELAY = 10000; // 5 seconds per slide

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Ref to track touch start position for touch swipes on mobile
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    // Trigger slide change if swiped past 50px threshold
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section
      className="font-[family-name:var(--font-google-sans)] relative h-[420px] w-full overflow-hidden md:h-[90vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {SLIDES.map((slide, index) => {
        const isActive = activeSlide === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10 slide-active" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />

            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Dynamic Slide Content */}
            <div className="absolute inset-x-0 top-[150px] flex flex-col items-center gap-3 px-5 text-center text-white md:top-[100px] lg:top-[142px] lg:gap-6">
              <p className="text-[14px] leading-none md:text-[18px] lg:text-[19px] lg:leading-[normal]">
                <span className="reveal-subtitle">{slide.subtitle}</span>
              </p>
              <h1 className="max-w-[1105px] text-[28px] font-bold leading-[1.15] md:text-[48px] lg:text-[54px] lg:leading-[normal]">
                <RevealWords text={slide.title} />
              </h1>
            </div>
          </div>
        );
      })}



      {/* Slide Indicators / Pagination Buttons */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 lg:bottom-14">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeSlide === index}
            onClick={() => setActiveSlide(index)}
            className="size-4 border-[0.5px] border-[#fff] rounded-full"
          >
            {activeSlide === index && (
              <span className="block size-full scale-75 rounded-full bg-white transition-all duration-300" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}