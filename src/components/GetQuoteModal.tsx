"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type GetQuoteModalProps = {
  open: boolean;
  onClose: () => void;
  vehicleType?: string;
  vehicleSlug?: string | null;
  vehicleId?: string | null;
  vehicleCategory?: string;
  vehicleImage?: string;
};

type SubState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fields?: Record<string, string> };

const LABEL = "text-[14px] font-semibold leading-5 text-ivm-n900 mb-2";
const INPUT =
  "h-12 w-full rounded-[8px] border border-ivm-n200 bg-white px-4 text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue";
const SELECT = `${INPUT} cursor-pointer appearance-none pr-11`;
const PRIMARY =
  "flex h-12 items-center justify-center rounded-[4px] bg-ivm-blue px-4 text-[14px] font-semibold leading-5 text-white transition-opacity hover:opacity-90 disabled:opacity-60";
const SECONDARY =
  "flex h-12 items-center justify-center rounded-[4px] border border-ivm-n200 bg-white px-4 text-[14px] font-semibold leading-5 text-ivm-n900 transition-colors hover:bg-ivm-n50";

const SHOWROOMS = [
  { value: "abuja", label: "Abuja · Mabuchi" },
  { value: "lagos-mainland", label: "Lagos · Mainland" },
  { value: "lagos-island", label: "Lagos · Island" },
  { value: "enugu", label: "Enugu · Emene" },
] as const;

const PAYMENT_OPTIONS = [
  {
    value: "outright",
    title: "Outright purchase",
    description: "Pay in full at pickup",
  },
  {
    value: "finance",
    title: "Instalment plan",
    description: "Up to 36 months with Access Bank",
  },
] as const;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function buildDateOptions(days = 14) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + 1);
    const value = date.toISOString().slice(0, 10);
    return { value, label: formatDate(date) };
  });
}

