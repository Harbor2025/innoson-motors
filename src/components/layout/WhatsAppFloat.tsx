"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/**
 * Figma: "WhatsApp float" + "WhatsApp chat panel".
 *
 * Closed: dismiss pill + "How can we help?" bubble + 64px WhatsApp button with
 * a red "1" badge. Open: 376x444 chat panel pinned bottom-right on desktop and
 * a bottom drawer on mobile.
 *
 * Mounted once in the root layout and hidden on the test-drive page (a floating
 * chat there competes with the booking form) and in the Payload admin.
 */

const DEFAULT_WHATSAPP_HREF = "https://wa.me/2348054459560";

/** Route prefixes where the widget should not appear. */
const HIDDEN_ROUTES = ["/book-a-test-drive", "/admin"];

const QUICK_REPLIES = [
  "Price & availability",
  "Book a test drive",
  "Financing plans",
  "After-sales & parts",
] as const;

export default function WhatsAppFloat({ href }: { href?: string }) {
  const pathname = usePathname() ?? "";
  const hidden = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (hidden) return null;

  return <WhatsAppChat href={href ?? DEFAULT_WHATSAPP_HREF} />;
}

function WhatsAppChat({ href }: { href: string }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(true);
  const [topic, setTopic] = useState<string | null>(null);

  // Escape closes the panel on desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const message = topic
    ? `Hello Innoson, I'd like to ask about ${topic.toLowerCase()}.`
    : "Hello Innoson, I'd like to speak with your team.";
  const chatHref = withMessage(href, message);

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] bg-black/30 sm:hidden"
        />
      )}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="ivm-rise fixed inset-x-0 bottom-0 z-[90] flex max-h-[85dvh] flex-col overflow-hidden rounded-t-[16px] bg-white font-[family-name:var(--font-inter)] shadow-[0px_16px_48px_rgba(0,0,0,0.2)] sm:inset-x-auto sm:bottom-8 sm:right-8 sm:h-[444px] sm:w-[376px] sm:max-h-none sm:rounded-[16px]"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 bg-[#075E54] px-4 py-[14px]">
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
              <span className="text-[12px] font-medium leading-[1.4] text-ivm-blue">
                IVM
              </span>
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#075E54] bg-[#25D366]"
              />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p
                id={titleId}
                className="text-[16px] font-bold leading-[1.4] text-white"
              >
                IVM Customer Care
              </p>
              <p className="text-[12px] leading-[1.4] text-white/80">
                Typically replies within an hour
              </p>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.12] text-white transition-colors hover:bg-white/20"
            >
              <X aria-hidden="true" className="size-4" strokeWidth={1.8} />
            </button>
          </div>

          {/* Conversation */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#EFEAE2] px-4 py-5">
            <span className="self-center rounded-[6px] bg-white/85 px-2.5 py-1 text-[12px] font-medium leading-[1.4] text-[#5C5E62]">
              TODAY
            </span>

            <div className="flex flex-col gap-1 self-stretch rounded-[2px_10px_10px_10px] bg-white px-3 pb-2 pt-2.5 shadow-[0px_1px_1px_rgba(0,0,0,0.08)]">
              <p className="text-[14px] leading-[1.4] text-ivm-n900">
                Hello 👋 Welcome to Innoson Vehicles. How can we help you today?
                Pick a topic or start a chat.
              </p>
              <span className="self-end text-[12px] leading-[1.4] text-[#8E8E8E]">
                9:41
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => {
                const selected = topic === reply;
                return (
                  <button
                    key={reply}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTopic(selected ? null : reply)}
                    className={`rounded-[18px] border px-3.5 py-2 text-[14px] font-semibold leading-[1.4] transition-colors ${
                      selected
                        ? "border-[#075E54] bg-[#075E54] text-white"
                        : "border-[rgba(18,140,126,0.35)] bg-white text-[#075E54] hover:bg-[#f2faf8]"
                    }`}
                  >
                    {reply}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 flex-col items-center gap-2 px-4 pb-4 pt-3.5">
            <a
              href={chatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[24px] bg-[#25D366] text-[16px] font-bold leading-[1.4] text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppGlyph className="size-[22px]" />
              Start chat on WhatsApp
            </a>
            <p className="text-[12px] leading-[1.4] text-[#5C5E62]">
              Mon–Sat, 8am–6pm WAT · Opens WhatsApp
            </p>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2 font-[family-name:var(--font-inter)] md:right-6 lg:right-8">
          {teaserVisible && (
            <>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setTeaserVisible(false)}
                className="flex size-6 items-center justify-center rounded-[12px] bg-white text-[#5C5E62] shadow-[0px_2px_6px_rgba(0,0,0,0.12)]"
              >
                <X aria-hidden="true" className="size-3" strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-[16px_16px_4px_16px] bg-white px-[18px] py-3 text-[16px] font-medium leading-[1.4] text-ivm-n900 shadow-[0px_6px_20px_rgba(0,0,0,0.14)] transition-transform hover:-translate-y-0.5"
              >
                How can we help?
              </button>
            </>
          )}

          <button
            type="button"
            aria-label="Open WhatsApp chat"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="relative block size-14 transition-transform hover:scale-105 md:size-16"
          >
            <Image
              src="/images/whatsapp.png"
              alt=""
              fill
              sizes="64px"
              className="object-contain"
            />
            <span
              aria-hidden="true"
              className="absolute -top-1 left-[38px] flex h-[22px] items-center justify-center rounded-[11px] border-2 border-solid border-white bg-[#ff2116] px-[7px] text-[12px] font-medium leading-[1.4] text-white md:left-[46px]"
            >
              1
            </span>
          </button>
        </div>
      )}
    </>
  );
}

/** Append a prefilled message to the WhatsApp link, keeping any existing query. */
function withMessage(href: string, message: string) {
  try {
    const url = new URL(href);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}text=${encodeURIComponent(message)}`;
  }
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
