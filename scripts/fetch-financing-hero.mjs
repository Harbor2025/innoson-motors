// Downloads the three Financing hero photos from the Figma file into
// public/images/financing/. The Figma asset links expire 7 days after they
// were generated, so run this soon (Node 18+):
//
//   node scripts/fetch-financing-hero.mjs
//
// If a link has expired, re-export the "Section – Hero" background image from
// each Financing frame (Desktop / Tablet / Mobile) and save it under the name
// shown below.
import { mkdir, writeFile } from "node:fs/promises";

const FILES = {
  "hero-desktop.png": "https://www.figma.com/api/mcp/asset/842bc083-2931-4b82-8027-85a56aaa0383.png",
  "hero-tablet.png": "https://www.figma.com/api/mcp/asset/f566ea9c-0328-485b-a24c-137a803087b6.png",
  "hero-mobile.png": "https://www.figma.com/api/mcp/asset/eefabc39-79ab-4559-821e-2dc06b40de01.png",
};

const dir = new URL("../public/images/financing/", import.meta.url);
await mkdir(dir, { recursive: true });

let failed = 0;
for (const [name, url] of Object.entries(FILES)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(new URL(name, dir), Buffer.from(await res.arrayBuffer()));
    console.log(`saved ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAILED ${name}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
