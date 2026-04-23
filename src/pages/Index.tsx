import {
  Phone,
  FileText,
  Heart,
  Apple,
  Users,
  ClipboardCheck,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SocialIcons from "@/components/SocialIcons";
import newsPublicHealth from "@/assets/news-public-health.jpg";

/**
 * Accessible rebuild of the ECHD homepage.
 *
 * Color contrast policy (WCAG 2.1 AA, ≥ 4.5:1 for normal text):
 *   - Brand blue text on white: hsl(var(--primary)) = #006a8e (was #008cba — 3.0:1, failing).
 *   - White text on brand surfaces: hsl(var(--brand)) = #005a78 (5.7:1).
 *   - Muted/secondary text: hsl(var(--muted-foreground)) at L=35% (≥ 4.5:1).
 *   - Gold accent stripe darkened to #a36a00 for any text laid over it.
 *
 * No hard-coded colors in this file — all styling flows through semantic tokens.
 * No empty `href=""` links — every interactive element is either a real route
 * or a <button>.
 */

const quickLinks = [
  { icon: Stethoscope, label: "Mobile Health Clinic", href: "/mobile-health-clinic" },
  { icon: FileText, label: "Birth/Death Certificates", href: "/vital-records" },
  { icon: Phone, label: "ECHD Directory", href: "/directory" },
  { icon: Heart, label: "Immunizations", href: "/immunizations" },
  { icon: ClipboardCheck, label: "Restaurant Scores", href: "/restaurant-scores" },
  { icon: Apple, label: "WIC", href: "/wic" },
  { icon: Users, label: "Volunteers", href: "/volunteers" },
];

const news = [
  {
    title:
      "WHAT IS PUBLIC HEALTH? by Lee Donohue, MD — Director, East Central Health District",
    href: "/news/what-is-public-health",
    image: newsPublicHealth,
    imageAlt:
      "Diverse group of healthcare workers and community members in a bright community health setting",
  },
  {
    title:
      "February Is American Heart Month — Know Your Numbers. Protect Your Heart.",
    href: "/news/american-heart-month",
  },
  {
    title:
      "Health Department Operations Update — operational status by county for February 2, 2026",
    href: "/news/operations-update-february",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader
        utilityExtras={
          <div className="flex flex-wrap items-center gap-2">
            <SocialIcons />
            <a
              href="/employee-login"
              className="rounded bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Employee Login
            </a>
            <a
              href="/patient-portal"
              className="rounded bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Patient Portal
            </a>
          </div>
        }
      />


      {/* ============ MAIN ============ */}
      <main id="main" className="container grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
        <section aria-label="Featured" className="space-y-8">
          <HeroSlider />

          <section aria-labelledby="news-heading">
            <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
              <h2 id="news-heading" className="text-2xl font-semibold">
                Public Health News
              </h2>
              <a
                href="/news"
                className="text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                News Archive
              </a>
            </div>

            <ul className="divide-y divide-border">
              {news.map((item) => (
                <li key={item.href} className="flex gap-4 py-5">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? `Photo for article: ${item.title}`}
                      loading="lazy"
                      width={704}
                      height={512}
                      className="h-20 w-28 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-20 w-28 shrink-0 rounded bg-muted"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      <a
                        href={item.href}
                        className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                      >
                        {item.title}
                      </a>
                    </h3>
                    <a
                      href={item.href}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:underline"
                      aria-label={`Read more: ${item.title}`}
                    >
                      Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {/* ============ SIDEBAR ============ */}
        <aside aria-label="Sidebar" className="space-y-8">
          <section aria-labelledby="quick-links-heading" className="rounded-lg border border-border p-5">
            <h2 id="quick-links-heading" className="mb-4 text-xl font-semibold">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {quickLinks.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="flex items-center gap-3 rounded px-3 py-2 text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium underline-offset-2 hover:underline">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/programs"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View All Programs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </section>

          <a
            href="/calendar"
            className="flex w-full items-center justify-center rounded bg-brand px-4 py-3 font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Calendar of Events
          </a>

          <section aria-labelledby="stay-connected-heading">
            <h2 id="stay-connected-heading" className="mb-3 text-xl font-semibold">
              Stay Connected
            </h2>
            <SocialIcons size="lg" />
          </section>
        </aside>
      </main>

      {/* ============ FOOTER ============ */}
      <SiteFooter />
    </div>
  );
};

export default Index;
