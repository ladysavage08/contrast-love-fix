import { ArrowRight, Calendar, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import WegoLayout from "@/components/wego/WegoLayout";

/** WeGo About — mirrors ADA content-page rhythm: H1 + gold rule + body sections. */
const WegoAbout = () => {
  return (
    <WegoLayout breadcrumb={[{ label: "About" }]}>
      <div className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">
            About the Mobile Health Clinic
          </h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            The Mobile Health Clinic — known as WeGo — is the East Central
            Health District's traveling public health unit. It brings essential
            screenings, immunizations, and clinical services directly to
            communities across our 13-county service area.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section aria-labelledby="mission-heading">
              <h2 id="mission-heading" className="text-2xl font-semibold">
                Our Mission
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                Public health works best when it meets people where they are.
                The Mobile Health Clinic exists to remove the most common
                barriers to care — distance, transportation, scheduling, and
                trust — by bringing a fully equipped clinical environment into
                neighborhoods, schools, churches, and community events
                throughout District 6.
              </p>
            </section>

            <section aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-2xl font-semibold">
                Who We Serve
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                The clinic is open to children, adults, and seniors living in
                any of the 13 counties of the East Central Health District.
                Services are available regardless of insurance status, and
                staff can connect patients to additional district programs such
                as WIC, immunizations, and chronic disease management.
              </p>
            </section>

            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="text-2xl font-semibold">
                How It Works
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-foreground/90">
                <li>Find an upcoming stop on the Schedule page.</li>
                <li>
                  Walk up during clinic hours — most services do not require
                  an appointment.
                </li>
                <li>
                  Bring a photo ID and your insurance card if you have one.
                  Care is available for the uninsured.
                </li>
                <li>
                  After your visit, our team can refer you to a county health
                  department for follow-up care.
                </li>
              </ol>
            </section>

            <section aria-labelledby="accessibility-heading">
              <h2 id="accessibility-heading" className="text-2xl font-semibold">
                Accessibility
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                The Mobile Health Clinic is wheelchair accessible. Please call
                ahead at <a className="font-semibold text-primary underline-offset-2 hover:underline" href="tel:18778849346">1-877-884-WEGO (9346)</a> if you have specific accessibility
                questions or need accommodations for your visit.
              </p>
            </section>
          </div>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="cta-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="cta-heading" className="text-xl font-semibold">
                Plan Your Visit
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                See where the clinic will be next or call us with questions.
              </p>
              <Link
                to="/wego/schedule"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                View Schedule
              </Link>
              <a
                href="tel:18778849346"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                1-877-884-WEGO
              </a>
              <Link
                to="/wego/services"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                Browse all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoAbout;
