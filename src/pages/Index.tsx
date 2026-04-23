import {
  Phone,
  FileText,
  Heart,
  Apple,
  Users,
  ClipboardCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SocialIcons from "@/components/SocialIcons";
import { usePosts, useEvents, formatPostDate } from "@/hooks/usePosts";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";

/**
 * Accessible rebuild of the ECHD homepage.
 *
 * Color contrast policy (WCAG 2.1 AA, ≥ 4.5:1 for normal text):
 *   - Brand blue text on white: hsl(var(--primary)) = #006a8e (was #008cba — 3.0:1, failing).
 *   - White text on brand surfaces: hsl(var(--brand)) = #005a78 (5.7:1).
 *   - Muted/secondary text: hsl(var(--muted-foreground)) at L=35% (≥ 4.5:1).
 *   - Gold accent stripe darkened to #a36a00 for any text laid over it.
 *
 * No hard-coded colors in this file — all styling flows through semantic tokens.
 * No empty `href=""` links — every interactive element is either a real route
 * or a <button>.
 */

const quickLinks = [
  { icon: Stethoscope, label: "Mobile Health Clinic", href: "/wego" },
  { icon: FileText, label: "Birth/Death Certificates", href: "https://dph.georgia.gov/VitalRecords" },
  { icon: Phone, label: "ECHD Directory", href: "/directory" },
  { icon: Heart, label: "Immunizations", href: "https://dph.georgia.gov/immunizations" },
  { icon: ClipboardCheck, label: "Restaurant Scores", href: "https://ga.healthinspections.us/stateofgeorgia/" },
  { icon: Apple, label: "WIC", href: "/wic" },
  { icon: Users, label: "Volunteers", href: "/volunteers" },
];

const Index = () => {
  const { data: news = [], isLoading: newsLoading } = usePosts(4);
  const { data: upcomingEvents = [] } = useEvents({ upcomingOnly: true, limit: 4 });

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader
        utilityExtras={
          <div className="flex flex-wrap items-center gap-2">
            <SocialIcons />
            <a
              href="https://ecphd.com/intranet/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Employee Login
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <a
              href="https://harrispublichealth.com/portal/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Patient Portal
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        }
        mobileQuickAction={
          <a
            href="https://harrispublichealth.com/portal/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-brand-foreground px-3 py-2 text-xs font-semibold text-brand hover:bg-brand-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-foreground"
          >
            Patient Portal
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        }
        mobileUtilityExtras={
          <div className="flex flex-col gap-3">
            <a
              href="https://ecphd.com/intranet/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded bg-brand-foreground px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-foreground"
            >
              Employee Login
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-foreground/80">
                Follow us
              </p>
              <SocialIcons size="md" wrap />
            </div>
          </div>
        }
      />


      {/* ============ MAIN ============ */}
      <main id="main" className="container grid gap-8 py-6 md:py-10 lg:grid-cols-[1fr_320px]">
        <section aria-label="Featured" className="space-y-8">
          <HeroSlider />

          <section aria-labelledby="news-heading">
            <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
              <h2 id="news-heading" className="text-2xl font-semibold">
                Public Health News
              </h2>
              <a
                href="/news"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                View All News &amp; Events
              </a>
            </div>

            {newsLoading && (
              <p className="py-4 text-sm text-muted-foreground">Loading…</p>
            )}

            {!newsLoading && news.length === 0 && (
              <p className="py-4 text-sm text-muted-foreground">
                No news posts have been published yet.
              </p>
            )}

            <ul className="divide-y divide-border">
              {news.map((item) => (
                <li key={item.id} className="flex gap-3 py-4 sm:gap-4 sm:py-5">
                  {item.featured_image_url ? (
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      loading="lazy"
                      className="h-16 w-20 shrink-0 rounded object-cover sm:h-20 sm:w-28"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-16 w-20 shrink-0 rounded bg-muted sm:h-20 sm:w-28"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">
                      {formatPostDate(item.published_at)}
                      {item.post_type === "event" && " • Event"}
                    </p>
                    <h3 className="text-base font-semibold leading-snug sm:text-lg">
                      <a
                        href={`/news/${item.slug}`}
                        className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                      >
                        {item.title}
                      </a>
                    </h3>
                    {item.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-none">
                        {item.excerpt}
                      </p>
                    )}
                    <a
                      href={`/news/${item.slug}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                      aria-label={`Read more: ${item.title}`}
                    >
                      Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <a
                href="/news"
                className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                View All News &amp; Events <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </section>

          {upcomingEvents.length > 0 && (
            <section aria-labelledby="upcoming-events-heading">
              <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
                <h2 id="upcoming-events-heading" className="text-2xl font-semibold">
                  Upcoming Events
                </h2>
                <a
                  href="/calendar"
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  View Full Calendar
                </a>
              </div>
              <ul className="space-y-3">
                {upcomingEvents.map((e) => {
                  const key = eventDateKey(e);
                  const dateLabel = key
                    ? formatDateKey(key, { weekday: "short", month: "short", day: "numeric" })
                    : formatPostDate(e.published_at);
                  return (
                    <li key={e.id} className="flex gap-4 rounded-lg border border-border p-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded bg-muted text-center">
                        <CalendarIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="mt-0.5 text-xs font-semibold text-foreground">{dateLabel}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground">
                          <a
                            href={`/news/${e.slug}`}
                            className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                          >
                            {e.title}
                          </a>
                        </h3>
                        {(e.event_time || e.event_location) && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {e.event_time}
                            {e.event_time && e.event_location && " • "}
                            {e.event_location && (
                              <>
                                <MapPin className="mr-1 inline h-3 w-3" aria-hidden="true" />
                                {e.event_location}
                              </>
                            )}
                          </p>
                        )}
                        {e.excerpt && (
                          <p className="mt-1 text-sm text-muted-foreground">{e.excerpt}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </section>

        {/* ============ SIDEBAR ============ */}
        <aside aria-label="Sidebar" className="space-y-8">
          <section aria-labelledby="quick-links-heading" className="rounded-lg border border-border p-5">
            <h2 id="quick-links-heading" className="mb-4 text-xl font-semibold">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {quickLinks.map(({ icon: Icon, label, href }) => {
                const external = href.startsWith("http");
                return (
                  <li key={href}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="flex items-center gap-3 rounded px-3 py-2 text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="font-medium underline-offset-2 hover:underline">
                        {label}
                        {external && <span className="sr-only"> (opens in new tab)</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="/programs"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View All Programs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>

          <a
            href="/calendar"
            className="flex w-full items-center justify-center rounded bg-brand px-4 py-3 font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Calendar of Events
          </a>

          <section aria-labelledby="stay-connected-heading">
            <h2 id="stay-connected-heading" className="mb-3 text-xl font-semibold">
              Stay Connected
            </h2>
            <SocialIcons size="lg" />
          </section>
        </aside>
      </main>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </div>
  );
};

export default Index;
