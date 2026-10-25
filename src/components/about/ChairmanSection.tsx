"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import ResponsiveImage from "@/components/revamp/ResponsiveImage";
import { CHAIRMAN_POSTER, CHAIRMAN_VIDEO_SRC } from "./about-data";

/**
 * Figma: "Section – Chairman". Desktop: copy left, video right. Tablet/mobile:
 * video first, then the heading, blurb and name. The poster has a centred play
 * button; clicking it swaps in the real video with native controls.
 */
export default function ChairmanSection({ videoSrc = CHAIRMAN_VIDEO_SRC }: { videoSrc?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section
      aria-labelledby="chairman-title"
      className="flex flex-col items-start gap-5 px-6 pt-16 md:pt-24 xl:flex-row xl:items-center xl:gap-20 xl:px-8 xl:pt-28"
    >
      <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-[12px] bg-ivm-n900 md:h-[400px] xl:order-last xl:h-[460px] xl:w-[720px] xl:shrink-0">
        {playing ? (
          <video
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <>
            <ResponsiveImage srcs={CHAIRMAN_POSTER} />
            <div className="absolute inset-0 bg-black/25" />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play a message from our Chairman"
              className="relative flex size-[60px] items-center justify-center rounded-full bg-white text-ivm-n900 transition-transform hover:scale-105 md:size-[72px] xl:size-[76px]"
            >
              <Play className="ml-[2px] size-[22px] fill-current xl:size-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="contents xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:items-start xl:gap-5 xl:pl-16">
        <div className="flex w-full flex-col gap-[10px] xl:w-auto">
          <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-blue">
            Leadership
          </p>
          <h2
            id="chairman-title"
            className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
          >
            A message from our Chairman
          </h2>
        </div>
        <p className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px] xl:text-[20px]">
          Hear IVM’s journey, key achievements and commitment to building vehicles Africans can be
          proud of - in his own words.
        </p>
        <div className="flex flex-col gap-[2px] leading-[1.4]">
          <p className="text-[16px] font-bold text-ivm-n900">Chief Dr. Innocent Ifediaso Chukwuma</p>
          <p className="text-[14px] text-ivm-n600">Founder &amp; Chairman, Innoson Group</p>
        </div>
      </div>
    </section>
  );
}
