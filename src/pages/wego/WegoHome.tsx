import { ArrowRight, Calendar, HeartPulse, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import WegoLayout from "@/components/wego/WegoLayout";

/**
 * WeGo Home — landing page for the Mobile Health Clinic program.
 * Layout rhythm and typography mirror the ADA homepage: hero with brand-blue
 * panel + gold accent stripe, content grid with sidebar, semantic headings.
 */

const servicesPreview = [
  "Physicals",
  "Adult Vaccines",
  "Blood Pressure Checks",
  "Cholesterol & A1C Screenings",
  "Diabetes Management",
  "WIC Referrals",
  "Well-Child Checks",
  "Sexual Health",
  "Family Planning",
];

const faqPreview = [
  { q: "What services are offered?", to: "/wego/faq" },
  { q: "Do I need insurance?", to: "/wego/faq" },
  { q: "What should I bring?", to: "/wego/faq" },
];

const WegoHome = () => {
  return (
    <WegoLayout>
      {/* Today's cancellation notice */}
      <div className="border-b border-border bg-destructive/10">
        <div
          role="alert"
          aria-live="polite"
          className="container flex items-start gap-3 py-4"
        >
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div className="text-sm leading-relaxed text-foreground">
            <span className="font-semibold text-destructive">
              Today's Mobile Health Clinic visit is cancelled
            </span>{" "}
            due to maintenance issues. We apologize for the inconvenience. For
            questions, call{" "}
            <a
              href="tel:18778849346"
              className="font-semibold text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              1-877-884-WEGO (9346)
            </a>
            .
          </div>
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section
        aria-label="Mobile Health Clinic introduction"
        className="border-b border-border bg-brand text-brand-foreground"
      >
        <div className="container grid gap-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-foreground/90 sm:text-sm">
              Mobile Health Clinic
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
              We Go Where You Are
            </h1>
            <div aria-hidden="true" className="mt-4 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-brand-foreground/90 md:text-lg">
              The Mobile Health Clinic brings public health services directly to
              communities across District 6 — bridging gaps in access with
              screenings, vaccines, well-child checks, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/wego/schedule"
                className="inline-flex items-center gap-2 rounded bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                View Schedule
              </Link>
              <Link
                to="/wego/services"
                className="inline-flex items-center gap-2 rounded border border-brand-foreground/60 px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-foreground"
              >
                Services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MAIN GRID ============ */}
      <div className="container grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {/* Video */}
          <section aria-labelledby="video-heading">
            <h2 id="video-heading" className="text-2xl font-semibold">
              Watch: Mobile Health Clinic
            </h2>
            <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
            <div className="mt-4 aspect-video w-full overflow-hidden rounded border border-border bg-muted">
              <iframe
                src="https://www.youtube.com/embed/8qkStjH0aUM"
                title="Mobile Health Clinic video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </section>

          {/* About preview */}
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-2xl font-semibold">
              About the Mobile Health Clinic
            </h2>
            <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
            <p className="mt-4 text-base leading-relaxed text-foreground/90">
              The East Central Health District operates a fully equipped Mobile
              Health Clinic that travels to communities throughout our 13-county
              service area. Our mission is simple: meet people where they are
              and remove barriers to essential public health services.
            </p>
            <Link
              to="/wego/about"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              Learn more about the Mobile Health Clinic <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>

          {/* Services preview */}
          <section aria-labelledby="services-heading">
            <div className="mb-3 flex items-end justify-between border-b border-border pb-2">
              <h2 id="services-heading" className="text-2xl font-semibold">
                Services Offered
              </h2>
              <Link
                to="/wego/services"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                View all services
              </Link>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {servicesPreview.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <HeartPulse className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-base text-foreground/90">{s}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Schedule preview */}
          <section aria-labelledby="schedule-heading">
            <div className="mb-3 flex items-end justify-between border-b border-border pb-2">
              <h2 id="schedule-heading" className="text-2xl font-semibold">
                Upcoming Stops
              </h2>
              <Link
                to="/wego/schedule"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                Full schedule
              </Link>
            </div>
            <p className="text-base text-foreground/90">
              Our schedule is updated regularly. Check the Schedule page for the
              latest list of dates, times, and community locations across
              District 6.
            </p>
            <Link
              to="/wego/schedule"
              className="mt-4 inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              View Schedule
            </Link>
          </section>

          {/* FAQ preview */}
          <section aria-labelledby="faq-heading">
            <div className="mb-3 flex items-end justify-between border-b border-border pb-2">
              <h2 id="faq-heading" className="text-2xl font-semibold">
                Frequently Asked
              </h2>
              <Link
                to="/wego/faq"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                All FAQs
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {faqPreview.map((f) => (
                <li key={f.q} className="py-3">
                  <Link
                    to={f.to}
                    className="flex items-center justify-between gap-3 text-base font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                  >
                    {f.q}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact CTA */}
          <section
            aria-labelledby="contact-heading"
            className="rounded-lg border border-border bg-muted p-6"
          >
            <h2 id="contact-heading" className="text-2xl font-semibold">
              Have a question?
            </h2>
            <p className="mt-2 text-base text-foreground/90">
              Call our toll-free line or send us a message — we're here to help
              you connect with the Mobile Health Clinic.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="tel:18778849346"
                className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call 1-877-884-WEGO
              </a>
              <Link
                to="/wego/contact"
                className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside aria-label="Sidebar" className="space-y-6">
          <section
            aria-labelledby="sidebar-call"
            className="rounded-lg border border-border p-5"
          >
            <h2 id="sidebar-call" className="text-xl font-semibold">
              Call Us
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Toll-free, Monday–Friday during business hours.
            </p>
            <a
              href="tel:18778849346"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              1-877-884-WEGO
            </a>
          </section>

          <section
            aria-labelledby="sidebar-area"
            className="rounded-lg border border-border p-5"
          >
            <h2 id="sidebar-area" className="text-xl font-semibold">
              Service Area
            </h2>
            <p className="mt-2 inline-flex items-start gap-2 text-sm text-foreground/90">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                All 13 counties of the East Central Health District (Georgia
                Public Health District 6).
              </span>
            </p>
            <Link
              to="/counties"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              See counties served <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>
    </WegoLayout>
  );
};

export default WegoHome;
