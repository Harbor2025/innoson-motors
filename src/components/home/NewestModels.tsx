"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";

/**
 * "Newest car model" carousel.
 * Figma: desktop node 768:636 (cards 994x722, 40px gap, next card peeks in from the right),
 *        mobile nodes 773:1850 / 773:1868 (cards 295x285, 16px gap).
 * Pass `items` to drive it from data; the fallback mirrors the placeholder copy in the design.
 */

export interface NewestModelItem {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const DESC =
  "Find the perfect electric vehicle designed for performance, efficiency, and sustainability";

const FALLBACK: NewestModelItem[] = [
  { id: "n1", title: "Newest car model", description: DESC, image: "/images/home/newest-1.png", href: "/vehicles" },
  { id: "n2", title: "Newest car model", description: DESC, image: "/images/home/newest-2.png", href: "/vehicles" },
  { id: "n3", title: "Newest car model", description: DESC, image: "/images/home/newest-1.png", href: "/vehicles" },
  { id: "n4", title: "Newest car model", description: DESC, image: "/images/home/newest-2.png", href: "/vehicles" },
];

export default function NewestModels({ items = FALLBACK }: { items?: NewestModelItem[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = items.length;
  const go = (i: number) => setIndex(Math.min(Math.max(i, 0), count - 1));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(index + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  if (count === 0) return null;

  return (
    <section
      className="relative mt-10 w-full overflow-hidden lg:mt-[130px]"
      aria-roledescription="carousel"
      aria-label="Newest car models"
    >
      <Container>
        <div
          className="flex gap-[var(--gap)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [--gap:16px] [--w:295px] lg:[--gap:40px] lg:[--w:994px]"
          style={{ transform: `translateX(calc(${index} * (var(--w) + var(--gap)) * -1))` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {items.map((item, i) => (
            <article
              key={item.id}
              aria-hidden={i !== index}
              className="relative h-[285px] w-[var(--w)] shrink-0 overflow-hidden rounded-[1.268px] lg:h-[722px] lg:rounded-[4px]"
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 994px, 295px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />

              <div
                className="absolute inset-x-0 bottom-0 h-[127px] lg:h-[259px]"
                style={{
                  backgroundImage:
                    "linear-gradient(5.35deg, rgba(0,0,0,0.11) 20.385%, rgba(102,102,102,0.11) 63.219%)",
                }}
              >
                <div className="absolute bottom-[12.6px] left-[12.68px] flex w-[247.5px] flex-col items-start gap-[15px] text-white lg:bottom-10 lg:left-10 lg:w-[781px] lg:gap-6">
                  <div className="flex w-full flex-col gap-3">
                    <h3 className="text-[20px] font-semibold uppercase leading-[18.38px] font-[family-name:var(--font-google-sans)] lg:text-[40px] lg:capitalize lg:leading-[58px] lg:font-[family-name:var(--font-inter)]">
                      {item.title}
                    </h3>
                    <p className="text-[12px] font-light leading-[normal] font-[family-name:var(--font-inter)] lg:text-[20px] lg:font-normal">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    tabIndex={i === index ? 0 : -1}
                    className="flex h-[31px] w-[73px] items-center justify-center rounded-[1.268px] bg-[#005eb8] p-[3.169px] text-[12px] font-medium text-white font-[family-name:var(--font-inter)] lg:h-auto lg:w-[173px] lg:rounded-[4px] lg:p-[10px] lg:text-[20px]"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Desktop arrows, pinned to the container edges */}
      {index > 0 && (
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(index - 1)}
          className="absolute left-[50px] top-[329px] z-10 hidden size-16 items-center justify-center transition-transform hover:scale-110 lg:flex"
        >
          <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
        </button>
      )}
      {index < count - 1 && (
        <button
          type="button"
          aria-label="Next"
          onClick={() => go(index + 1)}
          className="absolute right-[50px] top-[329px] z-10 hidden size-16 rotate-180 items-center justify-center transition-transform hover:scale-110 lg:flex"
        >
          <Image src="/icons/icon-chevron.svg" alt="" width={24} height={24} className="size-full" />
        </button>
      )}

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-4 lg:mt-10">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`size-4 rounded-full transition-colors duration-300 ${
              i === index ? "bg-black" : "bg-[#d9d9d9]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
