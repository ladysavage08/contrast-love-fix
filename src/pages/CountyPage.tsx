import { useParams, Navigate, Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Search,
  Phone,
  MapPin,
  Clock,
  User,
  Info,
  ChevronRight,
  Utensils,
  ArrowRight,
} from "lucide-react";
import CountiesDropdown from "@/components/CountiesDropdown";
import { counties } from "@/data/counties";

/**
 * Generic county page rendered for /counties/:slug.
 *
 * Data comes entirely from src/data/counties.ts so the Counties landing page
 * and individual county pages always stay in sync. Burke County keeps its
 * own bespoke page (registered explicitly in App.tsx) for richer content.
 */

const socials: Array<{ name: string; href: string; Icon: typeof Facebook }> = [
  { name: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { name: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", Icon: Youtube },
  { name: "Instagram", href: "https://instagram.com", Icon: Instagram },
];

const SocialIcons = () => (
  <ul className="flex items-center gap-2">
    {socials.map(({ name, href, Icon }) => (
      <li key={name}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} (opens in new tab)`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

const CountyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const county = counties.find((c) => c.slug === slug);

  if (!county) return <Navigate to="/counties" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============ HEADER (mirrors Counties.tsx) ============ */}
      <header className="border-b border-border">
        <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <a
            href="/"
            className="flex items-center gap-3 text-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="East Central Health District — Home"
          >
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded bg-destructive font-bold text-destructive-foreground"
            >
              DPH
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-muted-foreground">
                Georgia Department of Public Health
              </span>
              <span className="block text-base font-semibold">
                East Central Health District
              </span>
            </span>
          </a>

          <div className="flex flex-col gap-3 md:items-end">
            <nav aria-label="Utility" className="flex items-center gap-3 text-sm">
              <Info className="h-4 w-4 text-primary" aria-hidden="true" />
              <a href="/contact-us" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
                Contact Us
              </a>
              <span aria-hidden="true" className="text-muted-foreground">|</span>
              <a href="/sitemap" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
                Site Map
              </a>
            </nav>

            <form
              role="search"
              className="flex w-full max-w-sm items-stretch overflow-hidden rounded border border-border"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="site-search" className="sr-only">Search this site</label>
              <input
                id="site-search"
                type="search"
                placeholder="Search this site"
                className="flex-1 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Go
              </button>
            </form>
          </div>
        </div>

        <nav aria-label="Primary" className="bg-brand text-brand-foreground">
          <ul className="container flex flex-wrap">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["__counties__", ""],
              ["Programs/Services", "/programs"],
              ["Mobile Health Clinic", "/wego"],
              ["Careers", "/careers"],
              ["News/Events", "/news"],
              ["I Want To…", "/services"],
            ].map(([label, href]) =>
              label === "__counties__" ? (
                <CountiesDropdown key="counties" currentSlug={county.slug} />
              ) : (
                <li key={label}>
                  <a
                    href={href}
                    className="block px-5 py-3 text-sm font-medium hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
                  >
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
          <div className="h-1 bg-accent-gold" aria-hidden="true" />
        </nav>
      </header>

      {/* ============ BREADCRUMB ============ */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
        <ol className="container flex flex-wrap items-center gap-1 py-3 text-sm">
          <li>
            <a href="/" className="text-primary underline-offset-2 hover:underline focus-visible:underline">Home</a>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link to="/counties" className="text-primary underline-offset-2 hover:underline focus-visible:underline">
              Counties
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {county.name}
          </li>
        </ol>
      </nav>

      {/* ============ MAIN ============ */}
      <main id="main" className="container py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">{county.healthDept}</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Welcome to the {county.healthDept}. Our goal is to serve the
            citizens of {county.name} by providing preventive healthcare
            services. Use the contact information below to reach our office or
            schedule a visit.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Primary content */}
          <div className="space-y-6">
            {county.address && (
              <section
                aria-labelledby="location-heading"
                className="rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-6"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 id="location-heading" className="text-xl font-semibold">Location</h2>
                    <address className="mt-2 not-italic leading-relaxed text-foreground">
                      {county.address.poBox && (<>{county.address.poBox}<br /></>)}
                      {county.address.street}<br />
                      {county.address.cityStateZip}
                    </address>
                  </div>
                </div>
              </section>
            )}

            {county.hoursSummary && county.hoursSummary.length > 0 && (
              <section
                aria-labelledby="hours-heading"
                className="rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-6"
              >
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 id="hours-heading" className="text-xl font-semibold">Hours of Operation</h2>
                    <ul className="mt-2 space-y-1 text-foreground">
                      {county.hoursSummary.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                    {county.lunchClosure && (
                      <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                        <Utensils className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {county.lunchClosure}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {county.nurseManager && (
              <section
                aria-labelledby="nurse-heading"
                className="rounded-lg border border-t-[3px] border-border border-t-accent-gold bg-card p-6"
              >
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 id="nurse-heading" className="text-xl font-semibold">Nurse Manager</h2>
                    <p className="mt-2 font-medium text-foreground">{county.nurseManager}</p>
                  </div>
                </div>
              </section>
            )}

            <Link
              to="/counties"
              className="inline-flex items-center gap-2 text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              Back to all counties
            </Link>
          </div>

          {/* Sidebar */}
          <aside aria-label="Quick contact" className="space-y-6">
            <section
              aria-labelledby="contact-heading"
              className="rounded-lg border border-border p-5"
            >
              <h2 id="contact-heading" className="text-xl font-semibold">Contact</h2>
              {county.phone && county.phoneHref && (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Call the {county.name} health department:
                  </p>
                  <a
                    href={county.phoneHref}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {county.phone}
                  </a>
                </>
              )}
            </section>
          </aside>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border bg-muted">
        <div className="container py-6 text-sm text-muted-foreground">
          <div className="mb-4 flex items-center gap-3">
            <SocialIcons />
          </div>
          <p>
            <strong className="text-foreground">Disclaimer:</strong> Automatic
            translation services are provided but have not been fully vetted by
            ECHD staff.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} East Central Health District — Georgia
            Department of Public Health.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CountyPage;
