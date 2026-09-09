import Image from "next/image";
import Link from "next/link";

export default function EvCollectionBanner() {
  return (
    <section className=" font-[family-name:var(--font-google-sans)] relative h-[342px] w-full overflow-hidden md:h-[540px] lg:h-[807px]">
      <Image
        src="/images/ev-collection-bg.png"
        alt="Electric vehicle charging in a city"
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

      <div className=" absolute inset-0 flex flex-col justify-center gap-6 px-5 py-10 text-white lg:gap-10 lg:px-[73px]">
        <h2 className="max-w-[778px] text-[24px] font-bold leading-[normal] lg:text-[60px]">
          EXPLORE OUR LATEST EV COLLECTION
        </h2>
        <p className="max-w-[674px] text-[14px] leading-[normal] lg:text-[19px]">
          Discover our newest range of innovative electric vehicles, combining modern design,
          advanced technology.
        </p>
        <Link
          href="/vehicles/electric"
          className="w-fit text-[16px] font-bold leading-[normal] underline underline-offset-4 lg:text-[26px]"
        >
          Discover More
        </Link>
      </div>
    </section>
  );
}
