import { Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";
import {
  currentMonthKey,
  entryTypeLabel,
  formatLongDate,
  groupByDate,
  monthlySchedules,
  type ScheduleEntry,
  type ScheduleEntryType,
} from "@/data/wegoSchedule";

/**
 * WeGo Schedule page.
 *
 * Renders the current month's Mobile Health Clinic schedule from a single
 * structured data file (src/data/wegoSchedule.ts). To publish a new month:
 *   1. Add a new MonthlySchedule entry in that file.
 *   2. Update `currentMonthKey` to point to it.
 *
 * Layout:
 *  - One accessible card per calendar date.
 *  - Each date can contain multiple entries (e.g. an AM stop + a PM stop).
 *  - Maintenance, Training, and TBD days are intentionally shown so the
 *    public sees the full month at a glance.
 */

const TYPE_BADGE: Record<ScheduleEntryType, string> = {
  clinic:
    "bg-brand text-brand-foreground",
  maintenance:
    "bg-muted text-foreground border border-border",
  training:
    "bg-accent-gold text-accent-gold-foreground",
  tbd:
    "border border-dashed border-border bg-background text-muted-foreground",
};

const EntryRow = ({ entry }: { entry: ScheduleEntry }) => {
  const isClinic = entry.type === "clinic";
  return (
    <li className="border-t border-border pt-4 first:border-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE[entry.type]}`}
        >
          {entryTypeLabel(entry.type)}
        </span>
        {isClinic && entry.county && (
          <h3 className="text-lg font-semibold text-foreground">
            {entry.county} County
          </h3>
        )}
        {!isClinic && entry.note && (
          <span className="text-sm text-muted-foreground">{entry.note}</span>
        )}
      </div>

      {(entry.time || entry.location || entry.address) && (
        <dl className="mt-3 space-y-2 text-sm">
          {entry.time && (
            <div className="flex items-start gap-2">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <dt className="sr-only">Time</dt>
                <dd className="font-medium text-foreground">{entry.time}</dd>
              </div>
            </div>
          )}
          {(entry.location || entry.address) && (
            <div className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
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
                </dd>
              </div>
            </div>
          )}
        </dl>
      )}
    </li>
  );
};

const WegoSchedule = () => {
  const month = monthlySchedules[currentMonthKey];
  const grouped = groupByDate(month.entries);

  return (
    <WegoLayout breadcrumb={[{ label: "Schedule" }]}>
      <div className="container py-10">
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
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="month-heading" className="text-2xl font-semibold">
                {month.label} Schedule
              </h2>
              <p className="text-sm text-muted-foreground">
                Subject to change
              </p>
            </div>

            {/* Highlighted callout */}
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
                . The schedule below is updated as new community stops are
                confirmed.
              </p>
            </div>

            <ol
              className="mt-6 grid gap-4 sm:grid-cols-2"
              aria-label={`${month.label} clinic stops by date`}
            >
              {grouped.map(({ date, entries }) => (
                <li
                  key={date}
                  className="flex h-full flex-col rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-5 shadow-sm"
                >
                  <h3 className="text-sm font-bold uppercase tracking-wide text-primary">
                    <time dateTime={date}>{formatLongDate(date)}</time>
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {entries.map((entry, i) => (
                      <EntryRow key={`${entry.date}-${i}`} entry={entry} />
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
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
              <h2 id="legend-heading" className="text-xl font-semibold">
                Legend
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.clinic}`}>
                    Clinic Stop
                  </span>
                  <span className="text-muted-foreground">Open to public</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.maintenance}`}>
                    Maintenance
                  </span>
                  <span className="text-muted-foreground">No clinic</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.training}`}>
                    Training
                  </span>
                  <span className="text-muted-foreground">Staff training</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={`inline-flex rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${TYPE_BADGE.tbd}`}>
                    TBD
                  </span>
                  <span className="text-muted-foreground">Details pending</span>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoSchedule;
