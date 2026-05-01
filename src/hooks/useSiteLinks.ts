import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteLink {
  id: string;
  slug: string;
  label: string;
  url: string;
  location: string | null;
  active: boolean;
  notes: string | null;
  updated_at: string;
}

type LinksMap = Record<string, SiteLink>;

let cache: LinksMap | null = null;
let inflight: Promise<LinksMap> | null = null;
const subscribers = new Set<(map: LinksMap) => void>();
let channelStarted = false;

async function fetchAll(): Promise<LinksMap> {
  const { data, error } = await supabase
    .from("site_links")
    .select("id, slug, label, url, location, active, notes, updated_at")
    .eq("active", true);
  if (error || !data) return {};
  const map: LinksMap = {};
  for (const row of data) map[row.slug] = row as SiteLink;
  return map;
}

function notify(map: LinksMap) {
  cache = map;
  for (const cb of subscribers) cb(map);
}

function ensureRealtime() {
  if (channelStarted) return;
  channelStarted = true;
  supabase
    .channel("site_links_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_links" },
      async () => {
        const next = await fetchAll();
        notify(next);
      },
    )
    .subscribe();
}

/**
 * Read-only hook returning the currently-active site_links keyed by slug.
 * Backed by an in-memory cache + realtime subscription so any admin edit
 * is reflected on the live site within seconds without a reload.
 */
export function useSiteLinks() {
  const [map, setMap] = useState<LinksMap>(cache ?? {});
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    let mounted = true;
    const cb = (m: LinksMap) => {
      if (mounted) setMap(m);
    };
    subscribers.add(cb);
    ensureRealtime();

    if (cache === null) {
      if (!inflight) inflight = fetchAll();
      inflight
        .then((m) => {
          inflight = null;
          notify(m);
          if (mounted) setLoading(false);
        })
        .catch(() => {
          inflight = null;
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
      subscribers.delete(cb);
    };
  }, []);

  return { links: map, loading };
}

/**
 * Convenience: resolve a single slug, with default fallback.
 * Returns the configured link if present and active; otherwise the defaults.
 */
export function useSiteLink(
  slug: string,
  defaults: { url: string; label?: string },
): { url: string; label: string; isManaged: boolean } {
  const { links } = useSiteLinks();
  const managed = links[slug];
  if (managed) {
    return { url: managed.url, label: managed.label, isManaged: true };
  }
  return { url: defaults.url, label: defaults.label ?? "", isManaged: false };
}
