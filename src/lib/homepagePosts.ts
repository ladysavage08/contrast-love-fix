import type { Post } from "@/hooks/usePosts";
import { eventDateKey, eventEndKey } from "@/lib/eventDate";
import { easternNow } from "@/lib/eventOccurrences";

/** Configurable homepage-only recency window for news without an expiration. */
export const HOMEPAGE_NEWS_WINDOW_DAYS = 14;

const DAY_MS = 86_400_000;

function dayValue(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

function isUpcomingEvent(post: Post, today: string): boolean {
  if (post.post_type !== "event") return false;
  if (post.event_status) return post.event_status === "upcoming";
  const end = eventEndKey(post);
  return !!end && end >= today;
}

/** Homepage visibility only; this never archives or unpublishes a news post. */
export function isHomepageNewsEligible(
  post: Post,
  now: Date = new Date(),
): boolean {
  if (post.post_type === "event") return false;
  const today = easternNow(now).key;
  const expires = post.homepage_expires_on?.slice(0, 10);
  if (expires && today > expires) return false;
  if (post.homepage_featured) return true;

  const published = new Date(post.published_at);
  if (Number.isNaN(published.getTime())) return false;
  const publishedKey = easternNow(published).key;
  return dayValue(today) - dayValue(publishedKey) <= HOMEPAGE_NEWS_WINDOW_DAYS;
}

/**
 * Homepage Public Health News: soonest confirmed events lead, with only
 * current news mixed between them. If news is expired or stale, more upcoming
 * events fill its place. Past and undated events never enter this homepage list.
 */
export function selectHomepagePosts(
  posts: Post[],
  now: Date = new Date(),
  limit = 4,
): Post[] {
  const today = easternNow(now).key;
  const events = posts
    .filter((post) => isUpcomingEvent(post, today))
    .sort((a, b) => eventDateKey(a).localeCompare(eventDateKey(b)));
  const news = posts
    .filter((post) => isHomepageNewsEligible(post, now))
    .sort(
      (a, b) =>
        Number(b.homepage_featured) - Number(a.homepage_featured) ||
        b.published_at.localeCompare(a.published_at),
    );

  const mixed: Post[] = [];
  const rounds = Math.max(events.length, news.length);
  for (let index = 0; index < rounds; index++) {
    if (index < events.length) mixed.push(events[index]);
    if (index < news.length) mixed.push(news[index]);
  }
  return mixed.slice(0, limit);
}
