"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FAQS } from "./financing-data";

/**
 * Figma: "Section – FAQ". First question is open by default (as in the design);
 * each item toggles independently.
 */
export default function FinancingFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section
      className="px-4 pt-16 md:px-6 md:pt-22 xl:px-64 xl:pt-28"
      aria-labelledby={`${baseId}-title`}
    >
      <div className="flex flex-col items-start gap-2 pb-4 xl:items-center xl:gap-[10px] xl:pb-6 xl:text-center">
        <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-blue">
          FAQ
        </p>
        <h2
          id={`${baseId}-title`}
          className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
        >
          Questions about financing
        </h2>
      </div>

      <div className="border-t border-ivm-n200">
        {FAQS.map((item, i) => {
          const isOpen = open.has(i);
          const buttonId = `${baseId}-q-${i}`;
          const panelId = `${baseId}-a-${i}`;
          const Icon = isOpen ? Minus : Plus;
          return (
            <div key={item.q} className="border-b border-ivm-n200">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 py-[18px] text-left text-[16px] font-bold leading-[1.4] text-ivm-n900 md:text-[24px] md:font-semibold md:leading-[1.2] xl:py-[22px]"
                >
                  <span className="min-w-0 flex-1">{item.q}</span>
                  <Icon
                    className="size-5 shrink-0 xl:size-[22px]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px] xl:pb-6">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
