"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import {
  CATEGORIES,
  CATEGORY_EYEBROW,
  CATEGORY_LABEL,
  VEHICLES,
  type Category,
  type Vehicle,
} from "@/components/vehicles/vehicles-data";
import BookingStepper, { type BookingStep } from "./BookingStepper";
import BookingSummary from "./BookingSummary";
import type { DealershipDTO } from "@/types/dto";

const VISIBLE_VEHICLES = 8;

const TIME_SLOTS = [
  { value: "Morning", label: "Morning · 9–12" },
  { value: "Afternoon", label: "Afternoon · 12–3" },
  { value: "Late afternoon", label: "Late afternoon · 3–5" },
] as const;

/** Used when the CMS is unavailable; ids are placeholders only. */
const FALLBACK_DEALERSHIPS: DealershipDTO[] = [
  {
    id: "1",
    name: "IVM Abuja Showroom",
    address:
      "Edwin Medani Crescent, By St Martins Catholic Church, Back of VIO Office, Mabuchi Abuja",
    city: "Abuja",
    state: "FCT",
    phone: "07049087160",
  },
  {
    id: "2",
    name: "IVM Lagos MainLand Service Center",
    address: "39 Alh Tokan Street, Alaka Estate, Surulere",
    city: "Lagos",
    state: "Lagos",
    phone: "08037222939",
  },
  {
    id: "3",
    name: "IVM Lagos Island Service Center",
    address: "Lekki/Ajah express Way, After Cosharis Ibeju Lekki",
    city: "Lagos",
    state: "Lagos",
    phone: "09138177285",
  },
  {
    id: "4",
    name: "IVM Enugu Service Center",
    address:
      "Enugu Abakaliki Express Way, After Mobil Filling Station, Emene, Enugu State",
    city: "Enugu",
    state: "Enugu",
    phone: "08122202053",
  },
];

type SubState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string; fields?: Record<string, string> };

type WizardStep = BookingStep | "success";

const INPUT =
  "h-12 w-full rounded-[8px] border border-ivm-n200 bg-white px-4 text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue";

const PRIMARY =
  "flex h-12 items-center justify-center rounded-[4px] bg-ivm-blue px-4 text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90 disabled:opacity-60";

const SECONDARY =
  "flex h-12 items-center justify-center rounded-[4px] border border-ivm-n200 bg-white px-4 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50";

/* ------------------------------ date helpers ------------------------------ */

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildDateOptions(days = 14) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i + 1);
    const value = isoDate(date);
    return { value, label: formatDate(value) };
  });
}

const DATE_OPTIONS = buildDateOptions();

/* ---------------------------- showroom helpers ---------------------------- */

function dealershipKind(name: string) {
  return /service/i.test(name) ? "Service centre" : "Showroom";
}

function dealershipCity(dealer: DealershipDTO) {
  if (/main\s*land/i.test(dealer.name)) return "Lagos Mainland";
  if (/island/i.test(dealer.name)) return "Lagos Island";
  return dealer.city || dealer.name;
}

function dealershipArea(dealer: DealershipDTO) {
  const address = dealer.address.toLowerCase();
  const known: [string, string][] = [
    ["mabuchi", "Mabuchi"],
    ["alaka", "Alaka Estate"],
    ["ibeju", "Ibeju-Lekki"],
    ["emene", "Emene"],
    ["nnewi", "Nnewi"],
  ];
  const match = known.find(([needle]) => address.includes(needle));
  return match?.[1] ?? dealer.city ?? dealer.name;
}

const SHOWROOM_RANK = ["abuja", "lagos mainland", "lagos island", "enugu"];

function showroomRank(dealer: DealershipDTO) {
  const rank = SHOWROOM_RANK.indexOf(dealershipCity(dealer).toLowerCase());
  return rank === -1 ? 99 : rank;
}

/* --------------------------------- page ---------------------------------- */

