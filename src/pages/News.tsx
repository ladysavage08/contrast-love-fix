import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { usePosts, formatPostDate } from "@/hooks/usePosts";

const News = () => {
  const { data: posts, isLoading, error } = usePosts();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>News &amp; Events</span>
        </nav>

        <header className="mb-8 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">News &amp; Events</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Find the latest updates, announcements, and upcoming public health
            events from East Central Public Health.
          </p>
        </header>

        {isLoading && (
          <p className="text-muted-foreground">Loading posts…</p>
        )}
        {error && (
          <p className="text-destructive">
            We couldn't load posts right now. Please try again later.
          </p>
        )}

        {posts && posts.length === 0 && (
          <p className="text-muted-foreground">No posts have been published yet.</p>
        )}

        {posts && posts.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                {post.featured_image_url ? (
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-2 w-full bg-accent"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatPostDate(post.published_at)}
                    </span>
                    {post.category && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>{post.category}</span>
                      </>
                    )}
                    {post.post_type === "event" && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span className="rounded bg-accent/20 px-2 py-0.5 font-semibold text-accent-foreground">
                          Event
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold leading-snug">
                    <Link
                      to={`/news/${post.slug}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    to={`/news/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
                    aria-label={`Read more: ${post.title}`}
                  >
                    Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
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

export default News;
