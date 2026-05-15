import { ArrowRight, Phone, ExternalLink, Download, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * DPH Home Visiting Program — dedicated program page.
 * Layout matches the shared ProgramPage template (breadcrumb, H1 + gold rule,
 * main column + sidebar, gold-rule section headers) so it visually fits
 * alongside the other program pages.
 */
const HomeVisitingProgram = () => {
  const phone = "706-721-5800";
  const phoneHref = `tel:${phone.replace(/[^0-9]/g, "")}`;
  const dphUrl = "https://dph.georgia.gov/women-and-children/hvp";

  const maternalMonitoring = [
    "Blood pressure assessment",
    "Fingerstick for blood glucose, if indicated",
    "Weight",
    "Urine dipstick",
    "Fetal heart tones",
    "Screening for pregnancy and postpartum warning signs",
    "Depression and anxiety screening",
  ];

  const warningSigns = [
    "Vaginal bleeding or fluid leaking during pregnancy",
    "Vaginal bleeding or discharge after pregnancy",
    "Severe headaches",
    "Severe abdominal pain",
    "Extreme swelling of hands or face",
    "Changes in vision",
    "Severe swelling, redness, or pain in the leg or arm",
    "Trouble breathing",
    "Chest pain or fast-beating heart",
    "Depression and anxiety",
  ];

  const infantMonitoring = [
    "Feeding assessment",
    "Weight",
    "Head circumference",
    "Developmental screening",
  ];

  const maternalReferrals = [
    "Hypertension or gestational hypertension",
    "Preeclampsia",
    "Diabetes",
    "Multiple gestations",
    "Prior preterm delivery",
    "Preterm labor",
    "Chronic conditions or co-morbidities",
    "Prior second-trimester pregnancy loss",
    "Prior fetal or neonatal death",
    "Pre-existing health conditions",
    "Substance use disorder",
    "Mental health condition",
    "Poor support system",
    "Difficulty complying with provider recommendations or follow-up appointments",
    "Other medical conditions or concerns for poor outcomes",
  ];

  const infantReferrals = [
    "Recent NICU discharge",
    "Very low birth weight or low birth weight",
    "Less than 36 weeks gestation at delivery",
    "Positive maternal screening for substances at delivery",
    "Suspected or confirmed congenital syphilis or HIV infection",
    "Poor maternal support system or other environmental concerns",
  ];

  const counties = [
    "Richmond",
    "Jefferson",
    "Emanuel",
    "Burke",
    "Screven",
    "Jenkins",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <main id="main">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
          <div className="container py-3 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link to="/" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/programs" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
                  Programs and Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                DPH Home Visiting Program
              </li>
            </ol>
          </div>
        </nav>

        <div className="container py-6 md:py-10">
          <header className="mb-6 max-w-3xl md:mb-8">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              DPH Home Visiting Program
            </h1>
            <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 md:text-lg">
              The DPH Home Visiting Program provides services by public health department
              nurses and trained staff to expectant mothers from pregnancy through the first
              year of their baby&apos;s life. Services are provided at no cost to patients or
              providers. The program focuses on assisting pregnant women with high-risk
              conditions or risk factors that may increase the likelihood of poor pregnancy
              outcomes. Although enrollment can occur after delivery, early intervention is
              preferred.
            </p>
          </header>

          {/* Program video */}
          <section
            aria-labelledby="program-video-heading"
            className="mb-10 max-w-4xl"
          >
            <h2 id="program-video-heading" className="sr-only">
              DPH Home Visiting Program video
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-black shadow-sm">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/4CGBwQUEGt4?rel=0"
                  title="DPH Home Visiting Program video"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </section>

          <aside
            aria-label="Program highlight"
            className="mb-10 flex items-start gap-4 rounded-lg border-l-4 border-accent-gold bg-muted/40 p-5 md:p-6"
          >
            <Heart className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <p className="text-lg font-semibold text-foreground">
                Stronger Together
              </p>
              <p className="mt-1 text-base text-foreground/90">
                Partnering to Support Patients Beyond the Office.
              </p>
            </div>
          </aside>

          <div className="grid gap-8 md:gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {/* How the Program Helps */}
              <section aria-labelledby="how-helps-heading">
                <h2 id="how-helps-heading" className="text-2xl font-semibold">
                  How the Program Helps
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-5 text-base leading-relaxed text-foreground/90">
                  DPH home visitors can provide monitoring and support between provider
                  appointments to help detect potential warning signs, complications, and
                  concerns early. Early detection can increase the likelihood of prompt
                  intervention and referrals for additional assessment or treatment.
                </p>
              </section>

              {/* Monitoring and Service Components */}
              <section aria-labelledby="monitoring-heading">
                <h2 id="monitoring-heading" className="text-2xl font-semibold">
                  Monitoring and Service Components
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <article className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-lg font-semibold text-primary">
                      Maternal — Pregnancy and Postpartum
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                      {maternalMonitoring.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-foreground">
                      Warning signs monitored
                    </h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                      {warningSigns.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-lg font-semibold text-primary">
                      Infant — Nutrition and Development
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                      {infantMonitoring.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>

              {/* Who Should Be Referred */}
              <section aria-labelledby="referred-heading">
                <h2 id="referred-heading" className="text-2xl font-semibold">
                  Who Should Be Referred
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <article className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-lg font-semibold text-primary">
                      Maternal Patients With:
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                      {maternalReferrals.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-lg font-semibold text-primary">
                      Infant Patients With:
                    </h3>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/90">
                      {infantReferrals.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>

              {/* Service Area */}
              <section aria-labelledby="service-area-heading">
                <h2 id="service-area-heading" className="text-2xl font-semibold">
                  East Central Health District Service Area
                </h2>
                <div aria-hidden="true" className="mt-2 h-1 w-16 bg-accent-gold" />
                <p className="mt-5 text-base leading-relaxed text-foreground/90">
                  The East Central Health District Home Visiting Program serves the
                  following counties:
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-base text-foreground/90 sm:grid-cols-3">
                  {counties.map((c) => (
                    <li key={c} className="list-disc list-inside">{c}</li>
                  ))}
                </ul>
              </section>

              {/* Referral Information */}
              <section
                aria-labelledby="referral-heading"
                className="rounded-lg border border-border bg-muted/40 p-6"
              >
                <h2 id="referral-heading" className="text-xl font-semibold">
                  Referral Information
                </h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  Healthcare providers can refer eligible maternal or infant patients to
                  the DPH Home Visiting Program.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={dphUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download Referral Form
                  </a>
                  <a
                    href={dphUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Visit Official Georgia DPH Page
                  </a>
                </div>
              </section>
            </div>

            <aside aria-label="Sidebar" className="space-y-6">
              <section aria-labelledby="contact-heading" className="rounded-lg border border-border p-5">
                <h2 id="contact-heading" className="text-xl font-semibold">
                  Contact
                </h2>
                <p className="mt-3 text-sm text-foreground/90">
                  Call the East Central Health District main line and ask to be connected
                  to the DPH Home Visiting Program.
                </p>
                <a
                  href={phoneHref}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {phone}
                </a>
              </section>

              <section aria-labelledby="more-heading" className="rounded-lg border border-border p-5">
                <h2 id="more-heading" className="text-xl font-semibold">
                  Browse Programs
                </h2>
                <p className="mt-2 text-sm text-foreground/90">
                  Explore the full list of programs and services offered across the
                  district.
                </p>
                <Link
                  to="/programs"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                >
                  View all programs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HomeVisitingProgram;
