#!/usr/bin/env bash
# Rebuilds everything the design-sync converter reads, in the one order that works.
#
# Ordering is load-bearing: setup-pkg.mjs wipes and recreates .ds-sync/pkg/, so the
# compiled stylesheet and the harvested fonts have to be written into it AFTERWARDS.
# Running them out of order leaves the converter reporting
#   ! cssEntry: ./styles.css not found — skipped
#   ! extraFonts: ./fonts/fonts.css not found — skipped
# and silently produces an unstyled, fontless bundle that still exits 0.
#
# Run this before package-build.mjs, every time. Usage: bash .design-sync/prepare.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "── 1/3 scratch DS package (entry, next shims, tsc declarations)"
node .design-sync/setup-pkg.mjs

echo "── 2/3 brand fonts, harvested from the Next build"
node .design-sync/harvest-fonts.mjs

echo "── 3/3 Tailwind stylesheet, compiled against components/ and app/"
node .ds-sync/node_modules/.bin/tailwindcss \
  -i .ds-sync/pkg/tw-input.css \
  -o .ds-sync/pkg/styles.css

# tw-input.css lives in the wiped directory too, so setup-pkg.mjs must recreate
# it. Guard against it going missing rather than shipping an unstyled bundle.
test -s .ds-sync/pkg/styles.css || { echo "FATAL: styles.css is empty" >&2; exit 1; }
test -s .ds-sync/pkg/fonts/fonts.css || { echo "FATAL: fonts.css missing" >&2; exit 1; }
echo "── ready: $(wc -c < .ds-sync/pkg/styles.css) bytes of CSS, $(ls .ds-sync/pkg/fonts/*.woff2 | wc -l) font files"
