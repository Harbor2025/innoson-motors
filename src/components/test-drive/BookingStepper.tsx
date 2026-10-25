import { Check } from "lucide-react";

export type BookingStep = 1 | 2 | 3;

const STEPS: { number: BookingStep; label: string }[] = [
  { number: 1, label: "Vehicle" },
  { number: 2, label: "Showroom & time" },
  { number: 3, label: "Your details" },
];

/**
 * Figma: "Stepper". Completed steps become solid blue circles with a white
 * tick; the active step is outlined in blue with bold ink label; later steps
 * stay grey. Labels collapse on very small screens so all three circles fit.
 */
export default function BookingStepper({ current }: { current: BookingStep }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {STEPS.map((step, i) => {
        const completed = current > step.number;
        const active = current === step.number;
        return (
          <div key={step.number} className="flex items-center gap-4">
            <div className="flex items-center gap-[10px]">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold leading-[1.4] ${
                  completed
                    ? "bg-ivm-blue text-white"
                    : active
                      ? "border-2 border-ivm-blue bg-white text-ivm-blue"
                      : "border border-ivm-n200 bg-white text-ivm-n500"
                }`}
              >
                {completed ? (
                  <Check size={16} strokeWidth={2.5} aria-hidden="true" />
                ) : (
                  step.number
                )}
              </span>
              <span
                className={`hidden whitespace-nowrap text-[16px] leading-[1.4] sm:inline ${
                  active
                    ? "font-bold text-ivm-n900"
                    : completed
                      ? "font-normal text-ivm-n900"
                      : "font-normal text-ivm-n500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden="true"
                className={`h-[2px] w-8 shrink-0 sm:w-12 ${
                  current > step.number ? "bg-ivm-blue" : "bg-ivm-n200"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
