import { ReactNode } from "react";
import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Search,
  Info,
  Phone,
  Calendar,
  ChevronRight,
} from "lucide-react";
import CountiesDropdown from "@/components/CountiesDropdown";
import { Link, useLocation } from "react-router-dom";

/**
 * WegoLayout — shared chrome for the Mobile Health Clinic ("WeGo") sub-site.
 *
 * Design intent (per project brief):
 *  - Reuse the ADA / ECPHD primary header verbatim (DPH brand block, utility
 *    links, search, brand-blue nav with gold accent stripe) so WeGo reads as
 *    a *section* of the main site rather than a separate microsite.
 *  - Add a secondary "WeGo sub-nav" directly under the primary nav. This is the
 *    program-level navigation: Home / About / Services / Schedule / FAQ / Contact,
 *    plus two strong CTAs ("View Schedule" and "Call Now").
 *  - Footer matches Counties.tsx / Index.tsx exactly.
 *
 * Accessibility:
 *  - Skip link to #main.
 *  - Semantic landmarks (header/nav/main/footer) with aria-labels.
 *  - Visible focus states inherited from the global token system.
 *  - aria-current="page" on the active sub-nav link.
 */

type WegoLayoutProps = {
  /** Crumbs after Home → Mobile Health Clinic. Last entry is rendered as current page. */
  breadcrumb?: Array<{ label: string; href?: string }>;
  children: ReactNode;
};

const SUBNAV: Array<{ label: string; to: string }> = [
  { label: "Home", to: "/wego" },
  { label: "About", to: "/wego/about" },
  { label: "Services", to: "/wego/services" },
  { label: "Schedule", to: "/wego/schedule" },
  { label: "FAQ", to: "/wego/faq" },
  { label: "Contact", to: "/wego/contact" },
];

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

const WegoLayout = ({ breadcrumb = [], children }: WegoLayoutProps) => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-foreground"
      >
        Skip to main content
      </a>

      {/* ============ ADA / ECPHD PRIMARY HEADER (mirrors Index.tsx) ============ */}
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
              <a
                href="/contact-us"
                className="text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                Contact Us
              </a>
              <span aria-hidden="true" className="text-muted-foreground">|</span>
              <a
                href="/sitemap"
                className="text-primary underline-offset-2 hover:underline focus-visible:underline"
              >
                Site Map
              </a>
            </nav>

            <form
              role="search"
              className="flex w-full max-w-sm items-stretch overflow-hidden rounded border border-border"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="site-search" className="sr-only">
                Search this site
              </label>
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

        {/* Primary nav — identical to ADA site */}
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
                <CountiesDropdown key="counties" />
              ) : (
                <li key={label}>
                  <a
                    href={href}
                    aria-current={href === "/wego" ? "page" : undefined}
                    className={`block px-5 py-3 text-sm font-medium hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground ${
                      href === "/wego" ? "bg-brand-hover" : ""
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ),
            )}
          </ul>
          <div className="h-1 bg-accent-gold" aria-hidden="true" />
        </nav>

        {/* ============ WEGO SUB-NAV (program-level nav + CTAs) ============ */}
        <nav
          aria-label="Mobile Health Clinic"
          className="border-b border-border bg-muted/40"
        >
          <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap items-center gap-1">
              {SUBNAV.map(({ label, to }) => {
                const isActive =
                  to === "/wego" ? pathname === "/wego" : pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={`block rounded px-3 py-2 text-sm font-medium underline-offset-2 hover:bg-muted hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                        isActive
                          ? "bg-muted text-primary underline"
                          : "text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/wego/schedule"
                className="inline-flex items-center gap-2 rounded bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                View Schedule
              </Link>
              <a
                href="tel:18778849346"
                className="inline-flex items-center gap-2 rounded border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call 1-877-884-WEGO
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* ============ BREADCRUMB ============ */}
      <nav aria-label="Breadcrumb" className="border-b border-border bg-muted/40">
        <ol className="container flex flex-wrap items-center gap-1 py-3 text-sm">
          <li>
            <a
              href="/"
              className="text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              Home
            </a>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </li>
          <li>
            <Link
              to="/wego"
              className="text-primary underline-offset-2 hover:underline focus-visible:underline"
            >
              Mobile Health Clinic
            </Link>
          </li>
          {breadcrumb.map((crumb, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <span key={crumb.label} className="contents">
                <li aria-hidden="true" className="text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-foreground" : ""}
                >
                  {isLast || !crumb.href ? (
                    crumb.label
                  ) : (
                    <a
                      href={crumb.href}
                      className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                    >
                      {crumb.label}
                    </a>
                  )}
                </li>
              </span>
            );
          })}
        </ol>
      </nav>

      <main id="main">{children}</main>

      {/* ============ FOOTER (matches ADA site) ============ */}
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
            Department of Public Health. Mobile Health Clinic — 1-877-884-WEGO
            (9346).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WegoLayout;
