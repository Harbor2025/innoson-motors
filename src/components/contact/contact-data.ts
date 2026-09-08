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

export interface Showroom {
  city: string;
  address: string;
  /** Lagos has two sub-locations instead of one plain address paragraph. */
  subLocations?: { label: string; address: string }[];
}

export const SHOWROOMS: Showroom[] = [
  {
    city: "ABUJA",
    address: "Edwin Medani Crescent, By St Martins Catholic Church, Back of VIO Office, Mabuchi Abuja",
  },
  {
    city: "LAGOS",
    address: "",
    subLocations: [
      { label: "MainLand", address: "IVM Service Center, 39 Alh Tokan Street, Alaka Estate" },
      { label: "Island", address: "IVM Service Center, Lekki/ Ajah express Way, After Cosharis Ibeju Lekki" },
    ],
  },
  {
    city: "ENUGU",
    address: "IVM Service Center, Enugu Abakaliki Express Way, After Mobil Filling Station, Emene, Enugu State",
  },
];

export const FACTORY_ADDRESS = "No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State";

export const PHONE_NUMBERS = [
  "07049087160",
  "08037222939",
  "09138177285",
  "08122202053",
  "09020984374",
  "08054459560",
];

export const EMAIL = "Enquiries@innosonmotors.com";