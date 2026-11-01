/**
 * Temporary smoke test for the brochure generator (run with tsx, deleted after use).
 */
import fs from "node:fs";
import { PDFDocument } from "pdf-lib";
import { buildVehicleBrochurePdf } from "../src/lib/vehicle-brochure";
import { buildVehicleDetail } from "../src/components/vehicles/vehicle-detail-content";
import type { ModelDetailDTO } from "../src/types/dto";

const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.startsWith("/fonts/")) {
    const bytes = fs.readFileSync(`public${url}`);
    return new Response(bytes, { status: 200 });
  }
  return realFetch(input as RequestInfo, init);
}) as typeof fetch;

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
const out = "C:/Users/HP/AppData/Local/Temp/opencode/brochure-smoke.pdf";
fs.writeFileSync(out, bytes);

const parsed = await PDFDocument.load(bytes);
console.log("pages:", parsed.getPageCount());
console.log("size:", bytes.byteLength, "bytes");
console.log("title:", parsed.getTitle());
