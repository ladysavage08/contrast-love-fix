import type { Post } from "@/hooks/usePosts";

/**
 * Sort posts so that:
 *  - Events are ordered by their event_date (earliest upcoming first,
 *    then past events oldest-first at the bottom).
 *  - News posts are ordered by published_at (newest first).
 *  - Events appear before news within the same effective time bucket
 *    (upcoming events first, then news, then past events last).
 *
 * Non-mutating — returns a new array.
 */
export function sortPostsChronologically(posts: Post[]): Post[] {
  const today = new Date().toISOString().slice(0, 10);

  const events: Post[] = [];
  const news: Post[] = [];
  for (const p of posts) {
    if (p.post_type === "event") events.push(p);
    else news.push(p);
  }

  const eventKey = (e: Post) =>
    (e.event_date ?? e.published_at ?? "").slice(0, 10);

  const upcoming = events
    .filter((e) => eventKey(e) >= today)
    .sort((a, b) => eventKey(a).localeCompare(eventKey(b))); // earliest first

  const past = events
    .filter((e) => eventKey(e) < today)
    .sort((a, b) => eventKey(b).localeCompare(eventKey(a))); // newest past first

  const newsSorted = [...news].sort((a, b) =>
    (b.published_at ?? "").localeCompare(a.published_at ?? "")
  );

  return [...upcoming, ...newsSorted, ...past];
}
