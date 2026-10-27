"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Globe, X } from "lucide-react";

/**
 * Country picker modal (Figma "Modal / Choose your region").
 *
 * The selection is stored locally so the header pill can show the chosen
 * country. Nothing is priced per-region yet, so choosing a country does not
 * change catalogue content — it only records the preference.
 */

export type RegionId = "nigeria" | "ghana" | "sierra-leone";

export const REGIONS: ReadonlyArray<{
  id: RegionId;
  name: string;
  detail: string;
  flag: string;
}> = [
  {
    id: "nigeria",
    name: "Nigeria",
    detail: "Showrooms nationwide",
    flag: "/images/nigeria.png",
  },
  {
    id: "ghana",
    name: "Ghana",
    detail: "Accra & Kumasi",
    flag: "/images/ghana.png",
  },
  {
    id: "sierra-leone",
    name: "Sierra Leone",
    detail: "Freetown",
    flag: "/images/sierra.png",
  },
];

const STORAGE_KEY = "ivm-region";
const DEFAULT_REGION: RegionId = "nigeria";

function isRegionId(value: string | null): value is RegionId {
  return REGIONS.some((region) => region.id === value);
}

/** Persisted selected region, e.g. `const [region, setRegion] = useRegion()`. */
export function useRegion() {
  const [region, setRegionState] = useState<RegionId>(DEFAULT_REGION);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (isRegionId(saved)) setRegionState(saved);
    } catch {
      // Private mode / storage disabled — fall back to the default.
    }
  }, []);

  const setRegion = useCallback((next: RegionId) => {
    setRegionState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the in-memory selection still applies.
    }
  }, []);

  return [region, setRegion] as const;
}

export function regionName(id: RegionId) {
  return REGIONS.find((region) => region.id === id)?.name ?? "Nigeria";
}

type RegionModalProps = {
  open: boolean;
  onClose: () => void;
  value: RegionId;
  onChange: (id: RegionId) => void;
};

export default function RegionModal({
  open,
  onClose,
  value,
  onChange,
}: RegionModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Remember what had focus so it can be restored when the dialog closes.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    return () => previouslyFocused.current?.focus?.();
  }, [open]);

  // Lock page scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes; focus moves into the dialog on open.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const select = useCallback(
    (id: RegionId) => {
      onChange(id);
      onClose();
    },
    [onChange, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px] font-[family-name:var(--font-inter)] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="ivm-rise relative flex max-h-[calc(100dvh-32px)] w-full max-w-[720px] flex-col gap-5 overflow-y-auto rounded-[16px] bg-white p-6 shadow-[0px_20px_60px_rgba(0,0,0,0.18)] sm:gap-6 sm:p-10"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2
              id={titleId}
              className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 sm:text-[32px]"
            >
              Choose your region
            </h2>
            <p
              id={descriptionId}
              className="text-[14px] leading-[1.4] text-ivm-n600 sm:text-[16px]"
            >
              Prices, financing plans and showrooms are shown for the country
              you pick.
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ivm-n50 text-ivm-n900 transition-colors hover:bg-ivm-n100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue sm:size-10"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-n600">
          West Africa
        </p>

        {/* Country options */}
        <div
          role="radiogroup"
          aria-labelledby={titleId}
          className="grid gap-3 sm:grid-cols-2"
        >
          {REGIONS.map((region) => {
            const selected = region.id === value;
            return (
              <button
                key={region.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => select(region.id)}
                className={`flex min-h-[74px] w-full items-center gap-3.5 rounded-[10px] px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue ${
                  selected
                    ? "border-[1.5px] border-ivm-blue bg-[rgba(0,94,184,0.06)]"
                    : "border-[1.5px] border-ivm-n200 hover:border-ivm-n500"
                }`}
              >
                <Image
                  src={region.flag}
                  alt=""
                  width={32}
                  height={22}
                  className="h-[22px] w-8 shrink-0 rounded-[3px] border border-black/[0.08] object-cover"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[16px] font-medium leading-[1.4] text-ivm-n900">
                    {region.name}
                  </span>
                  <span className="truncate text-[14px] leading-[1.4] text-ivm-n600">
                    {region.detail}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full bg-ivm-blue text-white ${
                    selected ? "" : "opacity-0"
                  }`}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>

        <div aria-hidden="true" className="h-px w-full bg-ivm-n200" />

        {/* Export / fleet orders */}
        <div className="flex items-center gap-3.5">
          <span className="flex h-[22px] w-8 shrink-0 items-center justify-center rounded-[3px] border border-black/[0.08] bg-ivm-n50">
            <Globe
              aria-hidden="true"
              className="size-[17px] text-[#5c5e62]"
              strokeWidth={1.4}
            />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="text-[16px] font-medium leading-[1.4] text-ivm-n900">
              Buying from another country?
            </p>
            <p className="text-[14px] leading-[1.4] text-ivm-n600">
              Fleet, government and export orders across Africa
            </p>
          </div>
          <Link
            href="/contact"
            onClick={onClose}
            className="shrink-0 whitespace-nowrap text-[14px] font-semibold leading-[1.4] text-ivm-blue hover:underline"
          >
            Contact export team
          </Link>
        </div>
      </div>
    </div>
  );
}
