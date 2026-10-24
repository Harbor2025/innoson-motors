"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Figma: "WhatsApp float". Dismiss pill + "How can we help?" bubble + round
 * WhatsApp button with a red "1" badge. Dismissing hides the pill and bubble
 * and leaves the button. 64px button on tablet/desktop, 56px on mobile.
 */
export default function RevampWhatsAppFloat({
  href,
  message = "How can we help?",
}: {
  href: string;
  message?: string;
}) {
  const [bubbleOpen, setBubbleOpen] = useState(true);

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2 font-[family-name:var(--font-ivm-inter)] md:right-6 lg:right-8">
      {bubbleOpen && (
        <>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setBubbleOpen(false)}
            className="flex h-6 min-w-6 items-center justify-center rounded-[12px] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 2.5l7 7m0-7l-7 7" stroke="#171a20" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-bl-[16px] rounded-br-[4px] rounded-tl-[16px] rounded-tr-[16px] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[1.4] text-ivm-n900 shadow-[0_6px_20px_rgba(0,0,0,0.14)] md:px-[18px] md:py-3 md:text-[16px] md:font-medium"
          >
            {message}
          </a>
        </>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative block size-14 transition-transform hover:scale-105 md:size-16"
      >
        <Image
          src="/images/about/whatsapp.png"
          alt=""
          fill
          sizes="64px"
          className="object-contain"
        />
        <span className="absolute -top-1 left-[38px] flex h-[22px] items-center justify-center rounded-[11px] border-2 border-solid border-white bg-[#ff2116] px-[7px] text-[12px] font-medium leading-[1.4] text-white md:left-[46px]">
          1
        </span>
      </a>
    </div>
  );
}
