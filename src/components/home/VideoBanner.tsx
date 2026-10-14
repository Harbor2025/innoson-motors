"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed video section with a pause/play control.
 * Figma: desktop node 843:396 + 843:397 (1440x1024, control bottom-left),
 *        mobile node 773:1773 (393x319, control bottom-right).
 *
 * Drop the video at /public/videos/home-showcase.mp4 (or pass `videoSrc`).
 * Until it loads, the poster image from the design is shown.
 */
export default function VideoBanner({
  videoSrc = "/videos/home-showcase.mp4",
  posterDesktop = "/images/home/video-poster-desktop.png",
  posterMobile = "/images/home/video-poster-mobile.png",
}: {
  videoSrc?: string;
  posterDesktop?: string;
  posterMobile?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);

  // Respect reduced-motion: start paused
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section className="relative h-[319px] w-full overflow-hidden bg-[#1e1e1e] md:h-[600px] lg:h-[600px]">
      {/* Poster layer (also the fallback if the video can't load) */}
      <Image
        src={posterMobile}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom md:hidden"
      />
      <Image
        src={posterDesktop}
        alt=""
        fill
        sizes="100vw"
        className="hidden object-cover md:block"
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        onLoadedData={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-5 right-5 z-10 size-8 transition-transform hover:scale-110 lg:bottom-11 lg:left-[23px] lg:right-auto lg:h-14 lg:w-[55px]"
      >
        {playing ? (
          <>
            <Image
              src="/images/home/video-pause-mobile.svg"
              alt=""
              width={32}
              height={32}
              unoptimized
              className="size-full lg:hidden"
            />
            <Image
              src="/images/home/video-pause-desktop.png"
              alt=""
              width={55}
              height={56}
              className="hidden size-full lg:block"
            />
          </>
        ) : (
          // Play state: the design only ships the pause artwork, so this is a
          // matching white circle + triangle.
          <svg viewBox="0 0 32 32" fill="none" className="size-full" aria-hidden>
            <circle cx="16" cy="16" r="15" stroke="#fff" strokeWidth="2" />
            <path d="M13 10.5v11l9-5.5-9-5.5Z" fill="#fff" />
          </svg>
        )}
      </button>
    </section>
  );
}
