"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import type { Vehicle } from "@/components/vehicles/vehicles-data";
import { Btn, Chevron, ROUTES } from "./ui";
import { useInView } from "./useInView";

/**
 * "Explore Our Car Models".
 * Figma: desktop 943:472 / tablet 958:529 / mobile 957:492.
 *
 * Category tabs: the design shows Sedans / SUVs / Pickups / Buses / Electric. If your vehicles carry a
 * category-like field (`category`, `bodyType`, `type` or `segment`) the tabs filter by it. If none of
 * them do, the tabs still render but the list isn't filtered.
 */

const TABS = ["Sedans", "SUVs", "Pickups", "Buses", "Electric"] as const;
type Tab = (typeof TABS)[number];

interface CarModel {
  id: string;
  name: string;
  image: string;
  slug?: string;
  tab?: Tab;
}

const FALLBACK: CarModel[] = [
  { id: "fb-1", name: "IVM Caris", image: "/images/home/v2/model.png", slug: "caris" },
  { id: "fb-2", name: "IVM Capa", image: "/images/home/v2/model.png" },
  { id: "fb-3", name: "IVM G80", image: "/images/home/v2/model.png" },
];

function tabFor(v: unknown): Tab | undefined {
  const o = v as Record<string, unknown>;
  const raw = [o.category, o.bodyType, o.type, o.segment].find((x) => typeof x === "string") as
    | string
    | undefined;
  if (!raw) return undefined;
  const s = raw.toLowerCase();
  if (s.includes("sedan")) return "Sedans";
  if (s.includes("suv")) return "SUVs";
  if (s.includes("pick")) return "Pickups";
  if (s.includes("bus")) return "Buses";
  if (s.includes("electric") || s === "ev") return "Electric";
  return undefined;
}

export default function CarModelShowcase({ initialVehicles }: { initialVehicles?: Vehicle[] }) {
  const all: CarModel[] = useMemo(
    () =>
      initialVehicles && initialVehicles.length > 0
        ? initialVehicles.slice(0, 12).map((v) => ({
            id: v.id,
            name: v.name,
            image: v.image,
            slug: "slug" in v ? String((v as { slug?: string }).slug) : undefined,
            tab: tabFor(v),
          }))
        : FALLBACK,
    [initialVehicles],
  );

  const hasCategories = all.some((m) => m.tab);
  const available = (t: Tab) => !hasCategories || all.some((m) => m.tab === t);

  const [tab, setTab] = useState<Tab>(() => TABS.find((t) => !hasCategories || all.some((m) => m.tab === t)) ?? "Sedans");
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { ref, visible } = useInView<HTMLElement>(0.3);

  const models = hasCategories ? all.filter((m) => m.tab === tab) : all;
  const count = Math.max(models.length, 1);
  const model = models[Math.min(index, models.length - 1)] ?? all[0];
  const progress = `${((Math.min(index, count - 1) + 1) / count) * 100}%`;

  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const goNext = () => setIndex((i) => (i + 1) % count);
  const pickTab = (t: Tab) => {
    setTab(t);
    setIndex(0);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  const detailHref = model.slug && model.slug !== "undefined" ? `/vehicles/${model.slug}` : ROUTES.vehicles;
  const arrow =
    "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ivm-ink transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-ivm-blue md:flex lg:size-12";

  return (
    <section
      ref={ref}
      data-visible={visible}
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 pt-[72px] md:gap-6 md:px-6 md:pt-24 lg:gap-8 lg:px-8 lg:pb-8 lg:pt-28"
    >
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="hv-rise flex flex-col gap-[6px] lg:gap-2">
          <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-ink md:text-[32px] lg:text-[48px]">
            Explore Our Car Models
          </h2>
          <p className="text-[14px] leading-[1.4] text-ivm-muted md:text-[16px] lg:text-[20px]">
            Brand-new vehicles built in Nnewi for African roads.
          </p>
        </div>
        <div className="hidden shrink-0 md:block md:w-40 lg:w-[180px]">
          <Btn href={ROUTES.vehicles} className="w-full">
            See All Models
          </Btn>
        </div>
      </div>

      {/* Category tabs */}
      <div
        className="hv-rise hv-noscrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0"
        style={{ "--i": 1 } as React.CSSProperties}
        role="tablist"
        aria-label="Vehicle categories"
      >
        {TABS.map((t) => {
          const active = t === tab;
          const enabled = available(t);
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={!enabled}
              onClick={() => pickTab(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 md:px-[18px] md:py-[9px] lg:px-5 lg:py-[10px] ${
                active ? "bg-ivm-ink text-white" : "bg-ivm-wash text-ivm-ink hover:bg-ivm-line"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Model card */}
      <div
        className="relative flex flex-col items-center gap-3 overflow-hidden bg-ivm-wash px-5 pb-6 pt-7 md:gap-[14px] md:px-8 md:pb-8 md:pt-10 lg:gap-4 lg:px-12 lg:pb-10 lg:pt-12"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative flex w-full justify-center">
          {/* key re-mounts on change so the slide-in plays for every model */}
          <div
            key={model.id}
            className={`relative h-[170px] w-full max-w-[318px] md:h-[280px] md:max-w-[540px] lg:aspect-[2/1] lg:h-auto lg:max-w-[860px] ${
              visible ? "hv-model-in" : "hv-model-wait"
            }`}
          >
            <Image
              src={model.image}
              alt={model.name}
              fill
              sizes="(min-width: 1024px) 860px, (min-width: 768px) 540px, 318px"
              className="object-contain"
            />
          </div>

          <button type="button" aria-label="Previous model" onClick={goPrev} className={`${arrow} -left-3 lg:-left-4`}>
            <Chevron dir="left" className="size-[18px] lg:size-5" />
          </button>
          <button type="button" aria-label="Next model" onClick={goNext} className={`${arrow} -right-3 lg:-right-4`}>
            <Chevron dir="right" className="size-[18px] lg:size-5" />
          </button>
        </div>

        <h3
          key={`${model.id}-name`}
          className="text-[24px] font-semibold leading-[1.2] text-ivm-ink lg:text-[32px]"
        >
          {model.name}
        </h3>

        <div className="flex gap-5 text-[14px] font-semibold leading-[1.4] text-ivm-blue md:text-[16px] md:font-medium lg:gap-6">
          <Link href={detailHref} className="inline-flex items-center gap-1 hover:underline">
            Discover More <FaArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
          <Link href={ROUTES.quote} className="inline-flex items-center gap-1 hover:underline">
            Get a Quote <FaArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        {/* Tablet / desktop: full-width progress */}
        <div className="hidden h-[3px] w-full bg-ivm-line md:block">
          <div className="h-full bg-ivm-ink transition-[width] duration-500 ease-out" style={{ width: progress }} />
        </div>

        {/* Mobile: pager with arrows either side of the progress */}
        <div className="flex w-full items-center gap-3 pt-2 md:hidden">
          <button
            type="button"
            aria-label="Previous model"
            onClick={goPrev}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ivm-ink"
          >
            <Chevron dir="left" className="size-4" />
          </button>
          <div className="h-[3px] min-w-px flex-1 bg-ivm-line">
            <div className="h-full bg-[#838181] transition-[width] duration-500 ease-out" style={{ width: progress }} />
          </div>
          <button
            type="button"
            aria-label="Next model"
            onClick={goNext}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-ivm-ink"
          >
            <Chevron dir="right" className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile: See All Models sits below the card */}
      <div className="md:hidden">
        <Btn href={ROUTES.vehicles} className="w-full">
          See All Models
        </Btn>
      </div>
    </section>
  );
}