"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/layout/Logo";

const NAV_LINKS = [
  { label: "Vehicles", href: "/vehicles", id: "vehicles" },
  { label: "Financing", href: "/financing", id: "financing" },
  { label: "About Us", href: "/about", id: "about" },
  { label: "News", href: "/news", id: "news" },
  { label: "Contact Us", href: "/contact", id: "contact" },
];

const MENU_LINKS = [
  { label: "Home", href: "/" },
  ...NAV_LINKS.map(({ label, href }) => ({ label, href })),
  { label: "Book a Test Drive", href: "/book-a-test-drive" },
];

// TODO: point this at the real region / showroom finder when it exists
const REGION_HREF = "/contact#showrooms";

/** Scroll distance (px) after which the transparent nav turns solid. */
const SOLID_AFTER = 32;

type Props = {
  active?: string;
  /**
   * "solid": white bar, sticky (Figma "Nav/Desktop v2" and "Nav/Mobile").
   * "transparent": floats over a full-bleed hero photo with white text and
   * turns into the solid bar on scroll (Figma "… – Transparent").
   */
  variant?: "solid" | "transparent";
};

/**
 * Figma: "Revamp/Nav/Desktop v2" (>= lg, 56px) and "Revamp/Nav/Mobile"
 * (< lg, 56px mobile / 64px tablet).
 * Solid variant fades in over 0.5s; the transparent variant slides down 16px
 * and fades in (0.1s delay, 0.6s) to match the Financing motion timeline.
 */
export default function RevampNav({ active, variant = "solid" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const transparent = variant === "transparent";
  // Light-on-photo styling only while transparent and not yet scrolled
  const onPhoto = transparent && !scrolled;

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  // Lock page scroll + close on Escape while the full-screen menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const headerMotion = transparent
    ? ({ "--ivm-y": "-16px", "--ivm-delay": "0.1s", "--ivm-dur": "0.6s" } as React.CSSProperties)
    : ({ "--ivm-dur": "0.5s" } as React.CSSProperties);

  const pillClasses = onPhoto
    ? "border border-white/25 bg-white/15 text-white"
    : "border border-transparent bg-ivm-n50 text-ivm-n900";

  return (
    <>
      <header
        className={`${transparent ? "ivm-rise fixed inset-x-0 top-0" : "ivm-fade sticky top-0"} z-50 w-full border-b font-[family-name:var(--font-ivm-inter)] transition-colors duration-300 ${
          onPhoto ? "border-transparent bg-transparent" : "border-ivm-n100 bg-white"
        }`}
        style={headerMotion}
      >
        {/* Desktop */}
        <div className="hidden h-14 items-center justify-between px-12 lg:flex">
          <div className="flex h-10 w-[320px] items-center">
            <Link href="/" aria-label="Innoson Vehicle Manufacturing home" className="block">
              <Logo className="h-8 w-[54px]" />
            </Link>
          </div>

          <nav aria-label="Primary" className="flex items-start gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              const color = onPhoto
                ? isActive
                  ? "text-white"
                  : "text-white/85 hover:bg-white/10"
                : isActive
                  ? "text-ivm-blue"
                  : "text-ivm-n900 hover:bg-ivm-n50";
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center whitespace-nowrap rounded-[6px] px-3 py-[7px] text-[14px] font-semibold leading-[1.4] transition-colors ${color}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex h-10 w-[320px] items-center justify-end gap-3">
            <Link
              href={REGION_HREF}
              className={`flex items-center gap-[6px] rounded-[6px] px-3 py-[7px] text-[14px] font-semibold leading-[1.4] transition-colors ${pillClasses}`}
            >
              <Image
                src="/icons/globe.svg"
                alt=""
                width={16}
                height={16}
                className={onPhoto ? "invert" : ""}
              />
              Nigeria
            </Link>
            <Link
              href="/book-a-test-drive"
              className="flex h-[34px] w-[150px] items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white"
            >
              Book a Test Drive
            </Link>
          </div>
        </div>

        {/* Mobile + tablet */}
        <div className="flex h-14 items-center justify-between px-5 md:h-16 md:px-6 lg:hidden">
          <Link href="/" aria-label="Innoson Vehicle Manufacturing home" className="block">
            <Logo className="h-7 w-[47px]" />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="ivm-mobile-menu"
            onClick={() => setMenuOpen(true)}
            className={`flex items-center justify-center rounded-[6px] px-3 py-[6px] text-[14px] font-semibold leading-[1.4] transition-colors ${pillClasses}`}
          >
            Menu
          </button>
        </div>
      </header>

      {/*
        Full-screen menu. The "Mobile Menu" frame was not part of the linked
        Figma nodes, so this reuses the structure of the existing site menu
        restyled with the revamp tokens. Kept outside <header> so the fixed
        overlay is never trapped by the header's stacking context.
      */}
      {menuOpen && (
        <div
          id="ivm-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white font-[family-name:var(--font-ivm-inter)] lg:hidden"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-ivm-n100 px-5 md:h-16 md:px-6">
            <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Home" className="block">
              <Logo className="h-7 w-[47px]" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center rounded-[6px] bg-ivm-n50 px-3 py-[6px] text-[14px] font-semibold leading-[1.4] text-ivm-n900"
            >
              Close
            </button>
          </div>

          <nav className="flex flex-col px-5 pt-4 md:px-6">
            {MENU_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-ivm-n100 py-4 text-[20px] font-medium leading-[1.4] text-ivm-n900"
              >
                {link.label}
                <Image src="/icons/arrow-right.svg" alt="" width={24} height={24} />
              </Link>
            ))}
          </nav>

          <p className="mt-auto px-5 pb-10 pt-10 text-center text-[14px] leading-[1.4] text-ivm-n600">
            IVM © 2026
          </p>
        </div>
      )}
    </>
  );
}
