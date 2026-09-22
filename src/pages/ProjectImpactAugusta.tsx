import { Link } from "react-router-dom";
import { ExternalLink, Home, Mail } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * Project Impact Augusta — HIV/STI prevention and outreach program page.
 */
const CONDOM_FORM_URL = "https://forms.cloud.microsoft/g/5avd7qg7TA";

const ProjectImpactAugusta = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/programs" className="text-primary underline-offset-2 hover:underline">
            Programs &amp; Services
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Project Impact Augusta</span>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">Project Impact Augusta</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            HIV and STI prevention, testing, and outreach for the Augusta area.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="about-heading" className="max-w-3xl">
            <h2 id="about-heading" className="text-2xl font-semibold">
              About Project Impact Augusta
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
              <p>
                Project Impact Augusta is an HIV and STI prevention and outreach
                effort of the East Central Health District. The program focuses
                on community education, prevention resources, testing, and
                linkage to care for people in the Augusta area.
              </p>
              <p>
                Services are confidential. Staff can help connect you with
                testing, prevention tools, and follow-up care, and can answer
                questions about how to protect yourself and your partners.
              </p>
            </div>

            <section
              aria-labelledby="condoms-heading"
              className="mt-10 rounded-lg border border-border bg-card p-6"
            >
              <h2 id="condoms-heading" className="text-xl font-semibold">
                Request Free Condoms by Mail
              </h2>
              <p className="mt-2 text-base leading-relaxed text-foreground/90">
                Individuals can use our confidential online form to have free
                condoms mailed to them discreetly. Your request is private, the
                package is plain and unmarked, and there is no cost to you.
              </p>
              <div className="mt-4">
                <a
                  href={CONDOM_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Request Free Condoms by Mail using our confidential form (opens in a new tab)"
                  className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Request Free Condoms by Mail
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                The form opens in a new tab on a secure Microsoft Forms page.
              </p>
            </section>
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="more-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="more-heading" className="text-xl font-semibold">
                Related
              </h2>
              <Link
                to="/programs"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                All Programs &amp; Services
              </Link>
              <Link
                to="/hopwa"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                HOPWA Services
              </Link>
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ProjectImpactAugusta;
