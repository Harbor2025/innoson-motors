/**
 * Vehicle brochure PDF generator.
 *
 * Builds a print-ready A4 brochure straight from the same content object the
 * vehicle detail page renders (hero copy, stats, specifications, design and
 * technology features, exterior/interior photography, colour options and the
 * closing call to action) — so the download never drifts from the page.
 *
 * Runs entirely in the browser: images are rasterised through a canvas and
 * embedded as JPEGs, Inter (bundled in `public/fonts`) is embedded, and the
 * finished document is returned as a Blob.
 *
 * `pdf-lib` and the fonts are only fetched when the visitor actually asks for
 * the brochure (the caller imports this module dynamically).
 */
import { PDFDocument, rgb, setCharacterSpacing, StandardFonts } from "pdf-lib";
import type { PDFFont, PDFImage, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { VehicleDetailContent } from "@/components/vehicles/vehicle-detail-content";

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

const PAGE = { width: 595.28, height: 841.89 }; // A4 portrait, points
const MARGIN = 46;
const CONTENT_WIDTH = PAGE.width - MARGIN * 2;
const BOTTOM_LIMIT = 64;

const COLORS = {
  ink: rgb(0.09, 0.102, 0.125), // #171A20
  body: rgb(0.36, 0.38, 0.42), // #5C616B
  muted: rgb(0.53, 0.55, 0.59), // #888D96
  line: rgb(0.89, 0.9, 0.92), // #E3E6EB
  soft: rgb(0.957, 0.961, 0.969), // #F4F5F7
  blue: rgb(0, 0.369, 0.722), // #005EB8
  dark: rgb(0.039, 0.051, 0.071), // #0A0D12
  white: rgb(1, 1, 1),
  whiteSoft: rgb(0.83, 0.85, 0.88),
};

const SITE = "innosonmotors.com";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Fonts = { regular: PDFFont; semibold: PDFFont; bold: PDFFont };

type Context = {
  doc: PDFDocument;
  fonts: Fonts;
  page: PDFPage;
  /** Current top of the content flow, in points from the bottom of the page. */
  y: number;
  name: string;
};

type ImageRequest = {
  url: string;
  /** Box size in points. The raster is generated at 2× for crisp printing. */
  width: number;
  height: number;
  mode?: "cover" | "contain";
  background?: string;
  /** Width requested from the Next.js image optimiser. */
  optimizeWidth?: number;
};

/* -------------------------------------------------------------------------- */
/*                              Public entry point                            */
/* -------------------------------------------------------------------------- */

export async function buildVehicleBrochurePdf(
  content: VehicleDetailContent,
): Promise<Blob> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`${content.name} — Vehicle Brochure`);
  doc.setSubject(content.description);
  doc.setAuthor("Innoson Vehicle Manufacturing");
  doc.setCreator("Innoson Motors");
  doc.setProducer("Innoson Motors");

  const fonts = await embedFonts(doc);
  const ctx: Context = {
    doc,
    fonts,
    page: doc.addPage([PAGE.width, PAGE.height]),
    y: PAGE.height,
    name: content.name,
  };

  // Fetch + rasterise every photograph up front so page drawing stays synchronous.
  const [hero, exteriorHero, front, rear, interiorHero, seating, controls, tech] =
    await Promise.all([
      loadImage(ctx, {
        url: content.heroImage,
        width: PAGE.width,
        height: 452,
        optimizeWidth: 1920,
      }),
      loadImage(ctx, {
        url: content.exterior.featuredImage,
        width: CONTENT_WIDTH,
        height: 268,
        optimizeWidth: 1920,
      }),
      loadImage(ctx, {
        url: content.exterior.photos[0]?.image ?? content.exterior.featuredImage,
        width: (CONTENT_WIDTH - 18) / 2,
        height: 172,
      }),
      loadImage(ctx, {
        url: content.exterior.photos[1]?.image ?? content.exterior.featuredImage,
        width: (CONTENT_WIDTH - 18) / 2,
        height: 172,
      }),
      loadImage(ctx, {
        url: content.interior.featuredImage,
        width: CONTENT_WIDTH,
        height: 268,
        optimizeWidth: 1920,
      }),
      loadImage(ctx, {
        url: content.interior.photos[0]?.image ?? content.interior.featuredImage,
        width: (CONTENT_WIDTH - 18) / 2,
        height: 172,
      }),
      loadImage(ctx, {
        url: content.interior.photos[1]?.image ?? content.interior.featuredImage,
        width: (CONTENT_WIDTH - 18) / 2,
        height: 172,
      }),
      loadImage(ctx, {
        url: content.technology.image,
        width: 208,
        height: 152,
      }),
    ]);

  drawCover(ctx, content, hero);
  drawOverviewPage(ctx, content);
  drawDesignPage(ctx, content, tech);
  drawGalleryPage(ctx, content.exterior, exteriorHero, [front, rear]);
  drawGalleryPage(ctx, content.interior, interiorHero, [seating, controls]);
  drawClosingPage(ctx, content);
  drawFooters(ctx);

  const bytes = await doc.save();
  return new Blob([bytes as unknown as ArrayBuffer], { type: "application/pdf" });
}

