/**
 * Generates public/sitemap.xml from the application's route table + dynamic
 * content (counties, programs, environmental health, women's health, and
 * published news posts from the database). Runs before `vite dev` and
 * `vite build` via the predev/prebuild npm hooks.
 *
 * Admin, auth, redirect-only, and not-found routes are intentionally excluded.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

import { counties } from "../src/data/counties";
import { programs } from "../src/data/programs";
import { ehSubpages } from "../src/data/environmentalHealth";
import { whSubpages } from "../src/data/womensHealth";

const BASE_URL = "https://contrast-love-fix.lovable.app";
const SUPABASE_URL = "https://bqrzsvipbbrtfxpbjsjg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcnpzdmlwYmJydGZ4cGJqc2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTEyNjAsImV4cCI6MjA5MjUyNzI2MH0.oWR35ZlEgvwMTun-IYDz8Mc1mW5pWmjGjANexKPva-8";

interface Entry {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/counties", changefreq: "monthly", priority: "0.9" },
  { path: "/programs", changefreq: "monthly", priority: "0.9" },
  { path: "/programs/home-visiting-program", changefreq: "monthly", priority: "0.7" },
  { path: "/environmental-health", changefreq: "monthly", priority: "0.8" },
  { path: "/womens-health", changefreq: "monthly", priority: "0.8" },
  { path: "/wic", changefreq: "monthly", priority: "0.8" },
  { path: "/news", changefreq: "weekly", priority: "0.8" },
  { path: "/news/what-is-public-health-article-series", changefreq: "monthly", priority: "0.6" },
  { path: "/calendar", changefreq: "weekly", priority: "0.7" },
  { path: "/services", changefreq: "monthly", priority: "0.7" },
  { path: "/directory", changefreq: "monthly", priority: "0.6" },
  { path: "/search", changefreq: "monthly", priority: "0.4" },
  { path: "/sitemap", changefreq: "monthly", priority: "0.4" },
  { path: "/accessibility", changefreq: "yearly", priority: "0.3" },
  { path: "/wego", changefreq: "monthly", priority: "0.8" },
  { path: "/wego/about", changefreq: "monthly", priority: "0.6" },
  { path: "/wego/services", changefreq: "monthly", priority: "0.7" },
  { path: "/wego/schedule", changefreq: "weekly", priority: "0.8" },
  { path: "/wego/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/wego/contact", changefreq: "monthly", priority: "0.6" },
];

async function fetchPublishedNewsSlugs(): Promise<{ slug: string; updated: string }[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/posts?select=slug,published_at&published=eq.true&post_type=eq.news`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) {
      console.warn(`[sitemap] news fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as { slug: string; published_at: string }[];
    return rows
      .filter((r) => r.slug && r.slug !== "what-is-public-health-article-series")
      .map((r) => ({ slug: r.slug, updated: r.published_at }));
  } catch (err) {
    console.warn("[sitemap] news fetch error, continuing without dynamic news entries:", err);
    return [];
  }
}

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render(entries: Entry[]) {
  const urls = entries.map((e) => {
    const parts = [
      `  <url>`,
      `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ].filter(Boolean);
    return parts.join("\n");
  });
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
}

async function main() {
  const entries: Entry[] = [...staticEntries];

  for (const c of counties) {
    entries.push({ path: `/counties/${c.slug}`, changefreq: "monthly", priority: "0.7" });
  }
  for (const p of programs) {
    // /programs/home-visiting-program is a custom route, already included above.
    if (p.slug === "home-visiting-program") continue;
    entries.push({ path: `/programs/${p.slug}`, changefreq: "monthly", priority: "0.6" });
  }
  for (const e of ehSubpages) {
    entries.push({ path: `/environmental-health/${e.slug}`, changefreq: "monthly", priority: "0.6" });
  }
  for (const w of whSubpages) {
    entries.push({ path: `/womens-health/${w.slug}`, changefreq: "monthly", priority: "0.6" });
  }

  const news = await fetchPublishedNewsSlugs();
  for (const n of news) {
    entries.push({
      path: `/news/${n.slug}`,
      changefreq: "monthly",
      priority: "0.5",
      lastmod: n.updated ? n.updated.slice(0, 10) : undefined,
    });
  }

  // De-dupe by path (last one wins).
  const map = new Map<string, Entry>();
  for (const e of entries) map.set(e.path, e);
  const final = [...map.values()];

  writeFileSync(resolve("public/sitemap.xml"), render(final));
  console.log(`[sitemap] wrote public/sitemap.xml (${final.length} entries)`);
}

main();
