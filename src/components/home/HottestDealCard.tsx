import Image from "next/image";
import Link from "next/link";

/**
 * "Hottest Deal" mobile hero card — IVM Caris
 * Figma: IVM-website, node 745:329 (353 x 558)
 *
 * Assets expected in /public/hottest-deal/ (see download script in chat):
 *  caris-bg.png, ellipse-top.svg, ellipse-bottom.svg,
 *  icon-engine.svg, icon-safety.svg, icon-seat.svg, icon-wifi.svg, divider.svg
 */

const features = [
  { icon: "/hottest-deal/icon-engine.svg", label: "Powerful engine" },
  { icon: "/hottest-deal/icon-safety.svg", label: "Advanced & Safety features" },
  { icon: "/hottest-deal/icon-seat.svg", label: "Spacious interior" },
  { icon: "/hottest-deal/icon-wifi.svg", label: "Smart connectivity" },
];

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
  href = "/cars/caris",
}: HottestDealCardProps) {
  return (
    <section
      className="relative h-[558px] w-full max-w-[353px] overflow-hidden bg-white text-white"
      style={{ fontFamily: "Avenir, 'Avenir Next', 'Nunito Sans', sans-serif" }}
    >
      {/* Background photo */}
      <Image
        src="/hottest-deal/caris-bg.png"
        alt=""
        fill
        priority
        sizes="353px"
        className="object-cover"
      />

      {/* Top ellipse glow */}
      <div className="pointer-events-none absolute left-[-160px] top-[-210px] flex h-[630.835px] w-[585.682px] items-center justify-center">
        <div className="flex-none rotate-[86.97deg]">
          <div className="relative h-[554.65px] w-[602.39px]">
            <div className="absolute inset-[-22.41%_-20.63%]">
              <Image alt="" src="/hottest-deal/ellipse-top.svg" fill unoptimized />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom ellipse glow */}
      <div className="pointer-events-none absolute left-[-100.07px] top-[470.67px] flex h-[395.341px] w-[497.425px] items-center justify-center">
        <div className="-scale-y-100 flex-none rotate-[-93.03deg]">
          <div className="relative h-[478.525px] w-[370.593px]">
            <div className="absolute inset-[-25.98%_-33.54%]">
              <Image alt="" src="/hottest-deal/ellipse-bottom.svg" fill unoptimized />
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="absolute left-4 top-4 flex w-[321px] flex-col gap-6">
        <div className="flex w-full flex-col gap-3">
          <p className="text-base font-extrabold uppercase leading-normal text-[#a4e41a]">
            {eyebrow}
          </p>
          <h2 className="text-[32px] font-extrabold uppercase leading-normal">
            {title}
          </h2>
          <p className="text-base font-normal leading-normal">{description}</p>
        </div>

        <div className="flex w-full flex-col gap-3 leading-normal">
          <p className="text-base font-normal">Starting from</p>
          <p className="text-2xl font-black">{price}</p>
        </div>
      </div>

      <Link
        href={href}
        className="absolute left-4 top-[305.5px] -translate-y-1/2 whitespace-nowrap text-xl font-extrabold leading-normal underline underline-offset-[from-font] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4e41a]"
      >
        Discover More
      </Link>

      {/* Feature strip */}
      <ul className="absolute left-4 top-[501px] flex items-center gap-[13.641px]">
        {features.map((f, i) => (
          <li key={f.label} className="flex items-center gap-[13.641px]">
            {i > 0 && (
              <span className="relative block h-[34.613px] w-0" aria-hidden>
                <span className="absolute inset-[0_-0.17px]">
                  <Image alt="" src="/hottest-deal/divider.svg" fill unoptimized />
                </span>
              </span>
            )}
            <div className="flex w-[49.789px] flex-col items-start gap-[5.456px]">
              <Image alt="" src={f.icon} width={14} height={14} unoptimized className="size-[13.641px]" />
              <p className="w-[47.402px] text-[6.82px] font-normal leading-normal">
                {f.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}