export default function GetQuoteModal({
  open,
  onClose,
  vehicleType = "IVM Caris",
  vehicleSlug = null,
  vehicleId = null,
  vehicleCategory = "Sedan",
  vehicleImage = "/images/hero-car.png",
}: GetQuoteModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [sub, setSub] = useState<SubState>({ status: "idle" });

  const handleClose = useCallback(() => {
    setSub({ status: "idle" });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSub({ status: "loading" });
    const form = e.currentTarget;
    const fd = new FormData(form);
    const showroom = String(fd.get("showroom") ?? "");
    const preferredDate = String(fd.get("preferredDate") ?? "");
    const notes = String(fd.get("message") ?? "").trim();

    const message = [
      notes,
      showroom ? `Preferred showroom: ${showroom}` : "",
      preferredDate ? `Preferred date: ${preferredDate}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload = {
      [HONEYPOT_FIELD]: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      // The redesigned form collects a pickup showroom rather than a postal
      // address; the quotes API still expects an address value.
      address: showroom ? `Preferred showroom: ${showroom}` : "Not provided",
      modelId: vehicleId ?? undefined,
      modelSlug: vehicleSlug,
      message,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) {
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "Too many recent requests. Please try again later.",
          });
        } else if (res.status === 422) {
          const fields: Record<string, string> = {};
          const err = json?.errors;
          if (err && typeof err === "object") {
            for (const [k, v] of Object.entries(err as Record<string, unknown>)) {
              if (typeof v === "string") fields[k] = v;
            }
          }
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "Please check the highlighted fields and try again.",
            fields,
          });
        } else {
          setSub({
            status: "error",
            message:
              (json?.message as string | undefined) ??
              "We couldn't process your request right now. Please try again later.",
          });
        }
        return;
      }
      setSub({
        status: "success",
        message:
          "Thanks — our sales team will contact you with pricing and availability.",
      });
    } catch {
      setSub({
        status: "error",
        message:
          "We couldn't reach our server right now. Please check your connection and try again.",
      });
    }
  }

  if (!open) return null;

  const success = sub.status === "success";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 p-2 backdrop-blur-[5px] font-[family-name:var(--font-inter)] lg:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {success ? (
        <SuccessPanel
          titleId={titleId}
          closeRef={closeRef}
          onClose={handleClose}
          vehicleType={vehicleType}
          vehicleSlug={vehicleSlug}
        />
      ) : (
        <div className="relative flex max-h-[calc(100dvh-16px)] w-full max-w-[393px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_24px_64px_rgba(0,0,0,0.25)] lg:mt-0 lg:max-h-[calc(100dvh-32px)] lg:h-[889px] lg:max-w-[960px] lg:flex-row">
          {/* Vehicle panel */}
          <div className="relative h-[280px] w-full shrink-0 overflow-hidden bg-[#ebebeb] lg:h-full lg:w-[400px]">
            <Image
              src={vehicleImage}
              alt={vehicleType}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 bottom-5 lg:bottom-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0.75) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 pb-5 pl-5 lg:pb-8 lg:pl-8">
              <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-white/85">
                {vehicleCategory}
              </p>
              <h2 className="text-[40px] font-semibold leading-[1.2] text-white">
                {vehicleType}
              </h2>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-6 pt-5 lg:px-10 lg:pb-8 lg:pt-9">
            <button
              ref={closeRef}
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="absolute right-5 top-5 z-20 flex size-9 items-center justify-center rounded-full bg-ivm-n50 text-[#1e1e1e] transition-colors hover:bg-ivm-n100 lg:right-10 lg:top-9"
            >
              <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
            </button>

            <div className="flex items-start justify-between">
              <div className="flex flex-1 flex-col gap-1.5">
                <h2
                  id={titleId}
                  className="text-[32px] font-semibold leading-[1.2] text-ivm-n900 lg:text-[40px]"
                >
                  Get a quote
                </h2>
                <p className="text-[16px] leading-[1.4] text-ivm-n600">
                  Tell us what you need and our sales team will get back to you.
                </p>
              </div>
              {/* Reserves space for the absolutely-positioned close button. */}
              <div aria-hidden="true" className="hidden size-9 shrink-0 lg:block" />
            </div>

            <QuoteForm
              onSubmit={handleSubmit}
              vehicleType={vehicleType}
              sub={sub}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessPanel({
  titleId,
  closeRef,
  onClose,
  vehicleType,
  vehicleSlug,
}: {
  titleId: string;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  vehicleType: string;
  vehicleSlug: string | null;
}) {
  return (
    <div className="relative w-full max-w-[520px] rounded-[16px] bg-white px-6 pb-10 pt-6 shadow-[0px_24px_64px_rgba(0,0,0,0.25)] sm:px-10">
      <div className="flex justify-end">
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-ivm-n50 text-[#1e1e1e] transition-colors hover:bg-ivm-n100"
        >
          <X aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-ivm-blue/10">
          <Check
            aria-hidden="true"
            className="size-[30px] text-ivm-blue"
            strokeWidth={3}
          />
        </div>

        <h2
          id={titleId}
          className="text-center text-[32px] font-semibold leading-[1.2] text-ivm-n900 sm:text-[40px]"
        >
          Quote request sent
        </h2>

        <p className="max-w-[440px] text-center text-[16px] leading-[1.4] text-ivm-n600">
          Thanks — our sales team will contact you with pricing and availability
          for the {vehicleType}.
        </p>

        <div className="mt-2 flex w-full flex-col gap-3 sm:mt-0 sm:flex-row">
          <Link
            href="/book-a-test-drive"
            onClick={onClose}
            className={`${SECONDARY} flex-1`}
          >
            Book a Test Drive
          </Link>
          <Link
            href={vehicleSlug ? `/vehicles/${vehicleSlug}` : "/contact"}
            onClick={onClose}
            className={`${PRIMARY} flex-1`}
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuoteForm({
  onSubmit,
  vehicleType,
  sub,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  vehicleType: string;
  sub: SubState;
}) {
  const [payment, setPayment] = useState<string>("outright");
  const dateOptions = useMemo(() => buildDateOptions(), []);
  const errors = sub.status === "error" ? sub.fields : undefined;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <input
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {sub.status === "error" && sub.message ? (
        <div
          role="alert"
          className="rounded-[4px] border border-[#f3b6b6] bg-[#fdecec] p-3 text-[14px] font-semibold leading-5 text-[#9a2a2a]"
        >
          {sub.message}
        </div>
      ) : null}

      <Field label="Vehicle of interest">
        <SelectChevron>
          <select name="vehicleType" defaultValue={vehicleType} className={SELECT}>
            <option value={vehicleType}>{vehicleType}</option>
          </select>
        </SelectChevron>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" error={errors?.name}>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your name"
            className={INPUT}
          />
        </Field>
        <Field label="Email address" error={errors?.email}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            className={INPUT}
          />
        </Field>
      </div>

      <Field label="Phone number" error={errors?.phone}>
        <input
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Enter your phone number"
          className={INPUT}
        />
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className={LABEL}>How would you like to pay?</legend>
        <div className="grid grid-cols-2 gap-2.5">
          {PAYMENT_OPTIONS.map((option) => {
            const selected = payment === option.value;
            return (
              <label
                key={option.value}
                className={`relative flex min-h-24 cursor-pointer items-center gap-3.5 rounded-[12px] border bg-white px-4 py-3.5 transition-colors ${
                  selected
                    ? "border-2 border-ivm-blue"
                    : "border-ivm-n200 hover:border-ivm-n500"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.value}
                  checked={selected}
                  onChange={() => setPayment(option.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white ${
                    selected ? "border-ivm-blue" : "border-ivm-n200"
                  }`}
                >
                  {selected ? (
                    <span className="size-3 rounded-full bg-ivm-blue" />
                  ) : null}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold leading-[1.4] text-ivm-n900">
                    {option.title}
                  </span>
                  <span className="text-[14px] leading-5 text-ivm-n600">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Preferred showroom">
          <SelectChevron>
            <select name="showroom" defaultValue="" className={`${SELECT} text-ivm-n500`}>
              <option value="" disabled>
                Choose showroom
              </option>
              {SHOWROOMS.map((showroom) => (
                <option key={showroom.value} value={showroom.label} className="text-ivm-n900">
                  {showroom.label}
                </option>
              ))}
            </select>
          </SelectChevron>
        </Field>
        <Field label="Preferred date">
          <SelectChevron>
            <select
              name="preferredDate"
              defaultValue=""
              className={`${SELECT} text-ivm-n500`}
            >
              <option value="" disabled>
                Choose a date
              </option>
              {dateOptions.map((date) => (
                <option key={date.value} value={date.label} className="text-ivm-n900">
                  {date.label}
                </option>
              ))}
            </select>
          </SelectChevron>
        </Field>
      </div>

      <Field label="Message (optional)" error={errors?.message}>
        <textarea
          name="message"
          rows={3}
          placeholder="e.g. I’d like a quote for a fleet of 5"
          className="h-[84px] w-full resize-none rounded-[8px] border border-ivm-n200 bg-white px-4 py-3 text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue"
        />
      </Field>

      <button type="submit" disabled={sub.status === "loading"} className={PRIMARY}>
        {sub.status === "loading" ? "Submitting…" : "Order Now"}
      </button>

      <p className="text-center text-[12px] leading-[1.4] text-ivm-n500">
        Our sales team will contact you with pricing and availability.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      {children}
      {error ? (
        <p role="alert" className="text-[12px] font-semibold leading-4 text-[#9a2a2a]">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function SelectChevron({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block w-full">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ivm-n600"
        strokeWidth={1.35}
      />
    </span>
  );
}
