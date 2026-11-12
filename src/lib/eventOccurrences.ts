/**
 * Event occurrences: one event (post) can have several administrator-confirmed
 * dates stored in `post_event_dates`. Everything here is computed in
 * America/New_York time. No dates are ever generated from a pattern, and the
 * publication date is never used as an event date.
 */

export type OccurrenceRow = {
  id?: string;
  post_id?: string;
  event_date: string; // YYYY-MM-DD
  end_date?: string | null;
  start_time?: string | null; // HH:MM[:SS]
  end_time?: string | null;
  event_time?: string | null; // free-text, e.g. "10:30 AM – 12:30 PM"
  location?: string | null;
  details?: string | null;
  link_url?: string | null;
  link_label?: string | null;
  cancelled?: boolean | null;
  cancellation_note?: string | null;
};

export type EventPostLike = {
  post_type: string;
  event_date: string | null;
  event_end_date: string | null;
  event_time: string | null;
  event_location?: string | null;
  event_link?: string | null;
};

export type EventStatus = "upcoming" | "past" | "undated";

export type ResolvedFields = {
  event_status: EventStatus;
  occurrences: OccurrenceRow[];
  upcoming_occurrences: OccurrenceRow[];
  current_occurrence: OccurrenceRow | null;
  occurrence_details: string | null;
  occurrence_link_label: string | null;
};

const TZ = "America/New_York";
const END_OF_DAY = 23 * 60 + 59;

/** Current calendar day and minute-of-day in Eastern Time. */
export function easternNow(now: Date = new Date()): { key: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    key: `${g("year")}-${g("month")}-${g("day")}`,
    minutes: (+g("hour") % 24) * 60 + +g("minute"),
  };
}

const hhmmToMinutes = (s?: string | null): number | null => {
  const m = (s ?? "").match(/^(\d{1,2}):(\d{2})/);
  return m ? +m[1] * 60 + +m[2] : null;
};

/** Parse every "9:00 AM" style time in a free-text string, in order. */
export function parseTimesFromText(text?: string | null): number[] {
  const out: number[] = [];
  const re = /(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s*m\.?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text ?? ""))) {
    let h = +m[1] % 12;
    if (m[3].toLowerCase() === "p") h += 12;
    out.push(h * 60 + (m[2] ? +m[2] : 0));
  }
  return out;
}

/** Minute-of-day (Eastern) when this occurrence ends on its final day. */
export function occurrenceEndMinutes(o: OccurrenceRow): number {
  const explicit = hhmmToMinutes(o.end_time);
  if (explicit != null) return explicit;
  const times = parseTimesFromText(o.event_time);
  // A range ("10:30 AM – 12:30 PM") ends at its last time; a single time is a
  // start time only, so the occurrence runs to the end of the day.
  return times.length >= 2 ? times[times.length - 1] : END_OF_DAY;
}

/** True once the occurrence's end (Eastern) has passed. */
export function isOccurrenceOver(o: OccurrenceRow, now: Date = new Date()): boolean {
  const { key, minutes } = easternNow(now);
  const endKey = o.end_date || o.event_date;
  if (key !== endKey) return key > endKey;
  return minutes > occurrenceEndMinutes(o);
}

const fmtClock = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** Human time text for an occurrence (explicit times win over free text). */
export function occurrenceTimeText(o: OccurrenceRow): string | null {
  const s = hhmmToMinutes(o.start_time);
  const e = hhmmToMinutes(o.end_time);
  if (s != null && e != null) return `${fmtClock(s)} – ${fmtClock(e)}`;
  if (s != null) return fmtClock(s);
  return o.event_time?.trim() || null;
}

/** The post's confirmed dates: table rows if any, else its own single date. */
export function postOccurrences(post: EventPostLike, rows: OccurrenceRow[] = []): OccurrenceRow[] {
  if (rows.length) {
    return [...rows].sort((a, b) =>
      a.event_date === b.event_date
        ? (hhmmToMinutes(a.start_time) ?? 0) - (hhmmToMinutes(b.start_time) ?? 0)
        : a.event_date < b.event_date ? -1 : 1,
    );
  }
  if (!post.event_date) return [];
  return [
    {
      event_date: post.event_date.slice(0, 10),
      end_date: post.event_end_date?.slice(0, 10) || null,
      event_time: post.event_time,
      cancelled: false,
    },
  ];
}

/**
 * Resolve which date an event should display right now and override the
 * post's event fields with it (so every listing shows the same date).
 */
export function resolveEvent<T extends EventPostLike>(
  post: T,
  rows: OccurrenceRow[] = [],
  now: Date = new Date(),
): T & ResolvedFields {
  if (post.post_type !== "event") {
    return {
      ...post,
      event_status: "undated",
      occurrences: [],
      upcoming_occurrences: [],
      current_occurrence: null,
      occurrence_details: null,
      occurrence_link_label: null,
    };
  }
  const occurrences = postOccurrences(post, rows);
  const upcoming = occurrences.filter((o) => !o.cancelled && !isOccurrenceOver(o, now));
  const confirmed = occurrences.filter((o) => !o.cancelled);
  const current =
    upcoming[0] ?? confirmed[confirmed.length - 1] ?? occurrences[occurrences.length - 1] ?? null;
  const status: EventStatus = !occurrences.length ? "undated" : upcoming.length ? "upcoming" : "past";
  const usingRows = rows.length > 0;

  return {
    ...post,
    event_date: current?.event_date ?? null,
    event_end_date: current ? (usingRows ? current.end_date ?? null : post.event_end_date) : null,
    event_time: current ? (usingRows ? occurrenceTimeText(current) : post.event_time) : null,
    event_location: (usingRows && current?.location) || post.event_location || null,
    event_link: (usingRows && current?.link_url) || post.event_link || null,
    event_status: status,
    occurrences,
    upcoming_occurrences: upcoming,
    current_occurrence: current,
    occurrence_details: (usingRows && current?.details) || null,
    occurrence_link_label: (usingRows && current?.link_label) || null,
  };
}

const ymd = (key: string) => {
  const m = key.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
};

/**
 * Event date label: "Sunday, November 15, 2026", or for multi-day
 * "November 14–16, 2026" / "November 30 – December 2, 2026".
 * Returns null when the event has no confirmed date.
 */
export function formatEventDateLabel(start?: string | null, end?: string | null): string | null {
  const s = start ? ymd(start.slice(0, 10)) : null;
  if (!s) return null;
  const e = end ? ymd(end.slice(0, 10)) : null;
  if (!e || e.getTime() <= s.getTime()) {
    return s.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  const month = (d: Date) => d.toLocaleDateString("en-US", { month: "long" });
  if (s.getFullYear() === e.getFullYear()) {
    if (s.getMonth() === e.getMonth()) return `${month(s)} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`;
    return `${month(s)} ${s.getDate()} – ${month(e)} ${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${month(s)} ${s.getDate()}, ${s.getFullYear()} – ${month(e)} ${e.getDate()}, ${e.getFullYear()}`;
}
