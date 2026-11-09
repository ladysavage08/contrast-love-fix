import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  Droplet,
  GlassWater,
  Scale,
  BatteryLow,
  Eye,
  Salad,
  Footprints,
  HeartPulse,
  ClipboardCheck,
  CalendarCheck,
  Stethoscope,
  BookOpen,
  Share2,
  HandHeart,
  ShieldCheck,
  Sprout,
  Phone,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * American Diabetes Month 2026 landing page (/diabetes-awareness-month).
 * Content paraphrased only from the CDC and ADA pages listed in SOURCES (verified Nov 9, 2026).
 * Page stays live after November as an educational resource — only the homepage slide expires.
 */
const CDC_ABOUT = "https://www.cdc.gov/diabetes/about/";
const CDC_STATS = "https://www.cdc.gov/diabetes/communication-resources/diabetes-statistics.html";
const CDC_SYMPTOMS = "https://www.cdc.gov/diabetes/signs-symptoms/";
const CDC_PREVENT = "https://www.cdc.gov/diabetes/prevention-type-2/";
const CDC_TESTING = "https://www.cdc.gov/diabetes/diabetes-testing/";
const CDC_NDPP = "https://www.cdc.gov/diabetes-prevention/lifestyle-change-program/";
const CDC_RISKTEST = "https://www.cdc.gov/prediabetes/risktest/index.html";
const ADA_MONTH = "https://diabetes.org/newsroom/press-releases/american-diabetes-month-it-all-matters";

