import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Phone, Stethoscope, HeartPulse, AlertTriangle, BookOpen, CalendarCheck, Baby, Users, MapPin } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImg from "@/assets/healthy-pregnancy-support.jpg";

/**
 * Healthy Pregnancy Starts with Support (/healthy-pregnancy-support).
 * Evergreen page: Pregnancy Medicaid (PE) assistance and Home Visiting are kept as two distinct services.
 * Coverage statements paraphrase Georgia Medicaid and Georgia DPH pages listed in SOURCES.
 */
const PHONE = "706-721-5800";
const TEL = "tel:+17067215800";
const MEDICAID_FAQ = "https://medicaid.georgia.gov/medicaid-application-faqs";
const DPH_PREG = "https://dph.georgia.gov/pregnancy-resources";
const MEDICAID_APPLY = "https://medicaid.georgia.gov/how-apply";
const SOURCES = [
  { href: MEDICAID_FAQ, label: "Georgia Medicaid — Medicaid Application FAQs" },
  { href: DPH_PREG, label: "Georgia Department of Public Health — Pregnancy Resources" },
  { href: MEDICAID_APPLY, label: "Georgia Medicaid — How to Apply" },
];
const COUNTIES = ["Richmond", "Burke", "Jefferson", "Jenkins", "Emanuel", "Screven"];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maternal";
const btnPrimary = `inline-flex min-h-11 items-center justify-center gap-2 rounded bg-maternal px-5 py-2.5 text-sm font-semibold text-maternal-foreground hover:bg-maternal-hover ${focusRing}`;
const btnOutline = `inline-flex min-h-11 items-center justify-center gap-2 rounded border-2 border-maternal bg-background px-5 py-2.5 text-sm font-semibold text-maternal hover:bg-maternal-soft ${focusRing}`;
const textLink = `inline-flex items-baseline gap-1 font-semibold text-maternal underline underline-offset-4 hover:text-maternal-hover ${focusRing}`;

