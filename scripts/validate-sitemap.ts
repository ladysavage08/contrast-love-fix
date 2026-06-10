/**
 * Validates public/sitemap.xml after generation.
 *
 * Checks performed:
 *  1. The file exists and is well-formed XML with the sitemap schema namespace.
 *  2. Each <url> has a single <loc> with a parseable absolute URL on BASE_URL.
 *  3. No duplicate <loc> values.
 *  4. Every path resolves against the React Router route table in src/App.tsx
 *     (static or dynamic `:slug`), so we never publish a sitemap entry that
 *     would land on the NotFound page.
 *  5. Admin / auth / catch-all routes are excluded from the sitemap.
 *  6. <changefreq> and <priority> values fall within spec.
 *
 * Exits non-zero on any failure so the build pipeline halts before deploy.
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const SITEMAP_PATH = resolve("public/sitemap.xml");
const APP_PATH = resolve("src/App.tsx");
const BASE_URL = "https://contrast-love-fix.lovable.app";

const VALID_CHANGEFREQ = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

const FORBIDDEN_PREFIXES = ["/admin", "/auth"];
const FORBIDDEN_EXACT = new Set(["*"]);

interface RoutePattern {
  /** Original path from <Route path="..." />. */
  raw: string;
  /** Regex that matches a concrete URL path. */
  regex: RegExp;
}

function fail(messages: string[]): never {
  console.error("\n[sitemap:validate] FAILED");
  for (const m of messages) console.error(" - " + m);
  console.error("");
  process.exit(1);
}

function extractRoutes(): RoutePattern[] {
  const src = readFileSync(APP_PATH, "utf8");
  const re = /<Route\s+path=\"([^\"]+)\"/g;
  const out: RoutePattern[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const raw = m[1];
    if (FORBIDDEN_EXACT.has(raw)) continue;
    // Translate React Router style ":param" to a single path segment regex.
    const pattern =
      "^" +
      raw
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/:[A-Za-z_][A-Za-z0-9_]*/g, "[^/]+") +
      "/?$";
    out.push({ raw, regex: new RegExp(pattern) });
  }
  return out;
}

function pathMatchesAnyRoute(path: string, routes: RoutePattern[]): boolean {
  return routes.some((r) => r.regex.test(path));
}

function main() {
  if (!existsSync(SITEMAP_PATH)) {
    fail([`public/sitemap.xml does not exist — run generate-sitemap first.`]);
  }

  const xml = readFileSync(SITEMAP_PATH, "utf8").trim();
  const errors: string[] = [];

  // 1. Basic XML / schema checks.
  if (!xml.startsWith("<?xml")) errors.push("Missing XML prolog (<?xml ...?>).");
  if (!/<urlset[^>]*xmlns=\"http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9\"/.test(xml)) {
    errors.push("<urlset> is missing the sitemap 0.9 xmlns declaration.");
  }
  if (!xml.endsWith("</urlset>")) errors.push("Sitemap does not close with </urlset>.");

  // Reject unescaped ampersands (very common breakage source).
  const badAmp = xml.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g);
  if (badAmp && badAmp.length > 0) {
    errors.push(`Found ${badAmp.length} unescaped '&' in URLs — must be '&amp;'.`);
  }

  // 2. Parse all <loc> values.
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const locs: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  if (locs.length === 0) errors.push("Sitemap contains no <loc> entries.");

  // 3. Duplicate detection.
  const seen = new Set<string>();
  for (const loc of locs) {
    if (seen.has(loc)) errors.push(`Duplicate <loc>: ${loc}`);
    seen.add(loc);
  }

  // 4. Each URL must be absolute on BASE_URL and resolve to a known route.
  const routes = extractRoutes();
  for (const loc of locs) {
    let u: URL;
    try {
      u = new URL(loc);
    } catch {
      errors.push(`Invalid URL in <loc>: ${loc}`);
      continue;
    }
    if (`${u.protocol}//${u.host}` !== BASE_URL) {
      errors.push(`URL not on BASE_URL (${BASE_URL}): ${loc}`);
    }
    const path = u.pathname || "/";

    for (const prefix of FORBIDDEN_PREFIXES) {
      if (path === prefix || path.startsWith(prefix + "/")) {
        errors.push(`Forbidden path in sitemap: ${path}`);
      }
    }

    if (!pathMatchesAnyRoute(path, routes)) {
      errors.push(`Path is not crawlable — no matching <Route> in App.tsx: ${path}`);
    }
  }

  // 5. <changefreq> values.
  const cfRegex = /<changefreq>([^<]+)<\/changefreq>/g;
  while ((match = cfRegex.exec(xml)) !== null) {
    const v = match[1].trim().toLowerCase();
    if (!VALID_CHANGEFREQ.has(v)) errors.push(`Invalid <changefreq>: ${v}`);
  }

  // 6. <priority> values must be 0.0–1.0.
  const prRegex = /<priority>([^<]+)<\/priority>/g;
  while ((match = prRegex.exec(xml)) !== null) {
    const n = Number(match[1].trim());
    if (Number.isNaN(n) || n < 0 || n > 1) {
      errors.push(`Invalid <priority> (must be 0.0–1.0): ${match[1]}`);
    }
  }

  if (errors.length > 0) fail(errors);

  console.log(
    `[sitemap:validate] OK — ${locs.length} URL${locs.length === 1 ? "" : "s"}, all crawlable and well-formed.`,
  );
}

main();
