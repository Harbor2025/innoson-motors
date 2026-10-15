import Image from "next/image";
import Container from "../layout/Container";
import type { AboutPageDTO } from "@/types/dto";

// Figma: node 773:1436. The design shows two stats either side of the "1st Africa's" badge,
// so we use the first and last stat (middle ones from the CMS are dropped).
const FALLBACK = [
  { value: "100K+", label: "Employees" },
  { value: "20+", label: "Years of Manufacturing" },
  { value: "0%", label: "Imported Parts" },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center lg:items-start font-[family-name:var(--font-inter)] text-[#1e1e1e]">
      <p className="text-[24px] leading-[31px]">{value}</p>
      <p className="text-[14px] leading-[20px]">{label}</p>
    </div>
  );
}

export default function StatsRow({ stats }: { stats?: AboutPageDTO["stats"] }) {
  const items = stats?.length
    ? stats
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => ({ value: s.value, label: s.label }))
    : FALLBACK;
  const first = items[0];
  const last = items.length > 1 ? items[items.length - 1] : undefined;

  return (
    <section className="py-8 lg:pb-0 lg:pt-[45px]">
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-[138px]">
        {first && <Stat {...first} />}

        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:gap-[15px] lg:text-left">
          <Image src="/images/africa.png" alt="" width={42} height={42} className="size-[42px] object-cover" />
          <p className="max-w-[262px] text-[20px] leading-[normal] text-[#1e1e1e] font-[family-name:var(--font-inter)]">
            1ST Africa&rsquo;s Automobile Brand
          </p>
        </div>

        {last && <Stat {...last} />}
      </Container>
    </section>
  );
}
