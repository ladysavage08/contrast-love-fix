import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Search,
  Info,
  ChevronRight,
} from "lucide-react";
import CountiesDropdown from "@/components/CountiesDropdown";
import CountyTile from "@/components/CountyTile";
import { counties } from "@/data/counties";

/**
 * Counties landing page.
 * Lists all 13 counties served by ECHD as information-rich tiles.
 * Tile data lives in src/data/counties.ts (single source of truth).
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

const Counties = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============ HEADER ============ */}
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

        {/* Primary nav */}
        <nav aria-label="Primary" className="bg-brand text-brand-foreground">
          <ul className="container flex flex-wrap">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["__counties__", ""],
              ["Programs/Services", "/programs"],
              ["Mobile Health Clinic", "/mobile-health-clinic"],
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
          <li aria-current="page" className="font-medium text-foreground">
            Counties
          </li>
        </ol>
      </nav>

      {/* ============ MAIN ============ */}
      <main id="main" className="container py-10">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Our Counties</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            The East Central Health District serves 13 counties across
            east-central Georgia. Select a county below to view services,
            contact information, and hours of operation.
          </p>
        </header>

        <section aria-label="County list">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {counties.map((county) => (
              <li key={county.slug} className="flex">
                <CountyTile county={county} />
              </li>
            ))}
          </ul>
        </section>
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

export default Counties;
