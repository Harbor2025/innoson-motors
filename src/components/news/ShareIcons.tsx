"use client";

import { useState } from "react";

const BUTTON_CLASS =
  "inline-flex h-9 items-center justify-center rounded-full border border-ivm-n200 px-3.5 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50";

/**
 * Figma: "Share" row — WhatsApp, Facebook, LinkedIn, X and Copy link pills.
 * Uses the current page URL so the article can be shared from any environment.
 */
export default function ShareIcons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const openShare = (template: string) => {
    const url = window.location.href;
    const target =
      template === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
        : template === "facebook"
          ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
          : template === "linkedin"
            ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
            : `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => openShare("whatsapp")} className={BUTTON_CLASS}>
        WhatsApp
      </button>
      <button type="button" onClick={() => openShare("facebook")} className={BUTTON_CLASS}>
        Facebook
      </button>
      <button type="button" onClick={() => openShare("linkedin")} className={BUTTON_CLASS}>
        LinkedIn
      </button>
      <button type="button" onClick={() => openShare("x")} className={BUTTON_CLASS}>
        X
      </button>
      <button type="button" onClick={copyLink} className={BUTTON_CLASS} aria-live="polite">
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
