import {
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  Users,
  Leaf,
  HeartPulse,
  MapPin,
  Phone,
  Target,
  Eye,
  HandHeart,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import aboutHero from "@/assets/about-hero.jpg";
import aboutWho from "@/assets/about-who.jpg";

/**
 * About ECHD — mirrors the homepage rhythm:
 *  - SiteHeader + utility extras
 *  - Brand hero with overlay (matches HeroSlider treatment)
 *  - Section H2 with gold accent rule
 *  - Semantic tokens only (no hard-coded colors)
 *  - Min 4.5:1 contrast for all text
 */

const services = [
  {
    icon: Stethoscope,
    title: "Clinical Services",
    body:
      "Primary preventive care, immunizations, family planning, and screenings at health departments across all 13 counties.",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Care",
    body:
      "Vaccinations, STD testing, tuberculosis control, and chronic disease prevention to keep our communities healthy.",
  },
  {
    icon: Users,
    title: "Community Outreach",
    body:
      "The WeGo Mobile Health Clinic and partnerships that bring services directly into neighborhoods, schools, and events.",
  },
  {
    icon: Leaf,
    title: "Environmental Health",
    body:
      "Restaurant inspections, well-water testing, septic permitting, and rabies control that protect public safety.",
  },
];

const stats = [
  { value: "13", label: "Counties Served" },
  { value: "100K+", label: "Patient Visits Annually" },
  { value: "40+", label: "Programs & Services" },
  { value: "1", label: "Mission — Healthier Communities" },
];

const values = [
  { icon: HandHeart, label: "Compassion", body: "Care delivered with respect and dignity." },
  { icon: ShieldCheck, label: "Integrity", body: "Trustworthy, transparent public service." },
  { icon: HeartPulse, label: "Equity", body: "Access to care regardless of circumstance." },
];

const About = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        {/* ===== Hero ===== */}
        <section
          aria-labelledby="about-hero-heading"
          className="relative isolate overflow-hidden"
        >
          <img
            src={aboutHero}
            alt=""
            width={1920}
            height={800}
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          {/* Dark overlay for text contrast (≥ 4.5:1) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground/85 via-foreground/70 to-foreground/40"
          />
          <div className="container py-16 md:py-24">
            <div className="max-w-2xl text-background">
              <p className="text-sm font-semibold uppercase tracking-wide text-background/90">
                About Us
              </p>
              <h1
                id="about-hero-heading"
                className="mt-2 text-3xl font-bold leading-tight md:text-5xl"
              >
                About East Central Health District
              </h1>
              <div aria-hidden="true" className="mt-4 h-1 w-20 bg-accent-gold" />
              <p className="mt-5 text-base leading-relaxed text-background/95 md:text-lg">
                Serving 13 counties across Georgia with a commitment to
                healthier communities — one neighborhood, one family, one
                visit at a time.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/counties"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  View Locations
                </a>
                <a
                  href="/wego/contact"
                  className="inline-flex items-center justify-center gap-2 rounded border border-background bg-background/0 px-5 py-3 text-sm font-semibold text-background hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Who We Are ===== */}
        <section aria-labelledby="who-heading" className="container py-12 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="who-heading" className="text-2xl font-semibold md:text-3xl">
                Who We Are
              </h2>
              <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
              <p className="mt-5 text-base leading-relaxed text-foreground/90">
                The East Central Health District (District 6) is part of the
                Georgia Department of Public Health. We coordinate public
                health services for 13 counties in east-central Georgia.
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                Our county health departments, district programs, and the
                <strong className="font-semibold"> WeGo Mobile Health Clinic </strong>
                work together to prevent disease, promote wellness, and protect
                the public from environmental health hazards.
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                When transportation, time, or distance get in the way, we come
                to you — because <em>we go where you are</em>.
              </p>
            </div>
            <div>
              <img
                src={aboutWho}
                alt="A nurse in scrubs speaking warmly with a patient inside a community health clinic"
                loading="lazy"
                width={1024}
                height={768}
                className="h-auto w-full rounded-lg border border-border object-cover shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* ===== Mission & Vision ===== */}
        <section
          aria-labelledby="mv-heading"
          className="border-y border-border bg-muted"
        >
          <div className="container py-12 md:py-16">
            <h2 id="mv-heading" className="text-2xl font-semibold md:text-3xl">
              Our Mission &amp; Vision
            </h2>
            <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <article className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <Target className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold">Mission</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  To prevent disease, promote health, and protect the
                  communities of East Central Georgia through trusted public
                  health services.
                </p>
              </article>

              <article className="rounded-lg border border-border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-xl font-semibold">Vision</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  Healthier people in healthier communities — every county,
                  every neighborhood, every life we touch.
                </p>
              </article>
            </div>

            {/* Values */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold">Our Values</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {values.map(({ icon: Icon, label, body }) => (
                  <li
                    key={label}
                    className="rounded-lg border border-border bg-background p-5"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <p className="font-semibold">{label}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== What We Do ===== */}
        <section aria-labelledby="services-heading" className="container py-12 md:py-16">
          <h2 id="services-heading" className="text-2xl font-semibold md:text-3xl">
            What We Do
          </h2>
          <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/90">
            From everyday preventive care to district-wide outreach, our team
            delivers a broad range of public health services across District 6.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="flex flex-col rounded-lg border border-border bg-background p-5 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Mobile Clinic — We Go Where You Are ===== */}
        <section
          aria-labelledby="wego-heading"
          className="border-y border-border bg-muted"
        >
          <div className="container py-12 md:py-16">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  Mobile Health Clinic
                </p>
                <h2
                  id="wego-heading"
                  className="mt-2 text-2xl font-semibold md:text-3xl"
                >
                  We Go Where You Are
                </h2>
                <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
                <p className="mt-5 text-base leading-relaxed text-foreground/90">
                  The WeGo Mobile Health Clinic brings preventive care,
                  screenings, immunizations, and health education directly into
                  the neighborhoods, schools, workplaces, and community events
                  of East Central Georgia.
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  No clinic visit, no transportation, no problem. Our team
                  partners with churches, employers, schools, and community
                  organizations across all 13 counties to remove the barriers
                  that keep people from the care they need.
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  It's a simple promise, and one we keep every week:
                  <strong className="font-semibold"> we go where you are.</strong>
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href="/wego/schedule"
                    className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    View Schedule
                  </a>
                  <a
                    href="/wego"
                    className="inline-flex items-center justify-center gap-2 rounded border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Learn About WeGo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <aside
                aria-label="Mobile Health Clinic at a glance"
                className="rounded-lg border border-border bg-background p-5"
              >
                <h3 className="text-lg font-semibold">Mobile Clinic at a Glance</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Service area</dt>
                    <dd className="font-medium">All 13 counties</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Care</dt>
                    <dd className="font-medium">Preventive &amp; screenings</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Call</dt>
                    <dd className="font-medium">
                      <a
                        href="tel:18778849346"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        1-877-884-WEGO
                      </a>
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {/* ===== By the Numbers ===== */}
        <section
          aria-labelledby="impact-heading"
          className="bg-brand text-brand-foreground"
        >
          <div className="container py-12 md:py-16">
            <h2 id="impact-heading" className="text-2xl font-semibold md:text-3xl">
              Our Impact
            </h2>
            <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-foreground/95">
              Public health works best when it reaches everyone. Here's a
              snapshot of how we serve East Central Georgia.
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ value, label }) => (
                <li
                  key={label}
                  className="rounded-lg border border-brand-foreground/20 bg-brand-foreground/5 p-6 text-center"
                >
                  <p className="text-3xl font-bold md:text-4xl">{value}</p>
                  <p className="mt-2 text-sm font-medium text-brand-foreground/95">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== Leadership / District Info ===== */}
        <section aria-labelledby="leadership-heading" className="container py-12 md:py-16">
          <h2 id="leadership-heading" className="text-2xl font-semibold md:text-3xl">
            District Leadership
          </h2>
          <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <p className="text-base leading-relaxed text-foreground/90">
              East Central Health District is led by a District Health
              Director and a team of clinical, environmental health, and
              community health professionals. Together they oversee programs
              across our 13 counties and coordinate with the Georgia
              Department of Public Health on statewide initiatives.
            </p>
            <aside
              aria-label="District at a glance"
              className="rounded-lg border border-border p-5"
            >
              <h3 className="text-lg font-semibold">District at a Glance</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">District</dt>
                  <dd className="font-medium">6</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Counties</dt>
                  <dd className="font-medium">13</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Headquarters</dt>
                  <dd className="font-medium">Augusta, GA</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          aria-labelledby="cta-heading"
          className="border-t border-border bg-muted"
        >
          <div className="container py-12 md:py-16">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 id="cta-heading" className="text-2xl font-semibold md:text-3xl">
                  Find Services Near You
                </h2>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  Connect with your local county health department or reach
                  out to our district team. We're here to help.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/counties"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  View Locations
                </a>
                <a
                  href="tel:17067216614"
                  className="inline-flex items-center justify-center gap-2 rounded border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Contact Us
                </a>
                <a
                  href="/wego"
                  className="inline-flex items-center gap-1 self-center text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  Learn about WeGo <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </div>
  );
};

export default About;
