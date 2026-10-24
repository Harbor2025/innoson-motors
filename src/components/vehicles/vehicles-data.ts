export type Category = "ALL" | "CARS" | "SUVS" | "MPV" | "PICKUP" | "BUSES" | "ELECTRIC";

export interface Vehicle {
  id: string;
  name: string;
  /** URL segment for /vehicles/[slug]. Falls back to `id` when absent. */
  slug?: string;
  category: Exclude<Category, "ALL">;
  /** Eyebrow shown above the name (e.g. SEDAN, OFF-ROAD SUV). Falls back to the category. */
  bodyType?: string;
  /** Cut-out photo. Empty string renders the "Add cut-out photo" placeholder. */
  image: string;
}

/** Order matches the Figma sidebar / chips: All, Cars, SUVs, MPV, Pickups, Buses, Electric. */
export const CATEGORIES: Category[] = ["ALL", "CARS", "SUVS", "MPV", "PICKUP", "BUSES", "ELECTRIC"];

/** Label shown in the sidebar, chips and (for non-All) the page heading. */
export const CATEGORY_LABEL: Record<Category, string> = {
  ALL: "All",
  CARS: "Cars",
  SUVS: "SUVs",
  MPV: "MPV",
  PICKUP: "Pickups",
  BUSES: "Buses",
  ELECTRIC: "Electric",
};

/** Singular eyebrow used when a model has no explicit `bodyType`. */
export const CATEGORY_EYEBROW: Record<Exclude<Category, "ALL">, string> = {
  CARS: "CAR",
  SUVS: "SUV",
  MPV: "MPV",
  PICKUP: "PICKUP",
  BUSES: "BUS",
  ELECTRIC: "ELECTRIC",
};

/**
 * Fallback catalogue, mirroring the 24 cards in the Figma "Vehicles" frames.
 * Only used when the CMS returns no models (e.g. DB unavailable). Counts in the
 * sidebar/chips are always derived from whichever list is rendered.
 * Only Caris has a cut-out in the design; the rest show the placeholder.
 */
const m = (
  name: string,
  slug: string,
  category: Exclude<Category, "ALL">,
  bodyType: string,
  image = "",
): Vehicle => ({ id: slug, name, slug, category, bodyType, image });

export const VEHICLES: Vehicle[] = [
  m("IVM Caris", "caris", "CARS", "SEDAN", "/images/vehicle-card-sedan.png"),
  m("IVM Fox", "fox", "CARS", "CAR"),
  m("IVM Umu", "umu", "CARS", "CAR"),
  m("IVM Connect", "connect", "CARS", "CAR"),
  m("IVM G5T", "g5t", "SUVS", "CROSSOVER"),
  m("IVM G6T", "g6t", "SUVS", "SUV"),
  m("IVM G40", "g40", "SUVS", "OFF-ROAD SUV"),
  m("IVM G80", "g80", "SUVS", "OFF-ROAD SUV"),
  m("IVM Ikenga", "ikenga", "MPV", "MPV"),
  m("IVM Capa", "capa", "MPV", "MPV"),
  m("IVM G20 Smart", "g20-smart", "MPV", "MPV"),
  m("IVM Granite", "granite", "PICKUP", "PICKUP"),
  m("IVM Carrier 4WD", "carrier-4wd", "PICKUP", "PICKUP"),
  m("IVM Uzo", "uzo", "BUSES", "MINIBUS"),
  m("IVM Mini Bus", "mini-bus", "BUSES", "MINIBUS"),
  m("IVM Seriki", "seriki", "BUSES", "BUS"),
  m("IVM 6540", "6540", "BUSES", "BUS"),
  m("IVM 6601", "6601", "BUSES", "BUS"),
  m("IVM 6800", "6800", "BUSES", "BUS"),
  m("IVM 6857", "6857", "BUSES", "BUS"),
  m("IVM CNG Bus", "cng-bus", "BUSES", "CNG BUS"),
  m("IVM Link", "link", "ELECTRIC", "ELECTRIC"),
  m("IVM EX01", "ex01", "ELECTRIC", "ELECTRIC"),
  m("IVM EX02", "ex02", "ELECTRIC", "ELECTRIC"),
];