const Ext = ({ href, label, className = btnOutline }: { href: string; label: string; className?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    {label}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const peFacts = [
  "Eligibility depends on program requirements.",
  "Qualifying applicants may receive temporary coverage quickly.",
  "PE Medicaid can help cover outpatient prenatal health care.",
  "A full Medicaid application is necessary for continued coverage.",
  "Temporary PE coverage does not include inpatient labor and delivery. Full pregnancy Medicaid has different benefits.",
];

const hvHelps = [
  { icon: HeartPulse, text: "Monitor health concerns such as high blood pressure and diabetes." },
  { icon: AlertTriangle, text: "Recognize potential pregnancy and postpartum warning signs." },
  { icon: BookOpen, text: "Provide health education and reinforce care plans." },
  { icon: CalendarCheck, text: "Help families stay connected to prenatal and postpartum care." },
  { icon: Baby, text: "Monitor infant health, feeding, and development as appropriate." },
  { icon: Users, text: "Connect families with healthcare providers and community resources." },
];

const steps = [
  { title: "Reach Out", body: <>Call East Central Health District at <a href={TEL} className={textLink}>{PHONE}</a> or contact your <Link to="/counties" className={textLink}>local county health department</Link>.</> },
  { title: "Ask About Available Support", body: "Our staff can help you learn about pregnancy Medicaid assistance, Home Visiting eligibility, and applicable referral options." },
  { title: "Get Connected", body: "Depending on eligibility and individual needs, staff can help connect you with resources and services supporting a healthier pregnancy." },
];

const faqs = [
  { q: "Can I apply for pregnancy Medicaid if I don't have insurance?", a: "Yes. Pregnant women who don't have insurance can apply for Georgia Medicaid. Approval depends on program rules, such as household income and residency. Your local health department can help you get started, and you can also apply through Georgia Medicaid directly." },
  { q: "What is Presumptive Eligibility Medicaid?", a: "Presumptive Eligibility (PE) Medicaid, sometimes called Presumptive Medicaid, provides temporary coverage for eligible pregnant women while their full Medicaid application is being reviewed. Qualified local health departments can help with the PE process." },
  { q: "Does temporary Medicaid cover delivery?", a: "No. Temporary PE coverage is for outpatient prenatal care and does not include inpatient labor and delivery. Full pregnancy Medicaid has different benefits, which is why completing the full Medicaid application is important." },
  { q: "Is the Home Visiting Program free?", a: "Yes. Home Visiting services are free and voluntary for eligible families." },
  { q: "Which counties offer Home Visiting?", a: "Our Home Visiting Program currently serves eligible families in Richmond, Burke, Jefferson, Jenkins, Emanuel, and Screven counties." },
  { q: "Do I need a referral for Home Visiting?", a: `Contact us to learn about referrals and enrollment. Call ${PHONE} and our staff can explain the referral options that apply to you.` },
  { q: "Can I receive home visits after my baby is born?", a: "Yes. Services support eligible families during pregnancy and through the baby's first year." },
];

const HealthyPregnancySupport = () => {
  useEffect(() => {
    document.title = "Healthy Pregnancy Starts with Support | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-maternal-soft">
          <div className="container py-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="text-primary underline-offset-2 hover:underline">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link to="/womens-health" className="text-primary underline-offset-2 hover:underline">Women's Health</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>Healthy Pregnancy Starts with Support</span>
            </nav>
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-maternal">Healthy Pregnancy Starts with Support</p>
                <h1 className="mt-2 text-3xl font-bold leading-tight text-maternal-navy sm:text-5xl">
                  Pregnant? You Don't Have to Navigate It Alone.
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                  From help accessing prenatal care to free home visiting services, East Central Health District
                  connects mothers and babies with the support they need.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href={TEL} className={btnPrimary}><Phone className="h-4 w-4" aria-hidden="true" />Call {PHONE}</a>
                  <a href="#services" className={btnOutline}>Explore Available Services</a>
                </div>
              </div>
              <img src={heroImg} width={1200} height={640} alt="A public health nurse checks the blood pressure of a smiling pregnant woman at home." className="w-full rounded-lg object-cover shadow-sm" />
            </div>
          </div>
        </section>

        <div className="container max-w-5xl space-y-16 py-12">
          <section aria-labelledby="why-heading">
            <h2 id="why-heading" className="text-2xl font-bold text-maternal-navy sm:text-3xl">Why Early Prenatal Care Matters</h2>
            <div className="mt-4 space-y-3 text-lg leading-relaxed text-foreground/90">
              <p>Premature birth occurs before 37 weeks of pregnancy and can increase the risk of health complications.</p>
              <p>Receiving prenatal care early and consistently helps healthcare providers monitor pregnancy, identify potential complications, and connect expectant mothers with appropriate treatment and resources.</p>
              <p>Not all premature births can be prevented, but access to timely medical care and support is important.</p>
            </div>
          </section>

          <section id="services" aria-labelledby="pe-heading" className="scroll-mt-24 rounded-lg border border-maternal-medium bg-maternal-soft p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-maternal">Service 1 · Pregnancy Medicaid assistance</p>
            <h2 id="pe-heading" className="mt-1 text-2xl font-bold text-maternal-navy sm:text-3xl">Pregnant and Uninsured? We Can Help.</h2>
            <h3 className="mt-4 text-xl font-semibold">Presumptive Eligibility (PE) Medicaid</h3>
            <p className="mt-2 leading-relaxed text-foreground/90">
              Presumptive Eligibility Medicaid, sometimes called Presumptive Medicaid, provides temporary coverage for
              eligible pregnant women while their full Medicaid eligibility is being determined. Qualified local health
              departments can assist pregnant women with the PE Medicaid process.
            </p>
            <ul className="mt-4 space-y-2">
              {peFacts.map((f) => (
                <li key={f} className="flex gap-3 rounded bg-background p-3 ring-1 ring-border">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-maternal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">Approval is not guaranteed. Coverage depends on Georgia Medicaid requirements.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/counties" className={btnPrimary}><MapPin className="h-4 w-4" aria-hidden="true" />Contact Your Local Health Department</Link>
              <Ext href={MEDICAID_APPLY} label="Georgia Medicaid Application" />
              <Ext href={MEDICAID_FAQ} label="Georgia Medicaid FAQs" />
              <Ext href={DPH_PREG} label="Georgia DPH Pregnancy Resources" />
            </div>
          </section>

          <section aria-labelledby="hv-heading">
            <p className="text-sm font-semibold uppercase tracking-wide text-maternal">Service 2 · Home Visiting</p>
            <h2 id="hv-heading" className="mt-1 text-2xl font-bold text-maternal-navy sm:text-3xl">Support Beyond the Doctor's Office</h2>
            <p className="mt-3 leading-relaxed text-foreground/90">
              East Central Health District participates in the Georgia DPH Home Visiting Program. The program provides
              free, voluntary visits from public health nurses and trained community health workers for eligible mothers
              and infants experiencing higher-risk situations. Services support families during pregnancy and through the
              baby's first year.
            </p>
            <h3 className="mt-6 text-xl font-semibold">How Home Visiting Can Help</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hvHelps.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 rounded-lg border border-border bg-card p-4">
                  <Icon className="h-6 w-6 shrink-0 text-maternal" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg border-l-4 border-maternal bg-maternal-soft p-4 text-sm leading-relaxed">
              <strong>Please note:</strong> Home visits complement regular medical appointments. They do not replace prenatal care.
            </p>
          </section>

          <section aria-labelledby="counties-heading" className="rounded-lg bg-maternal p-6 text-maternal-foreground sm:p-10">
            <h2 id="counties-heading" className="text-2xl font-bold sm:text-3xl">Counties Served by Our Home Visiting Program</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COUNTIES.map((c) => (
                <li key={c} className="rounded bg-background px-4 py-4 text-center text-lg font-bold text-maternal-navy">{c} County</li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed">
              Our Home Visiting Program currently serves eligible families in these six East Central Georgia counties.
              Contact us to learn about referrals and enrollment.
            </p>
            <Link to="/programs/home-visiting-program" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded bg-background px-5 py-3 text-base font-semibold text-maternal hover:bg-maternal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto">
              Learn More About the Home Visiting Program
            </Link>
          </section>

          <section aria-labelledby="start-heading">
            <h2 id="start-heading" className="text-2xl font-bold text-maternal-navy sm:text-3xl">How to Get Started</h2>
            <ol className="mt-6 grid gap-5 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="rounded-lg border-t-4 border-maternal bg-card p-6 shadow-sm ring-1 ring-border">
                  <p className="text-sm font-semibold uppercase tracking-wide text-maternal">Step {i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-foreground/90">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-maternal-navy sm:text-3xl">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="mt-4 rounded-lg border border-border bg-card px-4 sm:px-6">
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger className={`min-h-11 text-left text-lg font-semibold ${focusRing}`}><h3>{f.q}</h3></AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-foreground/90">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section aria-labelledby="closing-heading" className="rounded-lg border-2 border-maternal p-6 text-center sm:p-10">
            <h2 id="closing-heading" className="text-2xl font-bold text-maternal-navy sm:text-3xl">Healthy Moms. Healthy Babies. Healthier Communities.</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-foreground/90">
              Getting support early can make a meaningful difference. Contact East Central Health District to learn how we can help.
            </p>
            <div className="mt-6 flex justify-center">
              <a href={TEL} className={btnPrimary}><Phone className="h-4 w-4" aria-hidden="true" />Call {PHONE}</a>
            </div>
          </section>

          <section aria-labelledby="sources-heading" className="border-t border-border pt-8">
            <h2 id="sources-heading" className="text-lg font-semibold">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SOURCES.map((s) => <li key={s.href}><Ext href={s.href} label={s.label} className={textLink} /></li>)}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              This page provides general information and is not medical advice. Program eligibility and benefits are set by
              Georgia Medicaid and the Georgia Department of Public Health.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HealthyPregnancySupport;