const SOURCES = [
  { href: ADA_MONTH, label: "American Diabetes Association — American Diabetes Month: It All Matters" },
  { href: CDC_ABOUT, label: "CDC — Diabetes Basics" },
  { href: CDC_STATS, label: "CDC — Diabetes Statistics" },
  { href: CDC_SYMPTOMS, label: "CDC — Symptoms of Diabetes" },
  { href: CDC_PREVENT, label: "CDC — Preventing Type 2 Diabetes" },
  { href: CDC_TESTING, label: "CDC — Diabetes Testing" },
  { href: CDC_NDPP, label: "CDC — National Diabetes Prevention Program" },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-diabetes";
const btnPrimary = `inline-flex min-h-11 items-center justify-center gap-2 rounded bg-diabetes px-5 py-2.5 text-sm font-semibold text-diabetes-foreground hover:bg-diabetes-hover ${focusRing}`;
const btnOutline = `inline-flex min-h-11 items-center justify-center gap-2 rounded border-2 border-diabetes bg-background px-5 py-2.5 text-sm font-semibold text-diabetes hover:bg-diabetes-soft ${focusRing}`;
const textLink = `inline-flex items-baseline gap-1 font-semibold text-diabetes underline underline-offset-4 hover:text-diabetes-hover ${focusRing}`;

const Ext = ({ href, label, className = btnOutline }: { href: string; label: string; className?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    {label}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const stats = [
  { value: "40.1 million", body: "people in the United States have diabetes." },
  { value: "More than 2 in 5", body: "American adults have prediabetes." },
  { value: "About 8 in 10", body: "adults with prediabetes don't know they have it." },
];

const signs = [
  { icon: Droplet, title: "Frequent urination", body: "Needing to urinate often, including at night." },
  { icon: GlassWater, title: "Increased thirst", body: "Feeling very thirsty much of the time." },
  { icon: Scale, title: "Unexplained weight loss", body: "Losing weight without trying." },
  { icon: BatteryLow, title: "Unusual fatigue", body: "Feeling very tired." },
  { icon: Eye, title: "Blurred vision", body: "Vision that becomes blurry." },
];

const tips = [
  { icon: Salad, title: "Make balanced food choices", body: "Small changes, like adding more vegetables or drinking water instead of sugary drinks, add up." },
  { icon: Footprints, title: "Move your body", body: "Find physical activity you enjoy and build it into your week, a little at a time." },
  { icon: HeartPulse, title: "Aim for a healthy weight, when appropriate", body: "For people at risk of type 2 diabetes, even a modest weight loss can make a difference." },
  { icon: ClipboardCheck, title: "Learn your risk factors", body: "Age, family history, and physical activity are some of the factors that affect your risk." },
  { icon: CalendarCheck, title: "Keep up with health screenings", body: "Ask your healthcare provider whether a blood sugar test is right for you." },
  { icon: Stethoscope, title: "Follow your care plan", body: "If you have diabetes, keep working with your healthcare provider on the plan that's right for you." },
];

const actions = [
  { icon: BookOpen, text: "Learning about diabetes and prediabetes" },
  { icon: Share2, text: "Sharing accurate health information from trusted sources" },
  { icon: HandHeart, text: "Supporting loved ones living with diabetes" },
  { icon: ShieldCheck, text: "Encouraging check-ups and preventive care" },
  { icon: Sprout, text: "Making healthy choices you can keep up over time" },
];

const types = [
  {
    id: "what",
    title: "What is diabetes?",
    body: "Diabetes is a long-lasting health condition that affects how your body turns food into energy. Your body breaks most food down into sugar (glucose), and a hormone called insulin helps that sugar get into your cells. With diabetes, the body doesn't make enough insulin or can't use it well, so too much sugar stays in the blood. Over time, this can lead to serious health problems such as heart disease, vision loss, and kidney disease.",
  },
  {
    id: "type1",
    title: "Type 1 diabetes",
    body: "Type 1 diabetes is thought to be caused by an autoimmune reaction that stops the body from making insulin. People with type 1 diabetes need to take insulin every day. Type 1 diabetes can't be prevented at this time.",
  },
  {
    id: "type2",
    title: "Type 2 diabetes",
    body: "With type 2 diabetes, the body doesn't use insulin well and can't keep blood sugar at normal levels. It is the most common type and usually develops over many years. Type 2 diabetes can often be prevented or delayed with healthy lifestyle changes.",
  },
  {
    id: "gestational",
    title: "Gestational diabetes",
    body: "Gestational diabetes develops during pregnancy in people who have never had diabetes. It usually goes away after the baby is born, but it raises the risk of type 2 diabetes later in life for the parent and can raise the baby's risk of health problems.",
  },
  {
    id: "prediabetes",
    title: "What is prediabetes?",
    body: "With prediabetes, blood sugar levels are higher than normal, but not high enough to be diagnosed as type 2 diabetes. Prediabetes raises your risk for type 2 diabetes, heart disease, and stroke. The good news: proven lifestyle change programs can help many people lower that risk.",
  },
];

const DiabetesAwarenessMonth = () => {
  useEffect(() => {
    document.title = "American Diabetes Month 2026 | East Central Health District";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        {/* Section 1 — Hero */}
        <section className="relative overflow-hidden border-b border-border bg-diabetes-soft">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-autumn-soft motion-safe:animate-fade-in"
          />
          <div className="container relative py-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="text-primary underline-offset-2 hover:underline">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>American Diabetes Month 2026</span>
            </nav>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-diabetes">
                  November Is American Diabetes Month
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">
                  Know Your Risk. Protect Your Health.
                </h1>
                <p className="mt-4 text-lg font-medium text-foreground">
                  November is American Diabetes Month. Every step toward better health matters.
                </p>
                <p className="mt-3 text-lg leading-relaxed text-foreground/90">
                  Learn the signs, understand your risk, and discover simple ways to protect your health and
                  the health of your loved ones.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Ext href={CDC_RISKTEST} label="Learn Your Diabetes Risk" className={btnPrimary} />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[18px] border-diabetes bg-background sm:h-52 sm:w-52 sm:border-[24px]"
              >
                <Sprout className="h-14 w-14 text-autumn sm:h-20 sm:w-20" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>

        <div className="container max-w-5xl space-y-16 py-12">
          {/* Section 2 — Numbers */}
          <section aria-labelledby="numbers-heading">
            <h2 id="numbers-heading" className="text-2xl font-bold sm:text-3xl">Diabetes by the Numbers</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {stats.map((s) => (
                <li key={s.value} className="rounded-lg border-t-4 border-diabetes bg-card p-6 shadow-sm ring-1 ring-border">
                  <p className="text-3xl font-bold text-diabetes sm:text-4xl">{s.value}</p>
                  <p className="mt-2 text-base text-foreground/90">{s.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg">
              Understanding your risk is an important first step toward preventing or managing diabetes.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Source: Centers for Disease Control and Prevention (CDC), “Diabetes Statistics” (page updated
              March 2026). These are national estimates from CDC's National Diabetes Statistics
              Report, based on survey data from earlier years — not counts collected in 2026.{" "}
              <Ext href={CDC_STATS} label="View CDC diabetes statistics" className={textLink} />
            </p>
          </section>

          {/* Section 3 — Understanding */}
          <section aria-labelledby="understanding-heading">
            <h2 id="understanding-heading" className="text-2xl font-bold sm:text-3xl">Understanding Diabetes</h2>
            <p className="mt-3 text-foreground/90">
              Type 1 diabetes can't be prevented at this time. Type 2 diabetes can often be prevented or
              delayed. Select a topic to learn more.
            </p>
            <Accordion type="multiple" className="mt-4 rounded-lg border border-border bg-card px-4 sm:px-6">
              {types.map((t) => (
                <AccordionItem key={t.id} value={t.id}>
                  <AccordionTrigger className={`min-h-11 text-left text-lg font-semibold ${focusRing}`}>
                    <h3>{t.title}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-foreground/90">{t.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Section 4 — Signs */}
          <section aria-labelledby="signs-heading" className="rounded-lg border border-diabetes-medium bg-diabetes-soft p-6 sm:p-8">
            <h2 id="signs-heading" className="text-2xl font-bold sm:text-3xl">Could You Recognize the Signs?</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {signs.map(({ icon: Icon, title, body }) => (
                <li key={title} className="rounded-lg bg-background p-4 ring-1 ring-border">
                  <Icon className="h-8 w-8 text-diabetes" aria-hidden="true" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-foreground/90">{body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-foreground/90">
              Diabetes and prediabetes don't always cause symptoms you notice. Type 2 diabetes symptoms can
              develop slowly over several years. If you have any of these signs — or think you may be at
              risk — talk with your healthcare provider about getting your blood sugar tested.
            </p>
            <div className="mt-6">
              <Ext href={CDC_TESTING} label="Talk With Your Healthcare Provider About Testing" className={btnPrimary} />
            </div>
          </section>

          {/* Section 5 — Risk */}
          <section
            aria-labelledby="risk-heading"
            className="rounded-lg bg-diabetes p-6 text-diabetes-foreground sm:p-10"
          >
            <h2 id="risk-heading" className="text-2xl font-bold sm:text-3xl">
              Could You Have Prediabetes and Not Know It?
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed">
              Prediabetes often has no clear symptoms, so many people don't know they have it. Knowing your
              risk — and getting tested if your provider recommends it — is the best way to find out.
            </p>
            <a
              href={CDC_RISKTEST}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-background px-5 py-3 text-base font-semibold text-diabetes hover:bg-diabetes-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              Take the 1-Minute Prediabetes Risk Test
              <span className="sr-only"> (CDC website, opens in a new tab)</span>
            </a>
            <p className="mt-4 text-sm">
              The risk test does not diagnose diabetes or prediabetes. Only a blood test ordered by a
              healthcare provider can do that.
            </p>
          </section>

          {/* Section 6 — Small steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-2xl font-bold sm:text-3xl">Small Steps Today. Healthier Tomorrows.</h2>
            <p className="mt-3 text-foreground/90">
              You don't have to change everything at once. Every healthy choice counts.
            </p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tips.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="flex gap-4 rounded-lg border border-border bg-card p-5">
                  <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${i % 2 ? "bg-autumn-soft text-autumn" : "bg-diabetes-soft text-diabetes"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-foreground/90">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg border-l-4 border-autumn bg-autumn-soft p-4 text-sm leading-relaxed">
              <strong>Please note:</strong> These tips are about preventing or delaying type 2 diabetes. They
              are not a treatment plan for type 1 diabetes. If you have any type of diabetes, follow the care
              plan from your healthcare provider.{" "}
              <Ext href={CDC_NDPP} label="Learn about CDC's lifestyle change program" className={textLink} />
            </p>
          </section>

          {/* Section 7 — Every action matters */}
          <section aria-labelledby="action-heading" className="rounded-lg bg-autumn-soft p-6 sm:p-8">
            <h2 id="action-heading" className="text-2xl font-bold sm:text-3xl">Every Action Matters.</h2>
            <p className="mt-4 leading-relaxed text-foreground/90">
              Inspired by the American Diabetes Association's message that every effort to raise awareness
              matters, here are ways you and your family can make a difference:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {actions.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-lg bg-background p-4 ring-1 ring-border">
                  <Icon className="h-6 w-6 shrink-0 text-autumn" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 8 — Resources */}
          <section aria-labelledby="resources-heading">
            <h2 id="resources-heading" className="text-2xl font-bold sm:text-3xl">Trusted Resources</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { href: CDC_ABOUT, label: "CDC Diabetes Information", body: "The basics of diabetes, types, and risk." },
                { href: CDC_PREVENT, label: "CDC Prediabetes Prevention Resources", body: "How to prevent or delay type 2 diabetes." },
                { href: CDC_TESTING, label: "CDC Diabetes Testing Guidance", body: "Who should be tested and what the tests are." },
                { href: CDC_NDPP, label: "CDC National Diabetes Prevention Program", body: "A proven lifestyle change program for people with prediabetes." },
                { href: ADA_MONTH, label: "American Diabetes Association: American Diabetes Month", body: "The ADA's “It All Matters” awareness article." },
              ].map((r) => (
                <li key={r.href} className="flex flex-col rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold">{r.label}</h3>
                  <p className="mt-1 flex-1 text-sm text-foreground/90">{r.body}</p>
                  <div className="mt-4"><Ext href={r.href} label={`Visit ${r.label}`} /></div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 9 — Closing */}
          <section aria-labelledby="closing-heading" className="rounded-lg border-2 border-diabetes p-6 text-center sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-diabetes">East Central Health District</p>
            <h2 id="closing-heading" className="mt-2 text-2xl font-bold sm:text-3xl">
              Your Health Journey Starts With One Step.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-foreground/90">
              Whether it's learning your risk, making healthier choices, or speaking with your healthcare
              provider, every step toward better health matters.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className={btnPrimary}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Contact East Central Health District
              </Link>
              <Link to="/counties" className={btnOutline}>Find Your County Health Department</Link>
            </div>
          </section>

          {/* Sources */}
          <section aria-labelledby="sources-heading" className="border-t border-border pt-8">
            <h2 id="sources-heading" className="text-lg font-semibold">Sources</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SOURCES.map((s) => (
                <li key={s.href}><Ext href={s.href} label={s.label} className={textLink} /></li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              This page provides general education and is not medical advice. East Central Health District
              is not affiliated with the American Diabetes Association. Please talk with a healthcare
              provider about your personal health.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default DiabetesAwarenessMonth;
