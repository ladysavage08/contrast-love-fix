import type { Post } from "@/hooks/usePosts";
import { eventDateKey, eventEndKey, todayKey } from "@/lib/eventDate";

/**
 * Two orderings live here:
 *
 *  - `sortPostsChronologically` — newest → oldest. Used by the admin list,
 *    where staff want the most recent thing on top.
 *  - `sortPostsForPublicList` — what visitors see on the homepage "Public
 *    Health News" block and the News & Events page: upcoming events run
 *    soonest → farthest, news runs newest → oldest, and the two take turns so
 *    both kinds of item appear.
 *
 * Events are never placed by their publication date, and an event with no
 * confirmed date never rises to the top of a public list.
 */

/** Newest → oldest key: events by event_date, news by published_at. */
function chronologicKey(p: Post): string {
  if (p.post_type === "event") {
    // Never fall back to the publication date for an event.
    return (p.event_date ?? "").slice(0, 10);
  }
  return (p.published_at ?? "").slice(0, 10);
}

/**
 * Sort posts newest → oldest using the most relevant date for each post:
 *   - Events: use `event_date` (the resolved next confirmed date)
 *   - News:   use `published_at`
 *
 * Non-mutating — returns a new array.
 */
export function sortPostsChronologically(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => chronologicKey(b).localeCompare(chronologicKey(a)));
}

type Bucket = "upcoming" | "news" | "other";

/**
 * Which public-listing bucket a post belongs in.
 *
 * `resolveEvent` normally stamps `event_status` on every event before it gets
 * here; the date-based fallback keeps the list sane if it ever hasn't.
 */
function bucketOf(p: Post): Bucket {
  if (p.post_type !== "event") return "news";
  const status =
    p.event_status ??
    (() => {
      const end = eventEndKey(p);
      if (!end) return "undated" as const;
      return end < todayKey() ? ("past" as const) : ("upcoming" as const);
    })();
  return status === "upcoming" ? "upcoming" : "other";
}

/**
 * The order visitors see: nearest event first, then the newest article, then
 * the next event, and so on. Events run soonest → farthest; articles run
 * newest → oldest. Ended events and events with no confirmed date go last.
 *
 * Non-mutating — returns a new array.
 */
export function sortPostsForPublicList(posts: Post[]): Post[] {
  const upcoming: Post[] = [];
  const news: Post[] = [];
  const last: Post[] = [];

  for (const p of posts) {
    const bucket = bucketOf(p);
    if (bucket === "upcoming") upcoming.push(p);
    else if (bucket === "news") news.push(p);
    else last.push(p);
  }

  // Soonest → farthest.
  upcoming.sort((a, b) => eventDateKey(a).localeCompare(eventDateKey(b)));
  // Newest → oldest.
  news.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
  last.sort((a, b) => chronologicKey(b).localeCompare(chronologicKey(a)));

  const interleaved: Post[] = [];
  const rounds = Math.max(upcoming.length, news.length);
  for (let i = 0; i < rounds; i++) {
    if (i < upcoming.length) interleaved.push(upcoming[i]);
    if (i < news.length) interleaved.push(news[i]);
  }

  return [...interleaved, ...last];
}
