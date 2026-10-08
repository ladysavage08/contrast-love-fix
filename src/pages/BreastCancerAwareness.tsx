import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Ribbon, HeartHandshake, Search, Stethoscope, Share2, ArrowDown } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * Breast Cancer Awareness Month 2026 landing page (/breastcancer).
 * Medical content is paraphrased from CDC pages (verified Oct 2026); no statistics are stated here.
 * Page stays live after October as an educational resource — only the homepage slide expires.
 */
const CDC_OVERVIEW = "https://www.cdc.gov/cancer/features/breast-cancer.html";
const CDC_SCREENING = "https://www.cdc.gov/breast-cancer/screening/index.html";
const CDC_SYMPTOMS = "https://www.cdc.gov/breast-cancer/symptoms/index.html";
const CDC_RISK = "https://www.cdc.gov/breast-cancer/risk-factors/index.html";
const KYL = "https://knowyourlemons.org/";

const btnPrimary =
  "inline-flex min-h-11 items-center gap-2 rounded bg-raspberry px-5 py-2.5 text-sm font-semibold text-raspberry-foreground hover:bg-raspberry-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry";
const btnOutline =
  "inline-flex min-h-11 items-center gap-2 rounded border-2 border-raspberry bg-background px-5 py-2.5 text-sm font-semibold text-raspberry hover:bg-pink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry";
const textLink =
  "font-semibold text-raspberry underline underline-offset-4 hover:text-raspberry-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry";

