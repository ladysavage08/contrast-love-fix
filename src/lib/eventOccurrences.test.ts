import { describe, it, expect } from "vitest";
import { resolveEvent, formatEventDateLabel, isOccurrenceOver } from "./eventOccurrences";
import { sortPostsChronologically } from "./sortPosts";

const base = { post_type: "event", event_date: null, event_end_date: null, event_time: null } as const;
const sundays = ["2026-11-01", "2026-11-08", "2026-11-15", "2026-11-22"].map((d) => ({
  id: d, event_date: d, event_time: "10:30 AM – 12:30 PM",
}));
// Eastern times (November = EST, UTC-5)
const at = (iso: string) => new Date(iso);

describe("event occurrences", () => {
  it("shows the next confirmed date, not the publication date", () => {
    const r = resolveEvent({ ...base, published_at: "2026-10-30" }, sundays, at("2026-11-12T16:00:00-05:00"));
    expect(r.event_date).toBe("2026-11-15");
    expect(formatEventDateLabel(r.event_date, r.event_end_date)).toBe("Sunday, November 15, 2026");
  });

  it("stays active until 12:30 PM Eastern, then rolls to the next date", () => {
    expect(resolveEvent(base, sundays, at("2026-11-15T12:29:00-05:00")).event_date).toBe("2026-11-15");
    expect(resolveEvent(base, sundays, at("2026-11-15T12:31:00-05:00")).event_date).toBe("2026-11-22");
  });

  it("skips a canceled date but keeps it in history", () => {
    const rows = sundays.map((o) => (o.event_date === "2026-11-15" ? { ...o, cancelled: true } : o));
    const r = resolveEvent(base, rows, at("2026-11-12T16:00:00-05:00"));
    expect(r.event_date).toBe("2026-11-22");
    expect(r.occurrences.some((o) => o.cancelled)).toBe(true);
  });

  it("archives once the last date has ended", () => {
    expect(resolveEvent(base, sundays, at("2026-11-22T12:31:00-05:00")).event_status).toBe("past");
  });

  it("no time means active through 11:59 PM Eastern", () => {
    const o = { event_date: "2026-11-15" };
    expect(isOccurrenceOver(o, at("2026-11-15T23:58:00-05:00"))).toBe(false);
    expect(isOccurrenceOver(o, at("2026-11-16T00:00:30-05:00"))).toBe(true);
  });

  it("multi-day uses the final day", () => {
    const o = { event_date: "2026-11-14", end_date: "2026-11-16" };
    expect(isOccurrenceOver(o, at("2026-11-16T20:00:00-05:00"))).toBe(false);
    expect(formatEventDateLabel("2026-11-14", "2026-11-16")).toBe("November 14–16, 2026");
  });

  it("an event with no confirmed date shows no date and is undated", () => {
    const r = resolveEvent({ ...base, published_at: "2026-10-30" }, [], at("2026-11-12T16:00:00-05:00"));
    expect(r.event_date).toBeNull();
    expect(r.event_status).toBe("undated");
  });

  it("uses the location for the date on display", () => {
    const rows = [
      { id: "a", event_date: "2026-11-15", location: "Arena" },
      { id: "b", event_date: "2026-11-22", location: "May Park" },
    ];
    expect(resolveEvent({ ...base, event_location: "Main" }, rows, at("2026-11-16T09:00:00-05:00")).event_location).toBe("May Park");
  });

  it("single-date events (e.g. Mobile Clinic) keep their own date and time", () => {
    const r = resolveEvent({ ...base, event_date: "2026-11-17", event_time: "9:00 AM – 12:00 PM" }, [], at("2026-11-12T16:00:00-05:00"));
    expect(r.event_date).toBe("2026-11-17");
    expect(r.event_time).toBe("9:00 AM – 12:00 PM");
  });

  it("news is never treated as an expiring event", () => {
    const r = resolveEvent({ post_type: "news", event_date: null, event_end_date: null, event_time: null }, [], at("2030-01-01T00:00:00Z"));
    expect(r.event_status).not.toBe("past");
  });

  it("sorting never uses published_at for events", () => {
    const sorted = sortPostsChronologically([
      { post_type: "event", event_date: null, published_at: "2099-01-01T00:00:00Z", id: "x" },
      { post_type: "event", event_date: "2026-11-15", published_at: "2026-10-30T00:00:00Z", id: "y" },
    ] as never);
    expect(sorted[0].id).toBe("y");
  });
});
