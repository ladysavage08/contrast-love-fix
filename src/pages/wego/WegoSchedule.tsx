import { Phone } from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";

/**
 * WeGo Schedule — placeholder for a Google Calendar embed.
 *
 * --- HOW TO ADD THE REAL CALENDAR ---
 * 1. In Google Calendar, open Settings → "Settings for my calendars" →
 *    select the WeGo calendar → "Integrate calendar".
 * 2. Copy the "Public URL to this calendar" embed src (looks like:
 *    https://calendar.google.com/calendar/embed?src=YOUR_CAL_ID&ctz=America%2FNew_York).
 * 3. Replace the empty `src=""` on the <iframe> below with that URL.
 * 4. Save — the calendar will render in place of the placeholder.
 */
const WegoSchedule = () => {
  return (
    <WegoLayout breadcrumb={[{ label: "Schedule" }]}>
      <div className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Schedule</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            See where the Mobile Health Clinic will be next. Stops are added
            and updated regularly throughout the month.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="calendar-heading">
            <h2 id="calendar-heading" className="text-2xl font-semibold">
              Upcoming Stops
            </h2>
            <p className="mt-2 text-base text-foreground/90">
              Check back for updates. The schedule below is updated as new
              community stops are confirmed.
            </p>

            {/* ============ GOOGLE CALENDAR EMBED ============ */}
            {/* Paste the Google Calendar embed URL into the src attribute below. */}
            <div className="mt-6 overflow-hidden rounded-lg border border-border">
              <div className="aspect-[4/3] w-full bg-muted">
                <iframe
                  title="Mobile Health Clinic schedule"
                  src=""
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="border-t border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                Calendar loading… If the schedule does not appear, please call
                us at{" "}
                <a
                  href="tel:18778849346"
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  1-877-884-WEGO (9346)
                </a>{" "}
                for the latest stops.
              </p>
            </div>
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
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoSchedule;
