import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  slug: string;
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
  event_time: string | null;
  event_location: string | null;
  event_link: string | null;
  cta_label: string | null;
  cta_url: string | null;
};

import { sortPostsChronologically } from "@/lib/sortPosts";

export function usePosts(limit?: number) {
  return useQuery({
    queryKey: ["posts", limit ?? "all"],
    queryFn: async (): Promise<Post[]> => {
      // Fetch all published posts; sort client-side so events use event_date
      // and news uses published_at (see sortPostsChronologically).
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true);
      if (error) throw error;
      const sorted = sortPostsChronologically((data ?? []) as Post[]);
      return limit ? sorted.slice(0, limit) : sorted;
    },
  });
}

export function useEvents(opts?: { upcomingOnly?: boolean; limit?: number }) {
  const { upcomingOnly = true, limit } = opts ?? {};
  return useQuery({
    queryKey: ["events", upcomingOnly, limit ?? "all"],
    queryFn: async (): Promise<Post[]> => {
      // Fetch ALL published events. We sort & filter client-side so that events
      // missing event_date (admin/mobile-app entries that only set published_at)
      // still appear on the website calendar.
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .eq("post_type", "event");
      if (error) throw error;
      const all = (data ?? []) as Post[];

      // Effective date used for sorting & filtering: event_date if present,
      // otherwise the published_at date portion.
      const effective = (e: Post) =>
        (e.event_date ?? e.published_at ?? "").slice(0, 10);

      let list = [...all].sort((a, b) => {
        const ea = effective(a);
        const eb = effective(b);
        return ea < eb ? -1 : ea > eb ? 1 : 0;
      });

      if (upcomingOnly) {
        const today = new Date().toISOString().slice(0, 10);
        list = list.filter((e) => effective(e) >= today);
      }
      if (limit) list = list.slice(0, limit);
      return list;
    },
  });
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: ["post", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as Post) ?? null;
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
