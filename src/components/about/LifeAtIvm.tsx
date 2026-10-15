import Image from "next/image";

// Figma: heading 773:1491, intro 773:1492, photos 773:1493 / 773:1494 (507x423, radius 4)
const DEFAULT_INTRO =
  "Lorem ipsum dolor sit amet consectetur. Nullam dui purus semper aliquam lorem. Hendrerit lorem donec et bibendum feugiat. Enim viverra enim duis aliquam diam fringilla amet libero pretium.";

const PHOTOS = [
  { src: "/images/about/life-1.png", alt: "IVM family and community" },
  { src: "/images/about/life-2.png", alt: "IVM family at sunset" },
];

export default function LifeAtIvm({ intro = DEFAULT_INTRO }: { intro?: string }) {
  return (
    <section className="mx-auto mt-10 w-full max-w-[1040px] px-5 lg:mt-20 lg:px-0">
      <div className="flex flex-col items-start gap-3 lg:items-center lg:gap-[18px] lg:text-center">
        <h2 className="text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]">
          Life at IVM
        </h2>
        <p className="text-[14px] leading-[normal] tracking-[0.28px] text-[#888] lg:max-w-[936px] lg:text-[16px] lg:tracking-[0.32px] font-[family-name:var(--font-inter)]">
          {intro}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-[69px] lg:gap-[26px]">
        {PHOTOS.map((p) => (
          <div
            key={p.src}
            className="relative h-[280px] overflow-hidden rounded-[4px] bg-[#d9d9d9] lg:h-[423px]"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 507px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
