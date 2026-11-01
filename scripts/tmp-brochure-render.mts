/**
 * Temporary: renders the brochure PDF with real images using a Node canvas shim.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { buildVehicleBrochurePdf } from "../src/lib/vehicle-brochure";
import { buildVehicleDetail } from "../src/components/vehicles/vehicle-detail-content";
import type { ModelDetailDTO } from "../src/types/dto";

const requireTemp = createRequire("C:/Users/HP/AppData/Local/Temp/opencode/pdfcheck/index.js");
const canvasLib = requireTemp("@napi-rs/canvas") as typeof import("@napi-rs/canvas");

const projectRoot = path.resolve(import.meta.dirname, "..");

// --- DOM shims -------------------------------------------------------------
const g = globalThis as unknown as Record<string, unknown>;
g.createImageBitmap = async (blob: Blob) => {
  const image = new canvasLib.Image();
  image.src = Buffer.from(await blob.arrayBuffer());
  return { width: image.width, height: image.height, close: () => {}, _image: image };
};
g.document = {
  createElement: () => {
    const canvas = canvasLib.createCanvas(1, 1);
    const original = canvas.getContext.bind(canvas);
    (canvas as unknown as { getContext: unknown }).getContext = (type: string) => {
      const context = original(type as "2d");
      // pdf generator only uses drawImage + toBlob
      const drawImage = context.drawImage.bind(context);
      context.drawImage = ((image: { _image?: unknown }, ...args: unknown[]) =>
        drawImage((image?._image ?? image) as never, ...(args as never[]))) as never;
      return context;
    };
    return canvas;
  },
};

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  let filePath: string | null = null;
  if (url.startsWith("/_next/image?url=")) {
    const raw = decodeURIComponent(url.slice("/_next/image?url=".length).split("&")[0]);
    filePath = path.join(projectRoot, "public", raw);
  } else if (url.startsWith("/")) {
    filePath = path.join(projectRoot, "public", url);
  }
  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const type = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
    return new Response(fs.readFileSync(filePath), { status: 200, headers: { "content-type": type } });
  }
  return realFetch(input as RequestInfo);
}) as typeof fetch;

// --- Build -----------------------------------------------------------------
const model = {
  id: "1",
  name: "INNOSON Caris",
  slug: "caris",
  tagline: "Bold and elegant",
  summary: "A sleek modern sedan.",
  category: { id: "c1", name: "Sedans", slug: "sedans" },
  featured: true,
  specs: [],
  gallery: [],
  highlights: [],
  colorOptions: [],
  brochure: null,
} as unknown as ModelDetailDTO;

const content = buildVehicleDetail(model);
const blob = await buildVehicleBrochurePdf(content);
const bytes = new Uint8Array(await blob.arrayBuffer());
const out = "C:/Users/HP/AppData/Local/Temp/opencode/pdfcheck/brochure.pdf";
fs.writeFileSync(out, bytes);
console.log("wrote", out, bytes.byteLength, "bytes");
