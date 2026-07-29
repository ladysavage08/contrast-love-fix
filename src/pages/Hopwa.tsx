import { Link } from "react-router-dom";
import { ExternalLink, Home } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * HOPWA (Housing Opportunities for Persons With AIDS) services page.
 */
const APPLICATION_URL =
  "https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=1194ecf0-9e51-45e5-8999-e4f9cdb5de48&env=na3&acct=bf407b1b-6cb7-4aa9-8071-158b99ee1247&v=2";

const Hopwa = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/services" className="text-primary underline-offset-2 hover:underline">
            Services
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>HOPWA Services</span>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">HOPWA Services</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Housing Opportunities for Persons With AIDS
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="about-heading" className="max-w-3xl">
            <h2 id="about-heading" className="sr-only">About HOPWA</h2>
            <div className="space-y-4 text-base leading-relaxed text-foreground/90">
              <p>
                The Housing Opportunities for Persons With AIDS, commonly known
                as HOPWA, program provides housing assistance and supportive
                services to eligible individuals and families affected by
                HIV/AIDS. The program is designed to help participants maintain
                stable housing and improve their overall health and well-being.
              </p>
              <p>
                Available assistance may include housing-related support, help
                accessing community resources, and referrals to other supportive
                services. Eligibility requirements and available services may
                vary.
              </p>
            </div>

            <section
              aria-labelledby="apply-heading"
              className="mt-10 rounded-lg border border-border bg-card p-6"
            >
              <h2 id="apply-heading" className="text-xl font-semibold">
                Apply for HOPWA Services
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete the online HOPWA application to begin the eligibility
                process.
              </p>
              <div className="mt-4">
                <a
                  href={APPLICATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Apply for HOPWA Services Online (opens in a new tab)"
                  className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Apply for HOPWA Services Online
                </a>
              </div>
            </section>
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="more-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="more-heading" className="text-xl font-semibold">
                More Services
              </h2>
              <Link
                to="/services"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                View All Services
              </Link>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Hopwa;
