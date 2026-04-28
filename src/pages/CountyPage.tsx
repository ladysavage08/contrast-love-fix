import { useParams, Navigate, Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Clock,
  User,
  ArrowRight,
  ChevronRight,
  Calendar,
  BarChart3,
  Newspaper,
  Utensils,
  ImageIcon,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SocialIcons from "@/components/SocialIcons";
import { counties, type CountyRelatedLink } from "@/data/counties";
import burkeImage from "@/assets/county-burke.jpg";

/**
 * Generic, data-driven county detail page rendered for /counties/:slug.
 * Mirrors the original Burke County layout 1:1 — every county uses the
 * same hero, info cards, services CTA, related links, sidebar, and footer.
 * All content comes from src/data/counties.ts so the listing page and
 * detail pages stay in sync.
 */

const heroImageMap: Record<string, string> = {
  "county-burke.jpg": burkeImage,
};

const relatedIconMap: Record<CountyRelatedLink["icon"], typeof Calendar> = {
  calendar: Calendar,
  barChart: BarChart3,
  newspaper: Newspaper,
  utensils: Utensils,
};

const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof User;
  title: string;
  children: React.ReactNode;
}) => {
  const id = `card-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <section
      aria-labelledby={id}
      className="rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-6 shadow-sm"
    >
      <h2
        id={id}
        className="mb-3 flex items-center gap-2 text-xl font-semibold text-foreground"
      >
        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <div className="text-foreground">{children}</div>
    </section>
  );
};

const CountyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const county = counties.find((c) => c.slug === slug);

  if (!county) return <Navigate to="/counties" replace />;

  const heroSrc = county.heroImage ? heroImageMap[county.heroImage] : undefined;
  const servicesUrl = county.servicesUrl ?? "#";
  const servicesLabel =
    county.servicesLabel ??
    `Click here to view all services provided by the ${county.healthDept}.`;
  const intro =
    county.intro ??
    `Welcome to the ${county.healthDept}. Our team serves the citizens of ${county.name} by providing preventive healthcare services.`;
  const hours = county.hours ?? [];
  const related = county.relatedLinks ?? [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader currentCountySlug={county.slug} />

      {/* ============ BREADCRUMB ============ */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
        <ol className="container flex flex-wrap items-center gap-1 py-3 text-sm">
          <li>
            <a href="/" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
              Home
            </a>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link to="/counties" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
              Counties
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {county.name}
          </li>
        </ol>
      </nav>

      {/* ============ MAIN ============ */}
      <main id="main" className="container py-6 md:py-10">
        {/* Page Hero */}
        <section
          aria-labelledby="page-title"
          className="mb-6 grid gap-5 md:mb-10 md:gap-8 lg:grid-cols-[1fr_420px] lg:items-center"
        >
          <div>
            <h1 id="page-title" className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {county.healthDept}
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 md:text-lg">
              {intro}
            </p>
            <Link
              to="/programs"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:mt-6 sm:w-auto"
            >
              View All Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            {heroSrc ? (
              <img
                src={heroSrc}
                alt={county.heroAlt ?? `${county.name} community photo`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                role="img"
                aria-label={`${county.name} photo placeholder`}
                className="flex aspect-[4/3] w-full items-center justify-center bg-muted text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2 px-6 text-center">
                  <ImageIcon className="h-10 w-10" aria-hidden="true" />
                  <p className="text-sm font-medium">{county.name}</p>
                  <p className="text-xs">Photo coming soon</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Two-column body */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            {county.nurseManager && (
              <InfoCard icon={User} title="County Nurse Manager">
                <p className="text-lg font-semibold text-foreground">
                  {county.nurseManager}
                </p>
              </InfoCard>
            )}

            {county.address && (
              <InfoCard icon={MapPin} title="Location">
                <address className="not-italic leading-relaxed text-foreground">
                  {county.healthDept}
                  <br />
                  {county.address.street}
                  <br />
                  {county.address.poBox && (
                    <>
                      {county.address.poBox}
                      <br />
                    </>
                  )}
                  {county.address.cityStateZip}
                </address>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${county.address.street}, ${county.address.cityStateZip}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Get Directions <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </InfoCard>
            )}

            {hours.length > 0 && (
              <InfoCard icon={Clock} title="Hours of Operation">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">{county.name} office hours</caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-4 font-semibold">Days</th>
                      <th scope="col" className="py-2 font-semibold">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.map((row) => (
                      <tr key={row.days} className="border-b border-border last:border-0">
                        <td className="py-2 pr-4 font-medium text-foreground">{row.days}</td>
                        <td className="py-2 text-muted-foreground">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {county.lunchClosure && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {county.lunchClosure}
                  </p>
                )}
              </InfoCard>
            )}

            {/* Services CTA band */}
            <section
              aria-labelledby="services-cta"
              className="rounded-lg border-l-4 border-accent-gold bg-brand p-6 text-brand-foreground shadow-sm"
            >
              <h2 id="services-cta" className="text-xl font-bold">
                Services at {county.healthDept}
              </h2>
              <p className="mt-2 text-sm opacity-95">{servicesLabel}</p>
              <Link
                to="/programs"
                className="mt-4 inline-flex items-center gap-2 rounded bg-accent-gold px-5 py-2.5 text-sm font-semibold text-accent-gold-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-foreground"
              >
                View All Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>

            {/* Clinic and Office Sites */}
            {county.clinicSites && county.clinicSites.length > 0 && (
              <section aria-labelledby="clinic-sites-heading" className="space-y-4">
                <h2 id="clinic-sites-heading" className="text-2xl font-bold text-foreground">
                  Clinic and Office Sites
                </h2>
                <div className="grid gap-4">
                  {county.clinicSites.map((site) => {
                    const mapsQuery = encodeURIComponent(site.addressLines.join(", "));
                    return (
                      <article
                        key={site.name}
                        className="rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-6 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          {site.name}
                        </h3>
                        {site.contactName && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {site.contactName}
                          </p>
                        )}
                        <address className="mt-3 not-italic text-sm leading-relaxed text-foreground">
                          {site.addressLines.map((line) => (
                            <span key={line} className="block">{line}</span>
                          ))}
                        </address>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                        >
                          Get Directions <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                        {site.phone && site.phoneHref && (
                          <p className="mt-3 flex items-start gap-2 text-sm">
                            <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                            <a
                              href={site.phoneHref}
                              className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
                            >
                              {site.phone}
                            </a>
                          </p>
                        )}
                        {site.hours && site.hours.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Clock className="h-4 w-4 text-primary" aria-hidden="true" /> Hours
                            </h4>
                            <table className="w-full text-left text-sm">
                              <caption className="sr-only">{site.name} hours</caption>
                              <thead className="sr-only">
                                <tr><th>Days</th><th>Hours</th></tr>
                              </thead>
                              <tbody>
                                {site.hours.map((row) => (
                                  <tr key={row.days} className="border-b border-border last:border-0">
                                    <td className="py-1.5 pr-4 font-medium text-foreground">{row.days}</td>
                                    <td className="py-1.5 text-muted-foreground">{row.time}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {site.walkInHours && site.walkInHours.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-sm font-semibold text-foreground">
                              Walk-In Hours
                            </h4>
                            <table className="w-full text-left text-sm">
                              <caption className="sr-only">{site.name} walk-in hours</caption>
                              <thead className="sr-only">
                                <tr><th>Days</th><th>Hours</th></tr>
                              </thead>
                              <tbody>
                                {site.walkInHours.map((row) => (
                                  <tr key={row.days} className="border-b border-border last:border-0">
                                    <td className="py-1.5 pr-4 font-medium text-foreground">{row.days}</td>
                                    <td className="py-1.5 text-muted-foreground">{row.time}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {site.notes && site.notes.length > 0 && (
                          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                            {site.notes.map((note) => (
                              <li key={note}>Note: {note}</li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Related links */}
            {related.length > 0 && (
              <section
                aria-labelledby="related-heading"
                className="rounded-lg border border-border p-6"
              >
                <h2 id="related-heading" className="mb-4 text-xl font-semibold">
                  Related Pages
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {related.map(({ icon, label, href }) => {
                    const Icon = relatedIconMap[icon];
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          className="flex items-center gap-3 rounded px-3 py-2.5 text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span className="font-medium underline-offset-2 hover:underline">
                            {label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside aria-label="Sidebar" className="space-y-6">
            {county.phone && county.phoneHref && (
              <section
                aria-labelledby="quick-contact-heading"
                className="rounded-lg border border-t-[3px] border-border border-t-accent-gold p-5"
              >
                <h2 id="quick-contact-heading" className="mb-3 text-lg font-semibold">
                  Quick Contact
                </h2>
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                  <a
                    href={county.phoneHref}
                    className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
                  >
                    {county.phone}
                  </a>
                </p>
                {county.address && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                    <span>
                      {county.address.street}
                      <br />
                      {county.address.cityStateZip}
                    </span>
                  </p>
                )}
                <a
                  href={county.phoneHref}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> Call Now
                </a>
              </section>
            )}

            <section
              aria-labelledby="connect-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="connect-heading" className="mb-3 text-lg font-semibold">
                Stay Connected
              </h2>
              <SocialIcons size="lg" />
            </section>
          </aside>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </div>
  );
};

export default CountyPage;
