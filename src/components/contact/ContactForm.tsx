"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { VEHICLE_BRANDS } from "./contact-data";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

const ENQUIRY_TYPES = [
  "Buying a vehicle",
  "Fleet or government order",
  "Service & parts",
  "Something else",
] as const;

type SubState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fields?: Record<string, string> };

const INPUT =
  "h-12 w-full rounded-[8px] border border-ivm-n200 bg-white px-4 text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue";

/**
 * Figma: "Enquiry form" (620 × 817). Full name + email share a row, then phone,
 * enquiry-type chips, vehicle select, message, submit and the consent caption.
 */
export default function ContactForm({ className = "" }: { className?: string }) {
  const [enquiryType, setEnquiryType] = useState<string>(ENQUIRY_TYPES[0]);
  const [vehicle, setVehicle] = useState("");
  const [sub, setSub] = useState<SubState>({ status: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSub({ status: "loading" });
    const form = e.currentTarget;
    const fd = new FormData(form);
    const subject = `${enquiryType}${vehicle ? ` — ${vehicle}` : ""}`.slice(0, 150);
    const payload = {
      [HONEYPOT_FIELD]: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject,
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
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
              "Too many messages from this connection. Please try again in an hour.",
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
              "We couldn't send your message right now. Please try again later.",
          });
        }
        return;
      }
      setSub({
        status: "success",
        message: "Thanks - we've received your message and will get back to you soon.",
      });
      setEnquiryType(ENQUIRY_TYPES[0]);
      setVehicle("");
      form.reset();
    } catch {
      setSub({
        status: "error",
        message:
          "We couldn't reach our server right now. Please check your connection and try again.",
      });
    }
  }

  const fieldError = (key: string) =>
    sub.status === "error" ? sub.fields?.[key] : undefined;

  return (
    <div
      className={`w-full rounded-[16px] border border-ivm-n200 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:p-8 xl:w-[620px] xl:shrink-0 xl:p-10 ${className}`}
    >
      <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[28px] xl:text-[32px]">
        Send us a message
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-5"
        noValidate
      >
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
            className="rounded-[8px] border border-[#f3b6b6] bg-[#fdecec] p-3 text-[14px] font-semibold text-[#9a2a2a]"
          >
            {sub.message}
          </div>
        ) : null}

        {sub.status === "success" ? (
          <div
            role="status"
            className="rounded-[8px] border border-[#7ec18e] bg-[#e9f8ee] p-4 text-[14px] font-semibold leading-[1.4] text-[#225b3a]"
          >
            {sub.message}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="contact-name" label="Full name" error={fieldError("name")}>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  className={INPUT}
                />
              </Field>
              <Field id="contact-email" label="Email address" error={fieldError("email")}>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className={INPUT}
                />
              </Field>
            </div>

            <Field id="contact-phone" label="Phone number" error={fieldError("phone")}>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                autoComplete="tel"
                required
                className={INPUT}
              />
            </Field>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="p-0 text-[14px] font-semibold leading-[1.4] text-ivm-n900 mb-2">
                What can we help with?
              </legend>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_TYPES.map((type) => {
                  const selected = enquiryType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setEnquiryType(type)}
                      className={`rounded-full border px-[14px] py-2 text-[14px] font-semibold leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue ${
                        selected
                          ? "border-ivm-blue bg-[rgba(0,94,184,0.08)] text-ivm-blue"
                          : "border-ivm-n200 bg-white text-ivm-n900 hover:border-ivm-n500"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field id="contact-vehicle" label="Vehicle of interest">
              <div className="relative">
                <select
                  id="contact-vehicle"
                  name="vehicle"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className={`${INPUT} appearance-none pr-10 ${vehicle ? "" : "text-ivm-n500"}`}
                >
                  <option value="">Choose a vehicle</option>
                  {VEHICLE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  strokeWidth={1.35}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#757575]"
                />
              </div>
            </Field>

            <Field id="contact-message" label="Message" error={fieldError("message")}>
              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help?"
                required
                rows={4}
                className="h-[132px] w-full resize-none rounded-[8px] border border-ivm-n200 bg-white px-4 py-[14px] text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue"
              />
            </Field>

            <button
              type="submit"
              disabled={sub.status === "loading"}
              className="flex h-12 w-full items-center justify-center rounded-[4px] bg-ivm-blue text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {sub.status === "loading" ? "Sending…" : "Send message"}
            </button>

            <p className="text-center text-[12px] leading-[1.4] text-ivm-n500">
              By sending this form you agree to be contacted by IVM about your enquiry.
            </p>
          </>
        )}
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[14px] font-semibold leading-[1.4] text-ivm-n900">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[12px] font-semibold leading-[1.4] text-[#9a2a2a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
