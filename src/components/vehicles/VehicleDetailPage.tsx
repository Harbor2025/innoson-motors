"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GetQuoteModal from "@/components/GetQuoteModal";
import type { ModelDetailDTO } from "@/types/dto";
import {
  buildVehicleDetail,
  type DetailFeature,
  type DetailGallery,
  type DetailSpec,
} from "./vehicle-detail-content";

const SECTIONS = [
  { id: "colours", label: "Colours" },
  { id: "overview", label: "Overview" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "video", label: "Video" },
  { id: "technology", label: "Technology" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type AccordionId = "design" | "specs" | "technology";

/** Height of the fixed revamp nav + the sticky section bar, plus breathing room. */
function scrollOffset() {
  if (typeof window === "undefined") return 116;
  return window.matchMedia("(min-width: 768px)").matches ? 116 : 108;
}

const motion = (delay: number, y = 16) =>
  ({
    "--ivm-delay": `${delay}s`,
    "--ivm-dur": "0.7s",
    "--ivm-y": `${y}px`,
  }) as React.CSSProperties;

export default function VehicleDetailPage({ model }: { model: ModelDetailDTO }) {
  const content = useMemo(() => buildVehicleDetail(model), [model]);

  const [openAccordion, setOpenAccordion] = useState<AccordionId | null>("design");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedColour, setSelectedColour] = useState(content.colours[0]?.name ?? "");
  const [activeSection, setActiveSection] = useState<SectionId>("colours");

  const activeColour =
    content.colours.find((colour) => colour.name === selectedColour) ?? content.colours[0];
  const previewImage = activeColour?.image || content.colourPreview;

  const goToSection = useCallback((id: SectionId) => {
    const section = document.getElementById(id);
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - scrollOffset();
    window.scrollTo({ top, behavior: "smooth" });
    setActiveSection(id);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = scrollOffset() + 8;
        let current: SectionId = SECTIONS[0].id;
        for (const section of SECTIONS) {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top <= threshold) {
            current = section.id;
          }
        }
        setActiveSection(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const openQuote = useCallback(() => setQuoteOpen(true), []);

  return (
    <div className="relative bg-white font-[family-name:var(--font-ivm-inter)] text-ivm-n900">
      <div>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative flex h-[680px] w-full flex-col justify-end overflow-clip bg-[#0a0d12] pb-7 lg:h-[820px] lg:pb-[72px]">
          <div className="ivm-hero-media absolute inset-0" aria-hidden="true">
            <Image
              src={content.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Bottom-weighted overlay on phones, left-weighted on desktop */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 95%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 55%)",
            }}
            aria-hidden="true"
          />
          {/* Nav scrim */}
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start gap-3 px-4 lg:gap-4 lg:px-24">
            <p
              className="ivm-rise text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-white"
              style={motion(0.1)}
            >
              {content.eyebrow}
            </p>

            <h1
              className="ivm-rise text-[28px] font-semibold leading-[1.2] text-white lg:text-[56px] lg:leading-[1.1]"
              style={motion(0.2)}
            >
              {content.name}
            </h1>

            <p
              className="ivm-rise w-full text-[14px] font-normal leading-[1.4] text-white lg:max-w-[460px] lg:text-[20px]"
              style={motion(0.3)}
            >
              {content.description}
            </p>

            <div
              className="ivm-rise flex w-full items-start gap-6 py-3 lg:gap-12 lg:py-4"
              style={motion(0.4)}
            >
              {content.heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-start gap-[2px]">
                  <p className="text-[24px] font-semibold leading-[1.2] text-white lg:text-[32px]">
                    {stat.value}
                  </p>
                  <p className="text-[12px] leading-[1.4] text-white lg:text-[14px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="ivm-rise flex w-full flex-col items-start gap-[10px] lg:w-auto lg:flex-row lg:gap-4"
              style={motion(0.5, 24)}
            >
              <button
                type="button"
                onClick={openQuote}
                className="flex h-11 w-full items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10 lg:w-[220px]"
              >
                Order Now
              </button>
              <Link
                href="/book-a-test-drive"
                className="flex h-11 w-full items-center justify-center rounded-[4px] bg-white text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-10 lg:w-[220px]"
              >
                Book a Test Drive
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Section nav */}
        <div className="sticky top-14 z-40 h-[52px] w-full border-b border-ivm-n100 bg-white md:top-16 lg:top-14 lg:h-[60px]">
          <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 lg:px-12">
            <p className="hidden w-[200px] shrink-0 text-[16px] font-bold leading-[1.4] text-ivm-n900 lg:block">
              {content.name}
            </p>

            <nav
              aria-label="Vehicle sections"
              className="-mx-4 flex h-full gap-6 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:gap-8 lg:px-0 lg:[&::-webkit-scrollbar]:hidden"
            >
              {SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(section.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex h-full shrink-0 items-center whitespace-nowrap text-[14px] font-semibold leading-[1.4] transition-colors ${
                      isActive ? "text-ivm-n900" : "text-ivm-n600 hover:text-ivm-n900"
                    }`}
                  >
                    {section.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-[2px] bg-ivm-blue transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>

            <div className="hidden w-[200px] shrink-0 justify-end lg:flex">
              <button
                type="button"
                onClick={openQuote}
                className="flex h-9 w-[140px] items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90"
              >
                Order Now
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------- Colours */}
        <section
          id="colours"
          className="mx-auto flex w-full max-w-[1440px] scroll-mt-[116px] flex-col gap-4 px-4 pt-16 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:pt-28"
        >
          <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-xl bg-white lg:h-[480px] lg:w-[860px]">
            <Image
              src={previewImage}
              alt={`${content.name} in ${activeColour?.name ?? "the selected colour"}`}
              fill
              sizes="(min-width: 1024px) 860px, 100vw"
              className="object-contain p-5 lg:p-[60px_80px]"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-4 lg:max-w-[436px] lg:flex-1 lg:gap-5">
            <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
              Colours
            </p>
            <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[48px]">
              Choose your look
            </h2>

            <p className="text-[16px] leading-[1.4] text-ivm-n600">
              Selected:{" "}
              <span className="font-medium text-ivm-n900">{activeColour?.name}</span>
            </p>

            <div className="flex flex-wrap gap-x-[14px] gap-y-4 lg:gap-5" role="group" aria-label="Body colour">
              {content.colours.map((colour) => {
                const isSelected = colour.name === activeColour?.name;
                return (
                  <button
                    key={colour.name}
                    type="button"
                    onClick={() => setSelectedColour(colour.name)}
                    aria-pressed={isSelected}
                    aria-label={colour.name}
                    className="flex w-10 flex-col items-center gap-1.5 lg:w-11 lg:gap-2"
                  >
                    <span
                      className={`block size-10 rounded-full lg:size-11 ${
                        isSelected
                          ? "border-[3px] border-ivm-blue"
                          : "border border-ivm-n200"
                      }`}
                      style={{ backgroundColor: colour.hex }}
                    />
                    <span
                      className={`text-[12px] leading-[1.4] lg:text-[14px] ${
                        isSelected ? "text-ivm-n900" : "text-ivm-n600"
                      }`}
                    >
                      {colour.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[14px] leading-[1.4] text-ivm-n500">
              Colour availability varies by showroom.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- Overview */}
        <section
          id="overview"
          className="mx-auto flex w-full max-w-[1440px] scroll-mt-[116px] flex-col items-start gap-4 px-4 pt-16 lg:px-8 lg:pt-24"
        >
          <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
            Overview
          </p>
          <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[48px]">
            {content.overviewHeading}
          </h2>
          <div className="flex max-w-[880px] flex-col gap-4 text-[14px] leading-[1.4] text-ivm-n600 lg:text-[20px]">
            {content.overviewBody.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- Accordions */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-10 lg:px-8 lg:pb-16 lg:pt-14">
          <div className="divide-y divide-ivm-n100">
            <AccordionItem
              title="Design"
              open={openAccordion === "design"}
              onToggle={() =>
                setOpenAccordion(openAccordion === "design" ? null : "design")
              }
            >
              <FeatureGrid features={content.designFeatures} />
            </AccordionItem>

            <AccordionItem
              title="Specifications"
              open={openAccordion === "specs"}
              onToggle={() => setOpenAccordion(openAccordion === "specs" ? null : "specs")}
            >
              <SpecList specs={content.specs} />
            </AccordionItem>

            <AccordionItem
              title="Technology"
              open={openAccordion === "technology"}
              onToggle={() =>
                setOpenAccordion(openAccordion === "technology" ? null : "technology")
              }
            >
              <FeatureGrid features={content.technologyFeatures} />
            </AccordionItem>
          </div>
        </section>

        {/* ---------------------------------------------------------- Stats bar */}
        <section className="bg-ivm-n50">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-12 lg:py-8">
            <div className="flex items-start gap-6 lg:gap-14">
              {content.statsBar.map((stat) => (
                <div key={stat.label} className="flex flex-col items-start gap-[2px]">
                  <p className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 lg:text-[24px] lg:leading-[1.2]">
                    {stat.value}
                  </p>
                  <p className="text-[12px] leading-[1.4] text-ivm-n600">{stat.label}</p>
                </div>
              ))}
            </div>

            <BrochureButton href={content.brochureUrl} onRequest={openQuote} />
          </div>
        </section>

        {/* ---------------------------------------------------------- Exterior */}
        <GallerySection id="exterior" gallery={content.exterior} />

        {/* ---------------------------------------------------------- Interior */}
        <GallerySection id="interior" gallery={content.interior} />

        {/* ------------------------------------------------------------- Video */}
        <section
          id="video"
          className="mx-auto w-full max-w-[1440px] scroll-mt-[116px] px-4 pt-16 lg:px-8 lg:pt-28"
        >
          <DrivingVideo
            poster={content.video.poster}
            src={content.video.src}
            eyebrow={content.video.eyebrow}
            heading={content.video.heading}
          />
        </section>

        {/* -------------------------------------------------------- Technology */}
        <section
          id="technology"
          className="mx-auto flex w-full max-w-[1440px] scroll-mt-[116px] flex-col gap-4 px-4 pt-16 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:pt-28"
        >
          <div className="relative h-[240px] w-full shrink-0 overflow-hidden rounded-xl bg-ivm-n50 lg:h-[460px] lg:w-[680px]">
            <Image
              src={content.technology.image}
              alt={content.technology.heading}
              fill
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-start gap-4 lg:flex-1 lg:gap-5">
            <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
              Technology
            </p>
            <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[48px]">
              {content.technology.heading}
            </h2>
            <p className="text-[14px] leading-[1.4] text-ivm-n600 lg:max-w-[520px] lg:text-[20px]">
              {content.technology.body}
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------- Final CTA */}
        <section id="order" className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-8 lg:py-28">
          <div className="flex w-full flex-col items-center gap-3 rounded-xl bg-ivm-n50 px-6 py-12 text-center lg:gap-4 lg:px-0 lg:py-20">
            <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[48px]">
              {content.cta.heading}
            </h2>
            <p className="text-[14px] leading-[1.4] text-ivm-n600 lg:text-[20px]">
              {content.cta.body}
            </p>
            <div className="h-2 lg:hidden" aria-hidden="true" />
            <div className="flex w-full max-w-[310px] flex-col gap-[10px] lg:w-auto lg:max-w-none lg:flex-row lg:gap-4 lg:pt-4">
              <button
                type="button"
                onClick={openQuote}
                className="flex h-11 w-full items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90 lg:h-10 lg:w-[220px]"
              >
                Order Now
              </button>
              <Link
                href="/book-a-test-drive"
                className="flex h-11 w-full items-center justify-center rounded-[4px] border border-ivm-n200 bg-white text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50 lg:h-10 lg:w-[220px]"
              >
                Book a Test Drive
              </Link>
            </div>
          </div>
        </section>
      </div>

      <GetQuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        vehicleType={content.name}
        vehicleSlug={model.slug}
        vehicleId={model.id}
        vehicleCategory={model.category?.name}
        vehicleImage={content.heroImage}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Section pieces                               */
/* -------------------------------------------------------------------------- */

function AccordionItem({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-[18px] text-left lg:py-6"
      >
        <span className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 lg:text-[32px] lg:leading-[1.2]">
          {title}
        </span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M5 12h14" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
          {!open && (
            <path d="M12 5v14" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open && <div className="pb-6 lg:pb-8">{children}</div>}
    </div>
  );
}

function FeatureGrid({ features }: { features: DetailFeature[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3 lg:gap-y-7">
      {features.map((feature, index) => (
        <div key={`${feature.title}-${index}`} className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-bold leading-[1.4] text-ivm-n900">
            {feature.title}
          </h3>
          {feature.body && (
            <p className="text-[14px] leading-[1.4] text-ivm-n600">{feature.body}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function SpecList({ specs }: { specs: DetailSpec[] }) {
  return (
    <div>
      {specs.map((spec, index) => (
        <div
          key={`${spec.label}-${index}`}
          className="flex items-start justify-between gap-3 py-3 text-[16px] leading-[1.4]"
        >
          <p className="text-ivm-n600">{spec.label}</p>
          <p className="max-w-[62%] text-right font-medium text-ivm-n900">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}

function GallerySection({ id, gallery }: { id: SectionId; gallery: DetailGallery }) {
  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-[1440px] scroll-mt-[116px] flex-col gap-4 px-4 pt-16 lg:gap-6 lg:px-8 lg:pt-28"
    >
      <div className="relative flex h-[360px] w-full flex-col justify-end overflow-hidden rounded-xl px-5 pb-6 lg:h-[680px] lg:px-16 lg:pb-16">
        <Image
          src={gallery.featuredImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 1376px, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col gap-2 lg:gap-3">
          <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-white">
            {gallery.eyebrow}
          </p>
          <h2 className="text-[32px] font-semibold leading-[1.2] text-white lg:text-[48px]">
            {gallery.heading}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        {gallery.photos.map((photo, index) => (
          <figure key={`${photo.caption}-${index}`} className="flex flex-col gap-3 lg:flex-1 lg:gap-4">
            <div className="relative h-[220px] w-full overflow-hidden rounded-xl lg:h-[400px]">
              <Image
                src={photo.image}
                alt={photo.caption}
                fill
                sizes="(min-width: 1024px) 672px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="text-[24px] font-semibold leading-[1.2] text-ivm-n900">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function DrivingVideo({
  poster,
  src,
  eyebrow,
  heading,
}: {
  poster: string;
  src: string;
  eyebrow: string;
  heading: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const idle = status === "idle";

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => setStatus("idle"));
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) play();
    else video.pause();
  };

  return (
    <div className="relative flex h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-black lg:h-[680px]">
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 1376px, 100vw"
        className={`object-cover transition-opacity duration-700 ${idle ? "opacity-100" : "opacity-0"}`}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
          idle ? "opacity-0" : "opacity-100"
        }`}
        playsInline
        preload="none"
        onPlay={() => setStatus("playing")}
        onPause={(event) => {
          if (!event.currentTarget.ended) setStatus("paused");
        }}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setStatus("idle");
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className={`absolute inset-0 bg-black/45 transition-opacity duration-500 ${
          idle ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex w-full flex-col items-center justify-center gap-3 px-5 text-center transition-opacity duration-500 lg:gap-4 ${
          idle ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!idle}
      >
        <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-white">
          {eyebrow}
        </p>
        <h2 className="text-[24px] font-semibold leading-[1.2] text-white lg:text-[48px]">
          {heading}
        </h2>
        <div className="h-2 w-2.5" aria-hidden="true" />
        <button
          type="button"
          onClick={play}
          aria-label={`Play the film: ${heading}`}
          tabIndex={idle ? 0 : -1}
          className="flex size-16 items-center justify-center rounded-full bg-white transition-transform duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:size-[88px]"
        >
          <svg
            viewBox="0 0 24 24"
            className="ml-0.5 size-6 lg:size-7"
            fill="none"
            aria-hidden="true"
          >
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="#005EB8" />
          </svg>
        </button>
      </div>

      {!idle && (
        <button
          type="button"
          onClick={toggle}
          aria-label={status === "playing" ? "Pause film" : "Resume film"}
          className="absolute bottom-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-ivm-n900 transition-transform hover:scale-110 lg:bottom-6 lg:left-6 lg:right-auto"
        >
          {status === "playing" ? (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

function BrochureButton({
  href,
  onRequest,
}: {
  href: string | null;
  onRequest: () => void;
}) {
  const className =
    "flex h-11 w-full items-center justify-center gap-[10px] rounded-[4px] border border-ivm-n200 bg-white px-4 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:border-ivm-blue hover:text-ivm-blue lg:w-auto";
  const icon = (
    <Image
      src="/icons/icon-pdf.svg"
      alt=""
      width={22}
      height={22}
      className="size-[22px] shrink-0"
    />
  );

  if (href) {
    return (
      <a
        href={href}
        download
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {icon}
        Download Brochure (PDF)
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onRequest}
      title="Request the brochure"
      className={className}
    >
      {icon}
      Download Brochure (PDF)
    </button>
  );
}
