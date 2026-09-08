import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="font-[family-name:var(--font-google-sans)] w-full">
      <div className="relative h-[439px] w-full lg:h-[715px]">
        <Image
          src="/images/contact-hero.webp"
          alt="IVM fleet vehicles in the factory yard"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-2 px-5 py-10 text-center lg:gap-4 lg:py-16">
        <h1 className="text-[24px] font-extrabold capitalize leading-[normal] text-[#000001] lg:text-[48px] lg:leading-[75px]">
          Reach out to us
        </h1>
        <p className="text-[14px] tracking-[0.02em] text-[#8a8a8a] lg:text-[24px]">
          We are ready to attend and answer your questions
        </p>
      </div>
    </section>
  );
}