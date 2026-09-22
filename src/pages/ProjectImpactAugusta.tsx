import { Link } from "react-router-dom";
import { ExternalLink, Home, Mail, MapPin } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

/**
 * Project Impact Augusta — HIV/STI prevention and outreach program page.
 */
const CONDOM_FORM_URL = "https://forms.cloud.microsoft/g/5avd7qg7TA";
const SERVICE_AREA_MAP_URL =
  "https://www.google.com/maps/d/u/0/embed?mid=1rn22MXwt1Op2Zwt-JS3SSvTYdzrcnBFg";

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
            HIV prevention, care coordination, housing support, and community
            education across our service area.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="max-w-3xl space-y-10">
            <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-semibold">
              About Project Impact Augusta
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
              <p>
                For more than three decades, Project Impact, a program of the
                DPH East Central Health District, has worked to prevent the
                spread of HIV and help people affected by HIV/AIDS live well.
              </p>
              <p>
                Our holistic, client-centered approach provides a variety of
                services, including connecting clients with medical care and
                case management. We also work to address underlying needs,
                including stigma and inequality, to improve the health and
                wellness of everyone we serve.
              </p>
              <p>
                Our services extend across the East Central Health District’s
                13 counties, as well as Aiken and Edgefield counties in South
                Carolina.
              </p>
            </div>
            </section>

            <section aria-labelledby="hopwa-heading">
              <h2 id="hopwa-heading" className="text-2xl font-semibold">
                PI HOPWA
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                The Housing Opportunities for Persons With AIDS (HOPWA) program
                provides mortgage, rental, and utility assistance to eligible
                clients living within the East Central Health District’s 13
                counties. Clients must be referred to PI HOPWA by their medical
                provider or case manager. Assistance may also be available for
                rental deposits and the first month’s rent.
              </p>
            </section>

            <section aria-labelledby="care-heading">
              <h2 id="care-heading" className="text-2xl font-semibold">
                PI Care
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                PI Care provides comprehensive, client-centered care to
                individuals living with HIV/AIDS. We connect clients with a
                personalized combination of resources, referrals, and services
                designed to improve their health and quality of life.
              </p>
            </section>

            <section aria-labelledby="information-heading">
              <h2 id="information-heading" className="text-2xl font-semibold">
                HIV/AIDS Information
              </h2>
              <h3 className="mt-5 text-xl font-semibold">
                The Four “Gets” for HIV/AIDS
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-foreground/90">
                <li><strong>Get Informed</strong> – Lower Your Risk</li>
                <li><strong>Get Educated</strong> – Learn the Facts</li>
                <li><strong>Get Tested</strong> – Know Your Status</li>
                <li><strong>Get Involved</strong> – Become an Intern or Volunteer</li>
              </ul>
              <p className="mt-5 text-base leading-relaxed text-foreground/90">
                Everyone should speak with a healthcare provider about how often
                they should be tested for HIV based on their individual risk
                factors.
              </p>
              <div className="mt-5">
                <Button asChild size="lg">
                  <Link to="/counties">
                    <MapPin aria-hidden="true" />
                    Find Confidential HIV Testing Near You
                  </Link>
                </Button>
              </div>
            </section>

            <section aria-labelledby="resources-heading">
              <h2 id="resources-heading" className="text-2xl font-semibold">
                Other Health Department Resources
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                HIV can be prevented, but prevention starts with knowledge,
                testing, and access to care.
              </p>
              <div className="mt-5 space-y-5 text-foreground/90">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Need a speaker?</h3>
                  <p className="mt-1 leading-relaxed">
                    To arrange a speaking engagement about HIV/AIDS, contact a
                    Health Educator at <a href="tel:+17066674342" className="font-medium text-primary underline underline-offset-2">706-667-4342</a>.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Newly diagnosed or returning to care?
                  </h3>
                  <p className="mt-1 leading-relaxed">
                    For case management, support groups, or other resources,
                    contact our case managers at <a href="tel:+17066674342" className="font-medium text-primary underline underline-offset-2">706-667-4342</a>.
                  </p>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="condoms-heading"
              className="rounded-lg border border-border bg-card p-6"
            >
              <h2 id="condoms-heading" className="text-2xl font-semibold">
                Free Condoms by Mail
              </h2>
              <div className="mt-4">
                <Button asChild size="lg">
                  <a
                    href={CONDOM_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Request Free Condoms by Mail (opens in a new tab)"
                  >
                    <Mail aria-hidden="true" />
                    Request Free Condoms by Mail
                    <ExternalLink aria-hidden="true" />
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">
                Complete our confidential form to request free condoms delivered
                discreetly by mail.
              </p>
            </section>

            <section aria-labelledby="map-heading">
              <h2 id="map-heading" className="text-2xl font-semibold">
                Service Area Map
              </h2>
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                <iframe
                  src={SERVICE_AREA_MAP_URL}
                  title="Project Impact Augusta service area and testing locations"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                If the map does not display, {" "}
                <a
                  href={SERVICE_AREA_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2"
                  aria-label="open the Project Impact Augusta service area map in a new tab"
                >
                  open the service area map
                  <ExternalLink className="ml-1 inline h-4 w-4" aria-hidden="true" />
                </a>.
              </p>
            </section>
          </div>

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
