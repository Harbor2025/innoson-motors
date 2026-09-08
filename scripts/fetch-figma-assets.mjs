/**
 * Downloads the exact image/icon bytes exported from the Figma file and
 * writes them into /public at the paths the components already reference.
 *
 * Figma's MCP asset URLs expire ~7 days after they were generated.
 * The homepage/vehicles URLs were generated around 2026-09-02; the
 * /news + /news/[slug] URLs were generated 2026-09-08. Run this soon:
 *
 *   node scripts/fetch-figma-assets.mjs
 *
 * If a URL has expired, re-run `get_design_context` on the relevant node
 * in Figma to mint a fresh one and update the ASSETS map below.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const ASSETS = {
  // --- images (public/images) ---
  "images/logo-header.png":
    "https://www.figma.com/api/mcp/asset/3197f33e-6b88-4fc7-98ef-210eabb0b1d3.png",
  "images/logo-header-mobile.png":
    "https://www.figma.com/api/mcp/asset/31cbb951-ec0f-4e27-a6d9-c8340d560dc1.png",
  "images/logo-footer.png":
    "https://www.figma.com/api/mcp/asset/62cd79f6-c332-4451-ba92-ff9edfa08b0e.png",
  "images/hero-truck.png":
    "https://www.figma.com/api/mcp/asset/36a63c7e-951b-424b-9090-a5dac28a46bd.png",
  "images/bold-experience-bg.png":
    "https://www.figma.com/api/mcp/asset/1a93a763-a384-4b83-8053-46bebec9e1bf.png",
  "images/ev-collection-bg.png":
    "https://www.figma.com/api/mcp/asset/d3164666-7f58-4d14-9281-8bc2086f8b42.png",
  "images/car-model-side.png":
    "https://www.figma.com/api/mcp/asset/b39fd331-88f1-4c1e-86c7-ee67c31544ab.png",
  "images/payment-bg.png":
    "https://www.figma.com/api/mcp/asset/a8c6a7ce-510d-489e-b431-8b7207e5a80b.png",

  // --- /news + /news/[slug] pages (node 510:251) ---
  "images/news-car.png":
    "https://www.figma.com/api/mcp/asset/025df312-6111-4d94-96cc-29cce7ec8914.png",
  "images/avatar-nneka.png":
    "https://www.figma.com/api/mcp/asset/a0db46eb-2206-4192-acf3-c74a5ee1bdb2.png",
  "icons/icon-search.svg":
    "https://www.figma.com/api/mcp/asset/b4e082fb-646e-44cb-8aa7-01530480d111.svg",

  // --- icons (public/icons) ---
  "icons/icon-hamburger.svg":
    "https://www.figma.com/api/mcp/asset/f70fbfa0-d7c4-423c-abb4-79a58c660bf5.svg",
  "icons/icon-arrow-up-right.svg":
    "https://www.figma.com/api/mcp/asset/4764ddd2-c578-49f8-b470-a98f90d6825d.svg",
  "icons/icon-chevron.svg":
    "https://www.figma.com/api/mcp/asset/5c31c57c-98b5-4f32-ae13-d7166c10e5bb.svg",
  "icons/icon-back-to-top.svg":
    "https://www.figma.com/api/mcp/asset/9503e948-bf1a-4ba8-a981-a16935ed5ae9.svg",
  "icons/icon-email.svg":
    "https://www.figma.com/api/mcp/asset/b793eb1b-b740-48a1-9e72-6194d559e4af.svg",
  "icons/icon-phone.svg":
    "https://www.figma.com/api/mcp/asset/6fe56db6-f29f-460d-ab74-3e7b0a071156.svg",
  "icons/icon-location.svg":
    "https://www.figma.com/api/mcp/asset/a17d4992-e01a-43e1-b1bc-fcc74f98ec1b.svg",

  // --- /vehicles page (node 510:250) ---
  "images/vehicle-card-suv.png":
    "https://www.figma.com/api/mcp/asset/88ab4fe4-3e38-4dfa-bc9b-611899750426.png",
  "images/vehicle-card-sedan.png":
    "https://www.figma.com/api/mcp/asset/f70d1ef6-ad89-4bbe-9e0d-ad89b0090785.png",
  "icons/icon-arrow-right.svg":
    "https://www.figma.com/api/mcp/asset/91a5c244-647f-47f0-a7a9-d76e7b14d752.svg",
};

const PUBLIC_DIR = join(process.cwd(), "public");

async function main() {
  const entries = Object.entries(ASSETS);
  let ok = 0;
  let failed = 0;

  for (const [relativePath, url] of entries) {
    const destination = join(PUBLIC_DIR, relativePath);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, buffer);
      console.log(`✔ ${relativePath}`);
      ok += 1;
    } catch (err) {
      console.error(`✘ ${relativePath} — ${err.message}`);
      failed += 1;
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${failed} failed.`);
  if (failed > 0) {
    console.log(
      "For any failures, the Figma asset link has likely expired — re-run get_design_context on that node to get a fresh URL."
    );
  }
}

main();