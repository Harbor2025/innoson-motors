import type { ContactInfoDTO } from "@/types/dto";

type SocialLink = { platform: string; url: string; order?: number };

const PLATFORM_LABEL: Record<string, string> = {
  facebook: "Facebook",
  twitter: "X",
  x: "X",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  youtube: "YouTube",
};

const PLATFORM_ORDER = ["facebook", "twitter", "x", "linkedin", "whatsapp", "instagram", "youtube"];

const FALLBACK: Pick<SocialLink, "platform" | "url">[] = [
  { platform: "facebook", url: "https://facebook.com/innosonmotors" },
  { platform: "twitter", url: "https://twitter.com/innosonmotors" },
  { platform: "linkedin", url: "https://linkedin.com/company/innoson-motors" },
  { platform: "whatsapp", url: "https://wa.me/2348054459560" },
];

/**
 * Figma: "Section – Follow" — a hairline top border, "Follow IVM" and a row of
 * outlined social pills (Facebook, X, LinkedIn, WhatsApp).
 */
export default function SocialRow({
  socialLinks,
}: {
  socialLinks?: ContactInfoDTO["socialLinks"];
}) {
  const source: SocialLink[] =
    socialLinks && socialLinks.length > 0 ? socialLinks : FALLBACK;

  const items = source
    .slice()
    .sort((a, b) => {
      const ra = PLATFORM_ORDER.indexOf(a.platform.toLowerCase());
      const rb = PLATFORM_ORDER.indexOf(b.platform.toLowerCase());
      if (ra === -1 && rb === -1) return (a.order ?? 0) - (b.order ?? 0);
      if (ra === -1) return 1;
      if (rb === -1) return -1;
      return ra - rb;
    })
    .map((link) => ({
      platform: link.platform.toLowerCase(),
      url: link.url,
      label: PLATFORM_LABEL[link.platform.toLowerCase()] ?? link.platform,
    }));

  return (
    <section
      aria-labelledby="follow-title"
      className="border-t border-ivm-n100 px-4 pb-16 pt-12 md:px-6 md:pb-20"
    >
      <div className="flex flex-col items-center gap-[14px]">
        <h2
          id="follow-title"
          className="text-[16px] font-bold leading-[1.4] text-ivm-n900"
        >
          Follow IVM
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-[10px]">
          {items.map((item) => (
            <a
              key={`${item.platform}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ivm-n200 bg-white px-4 py-2 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:border-ivm-blue hover:text-ivm-blue"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
