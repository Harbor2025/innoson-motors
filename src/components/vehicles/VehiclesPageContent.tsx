"use client";

import { useEffect, useMemo, useState } from "react";
import { VehicleChips, VehicleSidebar } from "./VehicleFilter";
import VehicleCard from "./VehicleCard";
import { CATEGORIES, CATEGORY_LABEL, VEHICLES, type Category, type Vehicle } from "./vehicles-data";

type Props = {
  initialVehicles?: Vehicle[];
};

/** Length of the Figma intro timeline; after this, re-filtered cards use a short stagger. */
const INTRO_MS = 2000;

export default function VehiclesPageContent({ initialVehicles }: Props) {
  const [active, setActive] = useState<Category>("ALL");
  const [introPlayed, setIntroPlayed] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setIntroPlayed(true), INTRO_MS);
    return () => window.clearTimeout(t);
  }, []);

  const vehicles = initialVehicles?.length ? initialVehicles : VEHICLES;

  const counts = useMemo(() => {
    const result = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
    result.ALL = vehicles.length;
    for (const v of vehicles) result[v.category] += 1;
    return result;
  }, [vehicles]);

  const filtered = useMemo(
    () => (active === "ALL" ? vehicles : vehicles.filter((v) => v.category === active)),
    [active, vehicles],
  );

  const isAll = active === "ALL";

  return (
    <div className="flex flex-col lg:flex-row">
      <VehicleSidebar active={active} onChange={setActive} counts={counts} />

      <div className="flex min-w-0 flex-1 flex-col items-start gap-6 px-4 pb-20 pt-10 md:px-6 lg:gap-8 lg:px-12 lg:pb-28 lg:pt-14">
        <div className="flex flex-col items-start gap-1 lg:gap-[6px]">
          <h1
            className="ivm-rise text-[28px] font-semibold leading-[1.2] text-ivm-n900 md:text-[40px] lg:text-[56px] lg:leading-[1.1]"
            style={{ "--ivm-delay": "0.2s", "--ivm-dur": "0.6s" } as React.CSSProperties}
          >
            {isAll ? (
              <>
                <span className="lg:hidden">Models</span>
                <span className="hidden lg:inline">All Models</span>
              </>
            ) : (
              CATEGORY_LABEL[active]
            )}
          </h1>
          <p
            className="ivm-rise text-[14px] font-normal leading-[1.4] text-ivm-n600 lg:text-[16px]"
            style={{ "--ivm-delay": "0.32s", "--ivm-dur": "0.6s" } as React.CSSProperties}
          >
            {filtered.length} {filtered.length === 1 ? "model" : "models"} · Built in Nnewi
            <span className="hidden lg:inline"> for African roads</span>
          </p>
        </div>

        <VehicleChips active={active} onChange={setActive} counts={counts} />

        {filtered.length > 0 ? (
          <div className="grid w-full grid-cols-2 gap-x-3 gap-y-7 md:gap-x-6 md:gap-y-10 lg:gap-y-14 xl:grid-cols-3 xl:gap-x-8">
            {filtered.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} introPlayed={introPlayed} />
            ))}
          </div>
        ) : (
          <p className="w-full py-16 text-center text-[16px] text-ivm-n500">
            No vehicles found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
