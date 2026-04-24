import { ArrowRight, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  getWhSubpages,
  whProgramSlugs,
  whRelatedSlugs,
} from "@/data/womensHealth";

/**
 * Women's Health — section index.
 * Layout intentionally mirrors the Environmental Health and Programs index
 * pages so it reads as part of the existing site (no redesign).
 */
const WomensHealth = () => {
  const programs = getWhSubpages(whProgramSlugs);
  const related = getWhSubpages(whRelatedSlugs);

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
              <li aria-current="page" className="text-foreground">
                Women's Health
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">Women's Health</h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Women's Health services focus on prevention, screenings,
              education, and long-term wellness — supporting women across every
              stage of life. Our team partners with you to detect problems
              early, manage ongoing conditions, and build healthy habits that
              improve outcomes for you and your family.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* Programs and Services */}
              <section aria-labelledby="programs-heading">
                <h2
                  id="programs-heading"
                  className="text-2xl font-semibold"
                >
                  Programs and Services
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-16 bg-accent-gold"
                />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Choose a program below to learn more about the services
                  offered, who's eligible, and how to get started.
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {programs.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/womens-health/${p.slug}`}
                        className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <h3 className="text-base font-semibold text-primary">
                          {p.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/90">
                          {p.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 group-hover:underline">
                          Learn more about {p.title}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Encouragement callout */}
              <section
                aria-labelledby="encourage-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <div className="flex items-start gap-3">
                  <HeartPulse
                    className="mt-1 h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h2
                      id="encourage-heading"
                      className="text-xl font-semibold"
                    >
                      Make preventive care a priority
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-foreground/90">
                      Regular screenings save lives. Many cancers and chronic
                      conditions are most treatable when caught early — and
                      most of our preventive services are free or low-cost
                      regardless of insurance status. If it's been more than a
                      year since your last well-woman visit, today is a good
                      day to schedule one.
                    </p>
                    <Link
                      to="/contact"
                      className="mt-4 inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Schedule or Ask a Question
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Related services */}
              {related.length > 0 && (
                <section aria-labelledby="related-heading">
                  <h2
                    id="related-heading"
                    className="text-2xl font-semibold"
                  >
                    Related Services
                  </h2>
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1 w-16 bg-accent-gold"
                  />
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {related.map((p) => (
                      <li key={p.slug} className="py-3">
                        <Link
                          to={`/womens-health/${p.slug}`}
                          className="inline-flex items-center gap-2 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                        >
                          {p.title}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <p className="mt-1 text-sm text-foreground/80">
                          {p.summary}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside aria-label="Sidebar" className="space-y-6">
              <section
                aria-labelledby="local-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2 id="local-heading" className="text-xl font-semibold">
                  Find Care Near You
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  Women's Health services are offered at health departments
                  across our 13 counties. Find your local office to schedule a
                  visit.
                </p>
                <Link
                  to="/counties"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Find your county
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>

              <section
                aria-labelledby="all-programs-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2
                  id="all-programs-heading"
                  className="text-xl font-semibold"
                >
                  All Programs &amp; Services
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  Browse the full list of programs and services offered across
                  the district.
                </p>
                <Link
                  to="/programs"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  View all programs
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

export default WomensHealth;
