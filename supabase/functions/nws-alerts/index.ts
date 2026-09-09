import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

/**
 * Proxies active National Weather Service alerts for Georgia and filters them
 * down to the 13 East Central Health District counties.
 *
 * - No API key required by NWS; a descriptive User-Agent is required.
 * - Results are cached in memory for ~5 minutes.
 * - The last successful payload is kept and served (flagged as stale) if NWS
 *   is temporarily unavailable.
 */

const NWS_URL = "https://api.weather.gov/alerts/active?area=GA";
const USER_AGENT =
  "EastCentralHealthDistrict-Website (ecphd.com, webmaster@ecphd.com)";
const CACHE_MS = 5 * 60 * 1000;

/** County name -> SAME (FIPS) code for the 13 district counties. */
const DISTRICT_COUNTIES: Record<string, string> = {
  Burke: "013033",
  Columbia: "013073",
  Emanuel: "013107",
  Glascock: "013125",
  Jefferson: "013163",
  Jenkins: "013165",
  Lincoln: "013181",
  McDuffie: "013189",
  Richmond: "013245",
  Screven: "013251",
  Taliaferro: "013265",
  Warren: "013301",
  Wilkes: "013317",
};

const SAME_TO_COUNTY = new Map(
  Object.entries(DISTRICT_COUNTIES).map(([name, code]) => [code, name]),
);

const SEVERITY_RANK: Record<string, number> = {
  Extreme: 0,
  Severe: 1,
  Moderate: 2,
  Minor: 3,
  Unknown: 4,
};
const URGENCY_RANK: Record<string, number> = {
  Immediate: 0,
  Expected: 1,
  Future: 2,
  Past: 3,
  Unknown: 4,
};

type Alert = {
  id: string;
  event: string;
  severity: string;
  urgency: string;
  certainty: string;
  counties: string[];
  areaDesc: string;
  effective: string | null;
  expires: string | null;
  headline: string;
  description: string;
  instruction: string;
  url: string;
};

type Payload = {
  alerts: Alert[];
  updatedAt: string;
  stale: boolean;
};

let cache: { data: Payload; fetchedAt: number } | null = null;

/** Strip any markup/control characters from NWS-supplied text. */
function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 4000);
}

function matchedCounties(props: Record<string, any>): string[] {
  const found = new Set<string>();

  const same: string[] = props?.geocode?.SAME ?? [];
  for (const code of same) {
    const name = SAME_TO_COUNTY.get(String(code));
    if (name) found.add(name);
  }

  // Zone-based alerts carry no county SAME codes; fall back to the area text,
  // but only for alerts that actually cover Georgia zones/counties, and only
  // for area parts that are Georgia (unlabeled or ", GA"). This avoids
  // matching same-named counties in other states, e.g. "Jefferson, FL".
  const ugc: string[] = props?.geocode?.UGC ?? [];
  const coversGeorgia =
    ugc.some((code) => String(code).startsWith("GA")) ||
    same.some((code) => String(code).startsWith("013"));

  if (coversGeorgia) {
    const parts = String(props?.areaDesc ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter((part) => !/,\s*[A-Z]{2}$/.test(part) || /,\s*GA$/.test(part))
      .map((part) => part.replace(/,\s*GA$/, ""));

    for (const name of Object.keys(DISTRICT_COUNTIES)) {
      // Exact part match: Georgia forecast zones for these counties are named
      // for the county itself, so this avoids "Northern Columbia" (Florida).
      if (parts.some((part) => part.toLowerCase() === name.toLowerCase())) {
        found.add(name);
      }
    }
  }


  return [...found].sort((a, b) => a.localeCompare(b));
}

function toAlert(feature: Record<string, any>): Alert | null {
  const p = feature?.properties ?? {};
  const counties = matchedCounties(p);
  if (counties.length === 0) return null;

  const rawUrl = typeof p.id === "string" ? p.id : "";
  const url = rawUrl.startsWith("https://api.weather.gov/alerts/")
    ? `https://alerts.weather.gov/search?id=${encodeURIComponent(
        rawUrl.split("/").pop() ?? "",
      )}`
    : "https://alerts.weather.gov/";

  return {
    id: clean(p.id) || crypto.randomUUID(),
    event: clean(p.event) || "Weather Alert",
    severity: clean(p.severity) || "Unknown",
    urgency: clean(p.urgency) || "Unknown",
    certainty: clean(p.certainty) || "Unknown",
    counties,
    areaDesc: clean(p.areaDesc),
    effective: typeof p.effective === "string" ? p.effective : null,
    expires: typeof p.expires === "string" ? p.expires : (p.ends ?? null),
    headline: clean(p.headline),
    description: clean(p.description),
    instruction: clean(p.instruction),
    url,
  };
}

function sortAlerts(a: Alert, b: Alert): number {
  const s = (SEVERITY_RANK[a.severity] ?? 4) - (SEVERITY_RANK[b.severity] ?? 4);
  if (s !== 0) return s;
  const u = (URGENCY_RANK[a.urgency] ?? 4) - (URGENCY_RANK[b.urgency] ?? 4);
  if (u !== 0) return u;
  return (a.effective ?? "").localeCompare(b.effective ?? "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_MS) {
    return new Response(JSON.stringify(cache.data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  }

  try {
    const res = await fetch(NWS_URL, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/geo+json" },
    });
    if (!res.ok) throw new Error(`NWS responded ${res.status}`);
    const json = await res.json();
    const features: any[] = Array.isArray(json?.features) ? json.features : [];

    const alerts = features
      .map(toAlert)
      .filter((a): a is Alert => a !== null)
      .sort(sortAlerts);

    const data: Payload = {
      alerts,
      updatedAt: new Date().toISOString(),
      stale: false,
    };
    cache = { data, fetchedAt: now };

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("nws-alerts fetch failed:", error);
    if (cache) {
      const stalePayload: Payload = { ...cache.data, stale: true };
      return new Response(JSON.stringify(stalePayload), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: "National Weather Service data is unavailable." }),
      {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
