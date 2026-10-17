"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string; // e.g. "100K+", "20+", "0%", "1,500", "3.5M"
  duration?: number; // ms
  className?: string;
};

const PATTERN = /^(\D*)(\d[\d,]*\.?\d*)(.*)$/;

export default function CountUp({ value, duration = 3000, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(PATTERN);

  const prefix = match?.[1] ?? "";
  const rawNumber = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = match ? parseFloat(rawNumber.replace(/,/g, "")) : 0;
  const decimals = rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0;
  const useCommas = rawNumber.includes(",");

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!match) return;

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(target);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          setCurrent(target * eased);
          if (progress < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  if (!match) return <span className={className}>{value}</span>;

  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: useCommas,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}