import { Check, CreditCard, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import FinButton from "./FinButton";
import {
  ACCESS_BANK_HOTLINES,
  FINANCE_HOTLINES,
  GOOD_TO_KNOW,
  PLANS,
  QUOTE_HREF,
  STEPS,
  type GoodToKnowIcon,
} from "./financing-data";

/** Section padding from Figma: top 64 / 88 / 112, sides 16 / 24 / 96 (mobile / tablet / desktop). */
const SECTION = "px-4 pt-16 md:px-6 md:pt-22 xl:px-24 xl:pt-28";

const EYEBROW = "text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px]";
const H2 =
  "text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]";

const telHref = (n: string) => `tel:${n.replace(/\s/g, "")}`;

/* ------------------------------ Ways to pay ------------------------------ */

export function PaymentPlans() {
  return (
    <section className={`flex flex-col gap-5 ${SECTION} xl:gap-8`} aria-labelledby="plans-title">
      <div className="contents xl:flex xl:flex-col xl:gap-[10px]">
        <p className={`${EYEBROW} text-ivm-blue`}>Payment plans</p>
        <h2 id="plans-title" className={H2}>
          Choose how you pay
        </h2>
      </div>

      <div className="contents xl:flex xl:items-stretch xl:gap-6">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col gap-[14px] rounded-[16px] p-6 xl:flex-1 xl:gap-4 xl:px-7 xl:py-8 ${
              plan.featured
                ? "border-2 border-ivm-blue bg-ivm-blue/[0.06]"
                : "border border-ivm-n200 bg-white"
            }`}
          >
            <p className={`${EYEBROW} ${plan.featured ? "text-ivm-blue" : "text-ivm-n500"}`}>
              {plan.eyebrow}
            </p>
            <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2] xl:text-[32px]">
              {plan.title}
            </h3>
            <p className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">{plan.description}</p>

            <ul className="flex flex-col gap-[10px] xl:gap-3 xl:py-2">
              {plan.points.map((point) => (
                <li key={point.text} className="flex items-start gap-[10px]">
                  <Check
                    size={18}
                    strokeWidth={2}
                    className="mt-[2px] shrink-0 text-ivm-n900"
                    aria-hidden="true"
                  />
                  <span
                    className={`min-w-0 flex-1 leading-[1.4] text-ivm-n900 ${
                      point.mobileLarge ? "text-[16px]" : "text-[14px] md:text-[16px]"
                    }`}
                  >
                    {point.text}
                  </span>
                </li>
              ))}
            </ul>

            <FinButton
              href={plan.cta.href}
              label={plan.cta.label}
              variant={plan.cta.variant}
              className="w-full"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- How it works ------------------------------ */

export function HowItWorks() {
  return (
    <section className={`flex flex-col gap-5 ${SECTION} xl:gap-10`} aria-labelledby="how-title">
      <div className="contents xl:flex xl:flex-col xl:gap-[10px]">
        <p className={`${EYEBROW} text-ivm-blue`}>IVM Auto Finance</p>
        <h2 id="how-title" className={H2}>
          How it works
        </h2>
      </div>

      <ol className="flex flex-col gap-5 xl:flex-row xl:gap-6">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex items-start gap-4 xl:flex-1 xl:flex-col xl:gap-[14px]"
          >
            <div className="flex w-10 shrink-0 xl:w-full xl:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ivm-blue text-[16px] font-bold leading-[1.4] text-white xl:size-11">
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden h-[2px] min-w-px flex-1 bg-ivm-n200 xl:block" aria-hidden="true" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 xl:contents">
              <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
                {step.title}
              </h3>
              <p className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------- Good to know ------------------------------ */

// Stand-ins for the four Figma item icons (lucide, matched by meaning)
const ITEM_ICON: Record<GoodToKnowIcon, ReactNode> = {
  bank: <CreditCard aria-hidden="true" />,
  repayments: <TrendingUp aria-hidden="true" />,
  insurance: <ShieldCheck aria-hidden="true" />,
  ownership: <FileText aria-hidden="true" />,
};

export function GoodToKnow() {
  return (
    <section
      className={`flex flex-col gap-4 ${SECTION} xl:flex-row xl:gap-16`}
      aria-labelledby="good-title"
    >
      <div className="flex flex-col gap-4 xl:w-[400px] xl:shrink-0 xl:gap-3">
        <p className={`${EYEBROW} text-ivm-blue`}>Before you apply</p>
        <h2 id="good-title" className={H2}>
          Good to know
        </h2>
        <p className="text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">
          Financing is provided by Access Bank. These are the bank’s general conditions for vehicle
          finance; your exact terms are confirmed when you apply.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:min-w-0 xl:flex-1 xl:gap-5">
        {GOOD_TO_KNOW.map((item) => (
          <div
            key={item.title}
            className="flex flex-col gap-2 rounded-[12px] bg-ivm-n50 p-5 xl:gap-[10px] xl:p-6"
          >
            <span className="text-ivm-n900 [&>svg]:size-[22px] xl:[&>svg]:size-6 [&>svg]:stroke-[1.75]">
              {ITEM_ICON[item.icon]}
            </span>
            <h3 className="text-[16px] font-bold leading-[1.4] text-ivm-n900">{item.title}</h3>
            <p className="text-[14px] leading-[1.4] text-ivm-n600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Hotlines CTA band --------------------------- */

export function HotlinesBand() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-22 xl:px-8 xl:py-28" aria-labelledby="hotline-title">
      <div className="flex flex-col gap-[14px] rounded-[16px] bg-ivm-blue px-6 py-8 xl:flex-row xl:items-center xl:gap-16 xl:p-16">
        <div className="contents xl:flex xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-3">
          <p className={`${EYEBROW} text-white`}>Get started</p>
          <h2
            id="hotline-title"
            className="text-[24px] font-semibold leading-[1.2] text-white md:text-[32px] xl:text-[48px]"
          >
            Talk to our finance team
          </h2>
          <p className="text-[14px] leading-[1.4] text-white md:text-[16px] xl:text-[20px]">
            Call the IVM Auto Finance hotlines, or ask for a quote and we’ll walk you through your
            options.
          </p>
          <div className="hidden xl:flex xl:pt-2">
            <FinButton href={QUOTE_HREF} label="Get a Quote" variant="white" className="w-[200px]" />
          </div>
        </div>

        <div className="flex flex-col gap-[10px] font-semibold text-white md:flex-row md:gap-3 xl:gap-4">
          <HotlineCard title="IVM Auto Finance" numbers={FINANCE_HOTLINES} />
          <HotlineCard title="Access Bank" numbers={ACCESS_BANK_HOTLINES} />
        </div>

        <FinButton href={QUOTE_HREF} label="Get a Quote" variant="white" className="w-full xl:hidden" />
      </div>
    </section>
  );
}

function HotlineCard({ title, numbers }: { title: string; numbers: string[] }) {
  return (
    <div className="flex flex-col gap-[6px] whitespace-nowrap rounded-[12px] border border-white/25 bg-white/15 p-[18px] md:flex-1 xl:w-[240px] xl:flex-none xl:gap-2 xl:p-6">
      <p className="text-[12px] uppercase leading-[normal] tracking-[1.44px]">{title}</p>
      {numbers.map((n) => (
        <a key={n} href={telHref(n)} className="text-[24px] leading-[1.2]">
          {n}
        </a>
      ))}
    </div>
  );
}
