import Image from "next/image";
import Link from "next/link";

export default function BoldExperience() {
  return (
    <section className="relative h-[371px] w-full overflow-hidden md:h-[560px] lg:h-[800px]">
      <Image
        src="/images/bold-experience-bg.png"
        alt="IVM Caris on display in a showroom"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(-65deg, rgba(255,255,255,0) 35.431%, rgba(0,0,0,0.39) 63.057%)",
        }}
      />

      <div className="font-avenir absolute inset-0 flex items-center px-5 lg:px-[50px]">
        <div className="flex max-w-[807px] flex-col gap-6 text-white lg:gap-10">
          <div className="flex flex-col gap-3 lg:gap-6">
            <h2 className="text-[24px] font-bold leading-[normal] lg:text-[70px] lg:leading-[90px]">
              THE BOLD EXPERIENCE
            </h2>
            <p className="max-w-[531px] text-[14px] leading-[normal] lg:text-[24px]">
              IVM Caris is one of our forays into future car designs. With a captivating
              sleeker design,
            </p>
          </div>
          <Link
            href="/vehicles/caris"
            className="text-[16px] font-bold leading-[normal] underline underline-offset-4 lg:text-[36px]"
          >
            Explore Innoson Cars
          </Link>
        </div>
      </div>
    </section>
  );
}