/* -------------------------------------------------------------------------- */
/*                                  Fonts                                     */
/* -------------------------------------------------------------------------- */

const FONT_FILES = {
  regular: "/fonts/Inter-Regular.ttf",
  semibold: "/fonts/Inter-SemiBold.ttf",
  bold: "/fonts/Inter-Bold.ttf",
};

let fontBytesPromise: Promise<Record<keyof Fonts, ArrayBuffer>> | null = null;

function loadFontBytes() {
  fontBytesPromise ??= (async () => {
    const [regular, semibold, bold] = await Promise.all(
      (Object.keys(FONT_FILES) as (keyof Fonts)[]).map(async (key) => {
        const response = await fetch(FONT_FILES[key], { cache: "force-cache" });
        if (!response.ok) throw new Error(`Could not load ${FONT_FILES[key]}`);
        return response.arrayBuffer();
      }),
    );
    return { regular, semibold, bold };
  })();
  return fontBytesPromise;
}

async function embedFonts(doc: PDFDocument): Promise<Fonts> {
  try {
    const bytes = await loadFontBytes();
    const [regular, semibold, bold] = await Promise.all([
      doc.embedFont(bytes.regular, { subset: false }),
      doc.embedFont(bytes.semibold, { subset: false }),
      doc.embedFont(bytes.bold, { subset: false }),
    ]);
    return { regular, semibold, bold };
  } catch {
    // Never block the download on a font fetch — fall back to the PDF core fonts.
    const [regular, bold] = await Promise.all([
      doc.embedFont(StandardFonts.Helvetica),
      doc.embedFont(StandardFonts.HelveticaBold),
    ]);
    return { regular, semibold: bold, bold };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */

async function loadImage(
  ctx: Context,
  request: ImageRequest,
): Promise<PDFImage | null> {
  const bytes = await rasterize(request);
  if (!bytes) return null;
  try {
    return await ctx.doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

/** Cover-crops (or letterboxes) an image into a JPEG of the requested pixel size. */
async function rasterize(request: ImageRequest): Promise<Uint8Array | null> {
  if (typeof document === "undefined") return null;

  const scale = 2;
  const width = Math.max(1, Math.round(request.width * scale));
  const height = Math.max(1, Math.round(request.height * scale));
  const blob = await fetchImageBlob(request.url, request.optimizeWidth ?? 1080);
  if (!blob) return null;

  const bitmap = await toBitmap(blob);
  if (!bitmap) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const mode = request.mode ?? "cover";
  context.fillStyle = request.background ?? "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const sourceWidth = bitmap.width;
  const sourceHeight = bitmap.height;
  const ratio =
    mode === "cover"
      ? Math.max(width / sourceWidth, height / sourceHeight)
      : Math.min(width / sourceWidth, height / sourceHeight);
  const drawWidth = sourceWidth * ratio;
  const drawHeight = sourceHeight * ratio;
  context.drawImage(
    bitmap,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );

  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();

  const jpeg = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.86),
  );
  if (!jpeg) return null;
  return new Uint8Array(await jpeg.arrayBuffer());
}

async function fetchImageBlob(url: string, optimizeWidth: number): Promise<Blob | null> {
  const candidates: string[] = [];
  if (/^(https?:\/\/|\/)/i.test(url)) {
    // Same-origin optimiser: no CORS surprises, and the bytes are already resized.
    candidates.push(
      `/_next/image?url=${encodeURIComponent(url)}&w=${optimizeWidth}&q=75`,
    );
  }
  candidates.push(url);

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { cache: "force-cache" });
      if (!response.ok) continue;
      const blob = await response.blob();
      if (blob.size > 0) return blob;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

async function toBitmap(
  blob: Blob,
): Promise<ImageBitmap | HTMLImageElement | null> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(blob);
    } catch {
      // fall through to the <img> path
    }
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    image.src = objectUrl;
  });
}

