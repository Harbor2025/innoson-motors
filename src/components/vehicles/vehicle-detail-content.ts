import type { ModelDetailDTO } from "@/types/dto";

export type DetailStat = { value: string; label: string };
export type DetailFeature = { title: string; body: string };
export type DetailSpec = { label: string; value: string };
export type DetailColour = { name: string; hex: string; image?: string | null };
export type DetailPhoto = { image: string; caption: string };

export type DetailGallery = {
  eyebrow: string;
  heading: string;
  featuredImage: string;
  photos: DetailPhoto[];
};

export type VehicleDetailContent = {
  name: string;
  eyebrow: string;
  description: string;
  heroStats: DetailStat[];
  heroImage: string;
  colourPreview: string;
  colours: DetailColour[];
  overviewHeading: string;
  overviewBody: string[];
  designFeatures: DetailFeature[];
  specs: DetailSpec[];
  technologyFeatures: DetailFeature[];
  statsBar: DetailStat[];
  exterior: DetailGallery;
  interior: DetailGallery;
  video: { eyebrow: string; heading: string; poster: string; src: string };
  technology: { heading: string; body: string; image: string };
  cta: { heading: string; body: string };
  brochureUrl: string | null;
};

/** Figma "Vehicle Detail (IVM Caris)" copy, used verbatim for the Caris. */
const CARIS = {
  eyebrow: "Sedan · Bold and elegant",
  description:
    "The beauty you want in a car, and the strength you need to keep enjoying it.",
  heroStats: [
    { value: '2.0L', label: "Petrol engine" },
    { value: '10"', label: "Multimedia display" },
    { value: "R17", label: "205/50 tyres" },
  ],
  overviewHeading: "Sleek, sporty, modern sedan.",
  overviewBody:
    "IVM Caris is one of our forays into future car design. Its sleek look gives you the comfort, sophistication and experience you want in a modern car — the beauty you want to explore, and the strength you need to keep enjoying it.",
  colours: [
    { name: "Black", hex: "#141417" },
    { name: "Silver", hex: "#BFC2C7" },
    { name: "White", hex: "#F7F7F7" },
    { name: "Red", hex: "#B81A1F" },
    { name: "Blue", hex: "#1A4599" },
    { name: "Grey", hex: "#6B7078" },
  ] satisfies DetailColour[],
  designFeatures: [
    {
      title: "Improved exhaust tech",
      body: "Energetic performance and stability over long distances, with better fuel efficiency and a cooler-running engine.",
    },
    {
      title: "Adjustable passenger seats",
      body: "Stay relaxed and comfortable on every journey.",
    },
    {
      title: "Air-conditioned leather seats",
      body: "A cool, lush feel, even on the hottest days.",
    },
    {
      title: "LED front lights",
      body: "Bright, clear vision when you drive at night.",
    },
    {
      title: "Multimedia system",
      body: "Play your music and connect your devices on the 10-inch display.",
    },
    {
      title: "Automatic folding side mirrors",
      body: "Park in tight spaces without worrying about your mirrors.",
    },
    {
      title: "Airbags",
      body: "Front airbags help protect you in a collision.",
    },
  ] satisfies DetailFeature[],
  specs: [
    { label: "Body type", value: "Compact sedan" },
    { label: "Engine", value: "2.0L petrol" },
    { label: "Seats", value: "5" },
    { label: "Display", value: "10-inch multimedia" },
    { label: "Tyres", value: "205/50 R17" },
    { label: "Airbags", value: "Front" },
    { label: "Dimensions (L × W × H)", value: "4,600 × 1,600 × 1,570 mm" },
  ] satisfies DetailSpec[],
  technologyFeatures: [
    {
      title: "Reverse camera",
      body: "Rear view shown on the 10-inch display when you reverse.",
    },
    {
      title: "10-inch multimedia system",
      body: "Music, calls and device connectivity on one screen.",
    },
    {
      title: "LED front lights",
      body: "Modern lighting for clearer night driving.",
    },
  ] satisfies DetailFeature[],
  statsBar: [
    { value: "Compact sedan", label: "Body type" },
    { value: "5", label: "Seats" },
    { value: "4,600 mm", label: "Length" },
  ] satisfies DetailStat[],
  videoHeading: "See the Caris on the road.",
  technology: {
    heading: "Reverse camera",
    body: "Park and reverse with confidence. The rear camera feed appears on the 10-inch multimedia display, so tight spaces are easier to handle.",
  },
};

