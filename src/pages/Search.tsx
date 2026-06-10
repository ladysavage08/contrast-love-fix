import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  fetchDynamicSearchEntries,
  getStaticSearchIndex,
  searchEntries,
  type SearchEntry,
} from "@/lib/siteSearch";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [input, setInput] = useState(query);
  const [dynamicEntries, setDynamicEntries] = useState<SearchEntry[]>([]);
  const [loadingDynamic, setLoadingDynamic] = useState(true);

  useEffect(() => {
    document.title = query
      ? `Search results for “${query}” | East Central Health District`
      : "Search | East Central Health District";
  }, [query]);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    fetchDynamicSearchEntries()
      .then((rows) => {
        if (!cancelled) setDynamicEntries(rows);
      })
      .finally(() => {
        if (!cancelled) setLoadingDynamic(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allEntries = useMemo(
    () => [...getStaticSearchIndex(), ...dynamicEntries],
    [dynamicEntries],
  );

  const results = useMemo(
    () => searchEntries(allEntries, query),
    [allEntries, query],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    setParams(q ? { q } : {}, { replace: false });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main id="main" className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold md:text-4xl">Search</h1>
            <p className="text-base text-muted-foreground">
              Search across pages, counties, programs, and news from the East
              Central Health District.
            </p>
          </header>

          <form
            role="search"
            aria-label="Search the site"
            onSubmit={handleSubmit}
            className="flex w-full items-stretch overflow-hidden rounded border border-border"
          >
            <label htmlFor="search-input" className="sr-only">
              Search this site
            </label>
            <input
              id="search-input"
              name="q"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search this site"
              autoFocus
              className="min-w-0 flex-1 bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand px-4 text-sm font-medium text-brand-foreground hover:bg-brand-hover"
            >
              Search
            </button>
          </form>

          <section aria-live="polite" aria-busy={loadingDynamic}>
            {query.trim() === "" ? (
              <p className="text-base text-muted-foreground">
                Enter a search term above to see results.
              </p>
            ) : results.length === 0 ? (
              <div className="rounded border border-border bg-card p-6">
                <h2 className="text-lg font-semibold">
                  No results found for “{query}”
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  Try a different keyword, check your spelling, or browse the
                  site from the{" "}
                  <Link to="/" className="text-primary underline">
                    home page
                  </Link>
                  ,{" "}
                  <Link to="/counties" className="text-primary underline">
                    counties
                  </Link>
                  , or{" "}
                  <Link to="/programs" className="text-primary underline">
                    programs
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {results.length} result{results.length === 1 ? "" : "s"} for
                  “{query}”
                  {loadingDynamic ? " (still loading news…)" : ""}
                </p>
                <ul className="space-y-4">
                  {results.map((r) => (
                    <li
                      key={`${r.section}:${r.url}`}
                      className="rounded border border-border bg-card p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {r.section}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        <Link
                          to={r.url}
                          className="text-primary underline-offset-2 hover:underline focus-visible:underline"
                        >
                          {r.title}
                        </Link>
                      </h3>
                      {r.snippet && (
                        <p className="mt-1 text-base text-foreground">
                          {r.snippet}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {r.url}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Search;
