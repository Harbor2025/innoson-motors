"use client";

import Image from "next/image";
import { Phone } from "lucide-react";
import { regionName, type RegionId } from "./RegionModal";

const HOTLINE = "0704 908 7160";
const HOTLINE_HREF = "tel:+2347049087160";

/**
 * Figma: "Footer info" — bottom row of the mobile menu. Replaces the copyright
 * line: hotline on the left, region picker pill on the right.
 */
export default function MobileMenuFooter({
  region,
  onOpenRegion,
  className = "",
}: {
  region: RegionId;
  onOpenRegion: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between px-6 pb-8 pt-3 font-[family-name:var(--font-inter)] ${className}`}
    >
      <a
        href={HOTLINE_HREF}
        className="flex items-center gap-2 text-[14px] font-semibold leading-[1.4] text-ivm-n900"
      >
        <Phone
          aria-hidden="true"
          className="size-4 text-ivm-blue"
          strokeWidth={1.2}
        />
        <span className="whitespace-nowrap">{HOTLINE}</span>
      </a>

      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpenRegion}
        className="flex items-center gap-1.5 rounded-[4px] bg-ivm-n50 px-3 py-1.5 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n100"
      >
        <span className="whitespace-nowrap">{regionName(region)}</span>
        <Image src="/icons/globe.svg" alt="" width={14} height={14} />
      </button>
    </div>
  );
}
