import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Download } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { usePostsByCategory } from "@/hooks/usePosts";
import { PUBLIC_HEALTH_SERIES_CATEGORY } from "@/lib/publicHealthSeries";

const PublicHealthSeries = () => {
  const { data: posts, isLoading, error } = usePostsByCategory(PUBLIC_HEALTH_SERIES_CATEGORY);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/news" className="text-primary underline-offset-2 hover:underline">
            News &amp; Events
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>What Is Public Health? Article Series</span>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">What Is Public Health? Article Series</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Monthly public education articles published in the Augusta Medical Examiner,
            presented here in newest-first order for easy access.
          </p>
        </header>

        {isLoading && <p className="text-muted-foreground">Loading articles…</p>}
        {error && (
          <p className="text-destructive">
            We couldn&apos;t load the article series right now. Please try again later.
          </p>
        )}
        {posts && posts.length === 0 && (
          <p className="text-muted-foreground">No article series entries have been published yet.</p>
        )}

        {posts && posts.length > 0 && (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                      {post.publication_name && (
                        <>
                          <span aria-hidden="true">•</span>
                          <span>{post.publication_name}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold leading-snug">
                      <Link to={`/news/${post.slug}`} className="text-primary underline-offset-2 hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    {post.author_name && (
                      <p className="mt-2 text-sm text-muted-foreground">By {post.author_name}</p>
                    )}
                    {post.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
                    )}
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      {post.article_page_reference && (
                        <div>
                          <dt className="font-semibold text-foreground">Article pages</dt>
                          <dd className="text-muted-foreground">{post.article_page_reference}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="font-semibold text-foreground">Category</dt>
                        <dd className="text-muted-foreground">{PUBLIC_HEALTH_SERIES_CATEGORY}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-3">
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Read series entry details
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    {post.external_publication_url && (
                      <a
                        href={post.external_publication_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        Open Augusta Medical Examiner article
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
                    {post.download_url && (
                      <a
                        href={post.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Download article PDF
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default PublicHealthSeries;