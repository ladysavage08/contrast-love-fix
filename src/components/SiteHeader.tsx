import { Search, Info } from "lucide-react";
import PrimaryNav from "@/components/PrimaryNav";

/**
 * Shared top header (DPH brand block + utility links + search + primary nav).
 * Used on Index, Counties, CountyPage, and inside WegoLayout — guarantees
 * consistent mobile behavior site-wide.
 *
 * Mobile refinement:
 *  - Brand row is denser; utility text links (Contact / Site Map) collapse
 *    into the hamburger drawer instead of stacking above search on phones.
 *  - Search stays one-tap accessible.
 *  - `utilityExtras` continues to render on md+ for desktop visibility, and
 *    `mobileUtilityExtras` (when provided) is forwarded into the mobile menu
 *    drawer via PrimaryNav so the top of the page stays clean on phones.
 */
interface SiteHeaderProps {
  currentCountySlug?: string;
  /** Optional content rendered to the right of the brand on md+ (e.g. patient/employee buttons on home). */
  utilityExtras?: React.ReactNode;
  /** Optional content rendered inside the mobile menu drawer (e.g. portals, social row). */
  mobileUtilityExtras?: React.ReactNode;
  /** Optional always-visible action shown next to the hamburger on mobile (e.g. Patient Portal). */
  mobileQuickAction?: React.ReactNode;
}

const SiteHeader = ({
  currentCountySlug,
  utilityExtras,
  mobileUtilityExtras,
  mobileQuickAction,
}: SiteHeaderProps) => {
  return (
    <header className="border-b border-border">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-brand focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-brand-foreground"
      >
        Skip to main content
      </a>

      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:py-6">
        <a
          href="/"
          className="flex items-center gap-3 text-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="East Central Health District — Home"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-destructive text-xs font-bold text-destructive-foreground sm:h-12 sm:w-12 sm:text-sm"
          >
            DPH
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] text-muted-foreground sm:text-xs">
              Georgia Department of Public Health
            </span>
            <span className="block text-sm font-semibold sm:text-base">
              East Central Health District
            </span>
          </span>
        </a>

        <div className="flex flex-col gap-2 md:items-end md:gap-3">
          {/* Utility text links: hidden on phones (moved into drawer), visible on md+. */}
          <nav
            aria-label="Utility"
            className="hidden items-center gap-3 text-sm md:flex"
          >
            <Info className="h-4 w-4 text-primary" aria-hidden="true" />
            <a
              href="/contact"
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
            className="flex w-full items-stretch overflow-hidden rounded border border-border md:max-w-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="site-search" className="sr-only">
              Search this site
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search this site"
              className="min-w-0 flex-1 bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none md:text-sm"
            />
            <button
              type="submit"
              aria-label="Search the site"
              className="flex min-w-[44px] items-center gap-1 bg-brand px-3 text-sm font-medium text-brand-foreground hover:bg-brand-hover sm:px-4"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Desktop-only utility extras (e.g. Employee Login + Patient Portal + social on home). */}
          {utilityExtras && (
            <div className="hidden md:block">{utilityExtras}</div>
          )}
        </div>
      </div>

      <PrimaryNav
        currentCountySlug={currentCountySlug}
        mobileDrawerExtras={mobileUtilityExtras}
        mobileQuickAction={mobileQuickAction}
      />
    </header>
  );
};

export default SiteHeader;
