export type Category = "ALL" | "CARS" | "MPV" | "PICKUP" | "SUVS" | "BUSES" | "ELECTRIC";

export interface Vehicle {
  id: string;
  name: string;
  category: Exclude<Category, "ALL">;
  image: string;
}

export const CATEGORIES: Category[] = ["ALL", "CARS", "MPV", "PICKUP", "SUVS", "BUSES", "ELECTRIC"];

export const CATEGORY_LABEL: Record<Category, string> = {
  ALL: "Models",
  CARS: "Cars",
  MPV: "MPV",
  PICKUP: "Pickup",
  SUVS: "SUVs",
  BUSES: "Buses",
  ELECTRIC: "Electric",
};

/**
 * Seed data mirrors the Figma mockup as closely as a placeholder grid can:
 * all 15 desktop cards (and all 5 mobile cards) use the identical copy
 * "Innoson Caris" / "Suvs", and of the two card instances inspected in
 * detail, both reuse the same two car photos — a strong signal this screen
 * was built by duplicating one placeholder card rather than designing 15
 * unique vehicles. The grid/filter below is fully data-driven, so swap this
 * array for real models (mixed categories, names, images) and everything —
 * filtering included — keeps working unchanged.
 */
export const VEHICLES: Vehicle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `vehicle-${i + 1}`,
  name: "Innoson Caris",
  category: "SUVS",
  image: i % 2 === 0 ? "/images/vehicle-card-suv.png" : "/images/vehicle-card-sedan.png",
}));
