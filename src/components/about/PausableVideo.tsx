"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Autoplaying muted video with the design's pause/play control.
 * Shows the poster until the video has loaded (and as the fallback if it never does).
 * Size/shape comes from `className`; the control's position from `buttonClassName`.
 */
export default function PausableVideo({
  videoSrc,
  poster,
  posterClassName = "object-cover",
  className = "",
  buttonClassName = "bottom-5 left-5 size-10",
}: {
  videoSrc: string;
  poster: string;
  posterClassName?: string;
  className?: string;
  buttonClassName?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);

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
    <div className={`relative overflow-hidden bg-[#d9d9d9] ${className}`}>
      <Image src={poster} alt="" fill sizes="100vw" className={posterClassName} />

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
        className={`absolute z-10 transition-transform hover:scale-110 lg:h-14 lg:w-[55px] ${buttonClassName}`}
      >
        {playing ? (
          <Image
            src="/images/about/video-pause.png"
            alt=""
            width={55}
            height={56}
            className="size-full object-contain"
          />
        ) : (
          // The design only ships the pause artwork; this is a matching play state.
          <svg viewBox="0 0 32 32" fill="none" className="size-full" aria-hidden>
            <circle cx="16" cy="16" r="15" stroke="#fff" strokeWidth="2" />
            <path d="M13 10.5v11l9-5.5-9-5.5Z" fill="#fff" />
          </svg>
        )}
      </button>
    </div>
  );
}
