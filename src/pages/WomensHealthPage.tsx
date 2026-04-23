import { ArrowRight, Mail, Phone } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getWhSubpageBySlug } from "@/data/womensHealth";

/**
 * Reusable Women's Health subpage.
 * One template for every Women's Health page — content driven by
 * `src/data/womensHealth.ts`. Layout matches the rest of the site
 * (breadcrumb, H1 + gold rule, intro, services, eligibility, resources,
 * contact sidebar, CTA).
 */
const WomensHealthPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getWhSubpageBySlug(slug) : undefined;

  if (!page) {
    return <Navigate to="/womens-health" replace />;
  }

  const phone = page.contact?.phone ?? "706-721-5800";
  const phoneHref = `tel:${phone.replace(/[^0-9]/g, "")}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-border bg-muted/40"
        >
          <div className="container py-3 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link
                  to="/"
                  className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to="/programs"
                  className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Programs and Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to="/womens-health"
                  className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Women's Health
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {page.title}
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">{page.title}</h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {page.intro}
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* Services / topics */}
              <section aria-labelledby="services-heading">
                <h2
                  id="services-heading"
                  className="text-2xl font-semibold"
                >
                  Services &amp; Topics
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-16 bg-accent-gold"
                />
                {page.services.length > 0 ? (
                  <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-relaxed text-foreground/90 marker:text-primary">
                    {page.services.map((s) => (
                      <li
                        key={s}
                        dangerouslySetInnerHTML={{ __html: s }}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-base leading-relaxed text-foreground/90">
                    Detailed service information is coming soon. Please use the
                    contact information in the sidebar to learn more.
                  </p>
                )}
              </section>

              {/* Eligibility */}
              {page.eligibility && (
                <section aria-labelledby="eligibility-heading">
                  <h2
                    id="eligibility-heading"
                    className="text-2xl font-semibold"
                  >
                    Who It's For
                  </h2>
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1 w-16 bg-accent-gold"
                  />
                  <p className="mt-4 text-base leading-relaxed text-foreground/90">
                    {page.eligibility}
                  </p>
                </section>
              )}

              {/* Resources */}
              {page.resources.length > 0 && (
                <section aria-labelledby="resources-heading">
                  <h2
                    id="resources-heading"
                    className="text-2xl font-semibold"
                  >
                    Resources &amp; Related Information
                  </h2>
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1 w-16 bg-accent-gold"
                  />
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {page.resources.map((r) => (
                      <li key={r.label} className="py-3">
                        {r.href ? (
                          <Link
                            to={r.href}
                            className="inline-flex items-center gap-2 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                          >
                            <span
                              dangerouslySetInnerHTML={{ __html: r.label }}
                            />
                            <ArrowRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : (
                          <span
                            className="text-base text-foreground/90"
                            dangerouslySetInnerHTML={{ __html: r.label }}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* CTA band */}
              <section
                aria-labelledby="cta-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <h2 id="cta-heading" className="text-xl font-semibold">
                  Ready to schedule or have questions?
                </h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  Our team can answer questions, confirm eligibility, or help
                  you schedule an appointment at the county office nearest you.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Contact Us
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/womens-health"
                    className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Back to Women's Health
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside aria-label="Sidebar" className="space-y-6">
              <section
                aria-labelledby="contact-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="contact-heading" className="text-xl font-semibold">
                  Contact
                </h2>
                <p className="mt-3 text-sm text-foreground/90">
                  {page.contact?.note ??
                    "Call the East Central Health District main line and ask to be connected to Women's Health."}
                </p>
                <a
                  href={phoneHref}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
                {page.contact?.email && (
                  <a
                    href={`mailto:${page.contact.email}`}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {page.contact.email}
                  </a>
                )}
              </section>

              <section
                aria-labelledby="more-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="more-heading" className="text-xl font-semibold">
                  Women's Health
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  Browse the full Women's Health section for programs,
                  screenings, and related resources.
                </p>
                <Link
                  to="/womens-health"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  View all Women's Health pages
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default WomensHealthPage;
