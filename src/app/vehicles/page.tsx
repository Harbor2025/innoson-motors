import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import VehiclesPageContent from "@/components/vehicles/VehiclesPageContent";
import { getCategories, getPublishedModels } from "@/server/models";
import { categoriesAsList, modelsAsVehicleCards } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Vehicles | Innoson Vehicle Manufacturing",
  description:
    "Browse all Innoson vehicles: SUVs, sedans, pickups, MPVs, buses and EVs — made in Nigeria.",
};

export const revalidate = 60;

export default async function VehiclesPage() {
  let vehicles: ReturnType<typeof modelsAsVehicleCards> = [];
  let categories: ReturnType<typeof categoriesAsList> = [];
  try {
    const [modelsRes, cats] = await Promise.all([
      getPublishedModels({ limit: 100 }),
      getCategories(),
    ]);
    vehicles = modelsAsVehicleCards(modelsRes.docs);
    categories = categoriesAsList(cats);
  } catch {
    // DB unavailable at build time; content will be fetched client-side or on revalidate.
  }
  return (
    <>
      <Header />
      <main>
        <VehiclesPageContent initialVehicles={vehicles} initialCategories={categories} />
      </main>
      <FooterServer />
    </>
  );
}
