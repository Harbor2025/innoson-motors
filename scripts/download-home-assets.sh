#!/usr/bin/env bash
# Downloads the homepage images/icons from the Figma file into /public.
# Run from your project root:   bash scripts/download-home-assets.sh
#
# The Figma MCP asset links EXPIRE 7 DAYS after they were generated (Oct 23, 2026), so run this soon.
# If a link has expired, ask for a fresh copy of this script (or export the layers manually from Figma).
set -euo pipefail

OUT="public/images/home/v2"
mkdir -p "$OUT/icons"

dl() {
  curl -fsSL "$2" -o "$OUT/$1" && echo "ok  $OUT/$1" || { echo "FAILED  $1"; FAIL=1; }
}
FAIL=0
B="https://www.figma.com/api/mcp/asset"

# Photos (desktop exports; the components use object-cover for tablet/mobile)
dl hero.png         "$B/7d0fab8b-1c78-40ab-991c-3cd48e5129b9.png"
dl offer.png        "$B/46c1d3c0-d27d-4b6b-89ba-211743c951c2.png"
dl model.png        "$B/6630d0a1-4b4e-4cd1-b04b-118e4f9a2205.png"
dl video-poster.png "$B/0f5be3ff-8281-40f9-9876-12b2739edb29.png"
dl factory.png      "$B/e3d9485a-dcbd-4b70-a397-18ddd1a0c881.png"
dl promo-1.png      "$B/afd1bac0-53ad-45c1-a9c9-a442f8c6112c.png"
dl promo-2.png      "$B/7c32d1aa-0405-46e1-9d2e-7a10185f9a82.png"
dl promo-3.png      "$B/f8336225-5c5c-42eb-acd3-9768dfc54118.png"
dl payment.png      "$B/35cb3a0b-c24e-43bf-9496-150ff2d68812.png"
dl app-card.png     "$B/1628da32-3309-4121-920d-080f7819f25e.png"
dl app-phones.png   "$B/75cb31b1-3056-4766-be79-b968bc2517b7.png"

# Icons (IVM App section)
dl icons/feature-service.svg   "$B/d4be8379-2415-4117-93bc-5f294f47de94.svg"
dl icons/feature-warranty.svg  "$B/b9108bb9-366e-4614-b880-4151544e8a2c.svg"
dl icons/feature-manual.svg    "$B/d59b27af-094a-4a46-b292-a97445306ffb.svg"
dl icons/feature-dealer.svg    "$B/748bebc8-43a0-4b2b-be78-8f1e6895b980.svg"
dl icons/store-apple.svg       "$B/c30e7731-2bde-4f37-b2f3-75cd3a4ea8f1.svg"
dl icons/store-google-play.svg "$B/45b82f99-0d83-46a6-b7eb-5004111b3247.svg"

[ "$FAIL" = 0 ] && echo "All assets downloaded." || { echo "Some downloads failed (expired links?)."; exit 1; }