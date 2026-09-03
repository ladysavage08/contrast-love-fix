import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight, ExternalLink, Video } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { counties } from "@/data/counties";
import {
  useBohRecordings,
  groupByYear,
  formatMeetingDate,
  platformLabel,
} from "@/hooks/useBohRecordings";

/**
 * Board of Health meeting recordings for a single county.
 * Content is managed entirely in the admin area (no code changes needed).
 */
const CountyBohRecordings = () => {
  const { slug } = useParams<{ slug: string }>();
  const county = counties.find((c) => c.slug === slug);
  const { data: recordings = [], isLoading, error } = useBohRecordings(slug);

  if (!county) return <Navigate to="/counties" replace />;

  const years = groupByYear(recordings);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 text-sm">
            <li>
              <Link to="/" className="text-primary underline-offset-2 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link to="/counties" className="text-primary underline-offset-2 hover:underline">
                Counties
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <Link
                to={`/counties/${county.slug}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {county.name}
              </Link>
            </li>
            <li aria-hidden="true" className="text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              BOH Meeting Recordings
            </li>
          </ol>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">
            {county.name} Board of Health Meeting Recordings
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Watch recordings of previous {county.name} Board of Health meetings. Recordings
            are grouped by year, with the most recent meeting listed first. Links open on an
            external video site in a new tab.
          </p>
        </header>

        {isLoading && <p className="text-muted-foreground">Loading recordings…</p>}
        {error && (
          <p className="text-destructive">
            We couldn't load recordings right now. Please try again later.
          </p>
        )}

        {!isLoading && !error && years.length === 0 && (
          <section
            aria-labelledby="no-recordings-heading"
            className="rounded-lg border border-border bg-muted/40 p-6"
          >
            <h2 id="no-recordings-heading" className="text-xl font-semibold">
              No recordings available yet
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              There are no {county.name} Board of Health meeting recordings posted at this
              time. Please check back soon, or{" "}
              <Link to="/contact" className="text-primary underline underline-offset-2">
                contact us
              </Link>{" "}
              if you need meeting information.
            </p>
          </section>
        )}

        {years.map(({ year, items }) => (
          <section key={year} aria-labelledby={`year-${year}`} className="mb-8">
            <h2 id={`year-${year}`} className="mb-4 text-2xl font-bold">
              {year} Meetings
            </h2>
            <ul className="space-y-3">
              {items.map((rec) => {
                const dateLabel = formatMeetingDate(rec.meeting_date);
                const heading = rec.title?.trim() || `Board of Health Meeting — ${dateLabel}`;
                return (
                  <li
                    key={rec.id}
                    className="rounded-lg border border-border bg-card p-5 sm:flex sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-snug">{heading}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{dateLabel}</span>
                        {rec.duration ? ` • ${rec.duration}` : ""}
                        {` • ${platformLabel(rec)}`}
                      </p>
                      {rec.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{rec.notes}</p>
                      )}
                    </div>
                    <a
                      href={rec.recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:mt-0 sm:w-auto sm:shrink-0"
                    >
                      <Video className="h-4 w-4" aria-hidden="true" />
                      <span>
                        Watch Recording
                        <span className="sr-only">
                          {` — ${heading}, ${dateLabel} (opens ${platformLabel(rec)} in a new tab)`}
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <p className="mt-8">
          <Link
            to={`/counties/${county.slug}`}
            className="text-primary underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Back to {county.name} Health Department
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CountyBohRecordings;
