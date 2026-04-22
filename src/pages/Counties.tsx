import {
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  ChevronRight,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

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
      <main id="main" className="container py-8 md:py-10">
        <header className="mb-8 max-w-3xl md:mb-10">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Our Counties</h1>
          <div aria-hidden="true" className="mt-3 h-1 w-20 bg-accent-gold" />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">
            The East Central Health District serves 13 counties across
            east-central Georgia. Select a county below to view services,
            contact information, and hours of operation.
          </p>
        </header>

        <section aria-label="County list">
          <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
