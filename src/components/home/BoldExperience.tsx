"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BoldExperience() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // play once
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
      className="font-[family-name:var(--font-google-sans)] relative h-[371px] w-full overflow-hidden md:h-[560px] lg:h-[800px]"
    >
      <div className="bx-image absolute inset-0">
        <Image
          src="/images/pexels-framesbyambro-14649124.jpg"
          alt="IVM Caris on display in a showroom"
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

      <div className="absolute inset-0 flex items-center px-5 lg:px-[50px]">
        <div className="flex max-w-[807px] flex-col items-start gap-6 text-white lg:gap-10">
          <div className="flex flex-col gap-3 lg:gap-6">
            <h2 className="text-[24px] font-bold leading-[normal] lg:text-[44px] lg:leading-[90px]">
              <span className="bx-wipe">
                <span>The Bold Experience</span>
              </span>
            </h2>
            <p className="bx-fade max-w-[531px] text-[14px] leading-[normal] lg:text-[19px]">
              IVM Caris is one of our forays into future car designs. With a captivating
              sleeker design,
            </p>
          </div>
          <Link
            href="/vehicles/caris"
            className="bx-cta text-[16px] font-bold leading-[normal] lg:text-[26px]"
          >
            Explore Innoson Cars
          </Link>
        </div>
      </div>
    </section>
  );
}