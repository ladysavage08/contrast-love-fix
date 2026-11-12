import type { Post } from "@/hooks/usePosts";

/**
 * Sort posts newest → oldest using the most relevant date for each post:
 *   - Events: use `event_date` (the resolved next confirmed date)
 *   - News:   use `published_at`
 *
 * Non-mutating — returns a new array.
 */
export function sortPostsChronologically(posts: Post[]): Post[] {
  const key = (p: Post) => {
    if (p.post_type === "event") {
      // Never fall back to the publication date for an event.
      return (p.event_date ?? "").slice(0, 10);
    }
    return (p.published_at ?? "").slice(0, 10);
  };

  return [...posts].sort((a, b) => key(b).localeCompare(key(a)));
}
