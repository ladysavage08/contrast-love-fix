import type { Post } from "@/hooks/usePosts";

/**
 * Sort posts newest → oldest using the most relevant date for each post:
 *   - Events: use `event_date` (fall back to `published_at`)
 *   - News:   use `published_at`
 *
 * Non-mutating — returns a new array.
 */
export function sortPostsChronologically(posts: Post[]): Post[] {
  const key = (p: Post) => {
    if (p.post_type === "event") {
      return (p.event_date ?? p.published_at ?? "").slice(0, 10);
    }
    return (p.published_at ?? "").slice(0, 10);
  };

  return [...posts].sort((a, b) => key(b).localeCompare(key(a)));
}
