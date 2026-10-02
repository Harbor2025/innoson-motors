"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EvCollectionBanner() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-inview={inView}
      className="font-[family-name:var(--font-google-sans)] relative h-[342px] w-full overflow-hidden md:h-[540px] lg:h-[807px]"
    >
      <div className="ev-image absolute inset-0">
        <Image
          src="/images/pexels-mohit-hambiria-92377455-36863205.jpg"
          alt="Electric vehicle charging in a city"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(-65deg, rgba(255,255,255,0) 35.431%, rgba(0,0,0,0.39) 63.057%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-center gap-6 px-5 py-10 text-white lg:gap-10 lg:px-[73px]">
        
        <h2
          className="ev-feather max-w-[778px] text-[24px] font-bold lg:text-[44px]"
          style={{ "--d": "0.4s" } as React.CSSProperties}
        >
          Explore Our Latest EV Collection
        </h2>

        <p
          className="ev-feather max-w-[674px] text-[14px] leading-[normal] lg:text-[19px]"
          style={{ "--d": "0.9s" } as React.CSSProperties}
        >
          Discover our newest range of innovative electric vehicles, combining modern design,
          advanced technology.
        </p>

        <Link
          href="/vehicles/electric"
          className="ev-cta flex w-fit items-center gap-3 text-[16px] font-bold leading-[normal] lg:text-[26px]"
        >
          <span className="underline underline-offset-4">Discover More</span>
          <svg
            className="ev-arrow h-[1em] w-[1em]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}