import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { CATEGORY_EYEBROW, type Vehicle } from "./vehicles-data";

type Props = {
  vehicle: Vehicle;
  /**
   * Position in the grid. The first 9 cards play the Figma intro: each fades
   * and rises 32px, staggered 0.08s apart after a 0.4s head start.
   */
  index: number;
  /** After the intro has played, re-filtered cards reveal with a short stagger instead. */
  introPlayed: boolean;
};

const INTRO_CARDS = 9;

/** Figma: "Card – IVM …" (Revamp vehicle card, whole card is the link). */
export default function VehicleCard({ vehicle, index, introPlayed }: Props) {
  const animated = index < INTRO_CARDS;
  const delay = introPlayed ? index * 0.04 : 0.4 + index * 0.08;
  const eyebrow = vehicle.bodyType ?? CATEGORY_EYEBROW[vehicle.category];

  return (
    <Link
      href={`/vehicles/${vehicle.slug ?? vehicle.id}`}
      className={`flex flex-col items-start gap-[10px] pt-[6px] text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-ivm-blue ${
        animated ? "ivm-rise" : ""
      }`}
      style={
        animated
          ? ({
              "--ivm-y": "32px",
              "--ivm-dur": "0.7s",
              "--ivm-delay": `${delay}s`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={`relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[8px] ${
          vehicle.image ? "" : "bg-ivm-n50"
        }`}
      >
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(min-width: 1280px) 333px, (min-width: 1024px) 308px, (min-width: 768px) 348px, 173px"
            className="object-contain"
          />
        ) : (
          <span className="text-[10px] font-medium leading-[1.4] text-ivm-n500 md:text-[12px]">
            Add cut-out photo
          </span>
        )}
      </div>

      {/* 6px spacer from the Figma card */}
      <div className="h-[6px] w-[10px] shrink-0" aria-hidden="true" />

      <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-n500">
        {eyebrow}
      </p>
      <p className="w-full text-[18px] font-semibold leading-[1.2] text-ivm-n900 md:text-[24px]">
        {vehicle.name}
      </p>
      <span className="inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-medium leading-[1.4] text-ivm-blue md:text-[16px]">
        Discover More <FaArrowRight aria-hidden="true" className="size-3.5" />
      </span>
    </Link>
  );
}
