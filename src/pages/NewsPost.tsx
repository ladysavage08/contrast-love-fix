import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { usePost, formatPostDate } from "@/hooks/usePosts";
import { isAllDayEvent } from "@/lib/eventDate";
import { normalizeSanitizedPostBody } from "@/lib/postBodyHtml";

const NewsPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePost(slug);

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
          {post && (
            <>
              <span className="mx-2" aria-hidden="true">/</span>
              <span>{post.title}</span>
            </>
          )}
        </nav>

        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {error && (
          <p className="text-destructive">
            We couldn't load this post. Please try again later.
          </p>
        )}

        {!isLoading && !error && !post && (
          <div>
            <h1 className="text-2xl font-bold">Post not found</h1>
            <p className="mt-2 text-muted-foreground">
              The post you're looking for doesn't exist or hasn't been published.
            </p>
            <Link
              to="/news"
              className="mt-4 inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to News &amp; Events
            </Link>
          </div>
        )}

        {post && (
          <article className="mx-auto max-w-3xl">
            <header className="mb-6 border-b border-border pb-4">
              <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
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
              <h1 className="text-3xl font-bold sm:text-4xl">{post.title}</h1>
              {post.excerpt && (
                <p className="mt-3 text-lg text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              {(post.author_name || post.publication_name || post.article_page_reference) && (
                <dl className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  {post.author_name && (
                    <div>
                      <dt className="font-semibold text-foreground">Author</dt>
                      <dd>{post.author_name}</dd>
                    </div>
                  )}
                  {post.publication_name && (
                    <div>
                      <dt className="font-semibold text-foreground">Publication</dt>
                      <dd>{post.publication_name}</dd>
                    </div>
                  )}
                  {post.article_page_reference && (
                    <div>
                      <dt className="font-semibold text-foreground">Pages</dt>
                      <dd>{post.article_page_reference}</dd>
                    </div>
                  )}
                </dl>
              )}
            </header>

            {post.featured_image_url && (
              <img
                src={post.featured_image_url}
                alt={
                  post.featured_image_decorative
                    ? ""
                    : post.featured_image_alt ?? ""
                }
                {...(post.featured_image_decorative
                  ? { role: "presentation", "aria-hidden": true }
                  : {})}
                className="mb-6 w-full rounded-lg object-cover"
              />
            )}

            {post.post_type === "event" &&
              (post.event_date || post.event_time || post.event_location || post.event_link) && (
                <section
                  aria-labelledby="event-details"
                  className="mb-6 rounded-lg border border-border bg-muted/40 p-5"
                >
                  <h2 id="event-details" className="mb-3 text-lg font-semibold">
                    Event Details
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {post.event_date && (
                      <li className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                        <span>
                          <span className="font-medium">Date: </span>
                          {new Date(post.event_date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </li>
                    )}
                    {isAllDayEvent(post) ? (
                      <li className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                        <span>
                          <span className="font-medium">Time: </span>
                          All day
                        </span>
                      </li>
                    ) : (
                      post.event_time && (
                        <li className="flex items-start gap-2">
                          <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                          <span>
                            <span className="font-medium">Time: </span>
                            {post.event_time}
                          </span>
                        </li>
                      )
                    )}
                    {post.event_location && (
                      <li className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                        <span>
                          <span className="font-medium">Location: </span>
                          {post.event_location}
                        </span>
                      </li>
                    )}
                    {post.event_link && (
                      <li className="flex items-start gap-2">
                        <ExternalLink className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                        <a
                          href={post.event_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          Registration / Details
                          <span className="sr-only"> (opens in new tab)</span>
                        </a>
                      </li>
                    )}
                  </ul>
                </section>
              )}

            {post.body && (
              <div
                className="prose prose-slate max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-2"
                dangerouslySetInnerHTML={{ __html: normalizeSanitizedPostBody(post.body) }}
              />
            )}

            {(post.external_publication_url || post.download_url) && (
              <section aria-labelledby="publication-links" className="mt-8 rounded-lg border border-border bg-muted/40 p-5">
                <h2 id="publication-links" className="text-lg font-semibold">Article Links</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {post.external_publication_url && (
                    <a
                      href={post.external_publication_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Read this article in the publication
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                  {post.download_url && (
                    <a
                      href={post.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Download article PDF
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                </div>
              </section>
            )}

            {post.cta_url && post.cta_label && (
              <div className="mt-6">
                <a
                  href={post.cta_url}
                  {...(post.cta_url.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {post.cta_label}
                </a>
              </div>
            )}

            <div className="mt-10 border-t border-border pt-6">
              <Link
                to="/news"
                className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to News &amp; Events
              </Link>
            </div>
          </article>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default NewsPost;
