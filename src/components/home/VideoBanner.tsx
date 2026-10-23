"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { EYEBROW, PauseIcon, PlayIcon } from "./ui";

/**
 * "Watch the film": poster + big play button, plays in place.
 * Figma: desktop 946:462 (720 tall) / tablet 958:561 (480) / mobile 957:524 (440).
 *
 * Idle: poster, dark overlay, copy and a play button (as in the design).
 * Playing: the copy fades out and a small pause/play control stays in the corner.
 * When the film ends it returns to the idle poster.
 * Put the film at /public/videos/home-showcase.mp4 (or pass `videoSrc`).
 */
export default function VideoBanner({
  videoSrc = "/videos/home-showcase.mp4",
  poster = "/images/home/v2/video-poster.png",
}: {
  videoSrc?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setStatus("idle"));
  };
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  const idle = status === "idle";

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-[72px] md:px-6 md:pt-24 lg:px-8 lg:pt-28">
      <div className="relative flex h-[440px] flex-col items-center justify-center overflow-hidden bg-ivm-ink md:h-[480px] lg:h-[720px]">
        <Image src={poster} alt="" fill sizes="(min-width: 1440px) 1376px, 100vw" className="object-cover" />

        <video
          ref={videoRef}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            idle ? "opacity-0" : "opacity-100"
          }`}
          playsInline
          preload="none"
          onPlay={() => setStatus("playing")}
          onPause={(e) => {
            if (!e.currentTarget.ended) setStatus("paused");
          }}
          onEnded={(e) => {
            e.currentTarget.currentTime = 0;
            setStatus("idle");
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Idle layer: overlay + copy + play button */}
        <div
          className={`hv-fade-out absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 px-6 text-center text-white md:gap-[14px] md:bg-black/[0.48] md:px-0 lg:gap-5 lg:bg-black/45 ${
            idle ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!idle}
        >
          <p className={EYEBROW}>Watch the film</p>
          <h2 className="max-w-[310px] text-[24px] font-semibold leading-[1.2] md:max-w-none md:text-[32px] lg:text-[48px]">
            Inside the Nnewi Plant
          </h2>
          <p className="max-w-[280px] text-[14px] leading-[1.4] md:max-w-none md:text-[16px] lg:text-[20px]">
            See how IVM builds brand-new vehicles for African roads.
          </p>
          <div className="h-2 lg:h-3" aria-hidden />
          <button
            type="button"
            onClick={play}
            aria-label="Play the film: Inside the Nnewi Plant"
            tabIndex={idle ? 0 : -1}
            className="flex size-16 items-center justify-center rounded-full bg-white text-ivm-ink transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:size-[76px] lg:size-[88px]"
          >
            <PlayIcon className="size-[22px] md:size-6 lg:size-7" />
          </button>
        </div>

        {/* Corner control once the film has started */}
        {!idle && (
          <button
            type="button"
            onClick={toggle}
            aria-label={status === "playing" ? "Pause film" : "Resume film"}
            className="absolute bottom-5 right-5 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-ivm-ink transition-transform hover:scale-110 lg:bottom-6 lg:left-6 lg:right-auto"
          >
            {status === "playing" ? <PauseIcon className="size-5" /> : <PlayIcon className="size-6" />}
          </button>
        )}
      </div>
    </section>
  );
}