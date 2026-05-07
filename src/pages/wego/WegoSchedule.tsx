import { useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Filter,
} from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";
import ManagedLink from "@/components/ManagedLink";
import { todayKey as getTodayKey } from "@/lib/eventDate";
import {
  entryTypeLabel,
  formatLongDate,
  groupByDate,
  type ScheduleEntry,
  type ScheduleEntryType,
} from "@/data/wegoSchedule";
import { useEvents, type Post } from "@/hooks/usePosts";

/**
 * WeGo Schedule page.
 *
 * Pulls Mobile Health Clinic stops live from the database (posts table,
 * category "Mobile Clinic") so admin edits, cancellations, and new stops
 * appear here without a redeploy.
 */

const TYPE_BADGE: Record<ScheduleEntryType, string> = {
  clinic: "bg-brand text-brand-foreground",
  maintenance: "bg-muted text-foreground border border-border",
  training: "bg-accent-gold text-accent-gold-foreground",
  tbd: "border border-dashed border-border bg-background text-muted-foreground",
  special: "bg-accent-gold text-accent-gold-foreground",
};

const PDF_HREF = "/wego-may-2026-schedule.pdf";

/** Build a Google Maps search URL for a venue + address. */
const mapsHref = (entry: ScheduleEntry) => {
  const q = [entry.location, entry.address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
};

const isPublic = (e: ScheduleEntry) =>
  e.type === "clinic" || e.type === "special";

/** Map a Post (database event) into the ScheduleEntry shape this page renders. */
function postToEntry(p: Post): ScheduleEntry | null {
  const date = (p.event_date ?? p.published_at ?? "").slice(0, 10);
  if (!date) return null;
  // Extract county from title like "Mobile Health Clinic — Warren County"
  const m = p.title.match(/—\s*(.+?)\s+County/i);
  const county = m?.[1];
  // Split location into venue + address if formatted "Venue — address"
  let location: string | undefined;
  let address: string | undefined;
  if (p.event_location) {
    const parts = p.event_location.split(/\s+—\s+/);
    location = parts[0]?.trim();
    address = parts[1]?.trim();
  }
  const type: ScheduleEntryType = (p.category ?? "").toLowerCase().includes("special")
    ? "special"
    : "clinic";
  return {
    date,
    type,
    county,
    time: p.event_time ?? undefined,
    location,
    address,
  };
}

type ViewMode = "cards" | "table";

const WegoSchedule = () => {
  const todayKey = getTodayKey();
  const { data: events = [], isLoading, isError } = useEvents({ upcomingOnly: false });

  // Build the entry list from live database events (Mobile Clinic category).
  // Show entries from the current month onward (or just current month).
  const { entries, monthLabel, cancelledKeys, noteByKey } = useMemo(() => {
    const monthPrefix = todayKey.slice(0, 7); // YYYY-MM
    const cancelled = new Set<string>();
    const notes = new Map<string, string>();
    const list: ScheduleEntry[] = [];

    for (const p of events) {
      const cat = (p.category ?? "").toLowerCase();
      if (!cat.includes("mobile") && !cat.includes("clinic") && !cat.includes("special")) {
        continue;
      }
      const entry = postToEntry(p);
      if (!entry) continue;
      if (!entry.date.startsWith(monthPrefix)) continue;
      list.push(entry);
      const key = `${entry.date}|${entry.county ?? ""}|${entry.time ?? ""}`;
      if (p.cancelled) {
        cancelled.add(key);
        if (p.cancellation_note) notes.set(key, p.cancellation_note);
      }
    }

    const dt = new Date(`${monthPrefix}-01T00:00:00`);
    const monthLabel = dt.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    return { entries: list, monthLabel, cancelledKeys: cancelled, noteByKey: notes };
  }, [events, todayKey]);

  const [view, setView] = useState<ViewMode>("cards");
  const [county, setCounty] = useState<string>("all");

  const counties = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) {
      if (isPublic(e) && e.county) set.add(e.county);
    }
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    if (county === "all") return entries;
    return entries.filter((e) => isPublic(e) && e.county === county);
  }, [entries, county]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const tableRows = useMemo(
    () =>
      filtered
        .filter((e) => (county === "all" ? true : isPublic(e)))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [filtered, county],
  );

  const entryKey = (e: ScheduleEntry) =>
    `${e.date}|${e.county ?? ""}|${e.time ?? ""}`;
  const isEntryCancelled = (e: ScheduleEntry) =>
    cancelledKeys.has(entryKey(e)) || e.date === todayKey;

  return (
    <WegoLayout breadcrumb={[{ label: "Schedule" }]}>
      <div className="container py-10 pb-32">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            Mobile Health Clinic Schedule
          </h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Dates, times, and locations may change. Please call ahead to
            confirm a stop before traveling.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="month-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="month-heading" className="text-2xl font-semibold">
                {monthLabel} Schedule
              </h2>
              <p className="text-sm text-muted-foreground">Subject to change</p>
            </div>

            <div
              role="note"
              className="mt-4 flex items-start gap-3 rounded-lg border-l-4 border-accent-gold bg-muted/40 p-4"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-foreground">
                <strong>For updates or questions, call </strong>
                <a
                  href="tel:18778849346"
                  className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  1-877-884-WEGO (9346)
                </a>
                . The schedule below is updated live as new community stops are
                confirmed.
              </p>
            </div>

            {/* Loading / error states */}
            {isLoading && (
              <p
                role="status"
                aria-live="polite"
                className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground"
              >
                Loading the latest schedule…
              </p>
            )}
            {isError && (
              <p
                role="alert"
                className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-sm text-destructive"
              >
                We couldn&apos;t load the latest schedule. Please refresh, or
                call 1-877-884-WEGO for current stops.
              </p>
            )}

            {/* Toolbar */}
            {!isLoading && !isError && (
              <div
                className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                role="toolbar"
                aria-label="Schedule controls"
              >
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <label
                    htmlFor="county-filter"
                    className="inline-flex items-center gap-1 text-sm font-medium text-foreground"
                  >
                    <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
                    Filter by county
                  </label>
                  <select
                    id="county-filter"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="min-h-[40px] flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-none"
                  >
                    <option value="all">All counties</option>
                    {counties.map((c) => (
                      <option key={c} value={c}>
                        {c} County
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex rounded border border-border"
                    role="group"
                    aria-label="View mode"
                  >
                    <button
                      type="button"
                      onClick={() => setView("cards")}
                      aria-pressed={view === "cards"}
                      className={`inline-flex min-h-[40px] items-center gap-1 rounded-l px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        view === "cards"
                          ? "bg-brand text-brand-foreground"
                          : "bg-background text-primary hover:bg-muted"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("table")}
                      aria-pressed={view === "table"}
                      className={`inline-flex min-h-[40px] items-center gap-1 rounded-r px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        view === "table"
                          ? "bg-brand text-brand-foreground"
                          : "bg-background text-primary hover:bg-muted"
                      }`}
                    >
                      <TableIcon className="h-4 w-4" aria-hidden="true" />
                      Table
                    </button>
                  </div>

                  <a
                    href={PDF_HREF}
                    download
                    className="inline-flex min-h-[40px] items-center gap-1 rounded border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download PDF
                  </a>
                </div>
              </div>
            )}

            {!isLoading && !isError && grouped.length === 0 && (
              <p
                role="status"
                className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground"
              >
                No stops scheduled this month. Try another county or call
                1-877-884-WEGO.
              </p>
            )}

            {/* Cards view */}
            {!isLoading && view === "cards" && grouped.length > 0 && (
              <ol
                className="mt-6 grid gap-4 sm:grid-cols-2"
                aria-label={`${monthLabel} clinic stops by date`}
              >
                {grouped.map(({ date, entries: dayEntries }) => {
                  const dayCancelled = dayEntries.every(isEntryCancelled);
                  return (
                    <li
                      key={date}
                      className={`flex h-full flex-col rounded-lg border border-t-[3px] border-border bg-card p-5 shadow-sm ${dayCancelled ? "border-t-destructive" : "border-t-accent-gold"}`}
                    >
                      <h3
                        className={`text-sm font-bold uppercase tracking-wide ${dayCancelled ? "text-destructive line-through decoration-destructive/70 decoration-2" : "text-primary"}`}
                      >
                        <time dateTime={date}>
                          {formatLongDate(date)}
                          {dayCancelled ? " — Cancelled" : ""}
                        </time>
                      </h3>
                      <ul className="mt-4 space-y-4">
                        {dayEntries.map((entry, i) => {
                          const cancelled = isEntryCancelled(entry);
                          const note = noteByKey.get(entryKey(entry));
                          return (
                            <div key={`${entry.date}-${i}`}>
                              <EntryRow entry={entry} cancelled={cancelled} />
                              {cancelled && note && (
                                <p className="mt-2 text-xs italic text-destructive">
                                  Reason: {note}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            )}

            {/* Table view */}
            {!isLoading && view === "table" && tableRows.length > 0 && (
              <div className="mt-6 overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <caption className="sr-only">
                    {monthLabel} Mobile Health Clinic schedule
                  </caption>
                  <thead className="bg-muted/60 text-xs uppercase tracking-wide text-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-3">Date</th>
                      <th scope="col" className="px-3 py-3">County</th>
                      <th scope="col" className="px-3 py-3">Time</th>
                      <th scope="col" className="px-3 py-3">Location</th>
                      <th scope="col" className="px-3 py-3">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((entry, i) => {
                      const cancelled = isEntryCancelled(entry);
                      return (
                        <tr
                          key={`${entry.date}-${i}`}
                          className={`border-t border-border ${
                            cancelled ? "line-through decoration-destructive/70 decoration-2" : ""
                          } ${isPublic(entry) ? "" : "bg-muted/30 text-muted-foreground"}`}
                        >
                          <td className="px-3 py-3 align-top">
                            <time dateTime={entry.date} className="font-medium text-foreground">
                              {formatLongDate(entry.date)}
                            </time>
                            {cancelled && (
                              <span className="ml-2 inline-flex items-center rounded bg-destructive px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive-foreground no-underline">
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 align-top font-semibold">
                            {entry.county ? `${entry.county} County` : "—"}
                          </td>
                          <td className="px-3 py-3 align-top">{entry.time ?? "—"}</td>
                          <td className="px-3 py-3 align-top">
                            {entry.location || entry.address ? (
                              <>
                                {entry.location && (
                                  <span className="block font-medium text-foreground">
                                    {entry.location}
                                  </span>
                                )}
                                {entry.address && (
                                  <address className="not-italic text-muted-foreground">
                                    {entry.address}
                                  </address>
                                )}
                                {isPublic(entry) && (
                                  <a
                                    href={mapsHref(entry)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-block text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
                                  >
                                    Get directions
                                  </a>
                                )}
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE[entry.type]}`}
                            >
                              {entryTypeLabel(entry.type)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="call-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="call-heading" className="text-xl font-semibold">
                Need the Latest Schedule?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Call our toll-free line for the most current stop list.
              </p>
              <a
                href="tel:18778849346"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                1-877-884-WEGO
              </a>
            </section>

            <section
              aria-labelledby="legend-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="legend-heading" className="text-xl font-semibold">Legend</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.clinic}`}>
                    Clinic Stop
                  </span>
                  <span className="text-muted-foreground">Open to public</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.special}`}>
                    Special Event
                  </span>
                  <span className="text-muted-foreground">Community event</span>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* Sticky CTA banner */}
      <div
        role="region"
        aria-label="Mobile Health Clinic contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-primary text-primary-foreground shadow-lg"
      >
        <div className="container flex flex-col items-center justify-between gap-2 py-3 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold sm:text-base">
            We Go Where You Are
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
            <a
              href="tel:18778849346"
              className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline focus-visible:underline"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call 1-877-884-WEGO
            </a>
            <ManagedLink
              slug="wego-site"
              defaultHref="https://www.ecphd.com/wego"
              defaultLabel="www.ecphd.com/wego"
              className="font-semibold underline-offset-2 hover:underline focus-visible:underline"
            />
          </div>
        </div>
      </div>
    </WegoLayout>
  );
};

const EntryRow = ({ entry, cancelled = false }: { entry: ScheduleEntry; cancelled?: boolean }) => {
  const showCounty = isPublic(entry) && entry.county;
  return (
    <li className={`border-t border-border pt-4 first:border-0 first:pt-0 ${cancelled ? "line-through decoration-destructive/70 decoration-2 text-muted-foreground" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide no-underline ${TYPE_BADGE[entry.type]}`}
        >
          {entryTypeLabel(entry.type)}
        </span>
        {cancelled && (
          <span className="inline-flex items-center rounded bg-destructive px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-destructive-foreground no-underline">
            Canceled
          </span>
        )}
        {showCounty && (
          <h3 className="text-lg font-semibold text-foreground">
            {entry.county} County
          </h3>
        )}
        {!isPublic(entry) && entry.note && (
          <span className="text-sm text-muted-foreground">{entry.note}</span>
        )}
      </div>

      {(entry.time || entry.location || entry.address) && (
        <dl className="mt-3 space-y-2 text-sm">
          {entry.time && (
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="sr-only">Time</dt>
                <dd className="font-medium text-foreground">{entry.time}</dd>
              </div>
            </div>
          )}
          {(entry.location || entry.address) && (
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="sr-only">Location</dt>
                <dd className="leading-relaxed text-foreground">
                  {entry.location && (
                    <span className="block font-medium">{entry.location}</span>
                  )}
                  {entry.address && (
                    <address className="not-italic text-muted-foreground">
                      {entry.address}
                    </address>
                  )}
                  {isPublic(entry) && (entry.location || entry.address) && (
                    <a
                      href={mapsHref(entry)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
                      aria-label={`Open ${entry.location ?? "location"} in Google Maps (opens in new tab)`}
                    >
                      Get directions
                    </a>
                  )}
                </dd>
              </div>
            </div>
          )}
        </dl>
      )}
    </li>
  );
};

export default WegoSchedule;
