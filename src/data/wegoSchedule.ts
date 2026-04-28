/**
 * Mobile Health Clinic ("WeGo") monthly schedule.
 *
 * Single source of truth for the Schedule page. To publish a new month,
 * add another entry to `monthlySchedules` and update `currentMonthKey`.
 *
 * Entry types:
 *  - "clinic":      A community stop where the mobile clinic provides services.
 *  - "maintenance": Vehicle/equipment maintenance — clinic not in service.
 *  - "training":    Staff training day.
 *  - "tbd":         Stop confirmed but details pending.
 */

export type ScheduleEntryType =
  | "clinic"
  | "maintenance"
  | "training"
  | "tbd"
  | "special";

export interface ScheduleEntry {
  /** ISO date (YYYY-MM-DD) — used for sorting and accessible labels. */
  date: string;
  type: ScheduleEntryType;
  /** County name for clinic stops; omitted for maintenance/training/TBD. */
  county?: string;
  /** Display time range, e.g. "9:00 AM – 12:00 PM". */
  time?: string;
  /** Venue name, e.g. "Midville City Hall". */
  location?: string;
  /** Street + city for the venue. */
  address?: string;
  /** Optional free-form note (e.g. "Maintenance / Training"). */
  note?: string;
}

export interface MonthlySchedule {
  /** Human-readable month label, e.g. "May 2026". */
  label: string;
  /** ISO month key (YYYY-MM) — used internally. */
  monthKey: string;
  entries: ScheduleEntry[];
}

/**
 * May 2026 — source: Mobile Health Clinic May 2026 calendar.
 * Times use en-dash spacing ("9:00 AM – 12:00 PM") for consistent display.
 */
const may2026: MonthlySchedule = {
  label: "May 2026",
  monthKey: "2026-05",
  entries: [
    { date: "2026-05-01", type: "maintenance" },
    { date: "2026-05-04", type: "maintenance" },
    {
      date: "2026-05-05",
      type: "clinic",
      county: "Burke",
      time: "9:00 AM – 12:00 PM",
      location: "Midville City Hall",
      address: "132 Jones St., Midville",
    },
    {
      date: "2026-05-05",
      type: "clinic",
      county: "Jenkins",
      time: "1:00 PM – 4:00 PM",
      location: "B&T Fresh Market",
      address: "540 E Winthrope Ave, Millen",
    },
    {
      date: "2026-05-06",
      type: "clinic",
      county: "Warren",
      time: "9:00 AM – 12:00 PM",
      location: "Library",
      address: "10 Warren St., Warrenton",
    },
    {
      date: "2026-05-06",
      type: "clinic",
      county: "Glascock",
      time: "1:00 PM – 4:00 PM",
      location: "Town Square / Southern Bank",
      address: "21 College St., Gibson",
    },
    {
      date: "2026-05-07",
      type: "clinic",
      county: "Taliaferro",
      time: "9:00 AM – 12:00 PM",
      location: "County School",
      address: "557 Broad St., Crawfordville",
    },
    {
      date: "2026-05-07",
      type: "clinic",
      county: "McDuffie",
      time: "1:00 PM – 4:00 PM",
      location: "Dearing Town Hall",
      address: "4577 Augusta Hwy, Dearing",
    },
    { date: "2026-05-08", type: "maintenance" },
    { date: "2026-05-11", type: "maintenance" },
    {
      date: "2026-05-12",
      type: "clinic",
      county: "Emanuel",
      time: "9:00 AM – 12:00 PM",
      location: "St. Philip Center of Hope",
      address: "231 South Racetrack St., Swainsboro",
    },
    {
      date: "2026-05-12",
      type: "clinic",
      county: "Jefferson",
      time: "1:00 PM – 4:00 PM",
      location: "Jefferson County School / Stadium",
      address: "1157 Warrior Trail, Louisville",
    },
    {
      date: "2026-05-13",
      type: "clinic",
      county: "Richmond",
      time: "9:00 AM – 3:00 PM",
      location: "Bernie Ward Community Center",
      address: "1941 Lumpkin Rd, Augusta, GA",
    },
    {
      date: "2026-05-14",
      type: "clinic",
      county: "Columbia",
      time: "9:00 AM – 12:00 PM",
      location: "Concerned Women's (front of building)",
      address: "114 E Robinson Ave, Grovetown",
    },
    {
      date: "2026-05-15",
      type: "maintenance",
      time: "1:00 PM – 4:00 PM",
    },
    { date: "2026-05-16", type: "maintenance" },
    { date: "2026-05-18", type: "maintenance" },
    {
      date: "2026-05-19",
      type: "clinic",
      county: "Wilkes",
      time: "9:00 AM – 12:00 PM",
      location: "Ingles",
      address: "110 Ann Denard Dr, Washington",
    },
    {
      date: "2026-05-19",
      type: "clinic",
      county: "Lincoln",
      time: "1:00 PM – 4:00 PM",
      location: "American Legion",
      address: "1070 Thomas Lane Post Rd, Lincolnton, GA",
    },
    {
      date: "2026-05-21",
      type: "clinic",
      county: "Richmond",
      time: "9:00 AM – 3:00 PM",
      location: "Bernie Ward Community Center",
      address: "1941 Lumpkin Rd, Augusta, GA",
    },
    {
      date: "2026-05-22",
      type: "maintenance",
      note: "Maintenance / Training",
    },
    { date: "2026-05-23", type: "maintenance" },
    { date: "2026-05-24", type: "maintenance" },
    { date: "2026-05-26", type: "tbd" },
    {
      date: "2026-05-27",
      type: "clinic",
      county: "Screven",
      time: "9:00 AM – 12:00 PM",
      location: "Newington Town Hall and Fire Dept. (next to)",
      address: "201 Church St., Newington",
    },
    { date: "2026-05-29", type: "maintenance" },
    {
      date: "2026-05-31",
      type: "special",
      county: "Richmond",
      time: "12:00 PM – 3:00 PM",
      location: "Strong Tower Christian Fellowship",
      address: "Wylds Rd, Augusta, GA",
      note: "Special Event",
    },
  ],
};

export const monthlySchedules: Record<string, MonthlySchedule> = {
  "2026-05": may2026,
};

/** Which month the Schedule page should currently feature. */
export const currentMonthKey = "2026-05";

/* ----------------------------- helpers ----------------------------- */

/** Group entries by their ISO date so we can render one card per day. */
export function groupByDate(entries: ScheduleEntry[]): Array<{
  date: string;
  entries: ScheduleEntry[];
}> {
  const map = new Map<string, ScheduleEntry[]>();
  for (const e of entries) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, entries]) => ({ date, entries }));
}

/** Format an ISO date as "Tuesday, May 5". Locale-stable (en-US). */
export function formatLongDate(iso: string): string {
  // Parse as local date (avoid UTC shift for YYYY-MM-DD).
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Short label for the type badge. */
export function entryTypeLabel(type: ScheduleEntryType): string {
  switch (type) {
    case "clinic":
      return "Clinic Stop";
    case "maintenance":
      return "Maintenance";
    case "training":
      return "Training";
    case "tbd":
      return "TBD";
  }
}