/* -------------------------------------------------------------------------- */
/*                                 Primitives                                 */
/* -------------------------------------------------------------------------- */

function newPage(ctx: Context) {
  ctx.page = ctx.doc.addPage([PAGE.width, PAGE.height]);
  ctx.y = PAGE.height - MARGIN;
}

function ensureSpace(ctx: Context, height: number) {
  if (ctx.y - height < BOTTOM_LIMIT) newPage(ctx);
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const lines: string[] = [];
  let line = "";
  for (const word of clean.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fitSize(
  text: string,
  font: PDFFont,
  preferred: number,
  maxWidth: number,
  minimum = 9,
): number {
  let size = preferred;
  while (size > minimum && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

/**
 * pdf-lib has no letter-spacing option, so tracking is applied through the
 * text state operator. Used for the small uppercase labels.
 */
function drawTracked(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: ReturnType<typeof rgb>;
    opacity?: number;
  },
  spacing: number,
) {
  page.pushOperators(setCharacterSpacing(spacing));
  page.drawText(text, options);
  page.pushOperators(setCharacterSpacing(0));
}

function drawLines(
  ctx: Context,
  lines: string[],
  options: {
    x: number;
    font: PDFFont;
    size: number;
    lineHeight: number;
    color: ReturnType<typeof rgb>;
    opacity?: number;
  },
) {
  for (const line of lines) {
    ctx.y -= options.size;
    ctx.page.drawText(line, {
      x: options.x,
      y: ctx.y,
      size: options.size,
      font: options.font,
      color: options.color,
      opacity: options.opacity,
    });
    ctx.y -= options.lineHeight - options.size;
  }
}

function drawParagraph(
  ctx: Context,
  text: string,
  options: {
    size?: number;
    lineHeight?: number;
    font?: PDFFont;
    color?: ReturnType<typeof rgb>;
    width?: number;
    gap?: number;
    x?: number;
    opacity?: number;
  } = {},
) {
  const size = options.size ?? 10.5;
  const lineHeight = options.lineHeight ?? size * 1.55;
  const width = options.width ?? CONTENT_WIDTH;
  const x = options.x ?? MARGIN;
  const lines = wrap(text, options.font ?? ctx.fonts.regular, size, width);
  if (lines.length === 0) return;

  ensureSpace(ctx, lines.length * lineHeight);
  drawLines(ctx, lines, {
    x,
    font: options.font ?? ctx.fonts.regular,
    size,
    lineHeight,
    color: options.color ?? COLORS.body,
    opacity: options.opacity,
  });
  ctx.y -= options.gap ?? 10;
}

function drawSectionLabel(ctx: Context, text: string, color = COLORS.blue) {
  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.y - 3,
    width: 14,
    height: 3,
    color,
  });
  drawTracked(
    ctx.page,
    text.toUpperCase(),
    {
      x: MARGIN + 22,
      y: ctx.y - 3.6,
      size: 8,
      font: ctx.fonts.bold,
      color,
    },
    1.8,
  );
  ctx.y -= 28;
}

function drawHeading(
  ctx: Context,
  text: string,
  options: {
    size?: number;
    lineHeight?: number;
    color?: ReturnType<typeof rgb>;
    width?: number;
    gap?: number;
  } = {},
) {
  const size = options.size ?? 24;
  const lineHeight = options.lineHeight ?? size * 1.22;
  const lines = wrap(text, ctx.fonts.bold, size, options.width ?? CONTENT_WIDTH);
  if (lines.length === 0) return;

  ensureSpace(ctx, lines.length * lineHeight);
  drawLines(ctx, lines, {
    x: MARGIN,
    font: ctx.fonts.bold,
    size,
    lineHeight,
    color: options.color ?? COLORS.ink,
  });
  ctx.y -= options.gap ?? 12;
}

/** Rounded rectangle. Drawn in local SVG coordinates (origin top-left). */
function roundedRect(
  page: PDFPage,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    color?: ReturnType<typeof rgb>;
    borderColor?: ReturnType<typeof rgb>;
    borderWidth?: number;
    opacity?: number;
  },
) {
  const { x, y, width, height } = options;
  const r = Math.max(0, Math.min(options.radius, width / 2, height / 2));
  const path = [
    `M ${r} 0`,
    `L ${width - r} 0`,
    `Q ${width} 0 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `Q ${width} ${height} ${width - r} ${height}`,
    `L ${r} ${height}`,
    `Q 0 ${height} 0 ${height - r}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");

  page.drawSvgPath(path, {
    x,
    y: y + height,
    color: options.color,
    borderColor: options.borderColor,
    borderWidth: options.borderWidth,
    opacity: options.opacity,
  });
}

function drawImageBox(
  ctx: Context,
  image: PDFImage | null,
  box: { x: number; y: number; width: number; height: number },
) {
  if (image) {
    ctx.page.drawImage(image, box);
    return;
  }
  ctx.page.drawRectangle({ ...box, color: COLORS.soft });
  ctx.page.drawRectangle({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    borderColor: COLORS.line,
    borderWidth: 0.8,
  });
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const value = hex.trim().replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const parsed = Number.parseInt(full.slice(0, 6), 16);
  if (!Number.isFinite(parsed) || full.length < 6) return { r: 217, g: 217, b: 217 };
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function colorFromHex(hex: string) {
  const { r, g, b } = parseHex(hex);
  return rgb(r / 255, g / 255, b / 255);
}

/* -------------------------------------------------------------------------- */
/*                                   Cover                                    */
/* -------------------------------------------------------------------------- */

function drawCover(ctx: Context, content: VehicleDetailContent, hero: PDFImage | null) {
  const page = ctx.page;
  const imageHeight = 452;
  const imageTop = PAGE.height;
  const imageY = imageTop - imageHeight;
  const panelTop = imageY - 4;

  page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: COLORS.dark });

  if (hero) {
    page.drawImage(hero, { x: 0, y: imageY, width: PAGE.width, height: imageHeight });
  } else {
    page.drawRectangle({
      x: 0,
      y: imageY,
      width: PAGE.width,
      height: imageHeight,
      color: rgb(0.13, 0.15, 0.18),
    });
  }

  // Melt the photograph into the dark panel below it.
  const bands = 14;
  const bandHeight = 8;
  for (let index = 0; index < bands; index += 1) {
    const progress = index / bands;
    page.drawRectangle({
      x: 0,
      y: imageY + index * bandHeight,
      width: PAGE.width,
      height: bandHeight,
      color: COLORS.dark,
      opacity: 0.62 * Math.pow(1 - progress, 1.7),
    });
  }

  // Brand mark
  page.drawRectangle({
    x: MARGIN,
    y: panelTop - 40,
    width: 9,
    height: 9,
    color: COLORS.blue,
  });
  drawTracked(
    page,
    "INNOSON MOTORS",
    {
      x: MARGIN + 18,
      y: panelTop - 40,
      size: 8,
      font: ctx.fonts.bold,
      color: COLORS.white,
    },
    2.6,
  );

  // Eyebrow + model name
  drawTracked(
    page,
    content.eyebrow.toUpperCase(),
    {
      x: MARGIN,
      y: panelTop - 74,
      size: 8.5,
      font: ctx.fonts.semibold,
      color: rgb(0.35, 0.66, 0.95),
    },
    1.9,
  );

  const nameSize = fitSize(content.name, ctx.fonts.bold, 40, CONTENT_WIDTH);
  page.drawText(content.name, {
    x: MARGIN,
    y: panelTop - 122,
    size: nameSize,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  // Description (max three lines keeps the cover balanced)
  const descriptionLines = wrap(
    content.description,
    ctx.fonts.regular,
    10.5,
    CONTENT_WIDTH - 60,
  ).slice(0, 3);
  let descriptionY = panelTop - 150;
  for (const line of descriptionLines) {
    page.drawText(line, {
      x: MARGIN,
      y: descriptionY,
      size: 10.5,
      font: ctx.fonts.regular,
      color: COLORS.whiteSoft,
    });
    descriptionY -= 15.5;
  }

  // Hero stats
  const stats = content.heroStats.slice(0, 3);
  if (stats.length > 0) {
    page.drawLine({
      start: { x: MARGIN, y: 168 },
      end: { x: PAGE.width - MARGIN, y: 168 },
      thickness: 0.7,
      color: COLORS.white,
      opacity: 0.14,
    });

    const columnWidth = CONTENT_WIDTH / stats.length;
    stats.forEach((stat, index) => {
      const x = MARGIN + index * columnWidth;
      if (index > 0) {
        page.drawLine({
          start: { x, y: 132 },
          end: { x, y: 152 },
          thickness: 0.7,
          color: COLORS.white,
          opacity: 0.14,
        });
      }

      const valueSize = fitSize(stat.value, ctx.fonts.semibold, 19, columnWidth - 26, 11);
      page.drawText(stat.value, {
        x: x + (index > 0 ? 16 : 0),
        y: 138,
        size: valueSize,
        font: ctx.fonts.semibold,
        color: COLORS.white,
      });
      drawTracked(
        page,
        stat.label.toUpperCase(),
        {
          x: x + (index > 0 ? 16 : 0),
          y: 122,
          size: 7,
          font: ctx.fonts.regular,
          color: COLORS.muted,
        },
        1.2,
      );
    });
  }

  // Footer strip
  page.drawLine({
    start: { x: MARGIN, y: 74 },
    end: { x: PAGE.width - MARGIN, y: 74 },
    thickness: 0.7,
    color: COLORS.white,
    opacity: 0.12,
  });
  drawTracked(
    page,
    "VEHICLE BROCHURE",
    {
      x: MARGIN,
      y: 54,
      size: 7.5,
      font: ctx.fonts.semibold,
      color: COLORS.muted,
    },
    1.8,
  );

  const siteWidth = ctx.fonts.semibold.widthOfTextAtSize(SITE, 8);
  page.drawText(SITE, {
    x: PAGE.width - MARGIN - siteWidth,
    y: 54,
    size: 8,
    font: ctx.fonts.semibold,
    color: COLORS.whiteSoft,
  });
}

/* -------------------------------------------------------------------------- */
/*                              Overview + specs                              */
/* -------------------------------------------------------------------------- */

function drawOverviewPage(ctx: Context, content: VehicleDetailContent) {
  newPage(ctx);

  drawSectionLabel(ctx, "Overview");
  drawHeading(ctx, content.overviewHeading, { size: 23, gap: 10 });

  const paragraphs = content.overviewBody.slice(0, 4);
  for (const paragraph of paragraphs) {
    drawParagraph(ctx, paragraph, { size: 10.5, lineHeight: 16.5, gap: 9 });
  }

  // Stats card
  ensureSpace(ctx, 110);
  ctx.y -= 8;
  const cardHeight = 76;
  const cardY = ctx.y - cardHeight;
  roundedRect(ctx.page, {
    x: MARGIN,
    y: cardY,
    width: CONTENT_WIDTH,
    height: cardHeight,
    radius: 10,
    color: COLORS.soft,
  });

  const stats = content.statsBar.slice(0, 3);
  const columnWidth = CONTENT_WIDTH / Math.max(stats.length, 1);
  stats.forEach((stat, index) => {
    const x = MARGIN + index * columnWidth + 20;
    if (index > 0) {
      ctx.page.drawLine({
        start: { x: x - 16, y: cardY + 20 },
        end: { x: x - 16, y: cardY + cardHeight - 20 },
        thickness: 0.7,
        color: COLORS.line,
      });
    }
    const valueSize = fitSize(stat.value, ctx.fonts.semibold, 15, columnWidth - 40, 9.5);
    ctx.page.drawText(stat.value, {
      x,
      y: cardY + 40,
      size: valueSize,
      font: ctx.fonts.semibold,
      color: COLORS.ink,
    });
    drawTracked(
      ctx.page,
      stat.label.toUpperCase(),
      {
        x,
        y: cardY + 24,
        size: 6.8,
        font: ctx.fonts.regular,
        color: COLORS.muted,
      },
      1.1,
    );
  });

  ctx.y = cardY - 30;

  // Key specifications
  ensureSpace(ctx, 120);
  drawSectionLabel(ctx, "Key specifications");
  ctx.y -= 2;

  const specs = content.specs.slice(0, 12);
  specs.forEach((spec, index) => {
    ensureSpace(ctx, 26);
    const rowHeight = 26;
    const rowY = ctx.y - rowHeight;

    if (index % 2 === 0) {
      roundedRect(ctx.page, {
        x: MARGIN,
        y: rowY,
        width: CONTENT_WIDTH,
        height: rowHeight,
        radius: 5,
        color: COLORS.soft,
      });
    }

    const labelSize = fitSize(spec.label, ctx.fonts.regular, 9.5, CONTENT_WIDTH * 0.55, 8);
    ctx.page.drawText(spec.label, {
      x: MARGIN + 12,
      y: rowY + 9,
      size: labelSize,
      font: ctx.fonts.regular,
      color: COLORS.body,
    });

    const valueSize = fitSize(spec.value, ctx.fonts.semibold, 9.5, CONTENT_WIDTH * 0.38, 8);
    const valueWidth = ctx.fonts.semibold.widthOfTextAtSize(spec.value, valueSize);
    ctx.page.drawText(spec.value, {
      x: MARGIN + CONTENT_WIDTH - 12 - valueWidth,
      y: rowY + 9,
      size: valueSize,
      font: ctx.fonts.semibold,
      color: COLORS.ink,
    });

    ctx.y = rowY;
  });

  ctx.y -= 6;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE.width - MARGIN, y: ctx.y },
    thickness: 0.7,
    color: COLORS.line,
  });
}

