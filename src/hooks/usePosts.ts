import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  slug: string;
  author_name: string | null;
  publication_name: string | null;
  article_page_reference: string | null;
  external_publication_url: string | null;
  download_file_type: string | null;
  download_page_count: number | null;
  download_url: string | null;
  excerpt: string | null;
  body: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  featured_image_decorative: boolean;
  post_type: "news" | "event";
  category: string | null;
  published: boolean;
  published_at: string;
  event_date: string | null;
  event_end_date: string | null;
  event_time: string | null;
  event_location: string | null;
  event_link: string | null;
  cta_label: string | null;
  cta_url: string | null;
  cancelled: boolean;
  cancellation_note: string | null;
  cancelled_at: string | null;
} & Partial<ResolvedFields>;

import { sortPostsForPublicList } from "@/lib/sortPosts";
import {
  resolveEvent,
  type OccurrenceRow,
  type ResolvedFields,
} from "@/lib/eventOccurrences";

/** Listings re-check every minute so dates roll over without a refresh. */
const ROLLOVER_MS = 60_000;

/** Fetch confirmed occurrence rows for the given event posts, grouped by post. */
async function fetchOccurrences(postIds: string[]): Promise<Map<string, OccurrenceRow[]>> {
  const map = new Map<string, OccurrenceRow[]>();
  if (!postIds.length) return map;
  const { data, error } = await supabase
    .from("post_event_dates")
    .select("*")
    .in("post_id", postIds);
  // The table is additive; if it can't be read, fall back to each post's own date.
  if (error) return map;
  for (const r of (data ?? []) as OccurrenceRow[]) {
    const list = map.get(r.post_id!) ?? [];
    list.push(r);
    map.set(r.post_id!, list);
  }
  return map;
}

async function resolveAll(posts: Post[]): Promise<Post[]> {
  const occ = await fetchOccurrences(posts.filter((p) => p.post_type === "event").map((p) => p.id));
  const now = new Date();
  return posts.map((p) => resolveEvent(p, occ.get(p.id) ?? [], now) as Post);
}

// Strip common markdown formatting (bold/italic/code) from a title so that
// admin-entered titles like "**Measles Update**" render cleanly on the site.
export function cleanTitle(title: string): string {
  if (!title) return title;
  return title
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, "$1")
    .replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function sanitizePost<T extends { title: string }>(p: T): T {
  return { ...p, title: cleanTitle(p.title) };
}

export function usePosts(limit?: number) {
  return useQuery({
    queryKey: ["posts", limit ?? "all"],
    queryFn: async (): Promise<Post[]> => {
      // Fetch all published posts; sort client-side so upcoming events run
      // soonest → farthest, news runs newest → oldest, and the two alternate
      // (see sortPostsForPublicList).
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true);
      if (error) throw error;
      // Hide cancelled posts from generic news/event lists, and hide events
      // that have no confirmed date (never substitute the publication date).
      // (The Calendar page opts in via useEvents({ includeCancelled: true }).)
      const resolved = await resolveAll((data ?? []) as Post[]);
      const visible = resolved.filter(
        (p) => !p.cancelled && !(p.post_type === "event" && p.event_status === "undated"),
      );
      const sorted = sortPostsForPublicList(visible).map(sanitizePost);
      return limit ? sorted.slice(0, limit) : sorted;
    },
    refetchInterval: ROLLOVER_MS,
  });
}

export function useEvents(opts?: {
  upcomingOnly?: boolean;
  limit?: number;
  includeCancelled?: boolean;
  /** One entry per confirmed occurrence (Calendar grid). */
  expand?: boolean;
}) {
  const { upcomingOnly = true, limit, includeCancelled = false, expand = false } = opts ?? {};
  return useQuery({
    queryKey: ["events", upcomingOnly, limit ?? "all", includeCancelled, expand],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .eq("post_type", "event");
      if (error) throw error;
      const resolved = (await resolveAll((data ?? []) as Post[])).filter(
        (e) => includeCancelled || !e.cancelled,
      );

      let list: Post[] = resolved;
      if (expand) {
        list = resolved.flatMap((e) =>
          (e.occurrences ?? []).length > 1 || (e.occurrences?.[0] && "id" in e.occurrences[0])
            ? (e.occurrences ?? [])
                .filter((o) => includeCancelled || !o.cancelled)
                .map((o) => ({
                  ...(resolveEvent(e, [o]) as Post),
                  id: `${e.id}__${o.event_date}${o.id ? `__${o.id}` : ""}`,
                  cancelled: e.cancelled || !!o.cancelled,
                  cancellation_note: o.cancelled ? o.cancellation_note ?? null : e.cancellation_note,
                }))
            : e.event_date
              ? [e]
              : [],
        );
      }

      list = [...list].sort((a, b) => {
        const ea = a.event_date ?? "9999";
        const eb = b.event_date ?? "9999";
        return ea < eb ? -1 : ea > eb ? 1 : 0;
      });

      // Upcoming = has a confirmed date whose Eastern end time hasn't passed.
      if (upcomingOnly) list = list.filter((e) => e.event_status === "upcoming");
      if (limit) list = list.slice(0, limit);
      return list.map(sanitizePost);
    },
    refetchInterval: ROLLOVER_MS,
  });
}

export type PostLookup = Post | { redirectTo: string } | null;

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ["post", slug],
    enabled: !!slug,
    queryFn: async (): Promise<PostLookup> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        // A merged/renamed post keeps working via its redirect.
        const { data: r } = await supabase
          .from("post_slug_redirects")
          .select("new_slug")
          .eq("old_slug", slug!)
          .maybeSingle();
        return r?.new_slug && r.new_slug !== slug ? { redirectTo: r.new_slug } : null;
      }
      const [resolved] = await resolveAll([data as Post]);
      return sanitizePost(resolved);
    },
    refetchInterval: ROLLOVER_MS,
  });
}

export function usePostsByCategory(category: string) {
  return useQuery({
    queryKey: ["posts", "category", category],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .eq("category", category)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return ((data ?? []) as Post[]).map(sanitizePost);
    },
  });
}

export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
