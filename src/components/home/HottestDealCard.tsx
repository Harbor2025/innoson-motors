import Image from "next/image";
import Link from "next/link";

/**
 * "Hottest Deal" hero — IVM Caris (responsive)
 * Figma: IVM-website — mobile node 745:329 (353x558), desktop node 745:246 (755 tall)
 *
 * The section fills 100% of its parent (no max-width), so any padding/container
 * around it controls the margin. Height: 558px on mobile, 755px from md up.
 *
 * Assets in /public/hottest-deal/:
 *  mobile : caris-bg.png, ellipse-top.svg, ellipse-bottom.svg
 *  desktop: caris-bg-desktop.png, ellipse-desktop.svg
 *  shared : icon-engine.svg, icon-safety.svg, icon-seat.svg, icon-wifi.svg
 */

const features = [
  { icon: "/hottest-deal/icon-engine.svg", label: "Powerful engine" },
  {
    icon: "/hottest-deal/icon-safety.svg",
    label: "Advanced & Safety features",
    nested: true, // this SVG is a group exported with Figma's inner insets
  },
  { icon: "/hottest-deal/icon-seat.svg", label: "Spacious interior" },
  { icon: "/hottest-deal/icon-wifi.svg", label: "Smart connectivity" },
];

function FeatureIcon({ src, nested }: { src: string; nested?: boolean }) {
  return (
    <div className="relative size-[13.641px] shrink-0 overflow-clip md:size-10">
      {nested ? (
        <div className="absolute inset-[8.33%_12.5%]">
          <div className="absolute inset-[-3.75%_-4.17%]">
            <Image alt="" src={src} fill unoptimized />
          </div>
        </div>
      ) : (
        <Image alt="" src={src} fill unoptimized />
      )}
    </div>
  );
}

type HottestDealCardProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  price?: string;
  href?: string;
};

export default function HottestDealCard({
  eyebrow = "Hottest Deal",
  title = "IVM Caris",
  description = "The IVM Caris blends modern design with advanced technology, giving you a smoother, safer and more exciting drive-every time",
  price = "N42,500,000",
  href = "/vehicles",
}: HottestDealCardProps) {
  return (
    <section
      className="relative isolate min-h-[558px] w-[90%] overflow-hidden bg-white text-white md:min-h-[755px] mx-3 my-3"
      style={{ fontFamily: "Avenir, 'Avenir Next', 'Nunito Sans', sans-serif" }}
    >
      {/* Background photo — different crop per breakpoint */}
      <Image
        src="/hottest-deal/caris-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover object-bottom md:hidden"
      />
      <Image
        src="/hottest-deal/caris-bg-desktop.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 hidden object-cover object-right md:block"
      />

      {/* Mobile glows */}
      <div className="pointer-events-none absolute inset-0 -z-20 md:hidden" aria-hidden>
        <div className="absolute left-[-160px] top-[-210px] flex h-[630.835px] w-[585.682px] items-center justify-center">
          <div className="flex-none rotate-[86.97deg]">
            <div className="relative h-[554.65px] w-[602.39px]">
              <div className="absolute inset-[-22.41%_-20.63%]">
                <Image alt="" src="/hottest-deal/ellipse-top.svg" fill unoptimized />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-[-100.07px] top-[470.67px] flex h-[395.341px] w-[497.425px] items-center justify-center">
          <div className="-scale-y-100 flex-none rotate-[-93.03deg]">
            <div className="relative h-[478.525px] w-[370.593px]">
              <div className="absolute inset-[-25.98%_-33.54%]">
                <Image alt="" src="/hottest-deal/ellipse-bottom.svg" fill unoptimized />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop glow */}
      <div
        className="pointer-events-none absolute left-[-488px] top-[-115px] -z-20 hidden h-[1115.974px] w-[1212.029px] md:block"
        aria-hidden
      >
        <div className="absolute inset-[-11.14%_-10.26%]">
          <Image alt="" src="/hottest-deal/ellipse-desktop.svg" fill unoptimized />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-[inherit] flex-col px-4 pb-5 pt-4 md:px-[50px] md:pb-[53px] md:pt-20">
        <div className="flex max-w-[610px] flex-col gap-6 md:gap-[72px]">
          <div className="flex flex-col gap-3">
            <p className="text-base font-extrabold uppercase leading-normal text-[#a4e41a] md:text-2xl font-[family-name:var(--font-inter)]">
              {eyebrow}
            </p>
            <h2 className="text-[32px] font-extrabold uppercase leading-normal md:text-5xl md:leading-[58px] font-[family-name:var(--font-google-sans)]">
              {title}
            </h2>
            <p className="text-base font-normal leading-normal md:text-2xl font-[family-name:var(--font-inter)]">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-3 leading-normal">
            <p className="text-base font-normal md:text-2xl font-[family-name:var(--font-inter)]">Starting from</p>
            <p className="text-2xl font-black md:text-4xl font-[family-name:var(--font-google-sans)]">{price}</p>
          </div>
        </div>

        <Link
          href={href}
          className="mt-[21px] w-fit text-xl font-extrabold leading-normal underline underline-offset-[from-font] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4e41a] md:mt-9 md:text-2xl font-[family-name:var(--font-inter)]"
        >
          Discover More
        </Link>

        {/* Feature strip — pinned to the bottom */}
        <ul className="mt-auto flex w-full items-stretch pt-10 lg:w-auto lg:self-start">
          {features.map((f) => (
            <li
              key={f.label}
              className="flex-none border-white/40 px-[13.641px] first:pl-0 last:pr-0 md:flex-1 md:px-6 lg:flex-none lg:px-10 [&:not(:first-child)]:border-l font-[family-name:var(--font-inter)]"
            >
              <div className="flex w-[49.789px] flex-col gap-[5.456px] md:w-auto md:gap-4 lg:w-[146px]">
                <FeatureIcon src={f.icon} nested={f.nested} />
                <p className="text-[6.82px] font-normal leading-normal md:text-xl font-[family-name:var(--font-inter)]">
                  {f.label}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
