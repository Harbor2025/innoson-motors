import Image from "next/image";

// Figma: heading 773:1485, intro 773:1487, cards 773:1488-1490 (335x295, #f1f1f1)
// The intro is lorem ipsum in the design: pass your real copy via `intro`.
const DEFAULT_INTRO =
  "Lorem ipsum dolor sit amet consectetur. Nullam dui purus semper aliquam lorem. Hendrerit lorem donec et bibendum feugiat. Enim viverra enim duis aliquam diam fringilla amet libero pretium.";

function MissionIcon() {
  return (
    <div className="relative size-10 shrink-0">
      <Image src="/images/about/icon-mission.svg" alt="" fill unoptimized />
    </div>
  );
}

function VisionIcon() {
  return (
    <div className="relative size-10 shrink-0 overflow-clip">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-3.75%]">
          <Image src="/images/about/icon-vision.svg" alt="" fill unoptimized />
        </div>
      </div>
    </div>
  );
}

function ObjectiveIcon() {
  return (
    <div className="relative size-10 shrink-0 overflow-clip">
      <div className="absolute inset-[0_6.25%]">
        <Image src="/images/about/icon-objective.svg" alt="" fill unoptimized />
      </div>
    </div>
  );
}

const ITEMS = [
  {
    title: "Mission",
    Icon: MissionIcon,
    text: "Our automobiles are made for the roads, the heat, and the daily demands of African drivers. We build for durability first, so your car keeps working long after the first year.",
  },
  {
    title: "Vision",
    Icon: VisionIcon,
    text: "A brand new automobile for almost the same price as a tokunbo. You get a clean history, no hidden accidents, and no guessing about what the car has been through.",
  },
  {
    title: "Objective",
    Icon: ObjectiveIcon,
    text: "We build to the standard of the foreign brands you already know and trust. Put our automobiles beside any of them and judge for yourself.",
  },
];

export default function ImpactSection({ intro = DEFAULT_INTRO }: { intro?: string }) {
  return (
    <section className="mx-auto mt-10 w-full max-w-[1040px] px-5 lg:mt-[98px] lg:px-0">
      <h2 className="text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]">
        Our Sustainable Impact
      </h2>
      <p className="mt-3 text-[14px] leading-[normal] tracking-[0.28px] text-[#888] lg:mt-[18px] lg:max-w-[932px] lg:text-[20px] lg:tracking-[0.4px] font-[family-name:var(--font-roboto)]">
        {intro}
      </p>

      <div className="mt-8 grid gap-4 lg:mt-[63px] lg:grid-cols-3 lg:gap-[17.5px]">
        {ITEMS.map(({ title, Icon, text }) => (
          <article
            key={title}
            className="rounded-[4px] bg-[#f1f1f1] px-8 py-8 lg:h-[295px] lg:px-10 lg:py-0"
          >
            <div className="mx-auto flex w-full max-w-[255px] flex-col gap-6 lg:h-full lg:justify-center">
              <Icon />
              <h3 className="text-[24px] font-semibold leading-[normal] text-[#1e1e1e] font-[family-name:var(--font-sofia,var(--font-inter))]">
                {title}
              </h3>
              <p className="text-[16px] leading-[normal] tracking-[0.32px] text-[#888] font-[family-name:var(--font-roboto)]">
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
