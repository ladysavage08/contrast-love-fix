/**
 * Site-wide search index used by /search.
 *
 * Static entries are derived from the same data sources the routes use
 * (counties, programs, environmental health, women's health), so the index
 * stays in sync when content is added or removed. Dynamic news/event items
 * are merged in at runtime via fetchDynamicSearchEntries().
 */
import { counties } from "@/data/counties";
import { programs } from "@/data/programs";
import { ehSubpages } from "@/data/environmentalHealth";
import { whSubpages } from "@/data/womensHealth";
import { supabase } from "@/integrations/supabase/client";
import { cleanTitle } from "@/hooks/usePosts";

export interface SearchEntry {
  title: string;
  url: string;
  snippet: string;
  section: string;
}

const staticPages: SearchEntry[] = [
  { title: "Home", url: "/", snippet: "East Central Health District — public health services across 13 Georgia counties.", section: "Site" },
  { title: "About", url: "/about", snippet: "Mission, leadership, and the 13-county service area.", section: "Site" },
  { title: "Contact Us", url: "/contact", snippet: "Get in touch with the East Central Health District.", section: "Site" },
  { title: "Counties", url: "/counties", snippet: "County health department locations and contacts.", section: "Counties" },
  { title: "Programs", url: "/programs", snippet: "Public health programs offered across the district.", section: "Programs" },
  { title: "Home Visiting Program", url: "/programs/home-visiting-program", snippet: "Support for new and expecting families through in-home visits.", section: "Programs" },
  { title: "Environmental Health", url: "/environmental-health", snippet: "Inspections, permits, and environmental health programs.", section: "Environmental Health" },
  { title: "Women's Health", url: "/womens-health", snippet: "Women's health services and clinics across the district.", section: "Women's Health" },
  { title: "WIC", url: "/wic", snippet: "Women, Infants, and Children nutrition program.", section: "Site" },
  { title: "News", url: "/news", snippet: "District news and announcements.", section: "News" },
  { title: "Calendar", url: "/calendar", snippet: "Upcoming events, clinics, and community visits.", section: "Calendar" },
  { title: "Services", url: "/services", snippet: "Clinical and community health services.", section: "Site" },
  { title: "Directory", url: "/directory", snippet: "Staff and office directory.", section: "Site" },
  { title: "Accessibility", url: "/accessibility", snippet: "Accessibility statement and feedback.", section: "Site" },
  { title: "Mobile Health Clinic (WeGo)", url: "/wego", snippet: "The Mobile Health Clinic that brings services to neighborhoods.", section: "WeGo" },
  { title: "WeGo — About", url: "/wego/about", snippet: "About the Mobile Health Clinic program.", section: "WeGo" },
  { title: "WeGo — Services", url: "/wego/services", snippet: "Services available onboard the mobile clinic.", section: "WeGo" },
  { title: "WeGo — Schedule", url: "/wego/schedule", snippet: "Where the mobile clinic will be next.", section: "WeGo" },
  { title: "WeGo — FAQ", url: "/wego/faq", snippet: "Frequently asked questions about the mobile clinic.", section: "WeGo" },
  { title: "WeGo — Contact", url: "/wego/contact", snippet: "Request a visit or get in touch with the mobile clinic team.", section: "WeGo" },
  { title: "WeGo — Request the Mobile Unit for an Event", url: "/wego/special-event-request", snippet: "Submit a request to bring the Mobile Health Clinic to your community event.", section: "WeGo" },
];

function firstParagraph(text: string | null | undefined, max = 180): string {
  if (!text) return "";
  const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.length > max ? `${stripped.slice(0, max - 1)}…` : stripped;
}

export function getStaticSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [...staticPages];

  for (const c of counties) {
    entries.push({
      title: `${c.name} County`,
      url: `/counties/${c.slug}`,
      snippet: firstParagraph(c.intro) || `${c.healthDept ?? `${c.name} County Health Department`}.`,
      section: "Counties",
    });
  }

  for (const p of programs) {
    entries.push({
      title: p.title,
      url: `/programs/${p.slug}`,
      snippet: firstParagraph(p.summary),
      section: "Programs",
    });
  }

  for (const e of ehSubpages) {
    entries.push({
      title: e.title,
      url: `/environmental-health/${e.slug}`,
      snippet: firstParagraph(e.summary),
      section: "Environmental Health",
    });
  }

  for (const w of whSubpages) {
    entries.push({
      title: w.title,
      url: `/womens-health/${w.slug}`,
      snippet: firstParagraph(w.summary),
      section: "Women's Health",
    });
  }

  return entries;
}

export async function fetchDynamicSearchEntries(): Promise<SearchEntry[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("title, slug, excerpt, body, post_type, published, published_at")
    .eq("published", true);

  if (error || !data) return [];

  return data
    .filter((p) => p.slug && p.post_type === "news")
    .map((p) => ({
      title: cleanTitle(p.title) || p.title,
      url: `/news/${p.slug}`,
      snippet: firstParagraph(p.excerpt || p.body),
      section: "News",
    }));
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const title = entry.title.toLowerCase();
  const snippet = entry.snippet.toLowerCase();
  const url = entry.url.toLowerCase();

  let score = 0;
  if (title === q) score += 100;
  if (title.includes(q)) score += 40;
  if (snippet.includes(q)) score += 10;
  if (url.includes(q)) score += 5;

  const tokens = tokenize(q);
  for (const t of tokens) {
    if (t.length < 2) continue;
    if (title.includes(t)) score += 6;
    if (snippet.includes(t)) score += 2;
  }
  return score;
}

export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const q = query.trim();
  if (!q) return [];
  return entries
    .map((e) => ({ e, s: scoreEntry(e, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.e);
}
