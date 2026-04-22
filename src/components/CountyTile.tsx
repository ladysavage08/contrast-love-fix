import { ArrowRight, Clock, MapPin, Phone, User } from "lucide-react";
import type { County } from "@/data/counties";

interface CountyTileProps {
  county: County;
}

/**
 * Information-rich county tile for the /counties landing page.
 *
 * Accessibility notes:
 *  - Each tile is an <article> with the county name as <h3> (page provides h1/h2).
 *  - The whole tile is NOT a single link — only the CTA button is interactive.
 *    Phone numbers are real tel: links so users can dial without leaving the tile.
 *  - Icons are aria-hidden; the visible text carries the meaning.
 */
const CountyTile = ({ county }: CountyTileProps) => {
  const isLive = county.status === "live";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md">
      {/* Header */}
      <header className="border-b border-border p-5">
        <h3 className="text-xl font-bold text-foreground">{county.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{county.healthDept}</p>
      </header>

      {/* Body */}
      <div className="flex-1 p-5">
        {isLive ? (
          <dl className="space-y-4 text-sm">
            {county.address && (
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd className="not-italic leading-relaxed text-foreground">
                    <address className="not-italic">
                      {county.address.street}
                      <br />
                      {county.address.cityStateZip}
                    </address>
                  </dd>
                </div>
              </div>
            )}

            {county.phone && county.phoneHref && (
              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      href={county.phoneHref}
                      className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {county.phone}
                    </a>
                  </dd>
                </div>
              </div>
            )}

            {county.hoursSummary && county.hoursSummary.length > 0 && (
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sr-only">Hours of operation</dt>
                  <dd className="leading-relaxed text-foreground">
                    {county.hoursSummary.map((line, i) => (
                      <span key={i} className={i === 0 ? "block font-medium" : "block text-muted-foreground"}>
                        {line}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
            )}

            {county.nurseManager && (
              <div className="flex items-start gap-3">
                <User
                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    Nurse Manager
                  </dt>
                  <dd className="font-semibold text-foreground">
                    {county.nurseManager}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            Detailed information coming soon.
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-border p-4">
        <a
          href={`/counties/${county.slug}`}
          className="flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label={`Visit ${county.name} page`}
        >
          {isLive ? `Visit ${county.name} Page` : "View County Page"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
};

export default CountyTile;
