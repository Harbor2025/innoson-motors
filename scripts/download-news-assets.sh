#!/usr/bin/env bash
# Run from the project root. Figma's MCP asset URLs expire ~7 days after they were issued
# (issued Oct 14 2026) - re-run get_design_context on the news frames if they've gone stale.
set -euo pipefail
mkdir -p public/icons
B=https://www.figma.com/api/mcp/asset
dl() { curl -fL --retry 2 "$1" -o "$2" && echo "ok   $2"; }

# Pagination arrows (list frame 772:1127)
dl $B/04b2d17e-2f81-4f03-9cd7-b4b64482fe31.svg public/icons/news-nav-prev.svg
dl $B/1aeebf79-6386-451b-b2e4-0c138e9c55d4.svg public/icons/news-nav-next.svg
# "Back" arrow (detail frame 772:954)
dl $B/6cc725fc-cb76-48af-b957-1f831fcb5dc7.svg public/icons/arrow-left-bold.svg

echo "Done. The card photos in the Figma are placeholders; real pages use each article's own image."
