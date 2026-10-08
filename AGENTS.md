
- Flu-page AI helper runs in the `flu-assistant` function and answers only from the approved content embedded there plus published flu_clinics rows; update that content when flu guidance changes.
- Flu page copy (English and Spanish) lives in one COPY object in FluShot.tsx so both languages stay in sync.
- Build deployment packages with `OUT=<path outside the repo>` (e.g. `OUT=/tmp/echd-pair-deploy.zip`); the packager defaults to the repo root and the zip exceeds the per-file commit limit.
- Share previews for static Pair hosting: `scripts/build-share-pages.mjs` writes per-route `dist/<route>/index.html` with route OG tags during packaging — social crawlers do not run JS.
- Time-limited homepage slides with no DB rows live in `defaultSlides` with `expiresAt`; adding any `hero_slides` DB row replaces all defaults.