export default function BookTestDriveClient({
  initialVehicles,
  dealerships,
}: {
  initialVehicles?: Vehicle[];
  dealerships?: DealershipDTO[];
}) {
  const catalogue = initialVehicles?.length ? initialVehicles : VEHICLES;
  const showrooms = (dealerships?.length ? dealerships : FALLBACK_DEALERSHIPS)
    .slice()
    .sort((a, b) => showroomRank(a) - showroomRank(b));

  const [step, setStep] = useState<WizardStep>(1);
  const [category, setCategory] = useState<Category>("ALL");
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const [dealershipId, setDealershipId] = useState(showrooms[0]?.id ?? "");
  const [preferredDate, setPreferredDate] = useState(DATE_OPTIONS[0]?.value ?? "");
  const [slot, setSlot] = useState<string>(TIME_SLOTS[0].label);

  const [licence, setLicence] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [sub, setSub] = useState<SubState>({ status: "idle" });

  const selected = catalogue.find((vehicle) => vehicle.id === selectedId) ?? null;
  const selectedDealership =
    showrooms.find((dealer) => dealer.id === dealershipId) ?? showrooms[0];

  const filtered =
    category === "ALL"
      ? catalogue
      : catalogue.filter((vehicle) => vehicle.category === category);
  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_VEHICLES);

  const showroomSummary = selectedDealership
    ? `${dealershipCity(selectedDealership)} · ${dealershipArea(selectedDealership)}`
    : "—";

  const goTo = (next: WizardStep) => {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToShowroom = () => {
    if (!selected) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    setSub({ status: "idle" });
    goTo(2);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedId(null);
    setShowAlert(false);
    setCategory("ALL");
    setShowAll(false);
    setDealershipId(showrooms[0]?.id ?? "");
    setPreferredDate(DATE_OPTIONS[0]?.value ?? "");
    setSlot(TIME_SLOTS[0].label);
    setLicence(true);
    setMarketing(false);
    setSub({ status: "idle" });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      setShowAlert(true);
      goTo(1);
      return;
    }
    if (!licence) {
      setSub({
        status: "error",
        message: "Please confirm you have a valid driver's licence and will bring it.",
      });
      return;
    }

    setSub({ status: "loading" });
    const fd = new FormData(e.currentTarget);
    const notes = String(fd.get("message") ?? "").trim();
    const message = [
      notes,
      `Preferred time: ${slot}`,
      "Has a valid driver's licence and will bring it.",
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload = {
      [HONEYPOT_FIELD]: (fd.get(HONEYPOT_FIELD) as string | null) ?? "",
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      modelId: selected.id,
      preferredDate,
      dealershipId: selectedDealership?.id,
      message,
      marketingOptIn: marketing,
    };

    try {
      const res = await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      const errorBody = (
        json as { error?: { message?: unknown; fieldErrors?: unknown } } | null
      )?.error;
      const apiMessage =
        typeof errorBody?.message === "string" ? errorBody.message : undefined;

      if (!res.ok) {
        if (res.status === 429) {
          setSub({
            status: "error",
            message:
              apiMessage ??
              "Too many attempts. Please try again in a little while.",
          });
        } else if (res.status === 422) {
          const fields: Record<string, string> = {};
          const err = errorBody?.fieldErrors;
          if (err && typeof err === "object") {
            for (const [key, value] of Object.entries(
              err as Record<string, unknown>,
            )) {
              if (Array.isArray(value) && typeof value[0] === "string") {
                fields[key] = value[0];
              } else if (typeof value === "string") {
                fields[key] = value;
              }
            }
          }
          setSub({
            status: "error",
            message:
              apiMessage && apiMessage !== "Validation failed."
                ? apiMessage
                : "Please correct the highlighted fields and try again.",
            fields,
          });
        } else if (res.status === 404) {
          setSub({
            status: "error",
            message:
              apiMessage ??
              "That model is no longer available. Please choose another one.",
          });
          setSelectedId(null);
          setShowAlert(false);
          goTo(1);
        } else {
          setSub({
            status: "error",
            message:
              apiMessage ?? "Something went wrong on our end. Please try again.",
          });
        }
        return;
      }

      setSub({ status: "idle" });
      goTo("success");
    } catch {
      setSub({
        status: "error",
        message:
          "We couldn't reach our server. Please check your connection and try again.",
      });
    }
  }

  const fieldError = (key: string) =>
    sub.status === "error" ? sub.fields?.[key] : undefined;

  /* ---------------------------- success screen ---------------------------- */

  if (step === "success" && selected) {
    return (
      <>
        {/* Figma: the success frame keeps the header band empty. */}
        <div className="h-[104px]" aria-hidden="true" />

        <section className="px-4 pb-24 md:px-6">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-7 pt-16 md:pt-24">
            <span className="ivm-rise flex size-[72px] items-center justify-center rounded-full bg-[rgba(0,94,184,0.1)] text-ivm-blue">
              <Check size={34} strokeWidth={3.5} aria-hidden="true" />
            </span>
            <h1 className="max-w-[720px] text-center text-[32px] font-semibold leading-[1.2] text-ivm-n900 md:text-[48px] xl:text-[56px] xl:leading-[1.1]">
              Test drive requested
            </h1>
            <p className="max-w-[560px] text-center text-[16px] leading-[1.4] text-ivm-n600 md:text-[20px]">
              Thanks — our team at the {dealershipCity(selectedDealership)} showroom will call
              you to confirm your time. Remember to bring your driver’s licence.
            </p>

            <BookingSummary
              eyebrow="Booking summary"
              vehicle={selected}
              showroom={showroomSummary}
              date={formatDate(preferredDate)}
              time={slot}
              className="max-w-[440px]"
            />

            <div className="flex w-full flex-col gap-3 pt-2 sm:w-[412px] sm:flex-row">
              <button type="button" onClick={resetBooking} className={`${SECONDARY} flex-1`}>
                Book a test drive
              </button>
              <Link href="/vehicles" className={`${PRIMARY} flex-1`}>
                Browse vehicles
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ------------------------------- wizard ------------------------------- */

  return (
    <>
      <header className="flex flex-col items-center gap-3 px-4 pb-8 pt-12 text-center md:pt-16 xl:pt-[72px]">
        <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-blue">
          Test drive
        </p>
        <h1 className="text-[32px] font-semibold leading-[1.2] text-ivm-n900 md:text-[48px] xl:text-[56px] xl:leading-[1.1]">
          Book a test drive
        </h1>
        <p className="max-w-[660px] text-[16px] leading-[1.4] text-ivm-n600 md:text-[20px]">
          Choose a vehicle, a showroom and a time. It takes about two minutes.
        </p>
        <div className="pt-6">
          <BookingStepper current={step === "success" ? 3 : step} />
        </div>
      </header>

      <section className="px-4 pb-24 pt-8 md:px-6">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-7">
          {step === 1 ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px]">
                  Which vehicle would you like to drive?
                </h2>
                <p className="text-[14px] leading-[1.4] text-ivm-n600">
                  {filtered.length} {filtered.length === 1 ? "model" : "models"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter vehicles">
                {CATEGORIES.map((item) => {
                  const active = category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setCategory(item);
                        setShowAll(false);
                      }}
                      className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] transition-colors ${
                        active
                          ? "bg-ivm-n900 text-white"
                          : "bg-ivm-n50 text-ivm-n900 hover:bg-ivm-n100"
                      }`}
                    >
                      {CATEGORY_LABEL[item]}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((vehicle) => (
                  <VehicleOption
                    key={vehicle.id}
                    vehicle={vehicle}
                    selected={selectedId === vehicle.id}
                    onSelect={() => {
                      setSelectedId(vehicle.id);
                      setShowAlert(false);
                    }}
                  />
                ))}
              </div>

              {filtered.length === 0 ? (
                <p className="py-6 text-center text-[14px] leading-[1.4] text-ivm-n600">
                  No models in this category right now.
                </p>
              ) : null}

              {filtered.length > VISIBLE_VEHICLES ? (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="text-[16px] font-medium leading-[1.4] text-ivm-blue"
                  >
                    {showAll
                      ? "Show fewer models ↑"
                      : `Show all ${filtered.length} models ↓`}
                  </button>
                </div>
              ) : null}

              {showAlert ? (
                <ErrorAlert
                  title="Please select a vehicle"
                  body="Choose at least one vehicle to continue to the next step."
                />
              ) : sub.status === "error" && sub.message ? (
                <ErrorAlert title="We couldn't submit your booking" body={sub.message} />
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-ivm-n100 pt-6 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={goToShowroom}
                  className={`${PRIMARY} w-full sm:w-[220px]`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px]">
                Where would you like to drive it?
              </h2>

              <div
                role="group"
                aria-label="Choose a showroom"
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {showrooms.map((dealer) => {
                  const active = dealer.id === selectedDealership?.id;
                  return (
                    <button
                      key={dealer.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setDealershipId(dealer.id)}
                      className={`relative flex h-[84px] items-start gap-[14px] rounded-[12px] border bg-white p-[18px] text-left transition-colors ${
                        active
                          ? "border-2 border-ivm-blue"
                          : "border-ivm-n200 hover:border-ivm-n500"
                      }`}
                    >
                      <RadioDot selected={active} />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="text-[16px] font-bold leading-[1.4] text-ivm-n900">
                          {dealershipCity(dealer)}
                        </span>
                        <span className="truncate text-[14px] leading-[1.4] text-ivm-n600">
                          {dealershipKind(dealer.name)} · {dealershipArea(dealer)}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div aria-hidden="true" className="h-2" />

              <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px]">
                When suits you?
              </h2>

              <div className="flex flex-col gap-4 xl:flex-row xl:gap-6">
                <label className="flex flex-col gap-[6px] xl:w-[360px]">
                  <span className="text-[14px] font-semibold leading-[1.4] text-ivm-n900">
                    Preferred date
                  </span>
                  <span className="relative">
                    <select
                      value={preferredDate}
                      onChange={(event) => setPreferredDate(event.target.value)}
                      className={`${INPUT} appearance-none pr-10`}
                    >
                      {DATE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.35}
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#757575]"
                    />
                  </span>
                </label>

                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-[14px] font-semibold leading-[1.4] text-ivm-n900">
                    Preferred time
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map((option) => {
                      const active = slot === option.label;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSlot(option.label)}
                          className={`rounded-[8px] border px-4 py-[13px] text-[14px] font-semibold leading-[1.4] transition-colors ${
                            active
                              ? "border-ivm-blue bg-[rgba(0,94,184,0.08)] text-ivm-blue"
                              : "border-ivm-n200 bg-white text-ivm-n900 hover:border-ivm-n500"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-[14px] leading-[1.4] text-ivm-n500">
                Our team will call you to confirm the exact time. Showroom hours may vary.
              </p>

              <div className="flex flex-col-reverse gap-3 border-t border-ivm-n100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goTo(1)} className={`${SECONDARY} w-full sm:w-[160px]`}>
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goTo(3)}
                  className={`${PRIMARY} w-full sm:w-[220px]`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-12">
                <form
                  id="test-drive-details"
                  onSubmit={handleSubmit}
                  className="flex min-w-0 flex-1 flex-col gap-5"
                  noValidate
                >
                  <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px]">
                    Tell us about you
                  </h2>

                  <input
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="td-name" label="Full name" error={fieldError("name")}>
                      <input
                        id="td-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your name"
                        required
                        className={INPUT}
                      />
                    </Field>
                    <Field id="td-email" label="Email address" error={fieldError("email")}>
                      <input
                        id="td-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        required
                        className={INPUT}
                      />
                    </Field>
                  </div>

                  <Field id="td-phone" label="Phone number" error={fieldError("phone")}>
                    <input
                      id="td-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      required
                      className={INPUT}
                    />
                  </Field>

                  <Field
                    id="td-message"
                    label="Anything we should know? (optional)"
                    error={fieldError("message")}
                  >
                    <textarea
                      id="td-message"
                      name="message"
                      rows={3}
                      placeholder="e.g. I’d like to compare it with the G5T"
                      className="h-[110px] w-full resize-none rounded-[8px] border border-ivm-n200 bg-white px-4 py-[14px] text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors placeholder:text-ivm-n500 focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue"
                    />
                  </Field>

                  <CheckBox checked={licence} onChange={setLicence}>
                    I have a valid driver’s licence and will bring it to the test drive.
                  </CheckBox>

                  <CheckBox checked={marketing} onChange={setMarketing}>
                    Send me news and offers from IVM (optional).
                  </CheckBox>
                </form>

                <BookingSummary
                  vehicle={selected}
                  showroom={showroomSummary}
                  date={formatDate(preferredDate)}
                  time={slot}
                  className="xl:w-[400px] xl:shrink-0"
                />
              </div>

              {sub.status === "error" && sub.message ? (
                <ErrorAlert title="We couldn't submit your booking" body={sub.message} />
              ) : null}

              <div className="flex flex-col-reverse gap-3 border-t border-ivm-n100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goTo(2)} className={`${SECONDARY} w-full sm:w-[160px]`}>
                  Back
                </button>
                <button
                  type="submit"
                  form="test-drive-details"
                  disabled={sub.status === "loading"}
                  className={`${PRIMARY} w-full sm:w-[220px]`}
                >
                  {sub.status === "loading" ? "Booking…" : "Confirm booking"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}

/* ------------------------------ small pieces ------------------------------ */

function VehicleOption({
  vehicle,
  selected,
  onSelect,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="relative flex h-[202px] flex-col items-start gap-2 rounded-[12px] bg-ivm-n50 p-4 text-left transition-colors hover:bg-ivm-n100/70"
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-n500">
          {vehicle.bodyType ?? CATEGORY_EYEBROW[vehicle.category]}
        </span>
        <RadioDot selected={selected} />
      </span>

      <span className="relative h-[110px] w-full overflow-hidden rounded-[8px] bg-white/60">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(min-width: 1280px) 233px, (min-width: 640px) 45vw, 90vw"
            className="object-contain"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[11px] text-ivm-n500">
            Photo coming soon
          </span>
        )}
      </span>

      <span className="w-full truncate text-[16px] font-bold leading-[1.4] text-ivm-n900">
        {vehicle.name}
      </span>

      {selected ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[12px] border-2 border-ivm-blue"
        />
      ) : null}
    </button>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white ${
        selected ? "border-ivm-blue" : "border-ivm-n200"
      }`}
    >
      {selected ? <span className="size-3 rounded-full bg-ivm-blue" /> : null}
    </span>
  );
}

function ErrorAlert({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-[8px] border border-[#d93026] bg-[#fceded] px-4 py-[14px]"
    >
      <AlertCircle
        size={20}
        strokeWidth={1.67}
        aria-hidden="true"
        className="shrink-0 text-[#d93025]"
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-[16px] font-bold leading-[1.4] text-ivm-n900">{title}</p>
        <p className="text-[14px] leading-[1.4] text-ivm-n600">{body}</p>
      </div>
    </div>
  );
}

function CheckBox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-0 flex size-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ivm-blue ${
          checked
            ? "border-ivm-blue bg-ivm-blue text-white"
            : "border-ivm-n200 bg-white text-transparent"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </span>
      <span className="text-[14px] leading-[1.4] text-ivm-n900">{children}</span>
    </label>
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
