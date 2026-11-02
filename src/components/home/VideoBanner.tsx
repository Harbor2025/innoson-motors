"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "./ui";

/**
 * Full-screen film: muted, looping, autoplays while the section is in view.
 * Figma: desktop 1440x860 / tablet 768x900 / mobile 390x720, all on #171A20.
 *
 * The corner control mirrors the design (40px circle, translucent black,
 * 1px white/50 border, two 4x14 bars) and doubles as a play/pause toggle.
 * Put the film at /public/videos/home-showcase.mp4 (or pass `videoSrc`).
 */
export default function VideoBanner({
  videoSrc = "/videos/home-showcase.mp4",
  poster = "/images/home/v2/hero.png",
}: {
  videoSrc?: string;
  poster?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Autoplay on scroll: start when the section is mostly visible, stop when it
  // leaves the viewport (keeps the page light and matches the design intent).
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.muted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section
      ref={sectionRef}
      aria-label="IVM brand film"
      className="relative h-[720px] w-full overflow-hidden bg-ivm-ink md:h-[900px] lg:h-[860px]"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the brand film" : "Play the brand film"}
        className="absolute bottom-4 right-4 z-10 flex size-10 items-center justify-center rounded-full border border-white/50 bg-black/35 text-white transition-colors hover:bg-black/55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-6 md:right-6 lg:bottom-8 lg:right-8"
      >
        {playing ? (
          <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
            <rect x="14" y="13" width="4" height="14" rx="1" fill="#FFFFFF" />
            <rect x="22" y="13" width="4" height="14" rx="1" fill="#FFFFFF" />
          </svg>
        ) : (
          <PlayIcon className="ml-0.5 size-5" />
        )}
      </button>
    </section>
  );
}
