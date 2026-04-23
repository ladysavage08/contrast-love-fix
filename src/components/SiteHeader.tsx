import { Search, Info } from "lucide-react";
import PrimaryNav from "@/components/PrimaryNav";

/**
 * Shared top header (DPH brand block + utility links + search + primary nav).
 * Used on Index, Counties, CountyPage, and inside WegoLayout — guarantees
 * consistent mobile behavior site-wide.
 */
interface SiteHeaderProps {
  currentCountySlug?: string;
  /** Optional content rendered to the right of the brand on md+ (e.g. patient/employee buttons on home). */
  utilityExtras?: React.ReactNode;
}

const SiteHeader = ({ currentCountySlug, utilityExtras }: SiteHeaderProps) => {
  return (
    <header className="border-b border-border">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-foreground focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      >
        Skip to main content
      </a>
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:py-6">
        <a
          href="/"
          className="flex items-center gap-3 text-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="East Central Health District — Home"
        >
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-destructive text-sm font-bold text-destructive-foreground sm:h-12 sm:w-12"
          >
            DPH
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] text-muted-foreground sm:text-xs">
              Georgia Department of Public Health
            </span>
            <span className="block text-sm font-semibold sm:text-base">
              East Central Health District
            </span>
          </span>
        </a>

        <div className="flex flex-col gap-3 md:items-end">
          <nav
            aria-label="Utility"
            className="flex items-center gap-3 text-sm"
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
              className="min-w-0 flex-1 bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none md:text-sm md:py-2"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Go
            </button>
          </form>

          {utilityExtras}
        </div>
      </div>

      <PrimaryNav currentCountySlug={currentCountySlug} />
    </header>
  );
};

export default SiteHeader;
