export const VEHICLE_BRANDS = [
  "G6T",
  "GST",
  "G80",
  "G40",
  "G6",
  "G5",
  "Granite",
  "Carrier 4WD",
  "Capa",
  "Carris",
  "Connect",
  "Ikenga",
  "6540 (Hummer)",
  "Seriki",
] as const;

export const FACTORY_ADDRESS =
  "No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State";

export interface Showroom {
  id: string;
  /** Eyebrow above the city, e.g. "Factory & head office" or "Service centre". */
  kind: string;
  city: string;
  address: string;
  phone?: string;
  state?: string;
}

/** Figma fallback set, used when the CMS dealerships are unavailable. */
export const SHOWROOMS: Showroom[] = [
  {
    id: "nnewi",
    kind: "Factory & head office",
    city: "Nnewi",
    address: FACTORY_ADDRESS,
    phone: "0805 445 9560",
    state: "Anambra",
  },
  {
    id: "abuja",
    kind: "Showroom",
    city: "Abuja",
    address:
      "Edwin Medani Crescent, by St Martins Catholic Church, behind VIO Office, Mabuchi, Abuja",
    phone: "0902 098 4374",
    state: "FCT",
  },
  {
    id: "lagos-mainland",
    kind: "Service centre",
    city: "Lagos Mainland",
    address: "39 Alh. Tokan Street, Alaka Estate, Lagos",
    state: "Lagos",
  },
  {
    id: "lagos-island",
    kind: "Service centre",
    city: "Lagos Island",
    address: "Lekki–Ajah Expressway, after Cosharis, Ibeju-Lekki, Lagos",
    state: "Lagos",
  },
  {
    id: "enugu",
    kind: "Service centre",
    city: "Enugu",
    address:
      "Enugu–Abakaliki Expressway, after Mobil Filling Station, Emene, Enugu State",
    phone: "0812 220 2053",
    state: "Enugu",
  },
];

export const PHONE_NUMBERS = [
  "07049087160",
  "08037222939",
  "09138177285",
  "08122202053",
  "09020984374",
  "08054459560",
];

export const EMAIL = "Enquiries@innosonmotors.com";
