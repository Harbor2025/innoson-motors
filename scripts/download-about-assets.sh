#!/usr/bin/env bash
# Run from the project root. Figma's MCP asset URLs expire ~7 days after they were issued
# (issued Oct 14 2026) - re-run get_design_context on the About frame if they've gone stale.
set -euo pipefail
mkdir -p public/images/about public/images/home public/icons

B=https://www.figma.com/api/mcp/asset
dl() { curl -fL --retry 2 "$1" -o "$2" && echo "ok   $2"; }
dl_missing() { if [ -f "$2" ]; then echo "skip $2 (already there)"; else dl "$1" "$2"; fi; }

# --- About page ---
dl $B/064e9103-92c7-4698-bc5c-447f46ec25f2.png public/images/about/hero.png
dl $B/40525f5f-b7b5-4c7a-b9b4-34b3377096be.png public/images/about/chairman-poster.png
dl $B/09a3b342-b4c2-4122-85f1-51666cf7536d.png public/images/about/video-pause.png
dl $B/1c888a5e-edc4-4461-9209-14fbb62c25bf.png public/images/about/factory-poster.png
dl $B/a870279a-af0d-42dc-83cd-26e7ed57b2fd.svg public/images/about/icon-mission.svg
dl $B/43cd6f37-2ff1-4cca-bb4a-b69dfddd0869.svg public/images/about/icon-vision.svg
dl $B/de134258-c6af-49e3-bea5-9fe9e84b7e99.svg public/images/about/icon-objective.svg
dl $B/0a45c7d8-f2d0-4480-a750-8510d1c165aa.png public/images/about/life-1.png
dl $B/929601c9-9620-4baf-bda1-f8db163bd0ce.png public/images/about/life-2.png
dl $B/92f27bcd-09f2-4739-9f30-3e3827eac4ed.png public/images/about/life-banner.png

# --- WhatsApp widget ---
dl $B/b105eb99-df19-4d5e-83e4-7fb4212199b2.png public/images/about/whatsapp.png
dl $B/0691248c-9ba3-4e0e-abad-2645ca112735.svg public/images/about/widget-tail.svg
dl $B/36cf655a-13f3-4daf-ad63-bbb76323594f.svg public/images/about/widget-badge.svg
dl $B/b89bccba-b055-4576-a990-4b8a9028cd69.svg public/images/about/widget-close.svg

# --- Shared with the homepage script (only fetched if you haven't run that one) ---
dl_missing $B/f519c285-8af8-47ee-b51b-8dad4c66cac7.png public/images/home/logo.png
dl_missing $B/4f983750-7f6f-4c9c-8935-09c4722eb5ea.svg public/icons/globe.svg

echo "Done. Add videos at public/videos/chairman-message.mp4 and public/videos/about-factory.mp4"
# /images/africa.png (stats badge) already exists in your project and is reused.
