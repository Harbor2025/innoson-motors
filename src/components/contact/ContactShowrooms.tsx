import { ArrowRight } from "lucide-react";
import {
  FACTORY_ADDRESS as ADDR_FB,
  SHOWROOMS as SHOWROOMS_FB,
  type Showroom,
} from "./contact-data";
import type { ContactInfoDTO, DealershipDTO } from "@/types/dto";

type Props = {
  contactInfo?: ContactInfoDTO;
  dealerships?: DealershipDTO[];
};

function directionsHref(showroom: Showroom) {
  const query = [showroom.address, showroom.city, showroom.state]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function dealershipKind(name: string) {
  return /service/i.test(name) ? "Service centre" : "Showroom";
}

/** The design splits the two Lagos dealerships by city (both are "Lagos" in the CMS). */
function dealershipCity(name: string, city?: string | null) {
  if (/main\s*land/i.test(name)) return "Lagos Mainland";
  if (/island/i.test(name)) return "Lagos Island";
  return city || name;
}

/** Matches the order in the design: factory, Abuja, Lagos (mainland then island), Enugu. */
const CITY_RANK: Record<string, number> = {
  nnewi: 0,
  abuja: 1,
  "lagos mainland": 2,
  "lagos island": 3,
  enugu: 4,
};

function rank(city: string) {
  const rank = CITY_RANK[city.toLowerCase()];
  return rank === undefined ? 99 : rank;
}

/**
 * Figma: "Section – Showrooms". Factory card first, then one card per CMS
 * dealership. Falls back to the design's five locations when the CMS is
 * unavailable. Cards are 439 wide (three per row) and keep their own height.
 */
export default function ContactShowrooms({ contactInfo, dealerships }: Props) {
  const factoryPhone =
    contactInfo?.phones.find((p) => /factory/i.test(p.label ?? ""))?.number ??
    "0805 445 9560";

  const showrooms: Showroom[] =
    dealerships && dealerships.length > 0
      ? [
          {
            id: "factory",
            kind: "Factory & head office",
            city: "Nnewi",
            address: contactInfo?.address ?? ADDR_FB,
            phone: factoryPhone,
            state: "Anambra",
          },
          ...dealerships
            .map((d) => ({
              id: d.id,
              kind: dealershipKind(d.name),
              city: dealershipCity(d.name, d.city),
              address: d.address,
              phone: d.phone ?? undefined,
              state: d.state ?? undefined,
            }))
            .sort((a, b) => rank(a.city) - rank(b.city)),
        ]
      : SHOWROOMS_FB;

  return (
    <section
      id="showrooms"
      aria-labelledby="showrooms-title"
      className="flex scroll-mt-16 flex-col gap-6 px-4 pb-16 pt-14 md:gap-8 md:px-6 md:pt-20 xl:px-8 xl:pb-24 xl:pt-28"
    >
      <div className="flex flex-col gap-[10px] xl:pl-16">
        <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-blue">
          Showrooms &amp; service centres
        </p>
        <h2
          id="showrooms-title"
          className="text-[32px] font-semibold leading-[1.2] text-ivm-n900 md:text-[40px] xl:text-[48px]"
        >
          Visit us
        </h2>
      </div>

      <div className="flex flex-wrap items-start gap-4 md:gap-6">
        {showrooms.map((showroom) => (
          <article
            key={showroom.id}
            className="flex w-full flex-col items-start gap-[10px] rounded-[12px] bg-ivm-n50 p-6 md:w-[calc(50%-12px)] xl:w-[calc((100%-48px)/3)] xl:p-7"
          >
            <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-n500">
              {showroom.kind}
            </p>
            <h3 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900">
              {showroom.city}
            </h3>
            <p className="text-[16px] leading-[1.4] text-ivm-n600">{showroom.address}</p>
            {showroom.phone ? (
              <a
                href={`tel:${showroom.phone.replace(/\s/g, "")}`}
                className="text-[16px] font-medium leading-[1.4] text-ivm-n900 transition-colors hover:text-ivm-blue"
              >
                {showroom.phone}
              </a>
            ) : null}
            <a
              href={directionsHref(showroom)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-[16px] font-medium leading-[1.4] text-ivm-blue"
            >
              Get directions
              <ArrowRight
                size={16}
                strokeWidth={1.75}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
