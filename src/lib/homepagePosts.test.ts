import { describe, expect, it } from "vitest";
import { isHomepageNewsEligible, selectHomepagePosts } from "./homepagePosts";

const NOW = new Date("2026-11-13T20:28:00Z"); // November 13 in America/New_York

type Fixture = {
  id: string;
  post_type: "event" | "news";
  event_date?: string | null;
  event_end_date?: string | null;
  event_status?: "upcoming" | "past" | "undated";
  published_at: string;
  homepage_expires_on?: string | null;
  homepage_featured?: boolean;
};

const event = (
  id: string,
  date: string | null,
  status: "upcoming" | "past" | "undated" = "upcoming",
  publishedAt = "2026-10-30T19:05:00Z",
): Fixture => ({
  id,
  post_type: "event",
  event_date: date,
  event_end_date: date,
  event_status: status,
  published_at: publishedAt,
  homepage_expires_on: null,
  homepage_featured: false,
});

const news = (
  id: string,
  publishedAt: string,
  expires: string | null = null,
  featured = false,
): Fixture => ({
  id,
  post_type: "news",
  event_date: null,
  published_at: publishedAt,
  homepage_expires_on: expires,
  homepage_featured: featured,
});

const ids = (posts: Fixture[]) => posts.map((post) => post.id);

describe("selectHomepagePosts", () => {
  it("uses the actual next confirmed event date, soonest first", () => {
    const selected = selectHomepagePosts([
      event("diaper-nov-16", "2026-11-16"),
      event("compass-nov-15", "2026-11-15"),
      event("fresh-but-later", "2026-11-22", "upcoming", "2026-11-13T12:00:00Z"),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["compass-nov-15", "diaper-nov-16", "fresh-but-later"]);
  });

  it("fills the homepage with upcoming events when the existing news is expired", () => {
    const selected = selectHomepagePosts([
      news("mobile-cancellation", "2026-11-03T13:44:40Z", "2026-11-03"),
      event("compass-nov-15", "2026-11-15"),
      news("office-closure", "2026-10-08T12:00:00Z", "2026-10-12"),
      event("diaper-nov-16", "2026-11-16"),
      event("next-nov-22", "2026-11-22"),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["compass-nov-15", "diaper-nov-16", "next-nov-22"]);
  });

  it("mixes newly published relevant news between upcoming events", () => {
    const selected = selectHomepagePosts([
      event("compass-nov-15", "2026-11-15"),
      news("current-announcement", "2026-11-13T12:00:00Z"),
      event("diaper-nov-16", "2026-11-16"),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["compass-nov-15", "current-announcement", "diaper-nov-16"]);
  });

  it("keeps past and undated events out of the homepage list", () => {
    const selected = selectHomepagePosts([
      event("past", "2026-11-12", "past"),
      event("undated", null, "undated"),
      event("next", "2026-11-15"),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["next"]);
  });

  it("keeps a manually featured older announcement eligible", () => {
    const selected = selectHomepagePosts([
      event("next", "2026-11-15"),
      news("featured-important", "2026-09-01T12:00:00Z", null, true),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["next", "featured-important"]);
  });

  it("does not let featuring override an explicit expiration", () => {
    const selected = selectHomepagePosts([
      event("next", "2026-11-15"),
      news("expired-featured", "2026-11-01T12:00:00Z", "2026-11-03", true),
    ] as never, NOW);
    expect(ids(selected)).toEqual(["next"]);
  });
});

describe("homepage news recency and expiration", () => {
  it("includes news published 14 days ago and excludes news published 15 days ago", () => {
    expect(isHomepageNewsEligible(news("fourteen", "2026-10-30T12:00:00Z") as never, NOW)).toBe(true);
    expect(isHomepageNewsEligible(news("fifteen", "2026-10-29T12:00:00Z") as never, NOW)).toBe(false);
  });

  it("keeps news visible through its expiration day in Eastern Time", () => {
    const post = news("expires-nov-3", "2026-11-01T12:00:00Z", "2026-11-03");
    expect(isHomepageNewsEligible(post as never, new Date("2026-11-04T04:59:00Z"))).toBe(true);
    expect(isHomepageNewsEligible(post as never, new Date("2026-11-04T05:00:00Z"))).toBe(false);
  });
});
