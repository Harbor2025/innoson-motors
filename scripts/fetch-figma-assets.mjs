/**
 * Downloads image assets from Figma by rendering unique image-fill node layers.
 *
 * Required environment variable:
 *   FIGMA_TOKEN=your_figma_personal_access_token
 *
 * Run:
 *   node scripts/fetch-figma-assets.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = "4HyDuRNxFD2P9osLXNqrPE";

const PUBLIC_DIR = join(process.cwd(), "public");
const IMAGES_DIR = join(PUBLIC_DIR, "images");

if (!FIGMA_TOKEN) {
  console.error("✘ FIGMA_TOKEN is not set in environment variables.");
  process.exit(1);
}

const FIGMA_HEADERS = {
  "X-Figma-Token": FIGMA_TOKEN,
};

async function figmaApi(path) {
  const url = `https://api.figma.com/v1${path}`;
  const res = await fetch(url, { headers: FIGMA_HEADERS });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Figma API ${res.status}: ${text || res.statusText}`);
  }

  return res.json();
}

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 150);
}

function walkNodes(node, callback) {
  if (!node) return;
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      walkNodes(child, callback);
    }
  }
}

/**
 * Collect unique image-fill nodes deduplicated by imageRef.
 */
function findUniqueImageNodes(document) {
  const imageMap = new Map();

  walkNodes(document, (node) => {
    if (!node.fills || !Array.isArray(node.fills)) return;

    for (const fill of node.fills) {
      if (fill.type === "IMAGE" && fill.imageRef) {
        if (!imageMap.has(fill.imageRef)) {
          imageMap.set(fill.imageRef, {
            imageRef: fill.imageRef,
            nodeId: node.id,
            nodeName: node.name || "image",
          });
        }
      }
    }
  });

  return [...imageMap.values()];
}

async function downloadFile(url, destination) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(join(destination, ".."), { recursive: true });
  await writeFile(destination, buffer);
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  console.log("Fetching Figma document structure...\n");

  const file = await figmaApi(`/files/${FILE_KEY}`);
  console.log(`File: ${file.name}`);

  const uniqueImages = findUniqueImageNodes(file.document);
  console.log(`Found ${uniqueImages.length} unique placed photo nodes.\n`);

  if (uniqueImages.length === 0) {
    console.log("No image fills found.");
    return;
  }

  // Request render URLs in small batches of 10 to keep URLs concise
  console.log("Requesting exported image URLs from Figma...");
  const renderedUrls = {};
  const chunks = chunkArray(uniqueImages, 10);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const nodeIds = chunk.map((item) => item.nodeId).join(",");

    try {
      const res = await figmaApi(
        `/images/${FILE_KEY}?ids=${encodeURIComponent(nodeIds)}&format=png&scale=2`
      );
      if (res.images) {
        Object.assign(renderedUrls, res.images);
      }
    } catch (err) {
      console.error(`Failed batch ${i + 1}: ${err.message}`);
    }
  }

  await mkdir(IMAGES_DIR, { recursive: true });

  let downloaded = 0;
  let failed = 0;
  const usedNames = new Set();

  console.log("\nDownloading images...\n");

  for (const item of uniqueImages) {
    const url = renderedUrls[item.nodeId];

    if (!url) {
      console.error(`✘ ${item.nodeName} (${item.nodeId}) — URL not found`);
      failed += 1;
      continue;
    }

    let filename = sanitizeFilename(item.nodeName) || "photo";
    const originalName = filename;
    let counter = 2;

    while (usedNames.has(filename)) {
      filename = `${originalName}-${counter}`;
      counter += 1;
    }
    usedNames.add(filename);

    const relativePath = `images/${filename}.png`;
    const destination = join(PUBLIC_DIR, relativePath);

    try {
      await downloadFile(url, destination);
      console.log(`✔ ${relativePath}`);
      downloaded += 1;
    } catch (err) {
      console.error(`✘ ${relativePath} — ${err.message}`);
      failed += 1;
    }
  }

  console.log("\n----------------------------------------");
  console.log(`Done: ${downloaded} downloaded, ${failed} failed.`);
  console.log("----------------------------------------");
}

main().catch((err) => {
  console.error("\n✘ Fatal error:", err.message);
  process.exit(1);
});