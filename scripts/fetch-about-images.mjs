// Downloads the About page photos from the Figma file into
// public/images/about/revamp/. The Figma asset links expire 7 days after they
// were generated, so run this soon (Node 18+):
//
//   node scripts/fetch-about-images.mjs
//
// If a link has expired, re-export the matching image from each About frame
// (Desktop / Tablet / Mobile) and save it under the name shown below.
// Note: the chairman poster and statement photos are named "AI PLACEHOLDER" in Figma.
import { mkdir, writeFile } from "node:fs/promises";

const BASE = "https://www.figma.com/api/mcp/asset/";
const FILES = {
  "hero-desktop.png": "077c7df9-b549-4134-be49-9cffbfce2335.png",
  "hero-tablet.png": "1472aa09-c651-47cd-81b5-f7ac346d22f4.png",
  "hero-mobile.png": "9a93b678-0ccb-40fa-810e-e977a7b9da45.png",
  "chairman-poster-desktop.png": "6046b63d-8a96-4652-8b8c-905d88d42d14.png",
  "chairman-poster-tablet.png": "870ee036-ed95-4a81-845c-c36f72abdd49.png",
  "chairman-poster-mobile.png": "c02108bb-d67c-487d-85d9-b698f1c25b19.png",
  "statement-desktop.png": "8685c8d6-91b3-44ab-adcc-f0da715b53a4.png",
  "statement-tablet.png": "e9e21d16-f19d-4ac7-b43a-fd8469870845.png",
  "statement-mobile.png": "3d45e68d-338c-4ffc-a2a1-9fbf31186cf4.png",
};

const dir = new URL("../public/images/about/revamp/", import.meta.url);
await mkdir(dir, { recursive: true });

let failed = 0;
for (const [name, id] of Object.entries(FILES)) {
  try {
    const res = await fetch(BASE + id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(new URL(name, dir), Buffer.from(await res.arrayBuffer()));
    console.log(`saved ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAILED ${name}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
