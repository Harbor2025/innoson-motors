"use client";

import Link from "next/link";
import { CATEGORIES, CATEGORY_LABEL, type Category } from "./vehicles-data";

interface VehicleFilterProps {
  active: Category;
  onChange: (category: Category) => void;
  counts: Record<Category, number>;
}

/**
 * Desktop (>= lg): Figma "Sidebar – Categories" with count per filter and the
 * "Not sure which one?" help card. Fades in (0.6s, after a 0.25s delay).
 */
export function VehicleSidebar({ active, onChange, counts }: VehicleFilterProps) {
  return (
    <aside
      className="ivm-fade hidden w-[280px] shrink-0 flex-col items-start gap-2 self-stretch overflow-hidden border-r border-solid border-ivm-n100 py-14 pl-12 pr-8 lg:flex"
      style={{ "--ivm-delay": "0.25s", "--ivm-dur": "0.6s" } as React.CSSProperties}
    >
      <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-n500">
        Categories
      </p>
      <div className="h-6 w-[10px] shrink-0" aria-hidden="true" />

      {CATEGORIES.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`flex w-full items-center justify-between rounded-[6px] py-[10px] pl-4 pr-3 text-left leading-[1.4] transition-colors ${
              isActive
                ? "bg-ivm-blue/10 text-ivm-blue"
                : "text-ivm-n600 hover:bg-ivm-n50"
            }`}
          >
            <span className={`text-[20px] ${isActive ? "font-semibold" : "font-normal"}`}>
              {CATEGORY_LABEL[category]}
            </span>
            <span className={`text-[14px] font-normal ${isActive ? "" : "text-ivm-n500"}`}>
              {counts[category]}
            </span>
          </button>
        );
      })}

      <div className="h-8 w-[10px] shrink-0" aria-hidden="true" />

      <div className="flex w-full flex-col items-start gap-[10px] overflow-hidden rounded-[8px] bg-ivm-n50 p-5">
        <p className="text-[16px] font-bold leading-[1.4] text-ivm-n900">Not sure which one?</p>
        <p className="text-[14px] font-normal leading-[1.4] text-ivm-n600">Drive it before you decide.</p>
        <Link
          href="/book-a-test-drive"
          className="flex h-10 w-full items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white"
        >
          Book a Test Drive
        </Link>
      </div>
    </aside>
  );
}

/** Mobile + tablet (< lg): Figma "Category chips (scroll)". */
export function VehicleChips({ active, onChange, counts }: VehicleFilterProps) {
  return (
    <div
      className="flex w-full gap-2 overflow-x-auto leading-[1.4] [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full px-4 py-[9px] transition-colors ${
              isActive ? "bg-ivm-n900 text-white" : "bg-ivm-n50 text-ivm-n900"
            }`}
          >
            <span className="text-[14px] font-semibold">{CATEGORY_LABEL[category]}</span>
            <span className={`text-[12px] font-normal ${isActive ? "" : "text-ivm-n500"}`}>
              {counts[category]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
