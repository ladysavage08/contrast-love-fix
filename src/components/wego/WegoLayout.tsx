import { ReactNode, useState } from "react";
import {
  Phone,
  Calendar,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Link, useLocation } from "react-router-dom";

/**
 * WegoLayout — shared chrome for the Mobile Health Clinic ("WeGo") sub-site.
 *
 * Reuses the shared SiteHeader (DPH brand block + utility links + search +
 * primary nav with mobile hamburger) so WeGo reads as a *section* of the
 * main site rather than a separate microsite.
 *
 * Adds a secondary "WeGo sub-nav" directly under the primary nav.
 *  - Desktop: horizontal pills.
 *  - Mobile: a "Section menu" disclosure that expands the WeGo sub-pages
 *    in a vertical, finger-friendly list.
 *  - "View Schedule" + "Call Now" CTAs are always visible.
 */

type WegoLayoutProps = {
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


const WegoLayout = ({ breadcrumb = [], children }: WegoLayoutProps) => {
  const { pathname } = useLocation();
  const [subOpen, setSubOpen] = useState(false);

  const activeLabel =
    SUBNAV.find(({ to }) =>
      to === "/wego" ? pathname === "/wego" : pathname.startsWith(to),
    )?.label ?? "Menu";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      {/* ============ WEGO SUB-NAV ============ */}
      <nav
        aria-label="Mobile Health Clinic"
        className="border-b border-border bg-muted/40"
      >
        <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          {/* Mobile: disclosure */}
          <div className="md:hidden">
            <button
              type="button"
              aria-expanded={subOpen}
              aria-controls="wego-subnav"
              onClick={() => setSubOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded border border-border bg-background px-3 py-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:bg-muted"
            >
              <span>
                <span className="text-muted-foreground">Section: </span>
                {activeLabel}
              </span>
              {subOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <ul
              id="wego-subnav"
              hidden={!subOpen}
              className="mt-2 overflow-hidden rounded border border-border bg-background"
            >
              {SUBNAV.map(({ label, to }) => {
                const isActive =
                  to === "/wego" ? pathname === "/wego" : pathname.startsWith(to);
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      aria-current={isActive ? "page" : undefined}
                      className={`block min-h-[48px] border-b border-border px-3 py-3 text-sm font-medium last:border-b-0 underline-offset-2 hover:bg-muted hover:underline focus-visible:bg-muted ${
                        isActive
                          ? "bg-muted text-primary"
                          : "text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop: horizontal pills */}
          <ul className="hidden flex-wrap items-center gap-1 md:flex">
            {SUBNAV.map(({ label, to }) => {
              const isActive =
                to === "/wego" ? pathname === "/wego" : pathname.startsWith(to);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={isActive ? "page" : undefined}
                    className={`block min-h-[44px] rounded px-3 py-2 text-sm font-medium underline-offset-2 hover:bg-muted hover:underline focus-visible:bg-muted ${
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded bg-brand px-3 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:flex-none"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              View Schedule
            </Link>
            <a
              href="tel:18778849346"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-primary px-3 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-none"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xs:inline">Call </span>1-877-884-WEGO
            </a>
          </div>
        </div>
      </nav>

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

      {/* ============ FOOTER ============ */}
      <SiteFooter showSocials extraCopy="Mobile Health Clinic — 1-877-884-WEGO (9346)." />
    </div>
  );
};

export default WegoLayout;
