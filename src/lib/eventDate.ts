/**
 * Shared date helpers for the events calendar.
 *
 * The backend stores two date-ish fields on `posts`:
 *   - `event_date`    -> "YYYY-MM-DD" (local calendar day, no time)
 *   - `published_at`  -> ISO timestamp with timezone
 *
 * Different surfaces (calendar grid, selected-day panel, upcoming list, event
 * card labels) all need to compare and render dates the SAME way. This module
 * is the single source of truth for that normalization, so a dot on day X
 * always corresponds to the events shown when day X is selected.
 *
 * Strategy:
 *   - Calendar day keys are the canonical "YYYY-MM-DD" string built from the
 *     LOCAL year/month/day of a Date object. (The grid is rendered in the
 *     user's local time, so we key by the local day.)
 *   - For an event without an `event_date`, we fall back to the LOCAL day of
 *     `published_at` so the event still lands on the calendar.
 *   - We never call `new Date(yyyy-mm-dd)` directly (that parses as UTC and
 *     drifts a day in negative-offset timezones). Instead we always split.
 */

export type EventLike = {
  event_date?: string | null;
  event_end_date?: string | null;
  published_at?: string | null;
};

/** Pad a number to 2 digits. */
const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Format a Date as "YYYY-MM-DD" using its LOCAL components.
 * This is the canonical key for calendar grid cells AND for events.
 */
export function dateKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * Normalize any supported date input to a "YYYY-MM-DD" key.
 * Accepts:
 *   - "YYYY-MM-DD" (returned as-is after validation)
 *   - ISO timestamp like "2026-04-20T17:39:34.028+00:00"
 *     (converted to the local calendar day)
 *   - Date object
 * Returns "" when the input is empty/invalid.
 */
export function toDateKey(input: string | Date | null | undefined): string {
  if (!input) return "";
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? "" : dateKeyFromDate(input);
  }
  const s = String(input).trim();
  if (!s) return "";

  // Plain "YYYY-MM-DD" — keep as-is (no timezone shifting).
  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) return s;

  // Anything else: let the JS engine parse (ISO timestamps with TZ are safe
  // here because we then read LOCAL components).
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return dateKeyFromDate(d);
}

/**
 * The single rule used everywhere to decide which calendar day an event
 * belongs to: prefer `event_date`, fall back to `published_at`.
 */
export function eventDateKey(e: EventLike): string {
  return toDateKey(e.event_date) || toDateKey(e.published_at);
}

/** Format a "YYYY-MM-DD" key as a long, human-readable date (local). */
export function formatDateKey(
  key: string,
  opts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const m = key.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return key;
  // Build as LOCAL date (NOT new Date("YYYY-MM-DD"), which is UTC).
  return new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-US", opts);
}

/** Today's key, in local time. */
export function todayKey(): string {
  return dateKeyFromDate(new Date());
}

/**
 * Should this event be treated as "All Day" on the public calendar?
 *
 * The backend has no dedicated `all_day` column. By convention an event is
 * all-day when EITHER:
 *   - `event_time` is null / empty, OR
 *   - `event_time` is a textual marker such as "All Day", "all-day",
 *     "All-day", "allday" (case-insensitive, ignoring punctuation/spaces).
 *
 * When this returns true, the public UI should hide explicit start/end time
 * fields and instead label the event as "All day".
 */
export function isAllDayEvent(e: { event_time?: string | null }): boolean {
  const raw = (e.event_time ?? "").trim();
  if (!raw) return true;
  const normalized = raw.toLowerCase().replace(/[\s\-_]/g, "");
  return normalized === "allday";
}

