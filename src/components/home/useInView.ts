"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flips `visible` to true once (and stays true) when the element scrolls into view.
 * Put `data-visible={visible}` on the section and style children with the `hv-*`
 * classes in globals.css. Reduced-motion users get the final state immediately.
 */
export function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}