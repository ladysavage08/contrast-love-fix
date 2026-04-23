import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import CountiesDropdown from "@/components/CountiesDropdown";

/**
 * Shared primary navigation used on every top-level page.
 *
 * Desktop (md+): horizontal brand-blue bar — visually identical to the
 * pre-refactor inline nav so no design change is introduced.
 * Mobile (<md): a hamburger button opens an in-flow accordion-style panel
 * with full-width tap targets (>= 44px), an expandable Counties section,
 * and proper aria-expanded/aria-controls wiring.
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
  ["Careers", "/careers"],
  ["News/Events", "/news"],
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
}

const PrimaryNav = ({ currentCountySlug }: PrimaryNavProps) => {
  const [open, setOpen] = useState(false);
  const [countiesOpen, setCountiesOpen] = useState(false);

  // Close menu when route changes (popstate) or escape pressed.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav aria-label="Primary" className="bg-brand text-brand-foreground">
      {/* Mobile: hamburger row */}
      <div className="container flex items-center justify-between md:hidden">
        <span className="py-3 text-sm font-semibold">Menu</span>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="primary-mobile-menu"
          aria-label={open ? "Close main menu" : "Open main menu"}
          onClick={() => setOpen((o) => !o)}
          className="my-2 inline-flex h-11 w-11 items-center justify-center rounded hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="primary-mobile-menu"
        hidden={!open}
        className="md:hidden border-t border-brand-foreground/20"
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
                  className="flex w-full items-center justify-between px-1 py-3 text-base font-medium hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
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
                      className="block py-2.5 text-sm font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
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
                          className={`block py-2.5 text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground ${
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
                  className="block px-1 py-3 text-base font-medium hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
                >
                  {label}
                </a>
              </li>
            ),
          )}
        </ul>
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
                className="flex w-full items-center justify-center px-3 py-3 text-center text-sm font-medium hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-foreground"
              >
                {label}
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
