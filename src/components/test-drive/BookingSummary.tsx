import Image from "next/image";
import type { Vehicle } from "@/components/vehicles/vehicles-data";

export type BookingSummaryProps = {
  eyebrow?: string;
  vehicle: Vehicle | null;
  showroom: string;
  date: string;
  time: string;
  className?: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[14px] leading-[1.4] text-ivm-n600">{label}</span>
      <span className="text-right text-[14px] font-semibold leading-[1.4] text-ivm-n900">
        {value}
      </span>
    </div>
  );
}

/**
 * Figma: "Booking summary". 400 wide in step 3 and 440 wide on the success
 * screen. Photo, then vehicle / showroom / date / time rows.
 */
export default function BookingSummary({
  eyebrow = "Your booking",
  vehicle,
  showroom,
  date,
  time,
  className = "",
}: BookingSummaryProps) {
  return (
    <aside
      aria-label="Booking summary"
      className={`flex w-full flex-col gap-[14px] rounded-[12px] bg-ivm-n50 p-6 ${className}`}
    >
      <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-n500">
        {eyebrow}
      </p>

      <div className="relative h-[140px] w-full overflow-hidden rounded-[8px] bg-white">
        {vehicle?.image ? (
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(min-width: 1280px) 400px, 100vw"
            className="object-contain"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[12px] text-ivm-n500">
            {vehicle?.name ?? "Choose a vehicle"}
          </span>
        )}
      </div>

      <Row label="Vehicle" value={vehicle?.name ?? "—"} />
      <Row label="Showroom" value={showroom} />
      <Row label="Date" value={date} />
      <Row label="Time" value={time} />
    </aside>
  );
}
