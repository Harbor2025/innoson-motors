import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[640px] lg:h-[944px]">
      <Image
        src="/images/hero-car.png"
        alt="IVM sedan"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className=" absolute inset-0 flex flex-col justify-center gap-2 px-6 text-white lg:justify-start lg:gap-4 lg:px-[109px] lg:pt-[178px]">
        <p className="text-[14px] leading-[normal] lg:text-[17px]">THE PRIDE OF AFRICA.</p>
        <h1 className="text-[40px] font-extrabold leading-[1.15] lg:text-[60px] lg:leading-[110px]">
          ABOUT IVM
        </h1>
      </div>
    </section>
  );
}