const DEFAULT_COLOURS: DetailColour[] = CARIS.colours;
const DEFAULT_DESCRIPTION =
  "Every Innoson vehicle is built for Nigerian roads — combining comfort, capability and technology you can rely on every day.";

/** "INNOSON Caris" → "IVM Caris" so the page matches the IVM wordmark. */
function displayName(name: string): string {
  return name.replace(/^innoson\s+/i, "IVM ").trim();
}

function withoutTrailingStop(text: string): string {
  return text.trim().replace(/\.$/, "");
}

function collectText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: unknown; children?: unknown[] };
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.children)) return n.children.map(collectText).join("");
  return "";
}

function lexicalParagraphs(lexical: unknown): string[] {
  if (!lexical || typeof lexical !== "object") return [];
  const root = (lexical as { root?: { children?: unknown[] } }).root;
  if (!Array.isArray(root?.children)) return [];
  return root.children
    .map((node) => collectText(node).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/** "Improved exhaust tech – Longer copy" → title + body. */
function featuresFromParagraphs(paragraphs: string[]): DetailFeature[] {
  return paragraphs.map((paragraph) => {
    const match = paragraph.match(/^(.{2,90}?)(?:\s+[–—]\s+|\s+-\s+|:\s+)(.+)$/);
    if (match) return { title: match[1].trim(), body: match[2].trim() };
    return {
      title: paragraph.length > 64 ? `${paragraph.slice(0, 61).trimEnd()}…` : paragraph,
      body: paragraph.length > 64 ? paragraph : "",
    };
  });
}

function findSpec(model: ModelDetailDTO, needles: string[]): string | undefined {
  const spec = model.specs?.find((row) =>
    needles.some((needle) => row.label.toLowerCase().includes(needle)),
  );
  return spec?.value;
}

function shortValue(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  const first = value.split(/[,/(]/)[0].trim();
  return first.length > 0 && first.length <= 14 ? first : fallback;
}

/**
 * Maps a Payload model onto the vehicle-detail design. The Caris is the
 * reference design, so it always uses the Figma copy; every other model is
 * filled from its CMS content with the same set of sections.
 */
export function buildVehicleDetail(model: ModelDetailDTO): VehicleDetailContent {
  const isCaris = model.slug === "caris";
  const name = isCaris ? "IVM Caris" : displayName(model.name);
  const gallery = model.gallery ?? [];
  const descriptionPlain = lexicalParagraphs(model.description);
  const designPlain = lexicalParagraphs(model.design);
  const technologyPlain = lexicalParagraphs(model.technology);

  const category = model.category?.name?.trim() || "IVM";
  const bodyType = isCaris
    ? "Sedan"
    : category.replace(/s$/i, "").replace(/^suv$/i, "SUV");
  const tagline = model.tagline ? withoutTrailingStop(model.tagline) : "";
  const eyebrow = isCaris
    ? CARIS.eyebrow
    : tagline
      ? `${bodyType} · ${tagline}`
      : bodyType;

  const description = isCaris
    ? CARIS.description
    : (descriptionPlain[0] ?? model.summary ?? DEFAULT_DESCRIPTION);

  const heroStats: DetailStat[] = isCaris
    ? CARIS.heroStats
    : [
        {
          value: shortValue(
            findSpec(model, ["engine", "capacity", "motor", "power"]),
            bodyType,
          ),
          label: "Engine",
        },
        {
          value: shortValue(
            findSpec(model, ["seating", "seat", "drive", "transmission"]),
            "5",
          ),
          label: "Seats",
        },
        {
          value: shortValue(
            findSpec(model, ["tyre", "wheel", "tire"]),
            findSpec(model, ["fuel", "range", "battery"])?.slice(0, 12) ?? "R17",
          ),
          label: "Tyres",
        },
      ];

  const highlights = (model.highlights ?? []).map((item) => ({
    title: item.title,
    body: item.description,
  }));

  const designFallback = featuresFromParagraphs(designPlain);
  const designFeatures = isCaris
    ? CARIS.designFeatures
    : highlights.length > 0
      ? highlights
      : designFallback.length > 0
        ? designFallback
        : [
            {
              title: "Built for everyday driving",
              body: description || DEFAULT_DESCRIPTION,
            },
          ];

  const technologyFeatures = isCaris
    ? CARIS.technologyFeatures
    : featuresFromParagraphs(technologyPlain).length > 0
      ? featuresFromParagraphs(technologyPlain)
      : designFeatures.slice(0, 3);

  const specs: DetailSpec[] = isCaris
    ? CARIS.specs
    : (model.specs ?? [])
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, 10)
        .map((row) => ({ label: row.label, value: row.value }));

  const specsOrFallback =
    specs.length > 0
      ? specs
      : [
          { label: "Body type", value: bodyType },
          { label: "Seats", value: "5" },
        ];

  const statsBar: DetailStat[] = isCaris
    ? CARIS.statsBar
    : [
        {
          value: findSpec(model, ["body", "type"]) ?? bodyType,
          label: "Body type",
        },
        {
          value: shortValue(findSpec(model, ["seating", "seat"]), "5"),
          label: "Seats",
        },
        {
          value: findSpec(model, ["length", "dimension"]) ?? "—",
          label: "Length",
        },
      ];

  const colours: DetailColour[] = isCaris
    ? CARIS.colours
    : (model.colorOptions ?? []).length > 0
      ? model.colorOptions.slice(0, 6).map((colour) => ({
          name: colour.name,
          hex: colour.hexCode || "#D9D9D9",
          image: colour.image?.url ?? null,
        }))
      : DEFAULT_COLOURS;

  const galleryImage = (index: number): string | undefined =>
    gallery[index]?.image?.url;

  const heroImage =
    model.heroImage?.url ??
    (isCaris ? "/images/hero-caris.png" : (galleryImage(0) ?? "/images/hero-caris.png"));

  const exteriorFeatured =
    (isCaris ? "/images/exterior-hero.png" : galleryImage(1)) ?? "/images/exterior-hero.png";
  const exteriorPhotos = isCaris
    ? [
        { image: "/images/exterior-detail-1.png", caption: "Front design" },
        { image: "/images/exterior-detail-2.png", caption: "Rear design" },
      ]
    : [
        {
          image: galleryImage(2) ?? "/images/exterior-detail-1.png",
          caption: gallery[2]?.caption ?? "Front design",
        },
        {
          image: galleryImage(3) ?? "/images/exterior-detail-2.png",
          caption: gallery[3]?.caption ?? "Rear design",
        },
      ];

  const interiorFeatured =
    (isCaris ? "/images/interior-hero.jpg" : galleryImage(4)) ?? "/images/interior-hero.jpg";
  const interiorPhotos = isCaris
    ? [
        { image: "/images/interior-detail-1.png", caption: "Comfortable seating" },
        { image: "/images/interior-detail-2.png", caption: "Intuitive controls" },
      ]
    : [
        {
          image: galleryImage(5) ?? "/images/interior-detail-1.png",
          caption: gallery[5]?.caption ?? "Comfortable seating",
        },
        {
          image: galleryImage(6) ?? "/images/interior-detail-2.png",
          caption: gallery[6]?.caption ?? "Intuitive controls",
        },
      ];

  const technology =
    isCaris || technologyFeatures.length === 0
      ? CARIS.technology
      : {
          heading: technologyFeatures[0].title,
          body: technologyFeatures[0].body || description,
        };

  return {
    name,
    eyebrow,
    description,
    heroStats,
    heroImage,
    colourPreview: isCaris ? "/images/vehicle-card-sedan.png" : "/images/vehicle-card-suv.png",
    colours,
    overviewHeading: isCaris
      ? CARIS.overviewHeading
      : tagline
        ? `${tagline}.`
        : `${name} at a glance.`,
    overviewBody: isCaris
      ? [CARIS.overviewBody]
      : descriptionPlain.length > 0
        ? descriptionPlain
        : [description],
    designFeatures,
    specs: specsOrFallback,
    technologyFeatures,
    statsBar,
    exterior: {
      eyebrow: "Exterior design",
      heading: "The bold experience.",
      featuredImage: exteriorFeatured,
      photos: exteriorPhotos,
    },
    interior: {
      eyebrow: "Interior design",
      heading: "Thoughtful details, all around you.",
      featuredImage: interiorFeatured,
      photos: interiorPhotos,
    },
    video: {
      eyebrow: "Driving video",
      heading: isCaris ? CARIS.videoHeading : `See the ${name} on the road.`,
      poster: galleryImage(7) ?? "/images/hero-caris.png",
      src: "/videos/home-showcase.mp4",
    },
    technology: { ...technology, image: "/images/tech-reverse-camera.png" },
    cta: {
      heading: `Own the ${name}`,
      body: "Get a quote, or visit a showroom and drive it first.",
    },
    brochureUrl: model.brochure?.url ?? null,
  };
}
