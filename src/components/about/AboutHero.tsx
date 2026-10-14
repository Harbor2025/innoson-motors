import Image from "next/image";

// Figma: node 773:1352 (1440x1024) + title block 773:1472. The header floats over the top 80px.
export default function AboutHero() {
  return (
    <section className="relative h-[530px] w-full overflow-hidden md:h-[720px] lg:h-[1024px]">
      <Image
        src="/images/about/hero.png"
        alt="IVM sedan"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_75%]"
      />
      <div className="absolute inset-x-0 top-[150px] flex flex-col items-center gap-3 px-5 text-center text-white md:top-[200px] lg:top-[227px]">
        <h1 className="text-[32px] font-bold capitalize leading-[normal] md:text-[44px] lg:text-[56px] font-[family-name:var(--font-inter)]">
          About IVM
        </h1>
        <p className="text-[14px] leading-[normal] md:text-[17px] lg:text-[20px] font-[family-name:var(--font-inter)]">
          The pride of Africa
        </p>
      </div>
    </section>
  );
}
