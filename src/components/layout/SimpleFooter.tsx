import Link from "next/link";

const footerItems = [
  { label: "Privacy & Legal", href: "/privacy-policy" },
  { label: "Find a Showroom", href: "/contact#showrooms" },
  { label: "Contact", href: "/contact" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

export default function SimpleFooter() {
  return (
    <footer className="w-full border-t border-[#e5e5e5] bg-white">
      <nav
        aria-label="Footer navigation"
        className="mx-auto flex min-h-[144px] max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-8 text-[15px] leading-6 text-[#6b6b6b] sm:gap-x-10 lg:gap-x-10"
      >
        <span className="whitespace-nowrap">IVM © 2026</span>
        {footerItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="whitespace-nowrap transition-colors hover:text-[#005eb8]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
