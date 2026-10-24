import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Privacy & Legal", href: "/privacy-policy" },
  { label: "Find a Showroom", href: "/contact#showrooms" },
  { label: "Contact", href: "/contact" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

/** Figma: "Revamp/Footer/Minimal" (>= md) and "Minimal Mobile" (< md). */
export default function RevampFooter() {
  return (
    <footer className="w-full border-t border-ivm-n100 bg-white font-[family-name:var(--font-ivm-inter)]">
      <nav
        aria-label="Footer"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 px-6 pb-10 pt-8 text-[14px] leading-[1.4] text-ivm-n600 md:gap-x-7 md:py-10"
      >
        <span className="whitespace-nowrap">IVM © 2026</span>
        {FOOTER_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="whitespace-nowrap py-[2px] transition-colors hover:text-ivm-blue"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
