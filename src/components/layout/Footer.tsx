import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import Container from "./Container";
import Logo from "./Logo";
import type { ContactInfoDTO } from "@/types/dto";

// Figma: desktop 766:483 (1440x415, blue) / mobile 773:1894 (393x854)
// Column headings match the design. Links come from the real routes / contact data.
const MODEL_LINKS = [
  { label: "SUV", href: "/vehicles?category=suvs" },
  { label: "Pickup", href: "/vehicles?category=pickup" },
  { label: "MPV", href: "/vehicles?category=mpv" },
  { label: "Cars", href: "/vehicles?category=cars" },
  { label: "Bus", href: "/vehicles?category=buses" },
  { label: "EV", href: "/vehicles?category=electric" },
];

const TECHNOLOGY_LINKS = [
  { label: "News", href: "/news" },
  { label: "Find Showroom", href: "/contact#showrooms" },
  { label: "Book a Test Drive", href: "/book-a-test-drive" },
];

const ADDRESS_FALLBACK =
  "No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State";

const AVENIR = "font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif]";

function socialIcon(platform: string): IconType | null {
  switch (platform.toLowerCase()) {
    case "facebook": return FaFacebookF;
    case "linkedin": return FaLinkedinIn;
    case "whatsapp": return FaWhatsapp;
    case "twitter":
    case "x": return FaXTwitter;
    case "instagram": return FaInstagram;
    case "youtube": return FaYoutube;
    default: return null;
  }
}

function Column({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[20px] uppercase leading-[20px] lg:text-[22px] font-[family-name:var(--font-universal,Universal,sans-serif)]">
        {heading}
      </h3>
      <ul className={`flex flex-col gap-4 text-[14px] leading-[20px] ${AVENIR}`}>{children}</ul>
    </div>
  );
}

export default function Footer({
  contactInfo,
  className = "",
}: {
  contactInfo?: ContactInfoDTO;
  className?: string;
}) {
  const email =
    contactInfo?.emails.find((e) => /support/i.test(e)) ??
    contactInfo?.emails[0] ??
    "Support@innosonmotors.com";
  const phone = contactInfo?.phones[0]?.number ?? "+234 (0) 700-0000";
  const address = contactInfo?.address ?? ADDRESS_FALLBACK;
  const socials = contactInfo?.socialLinks ?? [];

  return (
    <footer className={`w-full bg-[#005eb8] text-white ${className}`}>
      <Container className="pt-[33px] lg:pt-10">
        {/* Mobile: brand first, columns below. Desktop: columns left, brand right. */}
        <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-start lg:justify-between lg:gap-6 ">
          {/* Brand */}
          <div className="flex flex-col items-start gap-[18px] lg:w-[499px] lg:items-end">
            <Logo className="h-[47px] w-[79px] lg:h-[66px] lg:w-[111px]" />
            <div className={`flex w-full flex-col lg:text-right ${AVENIR}`}>
              <h2 className="text-[24px] font-extrabold capitalize leading-[42px] lg:text-[33px] font-[family-name:var(--font-inter)]">
                The Future of Mobility.
              </h2>
              <p className="text-[17px] font-light leading-[27px] font-[family-name:var(--font-inter)]">
                Innoson Vehicle Manufacturing — the first privately owned indigenous automobile
                manufacturer in Nigeria and the largest in West Africa.
              </p>
            </div>
            {socials.length > 0 && (
              <div className="flex items-center gap-[21px]">
                {socials.map((s) => {
                  const Icon = socialIcon(s.platform);
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="flex size-8 items-center justify-center text-white transition-opacity hover:opacity-80"
                    >
                      {Icon ? (
                        <Icon className="size-[20px] lg:size-full" />
                      ) : (
                        <span className="text-[12px] uppercase">{s.platform.slice(0, 2)}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
            <div className="w-[128px] font-[family-name:var(--font-inter)]">
              <Column heading="Models">
                {MODEL_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </Column>
            </div>
            <div className="w-[170px] font-[family-name:var(--font-inter)]">
              <Column heading="Technology">
                {TECHNOLOGY_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </Column>
            </div>
            <div className="lg:w-[220px] font-[family-name:var(--font-inter)]">
              <Column heading="Contact us">
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                </li>
                <li>{address}</li>
              </Column>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 pb-7 lg:mt-20 lg:gap-[30px] lg:pb-10">
          <div className="h-px w-full bg-white" />
          <p className="w-full text-center text-[10px] leading-[20px] font-[family-name:var(--font-inter)] lg:text-[13px] lg:font-medium lg:font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif]">
            ©Copyright 2025. All rights reserved (Innoson Manufacturing Vehicles, LTD)
          </p>
        </div>
      </Container>
    </footer>
  );
}
