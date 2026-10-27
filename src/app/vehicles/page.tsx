import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import VehiclesPageContent from "@/components/vehicles/VehiclesPageContent";
import { getPublishedModels } from "@/server/models";
import { modelsAsVehicleCards } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Vehicles | Innoson Vehicle Manufacturing",
  description:
    "Browse all Innoson vehicles: SUVs, sedans, pickups, MPVs, buses and EVs - made in Nigeria.",
};

export const revalidate = 60;

export default async function VehiclesPage() {
  let vehicles: ReturnType<typeof modelsAsVehicleCards> = [];
  try {
    const modelsRes = await getPublishedModels({ limit: 100 });
    vehicles = modelsAsVehicleCards(modelsRes.docs);
  } catch {
    // DB unavailable at build time; the Figma catalogue fallback is rendered instead.
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="vehicles" />
      <main className="flex-1">
        <VehiclesPageContent initialVehicles={vehicles} />
      </main>
      <RevampFooter />
    </div>
  );
}