const Ext = ({ href, label, className = btnOutline }: { href: string; label: string; className?: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
    {label}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
);

const actions = [
  { icon: Search, title: "Know Your Risk", body: "Learn about your personal and family health history." },
  { icon: Ribbon, title: "Know the Signs", body: "Become familiar with possible breast changes." },
  { icon: Stethoscope, title: "Discuss Screening", body: "Ask a healthcare provider when screening is appropriate for you." },
  { icon: Share2, title: "Share Awareness", body: "Encourage friends and family to learn about breast health." },
];

const BreastCancerAwareness = () => {
  useEffect(() => {
    document.title = "Breast Cancer Awareness Month 2026 | East Central Health District";
  }, []);

  const scrollToScreening = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("screening");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
    history.replaceState(null, "", "#screening");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        {/* Header */}
        <section className="border-b border-border bg-pink-soft">
          <div className="container py-10 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <Link to="/" className="text-primary underline-offset-2 hover:underline">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>Breast Cancer Awareness Month 2026</span>
            </nav>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-raspberry">
                  Breast Cancer Awareness Month 2026 · October 1–31
                </p>
                <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">
                  October Is Breast Cancer Awareness Month
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-foreground/90">
                  Awareness starts with knowledge. This October, East Central Health District encourages
                  everyone to learn about breast health, understand their personal risk, recognize potential
                  warning signs, and talk with a healthcare provider about screening.
                </p>
                <a href="#screening" onClick={scrollToScreening} className={`${btnPrimary} mt-6`}>
                  Learn About Breast Cancer Screening
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div
                aria-hidden="true"
                className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-raspberry text-raspberry-foreground sm:h-52 sm:w-52"
              >
                <Ribbon className="h-24 w-24 sm:h-32 sm:w-32" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>

        <div className="container max-w-4xl space-y-14 py-12">
          {/* Understanding */}
          <section aria-labelledby="understanding-heading">
            <h2 id="understanding-heading" className="text-2xl font-bold sm:text-3xl">
              Knowledge Is Power: Understanding Breast Cancer
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
              <p>
                Breast cancer is a disease in which cells in the breast grow out of control. Other than skin
                cancer, it is the most common cancer among American women. Men can also get breast cancer,
                though it is not common.
              </p>
              <p>
                <strong>Early detection matters.</strong> Breast cancer is easier to treat when it is found
                early. For many women, mammograms are the best way to find breast cancer early — sometimes
                before it is big enough to feel or cause symptoms.
              </p>
              <p>
                <strong>Know your personal risk.</strong> Some of the main factors that affect a person's chance
                of getting breast cancer include being a woman, getting older (most breast cancers are found in
                women 50 or older, but younger women are affected too), and having changes in the BRCA1 or BRCA2
                genes. Knowing your risk helps you and your provider make better decisions about your care.{" "}
                <Ext href={CDC_RISK} label="CDC: Breast cancer risk factors" className={textLink} />
              </p>
            </div>
            <div className="mt-6">
              <Ext href={CDC_OVERVIEW} label="Explore CDC Breast Cancer Resources" className={btnPrimary} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Source: Centers for Disease Control and Prevention (CDC), “Breast Cancer Awareness” and related
              CDC breast cancer pages.
            </p>
          </section>

          {/* Know the signs */}
          <section aria-labelledby="signs-heading" className="rounded-lg border border-pink-medium bg-pink-soft p-6 sm:p-8">
            <h2 id="signs-heading" className="text-2xl font-bold sm:text-3xl">Know Your Body. Know the Signs.</h2>
            <p className="mt-4 leading-relaxed text-foreground/90">
              Breast changes can look and feel different from person to person. Learning what is normal for
              your body can help you recognize changes that should be discussed with a healthcare provider.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/90">
              The <strong>Know Your Lemons Foundation</strong> uses a simple, visual approach — using lemons
              to show what breast changes can look and feel like — to make breast health education easier to
              understand and share.
            </p>
            <h3 className="mt-6 text-lg font-semibold">Possible signs to talk with a provider about</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-foreground/90">
              <li>Any change in the size or shape of the breast</li>
              <li>Pain in any area of the breast</li>
              <li>Nipple discharge other than breast milk (including blood)</li>
              <li>A new lump in the breast or underarm</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Source: CDC. Some people have no symptoms at all.{" "}
              <Ext href={CDC_SYMPTOMS} label="CDC: Symptoms of breast cancer" className={textLink} />
            </p>
            <p className="mt-4 rounded border-l-4 border-raspberry bg-background p-4 text-foreground/90">
              <strong>Remember:</strong> Not every breast change is cancer, but any new or unusual change should
              be checked by a healthcare provider.
            </p>
            <div className="mt-6">
              <Ext href={KYL} label="Explore Know Your Lemons" className={btnPrimary} />
            </div>
          </section>

          {/* Screening */}
          <section
            id="screening"
            tabIndex={-1}
            aria-labelledby="screening-heading"
            className="scroll-mt-24 focus:outline-none"
          >
            <h2 id="screening-heading" className="text-2xl font-bold sm:text-3xl">Screening Can Save Lives</h2>
            <div className="mt-4 space-y-5 leading-relaxed text-foreground/90">
              <div>
                <h3 className="text-lg font-semibold">What is a mammogram?</h3>
                <p>
                  A mammogram is an x-ray of the breast. For most women of screening age, it is the best way to
                  find breast cancer early, when it is easier to treat.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Why screening matters</h3>
                <p>
                  Screening checks for breast cancer before there are signs or symptoms. It cannot prevent breast
                  cancer, but getting mammograms on a regular schedule can lower the risk of dying from breast
                  cancer.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Screening is personal</h3>
                <p>
                  There is no single screening schedule that is right for everyone. Your age, medical history,
                  family history, and individual risk all affect when and how often you should be screened, and
                  which tests are right for you. People at higher than average risk may need a different plan.
                  Talk with your healthcare provider about the benefits and risks of screening and decide together
                  what is right for you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Report new changes — even after a normal mammogram</h3>
                <p>
                  If you notice a new breast change, tell your healthcare provider right away, even if your most
                  recent mammogram was normal.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                CDC also offers free or low-cost mammograms through the National Breast and Cervical Cancer Early
                Detection Program for people who qualify. Source: CDC, “Screening for Breast Cancer.”
              </p>
            </div>
            <div className="mt-6">
              <Ext href={CDC_SCREENING} label="Read CDC Breast Cancer Screening Guidance" className={btnPrimary} />
            </div>
          </section>

          {/* Take action */}
          <section aria-labelledby="action-heading">
            <h2 id="action-heading" className="text-2xl font-bold sm:text-3xl">Take Action This October</h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {actions.map(({ icon: Icon, title, body }) => (
                <li key={title} className="rounded-lg border border-border border-t-4 border-t-raspberry bg-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-soft text-raspberry" aria-hidden="true">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-foreground/90">{body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-start gap-3 rounded-lg bg-raspberry p-6 text-lg font-medium text-raspberry-foreground">
              <HeartHandshake className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
              Every conversation, every shared resource, and every step toward understanding breast health can
              make a difference.
            </p>
          </section>

          {/* Resources */}
          <section aria-labelledby="resources-heading">
            <h2 id="resources-heading" className="text-2xl font-bold sm:text-3xl">Additional Resources</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              <li className="flex flex-col rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">Centers for Disease Control and Prevention (CDC)</h3>
                <p className="mt-2 flex-1 text-foreground/90">
                  Trusted information on breast cancer symptoms, risk factors, screening, and free or low-cost
                  mammogram programs.
                </p>
                <div className="mt-4"><Ext href={CDC_OVERVIEW} label="Visit CDC Breast Cancer Awareness" /></div>
              </li>
              <li className="flex flex-col rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold">Know Your Lemons Foundation</h3>
                <p className="mt-2 flex-1 text-foreground/90">
                  Visual, easy-to-understand breast health education to help you learn the signs of breast cancer.
                </p>
                <div className="mt-4"><Ext href={KYL} label="Visit Know Your Lemons" /></div>
              </li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              This page provides general education and is not medical advice. Please talk with a healthcare
              provider about your personal health.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BreastCancerAwareness;
