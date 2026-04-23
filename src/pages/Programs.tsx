import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { programs } from "@/data/programs";

/**
 * Programs and Services — index page.
 * Lists every program from `src/data/programs.ts` as a linked tile.
 * Layout intentionally mirrors the Counties index for visual consistency.
 */
const Programs = () => {
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
              <li aria-current="page" className="text-foreground">
                Programs and Services
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              Programs and Services
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              East Central Public Health serves the entire community through
              clinical care, environmental protection, and emergency response.
              We also provide targeted programs and services for residents who
              are underserved or face barriers to care — meeting people where
              they are with the resources they need.
            </p>
          </header>

          <section aria-label="Program list">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/programs/${p.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <h2 className="text-lg font-semibold text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/90">
                      {p.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 group-hover:underline">
                      Learn more
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Programs;
