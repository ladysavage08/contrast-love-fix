import { describe, expect, it } from "vitest";
import { sortPostsChronologically, sortPostsForPublicList } from "./sortPosts";

/**
 * Ordering rules for the public listings (homepage "Public Health News" block
 * and the News & Events page). Dates below are the ones an admin confirmed;
 * nothing here is generated from a pattern.
 */

type Fix = {
  id: string;
  post_type: "event" | "news";
  event_date?: string | null;
  event_end_date?: string | null;
  event_status?: "upcoming" | "past" | "undated";
  published_at?: string;
};

const event = (
  id: string,
  eventDate: string | null,
  status: "upcoming" | "past" | "undated",
  publishedAt = "2026-10-01T00:00:00Z",
): Fix => ({
  id,
  post_type: "event",
  event_date: eventDate,
  event_end_date: eventDate,
  event_status: status,
  published_at: publishedAt,
});

const news = (id: string, publishedAt: string): Fix => ({
  id,
  post_type: "news",
  event_date: null,
  published_at: publishedAt,
});

const ids = (posts: Fix[]) => posts.map((p) => p.id);

describe("sortPostsForPublicList", () => {
  it("lists upcoming events soonest first, farthest last", () => {
    const sorted = sortPostsForPublicList([
      event("dec-10", "2026-12-10", "upcoming"),
      event("nov-13", "2026-11-13", "upcoming"),
      event("nov-20", "2026-11-20", "upcoming"),
    ] as never);
    expect(ids(sorted)).toEqual(["nov-13", "nov-20", "dec-10"]);
  });

  it("keeps news newest first", () => {
    const sorted = sortPostsForPublicList([
      news("oct-01", "2026-10-01T00:00:00Z"),
      news("nov-12", "2026-11-12T00:00:00Z"),
      news("nov-10", "2026-11-10T00:00:00Z"),
    ] as never);
    expect(ids(sorted)).toEqual(["nov-12", "nov-10", "oct-01"]);
  });

  it("alternates nearest event and newest article, starting with the event", () => {
    const sorted = sortPostsForPublicList([
      news("news-new", "2026-11-12T00:00:00Z"),
      event("ev-far", "2026-11-20", "upcoming"),
      news("news-old", "2026-11-10T00:00:00Z"),
      event("ev-near", "2026-11-13", "upcoming"),
    ] as never);
    expect(ids(sorted)).toEqual(["ev-near", "news-new", "ev-far", "news-old"]);
  });

  it("does not put ended events above upcoming ones", () => {
    const sorted = sortPostsForPublicList([
      event("oct-30", "2026-10-30", "past"),
      event("nov-15", "2026-11-15", "upcoming"),
      news("nov-12", "2026-11-12T00:00:00Z"),
    ] as never);
    expect(ids(sorted)).toEqual(["nov-15", "nov-12", "oct-30"]);
  });

  it("keeps an event with no confirmed date out of the top", () => {
    const sorted = sortPostsForPublicList([
      event("no-date", null, "undated"),
      event("nov-15", "2026-11-15", "upcoming"),
      news("nov-12", "2026-11-12T00:00:00Z"),
    ] as never);
    expect(ids(sorted)).toEqual(["nov-15", "nov-12", "no-date"]);
  });

  it("never uses published_at to place an event", () => {
    const sorted = sortPostsForPublicList([
      event("far-but-fresh", "2026-12-10", "upcoming", "2099-01-01T00:00:00Z"),
      event("near-but-old", "2026-11-15", "upcoming", "2026-01-01T00:00:00Z"),
    ] as never);
    expect(ids(sorted)).toEqual(["near-but-old", "far-but-fresh"]);
  });

  it("shows only news when there are no upcoming events", () => {
    const sorted = sortPostsForPublicList([
      news("nov-12", "2026-11-12T00:00:00Z"),
      event("oct-30", "2026-10-30", "past"),
      news("nov-10", "2026-11-10T00:00:00Z"),
    ] as never);
    expect(ids(sorted)).toEqual(["nov-12", "nov-10", "oct-30"]);
  });
});

describe("sortPostsChronologically (admin list)", () => {
  it("stays newest to oldest", () => {
    const sorted = sortPostsChronologically([
      event("nov-13", "2026-11-13", "upcoming"),
      event("dec-10", "2026-12-10", "upcoming"),
    ] as never);
    expect(ids(sorted)).toEqual(["dec-10", "nov-13"]);
  });
});
