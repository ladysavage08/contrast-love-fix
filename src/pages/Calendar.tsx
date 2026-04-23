import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, ArrowRight, Stethoscope } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useEvents } from "@/hooks/usePosts";
import type { Post } from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import {
  dateKeyFromDate,
  eventDateKey,
  formatDateKey,
  todayKey as getTodayKey,
} from "@/lib/eventDate";

/**
 * Calendar of Events
 * - Data source: posts table where post_type = 'event' (managed in admin).
 * - Provides BOTH a monthly calendar view and a chronological list view.
 * - Mobile Clinic events (category includes "mobile") are visually highlighted.
 *
 * All date math (grid keys, selected-day lookup, upcoming filter, card labels)
 * goes through the shared helpers in @/lib/eventDate so the same day is
 * recognized consistently everywhere.
 */

function isMobileClinic(e: Post) {
  const c = (e.category ?? "").toLowerCase();
  const t = (e.title ?? "").toLowerCase();
  // "Mobile" event-type / category should still be treated as a regular event
  // on the calendar — this only affects visual styling.
  return c.includes("mobile") || t.includes("mobile clinic") || t.includes("wego");
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const { data: events = [], isLoading } = useEvents({ upcomingOnly: false });
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<string | null>(null);

  // Group events by their canonical day key. Uses the SAME helper that the
  // grid below uses to build cell keys — guarantees clicks match dots.
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const e of events) {
      const key = eventDateKey(e);
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  // Today, in local time, as YYYY-MM-DD.
  const todayKey = getTodayKey();

  // Upcoming list (today onward), sorted by effective date.
  const upcoming = useMemo(
    () =>
      events
        .filter((e) => {
          const k = eventDateKey(e);
          return k && k >= todayKey;
        })
        .sort((a, b) => {
          const ka = eventDateKey(a);
          const kb = eventDateKey(b);
          return ka < kb ? -1 : ka > kb ? 1 : 0;
        }),
    [events, todayKey],
  );

  // Build calendar grid for current cursor month — keys built via the SAME
  // helper used by eventsByDate.
  const grid = useMemo(() => {
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      cells.push({ date, key: dateKeyFromDate(date) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, key: null });
    return cells;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedEvents = selected ? eventsByDate.get(selected) ?? [] : [];


  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <a href="/" className="text-primary hover:underline underline-offset-2">Home</a>
          <span className="mx-2">/</span>
          <span aria-current="page">Calendar of Events</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Calendar of Events</h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            Find upcoming events, Mobile Health Clinic dates and locations, and community
            outreach activities. Use the monthly calendar or the list view below — whichever
            works best for you.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* CALENDAR VIEW */}
          <section aria-labelledby="calendar-view-heading" className="rounded-lg border border-border p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 id="calendar-view-heading" className="text-xl font-semibold">
                {monthLabel}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCursor(startOfMonth(new Date()));
                    setSelected(null);
                  }}
                  className="rounded border border-border px-3 py-1.5 text-sm hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div role="grid" aria-label={`Events for ${monthLabel}`} className="grid grid-cols-7 gap-1 text-sm">
              {WEEKDAYS.map((w) => (
                <div key={w} role="columnheader" className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {w}
                </div>
              ))}
              {grid.map((cell, i) => {
                if (!cell.date) {
                  return <div key={`empty-${i}`} role="gridcell" aria-hidden="true" className="h-20 rounded bg-muted/30" />;
                }
                const dayEvents = eventsByDate.get(cell.key!) ?? [];
                const hasEvents = dayEvents.length > 0;
                const hasMobile = dayEvents.some(isMobileClinic);
                const isToday = cell.key === todayKey;
                const isSelected = cell.key === selected;
                return (
                  <button
                    key={cell.key}
                    type="button"
                    role="gridcell"
                    onClick={() => setSelected(cell.key)}
                    aria-pressed={isSelected}
                    aria-label={`${cell.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${hasEvents ? `, ${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}` : ", no events"}`}
                    className={cn(
                      "flex h-20 flex-col items-start gap-1 rounded border p-1.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : hasEvents
                        ? "border-border bg-card hover:bg-muted"
                        : "border-border/60 hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isToday ? "rounded bg-brand px-1.5 text-brand-foreground" : "text-foreground",
                      )}
                    >
                      {cell.date.getDate()}
                    </span>
                    {hasEvents && (
                      <span className="flex flex-wrap items-center gap-1">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span
                            key={e.id}
                            aria-hidden="true"
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isMobileClinic(e) ? "bg-accent" : "bg-primary",
                            )}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                        )}
                      </span>
                    )}
                    {hasMobile && (
                      <span className="sr-only">Includes Mobile Health Clinic</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" /> Event</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /> Mobile Clinic</span>
            </div>

            {selected && (
              <div className="mt-6 border-t border-border pt-4">
                <h3 className="mb-3 text-base font-semibold">
                  {formatDateKey(selected)}
                </h3>
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled.</p>
                ) : (
                  <ul className="space-y-3">
                    {selectedEvents.map((e) => (
                      <EventCard key={e.id} event={e} compact />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>

          {/* SIDEBAR — UPCOMING */}
          <aside aria-labelledby="upcoming-side-heading" className="space-y-4">
            <section className="rounded-lg border border-border p-5">
              <h2 id="upcoming-side-heading" className="mb-3 text-lg font-semibold">
                Next Up
              </h2>
              {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!isLoading && upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
              )}
              <ul className="space-y-3">
                {upcoming.slice(0, 5).map((e) => (
                  <li key={e.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {formatDateKey(eventDateKey(e))}
                    </p>
                    <p className="font-medium text-foreground">{e.title}</p>
                    {e.event_location && (
                      <p className="text-xs text-muted-foreground">{e.event_location}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <a
              href="/wego/schedule"
              className="flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-3 font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Stethoscope className="h-4 w-4" aria-hidden="true" />
              Mobile Clinic Schedule
            </a>
          </aside>
        </div>

        {/* LIST VIEW */}
        <section aria-labelledby="list-view-heading" className="mt-12">
          <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
            <h2 id="list-view-heading" className="text-2xl font-semibold">
              Upcoming Events
            </h2>
            <span className="text-sm text-muted-foreground">
              {upcoming.length} event{upcoming.length === 1 ? "" : "s"}
            </span>
          </div>

          {isLoading && <p className="py-6 text-sm text-muted-foreground">Loading events…</p>}
          {!isLoading && upcoming.length === 0 && (
            <p className="py-6 text-sm text-muted-foreground">
              No upcoming events have been published. Check back soon.
            </p>
          )}

          <ul className="space-y-4">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

function EventCard({ event, compact = false }: { event: Post; compact?: boolean }) {
  const mobile = isMobileClinic(event);
  return (
    <li
      className={cn(
        "rounded-lg border p-4 sm:p-5",
        mobile ? "border-accent bg-accent/5" : "border-border bg-card",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          {mobile && (
            <span className="mb-2 inline-flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              <Stethoscope className="h-3 w-3" aria-hidden="true" /> Mobile Clinic
            </span>
          )}
          <h3 className={cn("font-semibold text-foreground", compact ? "text-base" : "text-lg")}>
            {event.title}
          </h3>
          <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {eventDateKey(event) && (
              <div className="inline-flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Date</dt>
                <dd>{formatDateKey(eventDateKey(event))}</dd>
              </div>
            )}
            {event.event_time && (
              <div className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Time</dt>
                <dd>{event.event_time}</dd>
              </div>
            )}
            {event.event_location && (
              <div className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Location</dt>
                <dd>{event.event_location}</dd>
              </div>
            )}
          </dl>
          {event.excerpt && (
            <p className="mt-2 text-sm text-foreground/80">{event.excerpt}</p>
          )}
        </div>
      </div>

      {(event.event_link || event.cta_url) && (
        <div className="mt-3">
          <a
            href={event.event_link || event.cta_url || "#"}
            target={(event.event_link || event.cta_url || "").startsWith("http") ? "_blank" : undefined}
            rel={(event.event_link || event.cta_url || "").startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
          >
            {event.cta_label || "More details"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}
    </li>
  );
}

export default Calendar;
