import { Factory, GraduationCap, TrendingUp, Users } from "lucide-react";
import { CAREER_PILLARS } from "./careers-data";

const ICONS = {
  factory: Factory,
  learn: GraduationCap,
  grow: TrendingUp,
  team: Users,
} as const;

/** Figma: "Section – Why IVM" — four value cards under one heading. */
export default function WhyIvm() {
  return (
    <section
      className="flex flex-col gap-5 px-4 pt-16 md:px-6 xl:gap-8 xl:px-24 xl:pt-28"
      aria-labelledby="why-ivm-title"
    >
      <div className="flex flex-col gap-[10px]">
        <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-blue">
          Why IVM
        </p>
        <h2
          id="why-ivm-title"
          className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
        >
          Work that moves the country
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
        {CAREER_PILLARS.map((pillar) => {
          const Icon = ICONS[pillar.icon];
          return (
            <article
              key={pillar.id}
              className="flex h-[180px] flex-col gap-[10px] rounded-[12px] bg-ivm-n50 p-6 xl:h-[211px]"
            >
              <Icon
                aria-hidden="true"
                size={26}
                strokeWidth={1.95}
                className="shrink-0 text-ivm-blue"
              />
              <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 xl:text-[24px] xl:leading-[1.2]">
                {pillar.title}
              </h3>
              <p className="text-[14px] leading-[1.4] text-ivm-n600 xl:text-[16px]">
                {pillar.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
