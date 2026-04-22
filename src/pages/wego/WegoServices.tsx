import { Calendar, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import WegoLayout from "@/components/wego/WegoLayout";

/**
 * WeGo Services — structured, editable list of services offered on the
 * Mobile Health Clinic. Layout intentionally simple (definition-list style
 * stacked sections, no fancy cards) to match the ADA site's content rhythm.
 */

type Service = { title: string; description: string };

const SERVICES: Service[] = [
  {
    title: "Physicals",
    description:
      "Routine physical exams for school, sports, and employment. Walk-ins welcome during clinic hours.",
  },
  {
    title: "Adult Vaccines",
    description:
      "Recommended adult immunizations including flu, Tdap, shingles, and COVID-19 vaccines as supplies allow.",
  },
  {
    title: "Blood Pressure Checks",
    description:
      "Free blood pressure screenings with on-the-spot results and referrals when follow-up is needed.",
  },
  {
    title: "Cholesterol & A1C Screenings",
    description:
      "Finger-stick screenings for cholesterol and A1C (blood sugar) to help identify cardiovascular and diabetes risk.",
  },
  {
    title: "Diabetes Management",
    description:
      "Education, monitoring, and referrals to help patients manage type 1, type 2, and gestational diabetes.",
  },
  {
    title: "WIC Referrals",
    description:
      "Connection to the Women, Infants, and Children (WIC) program for nutrition assistance and breastfeeding support.",
  },
  {
    title: "Well-Child Checks",
    description:
      "Age-appropriate well-child exams, growth monitoring, and immunization reviews for infants through adolescents.",
  },
  {
    title: "Sexual Health",
    description:
      "Confidential testing and education for sexually transmitted infections, including counseling and treatment referrals.",
  },
  {
    title: "Family Planning",
    description:
      "Counseling on contraception options, reproductive health, and referrals for ongoing care.",
  },
];

const WegoServices = () => {
  return (
    <WegoLayout breadcrumb={[{ label: "Services" }]}>
      <div className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Services</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            The Mobile Health Clinic offers the following services at every
            stop. All services are available regardless of insurance status.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <section aria-label="Service list">
            <ul className="divide-y divide-border border-y border-border">
              {SERVICES.map((s) => (
                <li key={s.title} className="py-5">
                  <h2 className="text-xl font-semibold text-primary">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-foreground/90">
                    {s.description}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-muted-foreground">
              Service availability may vary by stop. Call{" "}
              <a
                href="tel:18778849346"
                className="font-semibold text-primary underline-offset-2 hover:underline"
              >
                1-877-884-WEGO (9346)
              </a>{" "}
              to confirm a specific service before your visit.
            </p>
          </section>

          <aside aria-label="Sidebar" className="space-y-6">
            <section
              aria-labelledby="visit-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="visit-heading" className="text-xl font-semibold">
                Plan Your Visit
              </h2>
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
            </section>
          </aside>
        </div>
      </div>
    </WegoLayout>
  );
};

export default WegoServices;
