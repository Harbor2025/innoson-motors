"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LAST_UPDATED,
  LEGAL_ADDRESS,
  LEGAL_DOCUMENTS,
  LEGAL_EMAIL,
  type LegalDocumentId,
} from "./legal-data";

const EYEBROW =
  "text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em]";

/**
 * Figma: "Desktop – Privacy & Legal" / "Mobile – Privacy & Legal".
 * The policy tabs switch documents; the "On this page" list tracks the section
 * currently in view and links down to it.
 */
export default function LegalPage() {
  const [docId, setDocId] = useState<LegalDocumentId>(LEGAL_DOCUMENTS[0].id);
  const doc =
    LEGAL_DOCUMENTS.find((item) => item.id === docId) ?? LEGAL_DOCUMENTS[0];
  const [activeId, setActiveId] = useState(doc.sections[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectDoc = useCallback((id: LegalDocumentId) => {
    const next = LEGAL_DOCUMENTS.find((item) => item.id === id);
    if (!next) return;
    setDocId(id);
    setActiveId(next.sections[0]?.id ?? "");
  }, []);

  // Highlight the section currently in view in the TOC.
  useEffect(() => {
    const sections = doc.sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [doc]);

  function onTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (index + offset + LEGAL_DOCUMENTS.length) % LEGAL_DOCUMENTS.length;
    selectDoc(LEGAL_DOCUMENTS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <>
      {/* Header */}
      <header className="bg-ivm-n50">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 pb-6 pt-10 md:px-6 lg:px-24 lg:pb-8 lg:pt-[72px]">
          <p className={`${EYEBROW} text-ivm-blue`}>Legal</p>

          <h1 className="text-[28px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[56px] lg:leading-[1.1]">
            Privacy &amp; Legal
          </h1>

          <p className="text-[16px] leading-[1.4] text-ivm-n600">
            Last updated: {LAST_UPDATED}
          </p>

          <div
            role="tablist"
            aria-label="Legal documents"
            className="flex gap-2 overflow-x-auto pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LEGAL_DOCUMENTS.map((item, index) => {
              const selected = item.id === doc.id;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`legal-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`legal-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectDoc(item.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-[9px] text-[14px] font-semibold leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue ${
                    selected
                      ? "border-ivm-n900 bg-ivm-n900 text-white"
                      : "border-ivm-n200 bg-white text-ivm-n900 hover:border-ivm-n500"
                  }`}
                >
                  {item.tab}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-14 pt-8 md:px-6 lg:flex-row lg:items-start lg:gap-20 lg:px-24 lg:pb-24 lg:pt-14">
        <aside
          aria-label="On this page"
          className="w-full rounded-[12px] bg-ivm-n50 p-5 lg:sticky lg:top-20 lg:w-[280px] lg:shrink-0"
        >
          <p className={`${EYEBROW} text-[#888888]`}>On this page</p>

          <nav className="mt-1 flex flex-col">
            {doc.sections.map((section) => {
              const active = section.id === activeId;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveId(section.id)}
                  aria-current={active ? "location" : undefined}
                  className={`py-1.5 text-[14px] font-semibold leading-[1.4] transition-colors ${
                    active
                      ? "text-ivm-blue"
                      : "text-ivm-n900 hover:text-ivm-blue"
                  }`}
                >
                  {section.nav}
                </a>
              );
            })}
          </nav>
        </aside>

        <div
          role="tabpanel"
          id={`legal-panel-${doc.id}`}
          aria-labelledby={`legal-tab-${doc.id}`}
          className="flex w-full flex-1 flex-col gap-8 lg:max-w-[888px]"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[48px]">
              {doc.title}
            </h2>
            <p className="text-[14px] leading-[1.4] text-ivm-n900 lg:text-[20px]">
              {doc.intro}
            </p>
          </div>

          {doc.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="flex scroll-mt-24 flex-col gap-3"
            >
              <h3
                id={`${section.id}-heading`}
                className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 lg:text-[32px] lg:leading-[1.2]"
              >
                {section.heading}
              </h3>

              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  className="text-[14px] leading-[1.4] text-ivm-n600 lg:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 ? (
                <ul className="flex flex-col gap-2 pl-1">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] size-1.5 shrink-0 rounded-full bg-ivm-blue"
                      />
                      <span className="text-[14px] leading-[1.4] text-ivm-n600 lg:text-[16px]">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* Contact box closes the last section, as in Figma. */}
              {index === doc.sections.length - 1 ? (
                <div className="mt-0 flex flex-col gap-2 rounded-[12px] border border-ivm-blue bg-[rgba(0,94,184,0.06)] p-6">
                  <p className="text-[16px] font-bold leading-[1.4] text-ivm-n900">
                    {doc.contactTitle}
                  </p>
                  <p className="text-[14px] leading-[1.4] text-ivm-n600 lg:text-[16px]">
                    Email{" "}
                    <a
                      href={`mailto:${LEGAL_EMAIL}`}
                      className="text-ivm-blue underline-offset-2 hover:underline"
                    >
                      {LEGAL_EMAIL}
                    </a>{" "}
                    or write to us at:
                  </p>
                  <p className="text-[14px] leading-[1.4] text-ivm-n600">
                    {LEGAL_ADDRESS}
                  </p>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
