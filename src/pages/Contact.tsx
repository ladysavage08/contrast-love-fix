import { Phone, Mail, MapPin, AlertTriangle, Clock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";

/**
 * Contact ECHD — uses locked layout patterns:
 *  - SiteHeader + SiteFooter
 *  - Section H2 with semantic tokens
 *  - No new styles or layout structures
 */

const Contact = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        {/* ===== Hero ===== */}
        <section
          aria-labelledby="contact-hero-heading"
          className="border-b border-border bg-muted"
        >
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl">
              <h1
                id="contact-hero-heading"
                className="text-3xl font-semibold md:text-4xl"
              >
                Contact Us
              </h1>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-lg">
                We're here to help residents across all 13 counties of the
                East Central Public Health District. Reach out with questions
                about services, programs, or how to connect with your local
                health department.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Main Contact ===== */}
        <section
          aria-labelledby="main-contact-heading"
          className="border-b border-border"
        >
          <div className="container py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2">
                <h2
                  id="main-contact-heading"
                  className="text-2xl font-semibold md:text-3xl"
                >
                  Get in Touch
                </h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  For general questions, program information, or to be
                  directed to the right department, please call our main
                  district office. Our staff can connect you with clinical
                  services, environmental health, vital records, and
                  community programs.
                </p>
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  If you know which county health department you need, you
                  can also reach out to your local office directly. Visit
                  our{" "}
                  <a
                    href="/counties"
                    className="font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                  >
                    counties page
                  </a>{" "}
                  for local phone numbers and addresses.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <a
                    href="tel:17067215800"
                    className="flex items-start gap-3 rounded-lg border border-border p-5 hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Phone className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-muted-foreground">Main Phone</p>
                      <p className="text-lg font-semibold">706-721-5800</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 rounded-lg border border-border p-5">
                    <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-muted-foreground">District Office</p>
                      <p className="text-base font-medium">Augusta, GA</p>
                      <p className="text-sm text-muted-foreground">District 6 Headquarters</p>
                    </div>
                  </div>
                </div>
              </div>

              <aside
                aria-label="Office hours"
                className="rounded-lg border border-border p-5"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">Office Hours</h3>
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Monday – Thursday</dt>
                    <dd className="font-medium">8:00 AM – 5:00 PM</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Friday</dt>
                    <dd className="font-medium">Closed</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Weekends</dt>
                    <dd className="font-medium">Closed</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">
                  Individual county offices may have different hours. Please
                  call ahead to confirm.
                </p>
              </aside>
            </div>
          </div>
        </section>

        {/* ===== Contact Form ===== */}
        <section
          aria-labelledby="contact-form-heading"
          className="border-b border-border"
        >
          <div className="container py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-3">
              <div className="md:col-span-1">
                <h2
                  id="contact-form-heading"
                  className="text-2xl font-semibold md:text-3xl"
                >
                  Send Us a Message
                </h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  Use the form to send us a message. Submissions are routed
                  directly to our district office at{" "}
                  <span className="font-medium">ecphd@dph.ga.gov</span>.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  For medical emergencies, call <strong>911</strong>. For
                  urgent service questions during business hours, call{" "}
                  <a
                    href="tel:17067215800"
                    className="font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                  >
                    706-721-5800
                  </a>
                  .
                </p>
              </div>
              <div className="md:col-span-2">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Urgent vs Non-Urgent ===== */}
        <section
          aria-labelledby="urgent-heading"
          className="border-b border-border bg-muted"
        >
          <div className="container py-12 md:py-16">
            <h2
              id="urgent-heading"
              className="text-2xl font-semibold md:text-3xl"
            >
              Urgent vs Non-Urgent Needs
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/90">
              Knowing where to turn helps us serve you faster. Use the guidance
              below to choose the right contact for your situation.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Emergencies */}
              <div className="rounded-lg border border-destructive/40 bg-background p-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className="h-5 w-5 text-destructive"
                    aria-hidden="true"
                  />
                  <h3 className="text-lg font-semibold">Medical Emergencies</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  If you or someone else is experiencing a life-threatening
                  emergency, call <strong>911</strong> immediately. Do not
                  wait to contact our office.
                </p>
                <a
                  href="tel:911"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-destructive px-5 py-3 text-sm font-semibold text-destructive-foreground hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call 911
                </a>
              </div>

              {/* Non-Urgent */}
              <div className="rounded-lg border border-border bg-background p-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">Non-Urgent Inquiries</h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  For appointments, program questions, vital records, or
                  general information, call our main office during business
                  hours or contact your local county health department.
                </p>
                <a
                  href="tel:17067215800"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  706-721-5800
                </a>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-border bg-background p-6">
              <h3 className="text-lg font-semibold">
                Public Health Concerns After Hours
              </h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                For urgent public health matters outside of office hours
                (such as suspected disease outbreaks or environmental
                hazards), please contact the Georgia Department of Public
                Health or your local emergency services.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section
          aria-labelledby="contact-cta-heading"
          className="border-t border-border"
        >
          <div className="container py-12 md:py-16">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2
                  id="contact-cta-heading"
                  className="text-2xl font-semibold md:text-3xl"
                >
                  Find Your Local Health Department
                </h2>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  Each of our 13 counties has its own health department with
                  local staff ready to help.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/counties"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  View Counties
                </a>
                <a
                  href="mailto:info@ecphd.com"
                  className="inline-flex items-center justify-center gap-2 rounded border border-primary px-5 py-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Contact;
