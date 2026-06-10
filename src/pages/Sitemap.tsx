import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getStaticSearchIndex, type SearchEntry } from "@/lib/siteSearch";

/**
 * Human-readable sitemap shown at /sitemap. Groups every public page by
 * section so visitors can scan the site at a glance. Search engines use
 * the XML sitemap served separately at /sitemap.xml.
 */
const Sitemap = () => {
  useEffect(() => {
    document.title = "Site Map | East Central Health District";
  }, []);

  const grouped = useMemo(() => {
    const entries = getStaticSearchIndex();
    const order = [
      "Site",
      "Counties",
      "Programs",
      "Environmental Health",
      "Women's Health",
      "News",
      "Calendar",
      "WeGo",
    ];
    const map = new Map<string, SearchEntry[]>();
    for (const e of entries) {
      const list = map.get(e.section) ?? [];
      list.push(e);
      map.set(e.section, list);
    }
    for (const [, list] of map) list.sort((a, b) => a.title.localeCompare(b.title));
    return order
      .filter((s) => map.has(s))
      .map((s) => ({ section: s, items: map.get(s)! }));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main" className="container py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <header className="space-y-2 border-b border-border pb-6">
            <h1 className="text-3xl font-bold md:text-4xl">Site Map</h1>
            <p className="text-base text-muted-foreground">
              A complete index of pages on the East Central Health District
              website. Search engines should use the{" "}
              <a href="/sitemap.xml" className="text-primary underline">
                XML sitemap
              </a>
              .
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {grouped.map(({ section, items }) => (
              <section
                key={section}
                aria-labelledby={`sitemap-${section.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
              >
                <h2
                  id={`sitemap-${section.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
                  className="mb-3 text-xl font-semibold"
                >
                  {section}
                </h2>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item.url}>
                      <Link
                        to={item.url}
                        className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Sitemap;
