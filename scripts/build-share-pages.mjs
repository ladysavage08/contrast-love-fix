// Post-build: write dist/<route>/index.html copies with route-specific
// title/description/Open Graph tags so social crawlers (which don't run JS)
// see the right preview on static Apache hosting. The SPA still boots normally.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://ecphd.com";
const pages = [
  {
    path: "breastcancer",
    title: "Breast Cancer Awareness Month 2026 | East Central Health District",
    description:
      "October is Breast Cancer Awareness Month. Learn about breast cancer signs, screening, early detection, and trusted resources from East Central Health District.",
    image: `${SITE}/breastcancer-og.jpg`,
    imageAlt: "Pink ribbon with the text Breast Cancer Awareness Month 2026 — East Central Health District",
  },
];

const base = readFileSync("dist/index.html", "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const p of pages) {
  const url = `${SITE}/${p.path}`;
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta\s+(name|property)="(description|og:title|og:description|og:url|og:image|og:image:alt|twitter:card|twitter:title|twitter:description|twitter:image)"[^>]*>\s*/g, "")
    .replace(/<link rel="canonical"[^>]*>\s*/g, "");
  const tags = `
    <meta name="description" content="${esc(p.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${p.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(p.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(p.title)}" />
    <meta name="twitter:description" content="${esc(p.description)}" />
    <meta name="twitter:image" content="${p.image}" />
  </head>`;
  html = html.replace("</head>", tags);
  mkdirSync(`dist/${p.path}`, { recursive: true });
  writeFileSync(`dist/${p.path}/index.html`, html);
  console.log(`share page: dist/${p.path}/index.html`);
}