/* -------------------------------------------------------------------------- */
/*                             Design + technology                            */
/* -------------------------------------------------------------------------- */

function drawDesignPage(ctx: Context, content: VehicleDetailContent, tech: PDFImage | null) {
  newPage(ctx);

  drawSectionLabel(ctx, "Design");
  drawHeading(ctx, "Design & comfort", { size: 23, gap: 14 });

  const features = content.designFeatures.slice(0, 8);
  const columnGap = 22;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;
  const titleSize = 10.5;
  const bodySize = 9;

  for (let index = 0; index < features.length; index += 2) {
    const row = features.slice(index, index + 2);
    const heights = row.map((feature) => {
      const titleLines = wrap(feature.title, ctx.fonts.semibold, titleSize, columnWidth - 14);
      const bodyLines = feature.body
        ? wrap(feature.body, ctx.fonts.regular, bodySize, columnWidth - 14)
        : [];
      return 14 + titleLines.length * 14 + bodyLines.length * 13;
    });
    const rowHeight = Math.max(...heights) + 18;

    ensureSpace(ctx, rowHeight);
    const rowTop = ctx.y;

    row.forEach((feature, column) => {
      const x = MARGIN + column * (columnWidth + columnGap);
      let y = rowTop - 14;

      ctx.page.drawRectangle({ x, y: y + 1.5, width: 5, height: 5, color: COLORS.blue });

      const titleLines = wrap(feature.title, ctx.fonts.semibold, titleSize, columnWidth - 14);
      for (const line of titleLines) {
        ctx.page.drawText(line, {
          x: x + 14,
          y,
          size: titleSize,
          font: ctx.fonts.semibold,
          color: COLORS.ink,
        });
        y -= 14;
      }

      if (feature.body) {
        const bodyLines = wrap(feature.body, ctx.fonts.regular, bodySize, columnWidth - 14);
        for (const line of bodyLines) {
          ctx.page.drawText(line, {
            x: x + 14,
            y: y + 3,
            size: bodySize,
            font: ctx.fonts.regular,
            color: COLORS.body,
          });
          y -= 13;
        }
      }
    });

    ctx.y = rowTop - rowHeight;
  }

  // Technology
  ensureSpace(ctx, 210);
  ctx.y -= 6;
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE.width - MARGIN, y: ctx.y },
    thickness: 0.7,
    color: COLORS.line,
  });
  ctx.y -= 26;

  const blockTop = ctx.y;
  const textWidth = CONTENT_WIDTH - 208 - 26;

  drawSectionLabel(ctx, "Technology");
  const headingLines = wrap(content.technology.heading, ctx.fonts.bold, 17, textWidth);
  for (const line of headingLines) {
    ctx.y -= 17;
    ctx.page.drawText(line, {
      x: MARGIN,
      y: ctx.y,
      size: 17,
      font: ctx.fonts.bold,
      color: COLORS.ink,
    });
    ctx.y -= 5;
  }
  ctx.y -= 4;
  drawParagraph(ctx, content.technology.body, {
    size: 9.5,
    lineHeight: 14.5,
    width: textWidth,
    gap: 0,
  });

  const imageBox = {
    x: MARGIN + CONTENT_WIDTH - 208,
    y: blockTop - 160,
    width: 208,
    height: 152,
  };
  drawImageBox(ctx, tech, imageBox);

  ctx.y = Math.min(ctx.y, imageBox.y) - 20;
}

