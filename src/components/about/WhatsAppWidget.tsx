"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Floating "How can we help?" WhatsApp widget.
 * Figma: node 852:290 (210x168; bubble 210x49, icon 84x84, red "1" badge, tiny close mark).
 * Below lg only the icon + badge are shown.
 */
export default function WhatsAppWidget({
  href,
  message = "How can we help?",
}: {
  href: string;
  message?: string;
}) {
  const [bubbleOpen, setBubbleOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-40 lg:bottom-6 lg:right-[38px]">
      <div className="relative size-[60px] lg:h-[168px] lg:w-[210px]">
        {bubbleOpen && (
          <div className="absolute left-0 top-[17px] hidden h-[49px] w-[210px] items-center justify-center rounded-[16px] bg-[#d9d9d9] lg:flex">
            <span className="text-[20px] leading-[normal] text-black font-[family-name:var(--font-inter)]">
              {message}
            </span>
          </div>
        )}
        {bubbleOpen && (
          <div className="absolute left-[174px] top-[56px] hidden h-[19px] w-[23px] rotate-180 lg:block">
            <div className="absolute inset-x-[6.7%] bottom-1/4 top-0">
              <Image src="/images/about/widget-tail.svg" alt="" fill unoptimized />
            </div>
          </div>
        )}
        {bubbleOpen && (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setBubbleOpen(false)}
            className="absolute -top-1.5 right-[-3px] hidden size-5 items-center justify-center lg:flex"
          >
            <span className="relative block h-[8.485px] w-[7.779px]">
              <Image src="/images/about/widget-close.svg" alt="" fill unoptimized />
            </span>
          </button>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="absolute bottom-0 right-0 size-[60px] transition-transform hover:scale-105 lg:size-[84px]"
        >
          <Image
            src="/images/about/whatsapp.png"
            alt=""
            fill
            sizes="84px"
            className="object-cover"
          />
          <span className="absolute right-0 top-0 flex size-[26px] items-center justify-center lg:size-[26px]">
            <Image src="/images/about/widget-badge.svg" alt="" fill unoptimized />
            <span className="relative text-[14px] leading-none text-[#faf2f2] font-[family-name:var(--font-inter)]">
              1
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
