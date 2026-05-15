#!/usr/bin/env bash
# One-command production packager for Pair (or any Apache host).
#
# Runs: bun install (if needed) -> vite build -> zips dist/ contents
# (including .htaccess, _redirects, etc.) into echd-pair-deploy.zip.
#
# Usage:
#   bun run package        # writes ./echd-pair-deploy.zip
#   OUT=/path/file.zip bun run package

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT="${OUT:-$ROOT/echd-pair-deploy.zip}"

echo "==> Installing dependencies (if missing)"
if [ ! -d node_modules ]; then
  if command -v bun >/dev/null 2>&1; then bun install
  else npm install
  fi
fi

echo "==> Building production bundle"
if command -v bun >/dev/null 2>&1; then bun run build
else npm run build
fi

if [ ! -d dist ]; then
  echo "ERROR: dist/ not found after build" >&2
  exit 1
fi

echo "==> Creating $OUT"
rm -f "$OUT"
( cd dist && zip -r "$OUT" . )

echo ""
echo "Done."
ls -lh "$OUT"
echo ""
echo "Upload the contents of the zip (NOT the zip itself) to your Pair web root."