/* -------------------------------------------------------------------------- */
/*                                  Galleries                                 */
/* -------------------------------------------------------------------------- */

function drawGalleryPage(
  ctx: Context,
  gallery: VehicleDetailContent["exterior"],
  featured: PDFImage | null,
  photos: (PDFImage | null)[],
) {
  newPage(ctx);

  drawSectionLabel(ctx, gallery.eyebrow);
  drawHeading(ctx, gallery.heading, { size: 21, gap: 14 });

  const featuredHeight = 300;
  ensureSpace(ctx, featuredHeight + 230);
  drawImageBox(ctx, featured, {
    x: MARGIN,
    y: ctx.y - featuredHeight,
    width: CONTENT_WIDTH,
    height: featuredHeight,
  });
  ctx.y -= featuredHeight + 18;

  const gap = 18;
  const photoWidth = (CONTENT_WIDTH - gap) / 2;
  const photoHeight = 172;

  gallery.photos.slice(0, 2).forEach((photo, index) => {
    const x = MARGIN + index * (photoWidth + gap);
    drawImageBox(ctx, photos[index] ?? null, {
      x,
      y: ctx.y - photoHeight,
      width: photoWidth,
      height: photoHeight,
    });

    const caption = wrap(photo.caption, ctx.fonts.semibold, 9.5, photoWidth);
    let captionY = ctx.y - photoHeight - 15;
    for (const line of caption) {
      ctx.page.drawText(line, {
        x,
        y: captionY,
        size: 9.5,
        font: ctx.fonts.semibold,
        color: COLORS.ink,
      });
      captionY -= 13;
    }
  });

  ctx.y -= photoHeight + 34;
}

