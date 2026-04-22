import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ExternalLink, Phone, ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

/**
 * Temporary notice page shown for any route that isn't yet built out.
 * React Router's catch-all "*" sends every unresolved internal link here,
 * so users get a branded, accessible message instead of a raw 404.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Keep this for diagnostics — helps identify which links still need pages.
    console.warn(
      "Temporary notice shown for unresolved route:",
      location.pathname,
    );
    document.title = "Page Temporarily Unavailable — East Central Health District";
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="container max-w-2xl py-12 md:py-20">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm md:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Page Temporarily Unavailable
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
              We're updating this section
            </h1>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground md:text-lg">
              <p>
                We're currently updating this section of the website to improve
                content and accessibility.
              </p>
              <p>
                For immediate assistance, please visit{" "}
                <a
                  href="https://dph.ga.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  dph.ga.gov
                </a>{" "}
                or call{" "}
                <a
                  href="tel:+17067215800"
                  className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  706-721-5800
                </a>
                .
              </p>
              <p>Thank you for your patience.</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="https://dph.ga.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-base font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Visit dph.ga.gov
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="tel:+17067215800"
                className="inline-flex items-center justify-center gap-2 rounded border border-primary px-5 py-3 text-base font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call 706-721-5800
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-base font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Return Home
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          © East Central Health District · Georgia Department of Public Health
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
