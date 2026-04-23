import {
  FileText, Stethoscope, Syringe, Activity, HeartPulse, Apple,
  MapPin, Bus, Clock, Phone, ShieldCheck, Baby, FlaskConical,
  Salad, FileWarning, ClipboardList, ScrollText, FileCheck,
  Newspaper, Calendar, Mail, ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Task = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
type Section = { title: string; items: Task[] };

const SECTIONS: Section[] = [
  {
    title: "Get Services",
    items: [
      { label: "Get a birth certificate", href: "/vital-records", icon: FileText },
      { label: "Get a death certificate", href: "/vital-records", icon: FileText },
      { label: "Get a physical (sports, school, work)", href: "/programs", icon: Stethoscope },
      { label: "Get vaccinated", href: "/immunizations", icon: Syringe },
      { label: "Get a health screening (A1C, cholesterol, blood pressure)", href: "/programs", icon: Activity },
      { label: "Get family planning services", href: "/womens-health/family-planning", icon: HeartPulse },
      { label: "Get help with WIC", href: "/wic", icon: Apple },
    ],
  },
  {
    title: "Find Care",
    items: [
      { label: "Find a health department near me", href: "/counties", icon: MapPin },
      { label: "Find the Mobile Clinic (We Go Where You Are)", href: "/wego", icon: Bus },
      { label: "View clinic hours and locations", href: "/counties", icon: Clock },
      { label: "Contact a health department", href: "/contact", icon: Phone },
    ],
  },
  {
    title: "Protect My Health",
    items: [
      { label: "Learn about vaccines", href: "/immunizations", icon: Syringe },
      { label: "Learn about COVID/Flu", href: "/programs", icon: ShieldCheck },
      { label: "Get STD testing information", href: "/programs", icon: FlaskConical },
      { label: "Learn about chronic disease prevention", href: "/programs", icon: HeartPulse },
      { label: "Learn about women's health services", href: "/womens-health", icon: HeartPulse },
      { label: "Learn about children's health services", href: "/programs", icon: Baby },
    ],
  },
  {
    title: "Food & Environment",
    items: [
      { label: "Check restaurant scores", href: "/environmental-health/restaurant-scores", icon: ClipboardList },
      { label: "Report a concern (food, sanitation, etc.)", href: "/contact", icon: FileWarning },
      { label: "Learn about food safety", href: "/environmental-health/foodservice", icon: Salad },
      { label: "Learn about environmental health services", href: "/environmental-health", icon: ShieldCheck },
    ],
  },
  {
    title: "Permits, Records & Forms",
    items: [
      { label: "Apply for permits (food service, septic, etc.)", href: "/environmental-health", icon: FileCheck },
      { label: "View or download forms", href: "/environmental-health", icon: ScrollText },
      { label: "Register for CPR / ServSafe", href: "/environmental-health/servsafe-registration-form", icon: ClipboardList },
      { label: "View public health regulations", href: "/environmental-health/state-regulations", icon: ScrollText },
    ],
  },
  {
    title: "Stay Informed",
    items: [
      { label: "View public health news and updates", href: "/news", icon: Newspaper },
      { label: "View upcoming events", href: "/news", icon: Calendar },
      { label: "Sign up for updates", href: "/contact", icon: Mail },
    ],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>I Want To…</span>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">I Want To…</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            What do you want to do today? Choose a task below to jump straight to
            the service, location, or information you need.
          </p>
        </header>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section
              key={section.title}
              aria-labelledby={`sec-${section.title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <h2
                id={`sec-${section.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="mb-4 border-b border-border pb-2 text-xl font-semibold"
              >
                {section.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="group flex h-full items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {label}
                      </span>
                      <ArrowRight
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Services;
