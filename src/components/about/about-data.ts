import type { ResponsiveSrcs } from "@/components/revamp/ResponsiveImage";

/**
 * Copy for the About page, taken from the Figma "About" frames.
 * Photos are in /public/images/about/revamp (run scripts/fetch-about-images.mjs).
 * Note: the Figma frames name the poster and statement photos "AI PLACEHOLDER".
 */
const img = (name: string): ResponsiveSrcs => ({
  mobile: `/images/about/revamp/${name}-mobile.png`,
  tablet: `/images/about/revamp/${name}-tablet.png`,
  desktop: `/images/about/revamp/${name}-desktop.png`,
});

export const HERO_IMAGES = img("hero");
export const CHAIRMAN_POSTER = img("chairman-poster");
export const STATEMENT_IMAGES = img("statement");

// TODO: swap for the Chairman's real message once the video exists
export const CHAIRMAN_VIDEO_SRC = "/videos/home-showcase.mp4";

export const STATS = [
  { value: "2007", label: "Founded in Nnewi" },
  { value: "2010", label: "Vehicle plant commissioned" },
  { value: "2022", label: "First CNG vehicles" },
  { value: "7+", label: "African export markets" },
];

export const STORY_BEGINNING = [
  "In 1978, Nnewi — a commercial town in eastern Nigeria — was the central hub for motorcycle importation. As it is today for tokunbo (foreign-used) cars, tokunbo motorcycles were the status quo.",
  "By 1987, a brand-new motorcycle sold for ₦150,000, while a tokunbo one sold for ₦90,000–₦100,000. That would have stayed the norm, but for a young Nigerian named Innocent Chukwuma, the founder of Innoson.",
  "Driven by his passion for people and a philosophy of cutting costs and passing the gain to customers, he pioneered the first made-in-Nigeria motorcycle brand, selling for as little as ₦60,000. By 2002, he had driven tokunbo motorcycles out of Nigeria.",
];

export const STORY_PRESENT = [
  "Today we build durable, affordable brand-new vehicles for Africans — selling for close to the price of their tokunbo equivalents, and built to the standard of any foreign brand.",
  "The need is real: a 2015 PwC report found that for every new car on Nigerian roads, there were 131 used ones.",
];

export const PULL_QUOTE =
  "“We’ve done it before for motorcycles. We are doing it again for automobiles.”";

export const PILLARS = [
  {
    id: "mission",
    title: "Mission",
    body: "Our vehicles are made for the roads, the heat and the daily demands of African drivers. We build for durability first, so your car keeps working long after the first year.",
  },
  {
    id: "vision",
    title: "Vision",
    body: "A brand-new vehicle for close to the price of a tokunbo — with a clean history, no hidden accidents and no guessing about what the car has been through.",
  },
  {
    id: "objective",
    title: "Objective",
    body: "To build to the standard of the foreign brands you already know and trust. Put our vehicles beside any of them and judge for yourself.",
  },
] as const;

export const MILESTONES = [
  { year: "2007", title: "IVM is founded", body: "Innoson Vehicle Manufacturing is established in Nnewi, Anambra State." },
  { year: "2010", title: "Plant commissioned", body: "The Nnewi vehicle plant is commissioned on 15 October by President Goodluck Jonathan." },
  { year: "2014", title: "New passenger cars", body: "The IVM Fox, Umu and Uzo are unveiled in Nnewi." },
  { year: "2016", title: "Partnerships", body: "An auto-finance deal with Sterling Bank, and an agreement with the Nigerian Air Force." },
  { year: "2018", title: "Nigerian Army", body: "A partnership to design, modify and build military vehicles for the Nigerian Army." },
  { year: "2019", title: "New family vehicles", body: "The Ikenga and G20 Smart 7-seat MPVs and the Seriki bus are released." },
  { year: "2020", title: "Caris, Capa & IVM Cruise", body: "The Caris sedan and Capa MPV arrive, and IVM launches a ride-hailing service in Enugu." },
  { year: "2022", title: "CNG vehicles and exports", body: "IVM starts building CNG vehicles and delivers a $4.7m order to Sierra Leone’s armed forces." },
  { year: "2023", title: "Manufacturer of the Year", body: "Our Chairman is honoured as Manufacturer of the Year for pioneering CNG vehicles." },
  { year: "2024", title: "First locally made EV", body: "IVM unveils its first locally made electric vehicles." },
  { year: "2025", title: "Expanding south", body: "IVM announces plans for a new manufacturing plant in Bayelsa State." },
  { year: "2026", title: "Growing further", body: "IVM now employs 8,000 people directly, with a new plant for CNG vehicles and EVs under way." },
];
