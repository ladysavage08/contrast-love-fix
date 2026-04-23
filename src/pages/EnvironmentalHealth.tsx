import { ArrowRight, ClipboardList, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  ehProgramSlugs,
  ehRelatedSlugs,
  getEhSubpages,
} from "@/data/environmentalHealth";

/**
 * Environmental Health — section index.
 * Mirrors the rhythm of /programs (breadcrumb, H1 + gold rule, intro, tile
 * grid, sidebar) so the new section reads as part of the existing site.
 */
const EnvironmentalHealth = () => {
  const programs = getEhSubpages(ehProgramSlugs);
  const related = getEhSubpages(ehRelatedSlugs);

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
                Environmental Health
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              Environmental Health
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Our Environmental Health Programs provide primary prevention
              through a combination of surveillance, education, enforcement,
              and assessment programs designed to identify, prevent and abate
              the environmental conditions that adversely impact human health.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* Programs */}
              <section aria-labelledby="programs-heading">
                <h2
                  id="programs-heading"
                  className="text-2xl font-semibold"
                >
                  Would you like information on our programs?
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-16 bg-accent-gold"
                />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Choose a program below to learn more about its rules,
                  regulations, and resources.
                </p>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {programs.map((p) => (
                    <li key={p.slug}>
                      <Link
                        to={`/environmental-health/${p.slug}`}
                        className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <h3 className="text-base font-semibold text-primary">
                          {p.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/90">
                          {p.summary}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 group-hover:underline">
                          Learn more
                          <ArrowRight
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Restaurant Scores callout */}
              <section
                aria-labelledby="scores-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <div className="flex items-start gap-3">
                  <ClipboardList
                    className="mt-1 h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h2
                      id="scores-heading"
                      className="text-xl font-semibold"
                    >
                      Restaurant Scores
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-foreground/90">
                      Look up the most recent inspection score for any
                      restaurant or retail food establishment in the district.
                    </p>
                    <Link
                      to="/environmental-health/restaurant-scores"
                      className="mt-4 inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      View Restaurant Scores
                      <ArrowRight
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Related pages */}
              <section aria-labelledby="related-heading">
                <h2
                  id="related-heading"
                  className="text-2xl font-semibold"
                >
                  Related Pages &amp; Resources
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-16 bg-accent-gold"
                />
                <ul className="mt-5 divide-y divide-border border-y border-border">
                  {related.map((p) => (
                    <li key={p.slug} className="py-3">
                      <Link
                        to={`/environmental-health/${p.slug}`}
                        className="inline-flex items-center gap-2 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                      >
                        {p.title}
                        <ArrowRight
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </Link>
                      <p className="mt-1 text-sm text-foreground/80">
                        {p.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <aside aria-label="Sidebar" className="space-y-6">
              <section
                aria-labelledby="local-heading"
                className="rounded-lg border border-border p-5"
              >
                <div className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <h2
                      id="local-heading"
                      className="text-xl font-semibold"
                    >
                      Offered in Every County
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      Environmental Health Programs are offered in each of our
                      13 counties. Locate your local Public Health Department
                      for in-person services.
                    </p>
                    <Link
                      to="/counties"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                    >
                      Find your county
                      <ArrowRight
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
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
                  Explore the full list of programs and services offered across
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

export default EnvironmentalHealth;