/* -------------------------------------------------------------------------- */
/*                             Colours + call to action                       */
/* -------------------------------------------------------------------------- */

function drawClosingPage(ctx: Context, content: VehicleDetailContent) {
  newPage(ctx);

  drawSectionLabel(ctx, "Colours");
  drawHeading(ctx, "Choose your look", { size: 23, gap: 10 });
  drawParagraph(
    ctx,
    "Colour availability varies by showroom. Ask your dealer about the finishes currently in stock.",
    { size: 9.5, lineHeight: 14.5, color: COLORS.muted, width: CONTENT_WIDTH - 40, gap: 18 },
  );

  const colours = content.colours.slice(0, 6);
  if (colours.length > 0) {
    const step = Math.min(78, CONTENT_WIDTH / colours.length);
    const diameter = 34;
    const swatchY = ctx.y - diameter / 2 - 4;

    colours.forEach((colour, index) => {
      const centreX = MARGIN + step * index + diameter / 2;
      const fill = colorFromHex(colour.hex);
      const { r, g, b } = parseHex(colour.hex);
      const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.82;

      ctx.page.drawEllipse({
        x: centreX,
        y: swatchY,
        xScale: diameter / 2,
        yScale: diameter / 2,
        color: fill,
        borderColor: light ? COLORS.line : undefined,
        borderWidth: light ? 0.8 : undefined,
      });

      ctx.page.drawText(colour.name, {
        x: centreX - ctx.fonts.regular.widthOfTextAtSize(colour.name, 8.5) / 2,
        y: swatchY - diameter / 2 - 16,
        size: 8.5,
        font: ctx.fonts.regular,
        color: COLORS.body,
      });
    });

    ctx.y = swatchY - diameter / 2 - 40;
  }

  // Closing card
  ensureSpace(ctx, 190);
  ctx.y -= 10;
  const cardHeight = 176;
  const cardY = ctx.y - cardHeight;

  roundedRect(ctx.page, {
    x: MARGIN,
    y: cardY,
    width: CONTENT_WIDTH,
    height: cardHeight,
    radius: 14,
    color: COLORS.dark,
  });

  drawTracked(
    ctx.page,
    "NEXT STEP",
    {
      x: MARGIN + 28,
      y: cardY + cardHeight - 40,
      size: 7.5,
      font: ctx.fonts.bold,
      color: rgb(0.35, 0.66, 0.95),
    },
    2,
  );

  const ctaLines = wrap(content.cta.heading, ctx.fonts.bold, 22, CONTENT_WIDTH - 90).slice(0, 2);
  let ctaY = cardY + cardHeight - 72;
  for (const line of ctaLines) {
    ctx.page.drawText(line, {
      x: MARGIN + 28,
      y: ctaY,
      size: 22,
      font: ctx.fonts.bold,
      color: COLORS.white,
    });
    ctaY -= 27;
  }

  const bodyLines = wrap(content.cta.body, ctx.fonts.regular, 9.5, CONTENT_WIDTH - 120).slice(0, 2);
  let bodyY = ctaY - 4;
  for (const line of bodyLines) {
    ctx.page.drawText(line, {
      x: MARGIN + 28,
      y: bodyY,
      size: 9.5,
      font: ctx.fonts.regular,
      color: COLORS.whiteSoft,
    });
    bodyY -= 14;
  }

  // Pills
  const pillY = cardY + 26;
  const pillHeight = 26;
  const orderLabel = "Order online";
  const orderWidth = ctx.fonts.semibold.widthOfTextAtSize(orderLabel, 9) + 34;
  roundedRect(ctx.page, {
    x: MARGIN + 28,
    y: pillY,
    width: orderWidth,
    height: pillHeight,
    radius: pillHeight / 2,
    color: COLORS.blue,
  });
  ctx.page.drawText(orderLabel, {
    x: MARGIN + 28 + 17,
    y: pillY + 9,
    size: 9,
    font: ctx.fonts.semibold,
    color: COLORS.white,
  });

  const driveLabel = "Book a test drive";
  const driveWidth = ctx.fonts.semibold.widthOfTextAtSize(driveLabel, 9) + 34;
  roundedRect(ctx.page, {
    x: MARGIN + 28 + orderWidth + 10,
    y: pillY,
    width: driveWidth,
    height: pillHeight,
    radius: pillHeight / 2,
    borderColor: COLORS.whiteSoft,
    borderWidth: 0.9,
  });
  ctx.page.drawText(driveLabel, {
    x: MARGIN + 28 + orderWidth + 10 + 17,
    y: pillY + 9,
    size: 9,
    font: ctx.fonts.semibold,
    color: COLORS.white,
  });

  const siteWidth = ctx.fonts.semibold.widthOfTextAtSize(SITE, 9);
  ctx.page.drawText(SITE, {
    x: PAGE.width - MARGIN - 28 - siteWidth,
    y: pillY + 9,
    size: 9,
    font: ctx.fonts.semibold,
    color: COLORS.whiteSoft,
  });

  ctx.y = cardY - 20;
}

/* -------------------------------------------------------------------------- */
/*                                  Footers                                   */
/* -------------------------------------------------------------------------- */

function drawFooters(ctx: Context) {
  const pages = ctx.doc.getPages();
  const total = pages.length - 1;

  pages.slice(1).forEach((page, index) => {
    page.drawLine({
      start: { x: MARGIN, y: 46 },
      end: { x: PAGE.width - MARGIN, y: 46 },
      thickness: 0.7,
      color: COLORS.line,
    });

    page.drawText(`${ctx.name}  ·  Vehicle brochure`, {
      x: MARGIN,
      y: 32,
      size: 7.5,
      font: ctx.fonts.regular,
      color: COLORS.muted,
    });

    const label = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    const width = ctx.fonts.semibold.widthOfTextAtSize(label, 7.5);
    page.drawText(label, {
      x: PAGE.width - MARGIN - width,
      y: 32,
      size: 7.5,
      font: ctx.fonts.semibold,
      color: COLORS.ink,
    });
  });
}
