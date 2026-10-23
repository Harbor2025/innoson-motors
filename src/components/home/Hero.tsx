"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { Btn, ROUTES } from "./ui";

/**
 * Hero carousel.
 * Figma: desktop 943:443 (1440x860) / tablet 958:500 (768x900) / mobile 957:464 (393x720).
 *
 * Only slide 1 exists in the design. Slides 2 and 3 keep your existing photos/copy,
 * re-laid out in the new typography. Edit SLIDES to change them.
 */
const SLIDES = [
  {
    id: 1,
    image: "/images/home/v2/hero.png",
    eyebrow: "Nigeria’s first indigenous automaker",
    title: "Pride of African Roads",
    alt: "IVM sedan on an open road at sunset",
  },
  {
    id: 2,
    image: "/images/home/v2/hero.png",
    eyebrow: "Built for Africa",
    title: "Unmatched Strength & Durability",
    alt: "Featured IVM vehicle showpiece",
  },
  {
    id: 4,
    image: "/images/home/v2/hero.png",
    eyebrow: "Quality & Reliability",
    title: "Engineered for Perfection",
    alt: "IVM vehicle interior",
  },
];

// The Figma motion timeline is 12 s long; one slide = one full loop.
const AUTOPLAY_DELAY = 12000;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => setActiveSlide((p) => (p + 1) % SLIDES.length), []);
  const prevSlide = useCallback(
    () => setActiveSlide((p) => (p - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, activeSlide]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? nextSlide : prevSlide)();
    touchStartX.current = null;
  };

  return (
    <section
      id="home-hero"
      className="relative h-[720px] w-full overflow-hidden bg-[#0a0d12] md:h-[900px] lg:h-[860px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured"
    >
      {SLIDES.map((slide, index) => {
        const isActive = activeSlide === index;
        const Title = index === 0 ? "h1" : "h2";
        const words = slide.title.split(" ");
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "slide-active z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <div className="hero-media absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {/* Overlay + nav scrim (Figma "Overlay" / "Nav scrim") */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.7) 100%)",
              }}
            />
            <div className="absolute inset-x-0 top-0 h-[160px] bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0))]" />

            {/* Heading */}
            <div className="absolute inset-x-0 top-[72px] flex flex-col items-center gap-[10px] px-6 text-center text-white md:top-24 md:gap-3 lg:top-[120px]">
              <p className="hero-eyebrow text-[14px] font-semibold leading-[1.4]">{slide.eyebrow}</p>
              <Title className="max-w-[342px] text-[28px] font-semibold leading-[1.2] md:max-w-none md:text-[40px] lg:text-[56px] lg:leading-[1.1]">
                {words.map((w, i) => (
                  <Fragment key={i}>
                    {i > 0 && " "}
                    <span className="hero-word inline-block" style={{ "--i": i } as CSSProperties}>
                      {w}
                    </span>
                  </Fragment>
                ))}
              </Title>
            </div>
          </div>
        );
      })}

      {/* CTAs + dots (static across slides) */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 px-6 md:bottom-12 md:gap-7 md:px-0 lg:bottom-14 lg:gap-8">
        <div
          className="hero-rise-24 flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-4 lg:gap-6"
          style={{ "--d": "1.18s" } as CSSProperties}
        >
          <Btn href={ROUTES.vehicles} className="w-full md:w-[300px] lg:w-[264px]">
            Explore Vehicles
          </Btn>
          <Btn href={ROUTES.testDrive} variant="secondary" className="w-full md:w-[300px] lg:w-[264px]">
            Book a Test Drive
          </Btn>
        </div>

        {/* Dots: active = 24px pill, others 8px (all white in the design) */}
        <div
          className="hero-rise-24 flex items-center gap-2 pt-3 md:pt-0"
          style={{ "--d": "1.36s" } as CSSProperties}
        >
          {SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index}
              onClick={() => setActiveSlide(index)}
              className={`relative h-2 rounded-full bg-white transition-[width] duration-300 before:absolute before:-inset-2 before:content-[''] ${
                activeSlide === index ? "w-6" : "w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}