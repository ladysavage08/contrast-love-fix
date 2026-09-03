import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BohRecording = {
  id: string;
  county_slug: string;
  meeting_date: string;
  title: string | null;
  recording_url: string;
  platform: string;
  notes: string | null;
  duration: string | null;
  published: boolean;
  archived: boolean;
};

export const RECORDING_PLATFORMS = [
  "YouTube",
  "Vimeo",
  "Microsoft Stream",
  "Webex",
  "Zoom",
  "Other",
] as const;

/** Friendly platform label, inferred from the URL when not explicitly set. */
export function platformLabel(rec: Pick<BohRecording, "platform" | "recording_url">): string {
  if (rec.platform && rec.platform.toLowerCase() !== "other") return rec.platform;
  const u = rec.recording_url.toLowerCase();
  if (u.includes("youtu")) return "YouTube";
  if (u.includes("vimeo")) return "Vimeo";
  if (u.includes("microsoftstream") || u.includes("sharepoint") || u.includes("stream.microsoft"))
    return "Microsoft Stream";
  if (u.includes("webex")) return "Webex";
  if (u.includes("zoom")) return "Zoom";
  return "External site";
}

/** Format an ISO date (YYYY-MM-DD) as "March 12, 2026" without UTC shift. */
export function formatMeetingDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Published, non-archived recordings for one county, newest first. */
export function useBohRecordings(countySlug: string | undefined) {
  return useQuery({
    queryKey: ["boh-recordings", countySlug],
    enabled: !!countySlug,
    queryFn: async (): Promise<BohRecording[]> => {
      const { data, error } = await supabase
        .from("boh_recordings")
        .select("*")
        .eq("county_slug", countySlug!)
        .eq("published", true)
        .eq("archived", false)
        .order("meeting_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as BohRecording[];
    },
  });
}

/** Group recordings by calendar year, newest year first. */
export function groupByYear(recs: BohRecording[]): Array<{ year: string; items: BohRecording[] }> {
  const map = new Map<string, BohRecording[]>();
  for (const r of recs) {
    const year = r.meeting_date.slice(0, 4);
    map.set(year, [...(map.get(year) ?? []), r]);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({
      year,
      items: items.sort((a, b) => b.meeting_date.localeCompare(a.meeting_date)),
    }));
}
