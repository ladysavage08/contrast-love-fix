import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  featured_image_url: string | null;
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

export function usePosts(limit?: number) {
  return useQuery({
    queryKey: ["posts", limit ?? "all"],
    queryFn: async (): Promise<Post[]> => {
      let q = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Post[];
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
