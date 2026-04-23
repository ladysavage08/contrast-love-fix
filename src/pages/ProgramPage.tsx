import { ArrowRight, Phone, Mail } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getProgramBySlug } from "@/data/programs";

/**
 * Reusable program/service detail page.
 * One template for all 16 programs — content driven by `src/data/programs.ts`.
 * Layout mirrors the existing content-page rhythm (H1 + gold rule + body
 * sections + sidebar) used elsewhere on the site.
 */
const ProgramPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? getProgramBySlug(slug) : undefined;

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  const phone = program.contact?.phone ?? "706-721-5800";
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
              <li aria-current="page" className="text-foreground">
                {program.title}
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">{program.title}</h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {program.intro}
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* Topics / sub-services */}
              <section aria-labelledby="topics-heading">
                <h2
                  id="topics-heading"
                  className="text-2xl font-semibold"
                >
                  Resources &amp; Topics
                </h2>
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-16 bg-accent-gold"
                />
                {program.subtopics.length > 0 ? (
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {program.subtopics.map((s) => (
                      <li key={s.label} className="py-3">
                        {s.href ? (
                          <Link
                            to={s.href}
                            className="inline-flex items-center gap-2 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                          >
                            {s.label}
                            <ArrowRight
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : (
                          <span className="text-base text-foreground/90">
                            {s.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-base leading-relaxed text-foreground/90">
                    Additional resources for this program are coming soon.
                    Please contact us using the information in the sidebar to
                    learn more or request services.
                  </p>
                )}
              </section>

              {/* CTA band */}
              <section
                aria-labelledby="cta-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <h2
                  id="cta-heading"
                  className="text-xl font-semibold"
                >
                  Need help or have a question?
                </h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  Our team can answer questions about {program.title.toLowerCase()},
                  connect you with services, or refer you to the right county
                  health department.
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
                    to="/counties"
                    className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Find a County Office
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            </div>

            <aside aria-label="Sidebar" className="space-y-6">
              <section
                aria-labelledby="contact-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2
                  id="contact-heading"
                  className="text-xl font-semibold"
                >
                  Contact
                </h2>
                <p className="mt-3 text-sm text-foreground/90">
                  {program.contact?.note ??
                    "Call the East Central Health District main line and ask to be connected to this program."}
                </p>
                <a
                  href={phoneHref}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
                {program.contact?.email && (
                  <a
                    href={`mailto:${program.contact.email}`}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {program.contact.email}
                  </a>
                )}
              </section>

              <section
                aria-labelledby="more-heading"
                className="rounded-lg border border-border p-5"
              >
                <h2
                  id="more-heading"
                  className="text-xl font-semibold"
                >
                  Browse Programs
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

export default ProgramPage;
