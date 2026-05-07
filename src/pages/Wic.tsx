import { Link } from "react-router-dom";
import {
  ArrowRight, Phone, Apple, HeartHandshake,
  GraduationCap, Baby, Users, ClipboardList, HelpCircle,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ManagedLink from "@/components/ManagedLink";

/**
 * Dedicated WIC (Women, Infants, and Children) program page.
 * Content-driven sections so future updates only require editing arrays below.
 * Reuses the same layout patterns as ProgramPage / EnvironmentalHealth pages.
 */

const services = [
  { icon: Apple, title: "Healthy Food Benefits", body: "Monthly benefits for nutritious foods such as milk, eggs, whole grains, fruits, vegetables, infant formula, and baby food." },
  { icon: GraduationCap, title: "Nutrition Education", body: "Personalized nutrition counseling and group classes that support healthy eating for the whole family." },
  { icon: HeartHandshake, title: "Breastfeeding Support", body: "Lactation support, peer counseling, and resources for nursing parents at every stage." },
  { icon: Users, title: "Healthcare & Community Referrals", body: "Connections to medical care, immunizations, dental services, and community programs that support your family's well-being." },
];

const eligibility = [
  "Pregnant women",
  "Breastfeeding women (up to one year postpartum)",
  "Postpartum women (up to six months after giving birth)",
  "Infants (up to one year old)",
  "Children up to age 5 (including foster children)",
];

const applySteps: Array<string | { text: string; link: { href: string; label: string } }> = [
  {
    text: "Apply online at ",
    link: { href: "https://ecphd-getwic.qminder.site/#/", label: "ecphd.com/getwic" },
  },
  "Gather proof of identity, address, household income, and your child's medical/immunization records.",
  "Attend your appointment for a brief health and nutrition screening.",
  "Receive your WIC benefits and nutrition education materials.",
];

const foodCategories = [
  "Milk, cheese, and yogurt",
  "Eggs",
  "Whole grain bread, tortillas, brown rice, and oatmeal",
  "Cereals (iron-fortified)",
  "Fresh, frozen, and canned fruits and vegetables",
  "100% fruit and vegetable juice",
  "Infant formula, infant cereal, and baby food",
  "Peanut butter, beans, and lentils",
  "Canned fish (for fully breastfeeding women)",
];

const faqs = [
  {
    q: "Do I have to be a U.S. citizen to qualify?",
    a: "No. WIC eligibility is based on residency, income, and nutritional need — not citizenship status. Participating in WIC will not affect your immigration status.",
  },
  {
    q: "Can working families qualify?",
    a: "Yes. Many working families qualify. Income guidelines are based on household size, and families enrolled in Medicaid, SNAP, or TANF are automatically income-eligible.",
  },
  {
    q: "How do I receive my WIC benefits?",
    a: "Benefits are loaded onto a WIC eBT card you can use at most grocery stores in Georgia. Your local WIC office will show you how to use it.",
  },
];

const Wic = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
          <div className="container py-3 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link to="/" className="text-primary underline-offset-2 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/programs" className="text-primary underline-offset-2 hover:underline">
                  Programs and Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">WIC</li>
            </ol>
          </div>
        </nav>

        <div className="container py-10">
          <header className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              WIC (Women, Infants, and Children)
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              The Special Supplemental Nutrition Program for Women, Infants, and
              Children (WIC) helps families across the East Central Health
              District eat well and thrive. WIC provides healthy foods, nutrition
              education, breastfeeding support, and connections to other
              services that support healthy pregnancies and growing children.
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* What is WIC */}
              <section aria-labelledby="what-heading">
                <h2 id="what-heading" className="text-2xl font-semibold">What is WIC?</h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base leading-relaxed text-foreground/90">
                  WIC is a federally funded nutrition program that supports the
                  health of pregnant women, new mothers, infants, and young
                  children up to age 5. The program helps families access
                  nutritious food, learn about healthy eating, and find the
                  community resources they need at no cost.
                </p>
              </section>

              {/* Who Qualifies */}
              <section aria-labelledby="qualify-heading">
                <h2 id="qualify-heading" className="text-2xl font-semibold">Who Qualifies?</h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base text-foreground/90">
                  WIC serves Georgia residents who meet income guidelines and
                  have a nutritional need. Eligible groups include:
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-6 text-base text-foreground/90">
                  {eligibility.map((e) => <li key={e}>{e}</li>)}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Households enrolled in Medicaid, SNAP, or TANF are
                  automatically income-eligible. Income guidelines are updated
                  each year — your local WIC office can help confirm if you
                  qualify.
                </p>
              </section>

              {/* Services Offered */}
              <section aria-labelledby="services-heading">
                <h2 id="services-heading" className="text-2xl font-semibold">
                  What Services Are Offered?
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {services.map(({ icon: Icon, title, body }) => (
                    <li key={title} className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                      </div>
                      <p className="mt-2 text-sm text-foreground/90">{body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* How to Apply */}
              <section aria-labelledby="apply-heading">
                <h2 id="apply-heading" className="text-2xl font-semibold">How to Apply</h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ol className="mt-4 list-decimal space-y-2 pl-6 text-base text-foreground/90">
                  {applySteps.map((s, i) => (
                    <li key={typeof s === "string" ? s : s.link.href}>
                      {typeof s === "string" ? (
                        s
                      ) : (
                        <>
                          {s.text}
                          <a
                            href={s.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            {s.link.label}
                            <span className="sr-only"> (opens in new tab)</span>
                          </a>
                          {" "}for a same-day appointment.
                        </>
                      )}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ManagedLink
                    slug="wic-apply"
                    defaultHref="https://ecphd-getwic.qminder.site/#/"
                    defaultLabel="Apply for Same-Day Appointment"
                    aria-label="Apply for a same-day WIC appointment (opens in new tab)"
                    className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Apply for Same-Day Appointment <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ManagedLink>
                  <a
                    href="tel:18663746942"
                    aria-label="Call the WIC Call Center at 1-866-374-6942"
                    className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted"
                  >
                    Call for Assistance <Phone className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <ManagedLink
                    slug="wic-apply"
                    defaultHref="https://ecphd-getwic.qminder.site/#/"
                    defaultLabel="Apply for WIC"
                    aria-label="Apply for WIC (opens in new tab)"
                    className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted"
                  >
                    Apply for WIC <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </ManagedLink>
                </div>
                <p className="mt-4 text-sm text-foreground/90">
                  WIC Call Center: <a href="tel:18663746942" className="text-primary underline-offset-2 hover:underline">+1 866-374-6942</a>
                </p>
              </section>

              {/* WIC Approved Foods */}
              <section aria-labelledby="foods-heading">
                <h2 id="foods-heading" className="text-2xl font-semibold">WIC Approved Foods</h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-4 text-base text-foreground/90">
                  WIC food packages are tailored to each participant's needs.
                  Common approved categories include:
                </p>
                <ul className="mt-3 grid list-disc gap-1 pl-6 text-base text-foreground/90 sm:grid-cols-2">
                  {foodCategories.map((c) => <li key={c}>{c}</li>)}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  For the complete, up-to-date Georgia WIC Approved Food List,
                  visit the{" "}
                  <ManagedLink
                    slug="wic-foods"
                    defaultHref="https://dph.georgia.gov/WIC"
                    defaultLabel="Georgia DPH WIC Foods page"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Georgia DPH WIC Foods page
                    <span className="sr-only"> (opens in new tab)</span>
                  </ManagedLink>.
                </p>
              </section>

              {/* Community Support */}
              <section aria-labelledby="community-heading">
                <h2 id="community-heading" className="text-2xl font-semibold">
                  Community Support &amp; Additional Resources
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <ul className="mt-4 space-y-3">
                  <li className="flex gap-3">
                    <Baby className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span><strong>Breastfeeding peer counseling</strong> for new and expectant parents.</span>
                  </li>
                  <li className="flex gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span><strong>Nutrition education</strong> classes covering meal planning, feeding milestones, and healthy habits.</span>
                  </li>
                  <li className="flex gap-3">
                    <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span><strong>Outreach &amp; referrals</strong> to immunizations, well-child checkups, dental care, SNAP, Medicaid, and other community supports.</span>
                  </li>
                </ul>
              </section>

              {/* FAQ */}
              <section aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-semibold">Frequently Asked Questions</h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <dl className="mt-4 divide-y divide-border border-y border-border">
                  {faqs.map((f) => (
                    <div key={f.q} className="py-4">
                      <dt className="flex items-start gap-2 text-base font-semibold">
                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        {f.q}
                      </dt>
                      <dd className="mt-2 pl-7 text-base text-foreground/90">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            {/* Sidebar */}
            <aside aria-label="Sidebar" className="space-y-6">
              <section aria-labelledby="related-heading" className="rounded-lg border border-border p-5">
                <h2 id="related-heading" className="text-xl font-semibold">Related</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link to="/programs/breastfeeding" className="text-primary underline-offset-2 hover:underline">
                      Breastfeeding Support
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs/child-adolescent-health" className="text-primary underline-offset-2 hover:underline">
                      Child &amp; Adolescent Health
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="text-primary underline-offset-2 hover:underline">
                      All Programs &amp; Services
                    </Link>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Wic;
