#!/usr/bin/env bash
# Run from the project root. Figma's MCP asset URLs expire ~7 days after they were issued
# (issued Oct 14 2026) - re-run get_design_context in Figma if they've gone stale.
set -euo pipefail
mkdir -p public/images/home public/icons

dl() { curl -fL --retry 2 "$1" -o "$2" && echo "ok  $2"; }
B=https://www.figma.com/api/mcp/asset

# --- Desktop ---
dl $B/a0312a85-274d-43ef-a2d8-34588077020d.png public/images/home/hero-1.png
dl $B/36e8b26b-90be-40de-a90e-3a74194124f8.png public/images/home/video-poster-desktop.png
dl $B/42bfc120-9538-4a40-bfbc-e31062e99da4.png public/images/home/video-pause-desktop.png
dl $B/507c9b71-071a-4df4-be69-4fcb6209f976.png public/images/home/special-offer-bg.png
dl $B/8677f122-dfe5-4e03-8a66-c86091e08ba5.png public/images/home/newest-1.png
dl $B/eb2dbe07-1d36-45e0-a369-d0657362889a.png public/images/home/newest-2.png
dl $B/99424c2d-8c3d-44ab-8711-cb318095b0b4.png public/images/home/payment.png
dl $B/249f2381-243d-4da9-80bc-c121eee25acd.png public/images/home/logo.png
dl $B/3c8a7302-ea1b-4c59-99cc-a4861948fa49.svg public/icons/globe.svg

# --- Mobile ---
dl $B/7e7a10cb-72b1-4a13-87cd-f05e91b4250a.png public/images/home/hero-1-mobile.png
dl $B/1c5815a0-4019-4b79-a045-8d88deb44d0c.png public/images/home/video-poster-mobile.png
dl $B/629bfdd6-372c-4b30-9450-49b37d15f17b.svg public/images/home/video-pause-mobile.svg

# --- Nav menu ---
dl $B/f9d949f1-6afa-41e6-a912-212286b95ffa.svg public/icons/arrow-right.svg

echo "Done. Add your video at public/videos/home-showcase.mp4"
