import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import CountiesDropdown from "@/components/CountiesDropdown";

/**
 * Shared primary navigation used on every top-level page.
 *
 * Desktop (md+): horizontal brand-blue bar — visually identical to the
 * pre-refactor inline nav so no design change is introduced.
 * Mobile (<md): a hamburger button opens a smooth slide-down panel with
 * full-width tap targets (≥ 44px), an expandable Counties section,
 * Contact / Site Map utility links, and any page-supplied extras
 * (e.g. Patient Portal, Employee Login, social row). Body scroll is
 * locked while the menu is open.
 *
 * Always include the gold accent stripe at the bottom.
 */

type NavItem = [label: string, href: string];

const ITEMS: NavItem[] = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["__counties__", ""],
  ["Programs/Services", "/programs"],
  ["Mobile Health Clinic", "/wego"],
  ["Directory", "/directory"],
  ["Careers", "https://dph.georgia.gov/about-dph/careers"],
  ["News/Events", "/news"],
  ["Calendar", "/calendar"],
  ["I Want To…", "/services"],
];

const COUNTIES = [
  "Burke",
  "Columbia",
  "Emanuel",
  "Glascock",
  "Jefferson",
  "Jenkins",
  "Lincoln",
  "McDuffie",
  "Richmond",
  "Screven",
  "Taliaferro",
  "Warren",
  "Wilkes",
];

interface PrimaryNavProps {
  /** Slug of the current county (used for aria-current in dropdown). */
  currentCountySlug?: string;
  /** Optional content rendered at the bottom of the mobile drawer (Patient Portal, social, etc). */
  mobileDrawerExtras?: React.ReactNode;
  /** Optional content rendered inline next to the hamburger button on mobile. */
  mobileQuickAction?: React.ReactNode;
}

const PrimaryNav = ({
  currentCountySlug,
  mobileDrawerExtras,
  mobileQuickAction,
}: PrimaryNavProps) => {
  const [open, setOpen] = useState(false);
  const [countiesOpen, setCountiesOpen] = useState(false);

  // ESC closes; body scroll locks while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <nav aria-label="Primary" className="bg-brand text-brand-foreground">
      {/* Mobile: hamburger row */}
      <div className="container flex items-center justify-between gap-2 md:hidden">
        <span className="py-3 text-sm font-semibold">Menu</span>
        <div className="flex items-center gap-2">
          {mobileQuickAction}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="primary-mobile-menu"
            aria-label={open ? "Close main menu" : "Open main menu"}
            onClick={() => setOpen((o) => !o)}
            className="my-2 inline-flex h-11 w-11 items-center justify-center rounded hover:bg-brand-hover focus-visible:bg-brand-hover"
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="primary-mobile-menu"
        hidden={!open}
        className="md:hidden border-t border-brand-foreground/20 max-h-[calc(100vh-7rem)] overflow-y-auto"
      >
        <ul className="container flex flex-col py-2">
          {ITEMS.map(([label, href]) =>
            label === "__counties__" ? (
              <li key="counties-mobile">
                <button
                  type="button"
                  aria-expanded={countiesOpen}
                  aria-controls="counties-mobile-panel"
                  onClick={() => setCountiesOpen((o) => !o)}
                  className="flex min-h-[48px] w-full items-center justify-between px-2 py-3 text-base font-medium hover:bg-brand-hover focus-visible:bg-brand-hover"
                >
                  <span>Counties</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${countiesOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <ul
                  id="counties-mobile-panel"
                  hidden={!countiesOpen}
                  className="mb-2 ml-3 border-l-2 border-accent-gold pl-3"
                >
                  <li>
                    <a
                      href="/counties"
                      className="block min-h-[44px] py-3 text-sm font-semibold underline underline-offset-2 hover:underline focus-visible:bg-brand-hover"
                    >
                      All Counties
                    </a>
                  </li>
                  {COUNTIES.map((c) => {
                    const slug = c.toLowerCase();
                    return (
                      <li key={c}>
                        <a
                          href={`/counties/${slug}`}
                          aria-current={
                            currentCountySlug === slug ? "page" : undefined
                          }
                          className={`block min-h-[44px] py-3 text-sm underline-offset-2 hover:underline focus-visible:bg-brand-hover ${
                            currentCountySlug === slug ? "font-semibold underline" : ""
                          }`}
                        >
                          {c} County
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block min-h-[48px] px-2 py-3 text-base font-medium hover:bg-brand-hover focus-visible:bg-brand-hover"
                >
                  {label}
                  {href.startsWith("http") && (
                    <span className="sr-only"> (opens in new tab)</span>
                  )}
                </a>
              </li>
            ),
          )}
        </ul>

        {/* Utility links moved out of the top header on phones. */}
        <div className="container border-t border-brand-foreground/20 py-3">
          <ul className="flex flex-col">
            <li>
              <a
                href="/contact"
                className="block min-h-[44px] px-2 py-3 text-sm font-medium underline-offset-2 hover:bg-brand-hover hover:underline focus-visible:bg-brand-hover"
              >
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="/sitemap"
                className="block min-h-[44px] px-2 py-3 text-sm font-medium underline-offset-2 hover:bg-brand-hover hover:underline focus-visible:bg-brand-hover"
              >
                Site Map
              </a>
            </li>
          </ul>
        </div>

        {mobileDrawerExtras && (
          <div className="container border-t border-brand-foreground/20 py-4">
            {mobileDrawerExtras}
          </div>
        )}
      </div>

      {/* Desktop: horizontal nav (md+) */}
      <ul className="container hidden w-full md:flex md:flex-nowrap md:items-stretch">
        {ITEMS.map(([label, href]) =>
          label === "__counties__" ? (
            <CountiesDropdown key="counties" currentSlug={currentCountySlug} />
          ) : (
            <li key={label} className="flex flex-1 items-stretch">
              <a
                href={href}
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex w-full items-center justify-center px-3 py-3 text-center text-sm font-medium hover:bg-brand-hover focus-visible:bg-brand-hover"
              >
                {label}
                {href.startsWith("http") && (
                  <span className="sr-only"> (opens in new tab)</span>
                )}
              </a>
            </li>
          ),
        )}
      </ul>

      <div className="h-1 bg-accent-gold" aria-hidden="true" />
    </nav>
  );
};

export default PrimaryNav;
