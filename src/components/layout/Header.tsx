"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import Logo from "./Logo";
import RegionModal, { regionName, useRegion } from "./RegionModal";

const NAV_LINKS = [
  { label: "Vehicles", href: "/vehicles", id: "vehicles" },
  { label: "Financing", href: "/financing", id: "financing" },
  { label: "About Us", href: "/about", id: "about" },
  { label: "News", href: "/news", id: "news" },
  { label: "Contact Us", href: "/contact", id: "contact" },
];

// Mobile menu rows (Figma node 773:1932)
const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "Financing", href: "/financing" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "About Us", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact us", href: "/contact" },
];



interface HeaderProps {
  active?: "vehicles" | "about" | "news" | "contact" | string;
  /**
   * Home page only. On mobile the header floats transparently over the hero
   * (logo + MENU pill) and turns into a solid white bar once you scroll.
   * Without it the header is a solid white bar on every breakpoint.
   */
  overlay?: boolean;
}

export default function Header({ active, overlay = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [region, setRegion] = useRegion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => {
      const hero = document.getElementById("home-hero");
      setScrolled(hero ? hero.getBoundingClientRect().bottom <= 0 : false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  // Lock page scroll + close on Escape while the menu is open
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

  const transparent = overlay && !scrolled;

  return (
    <>
      <header
        className={`font-[family-name:var(--font-inter)] fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300  ${
          transparent ? "bg-transparent" : "border-b border-[#e4e4e4] bg-white"
        }`}
      >
        <Container
          className={`flex justify-between lg:h-[80px] lg:items-center lg:pt-0 ${
            overlay ? "h-[75px] items-start pt-5" : "h-[60px] items-center"
          }`}
        >
          {/* Left group: logo + primary nav (880px wide on desktop) */}
          <div className="flex items-center lg:flex-1 lg:justify-between xl:w-[880px] xl:flex-none">
            <Link href="/" aria-label="Innoson Vehicle Manufacturing home" className="shrink-0">
              <Logo className="h-[35px] w-[59px] lg:h-[54px] lg:w-[90px]" />
            </Link>

            <nav className="hidden items-center gap-8 text-[14px] font-semibold text-black lg:ml-10 lg:flex xl:ml-0 xl:gap-[66px]">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`whitespace-nowrap leading-[20px] transition-colors ${
                      isActive ? "text-[#005eb8]" : "hover:text-[#005eb8]"
                    } ${
                      transparent
                        ? " text-white"
                        : " text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop: region + CTA */}
          <div className="hidden items-center gap-4 lg:ml-10 lg:flex xl:ml-0">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={regionOpen}
              onClick={() => setRegionOpen(true)}
              className="flex h-[39px] items-center gap-3 rounded-[4px] bg-[#ebebeb] p-2 text-[12px] leading-[20px] text-black transition-colors hover:bg-[#e3e3e3] font-[family-name:var(--font-inter)]"
            >
              <Image src="/icons/globe.svg" alt="" width={20} height={20} />
              <span className="whitespace-nowrap">{regionName(region)}</span>
            </button>
            <Link
              href="/book-a-test-drive"
              className="flex h-[38px] w-[143px] items-center justify-center rounded-[4px] bg-[#005eb8] px-1.5 py-1 text-center text-[12px] font-extrabold leading-[20px] text-white font-[family-name:var(--font-inter)]"
            >
              Book a Test Drive
            </Link>
          </div>

          {/* Mobile: MENU pill */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className={`flex items-center justify-center rounded-[6px] p-[10px] text-[14px] font-semibold leading-[normal] transition-colors lg:hidden font-[family-name:var(--font-inter)] ${
              transparent ? "bg-white/[0.26] text-white" : "bg-[#ebebeb] text-black"
            }`}
          >
            Menu
          </button>
        </Container>
      </header>

      {/* Mobile menu: full-screen sheet */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute right-5 top-5 size-6"
          >
            <Image src="/icons/icon-cancel.svg" alt="" width={24} height={24} />
          </button>

          <nav className="mt-[104px] flex flex-col gap-5 font-[family-name:var(--font-inter)]">
            {MENU_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-5 py-3 text-[20px] font-medium leading-[20px] text-black"
              >
                {link.label}
                <Image src="/icons/arrow-right.svg" alt="" width={24} height={24} />
              </Link>
            ))}

            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(false);
                setRegionOpen(true);
              }}
              className="flex items-center justify-between px-5 py-3 text-left text-black"
            >
              <span className="flex flex-col gap-3">
                <span className="text-[20px] font-medium leading-[20px]">Search by Region</span>
                <span className="text-[14px] font-light leading-[20px]">
                  {regionName(region)}
                </span>
              </span>
              <Image src="/icons/arrow-right.svg" alt="" width={24} height={24} />
            </button>
          </nav>

          <div className="flex flex-col gap-[10px] p-6 font-[family-name:var(--font-inter)]">
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-semibold leading-[20px] text-white"
            >
              Get a Quote
            </Link>
            <Link
              href="/book-a-test-drive"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 w-full items-center justify-center rounded-[4px] border border-[#d9d9d9] bg-white text-[14px] font-semibold leading-[20px] text-[#171a20]"
            >
              Book a Test Drive
            </Link>
          </div>

          <p className="mx-auto mt-auto w-[308px] pb-[42px] pt-10 text-center text-[14px] leading-[20px] text-[#272727] font-[family-name:var(--font-inter)]">
            ©Copyright 2025. All rights reserved (Innoson Manufacturing Vehicles, LTD)
          </p>
        </div>
      )}

      <RegionModal
        open={regionOpen}
        onClose={() => setRegionOpen(false)}
        value={region}
        onChange={setRegion}
      />
    </>
  );
}
