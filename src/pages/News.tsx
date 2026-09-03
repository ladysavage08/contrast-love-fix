import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { usePosts, formatPostDate, type Post } from "@/hooks/usePosts";
import { PUBLIC_HEALTH_SERIES_CATEGORY, PUBLIC_HEALTH_SERIES_PATH, isPublicHealthSeriesPost } from "@/lib/publicHealthSeries";

/** Date an event is considered finished (end date if multi-day, else start). */
const eventEndKey = (p: Post) =>
  (p.event_end_date ?? p.event_date ?? p.published_at ?? "").slice(0, 10);
const eventStartKey = (p: Post) =>
  (p.event_date ?? p.published_at ?? "").slice(0, 10);

const PostCard = ({ post, past = false }: { post: Post; past?: boolean }) => (
  <li className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
    {post.featured_image_url ? (
      <img
        src={post.featured_image_url}
        alt={post.featured_image_decorative ? "" : post.featured_image_alt ?? ""}
        {...(post.featured_image_decorative
          ? { role: "presentation", "aria-hidden": true }
          : {})}
        loading="lazy"
        className="h-48 w-full object-cover"
      />
    ) : (
      <div aria-hidden="true" className="h-2 w-full bg-accent" />
    )}
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          {formatPostDate(post.event_date ?? post.published_at)}
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
              {past ? "Past event" : "Event"}
            </span>
          </>
        )}
      </div>
      <h3 className="text-lg font-semibold leading-snug">
        <Link
          to={`/news/${post.slug}`}
          className="text-primary underline-offset-2 hover:underline"
        >
          {post.title}
        </Link>
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
      )}
      {post.event_location && (
        <p className="mt-1 text-sm text-muted-foreground">{post.event_location}</p>
      )}
      <Link
        to={`/news/${post.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-2 hover:underline"
        aria-label={`Read the full article: ${post.title}`}
      >
        Read Full Article <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </li>
);

const News = () => {
  const { data: posts, isLoading, error } = usePosts();
  const today = new Date().toISOString().slice(0, 10);
  const seriesPosts = posts?.filter((post) => isPublicHealthSeriesPost(post.category)) ?? [];
  const regularPosts = posts?.filter((post) => !isPublicHealthSeriesPost(post.category)) ?? [];

  const newsPosts = regularPosts.filter((p) => p.post_type !== "event");
  const upcomingEvents = regularPosts
    .filter((p) => p.post_type === "event" && eventEndKey(p) >= today)
    .sort((a, b) => eventStartKey(a).localeCompare(eventStartKey(b)));
  const pastEvents = regularPosts
    .filter((p) => p.post_type === "event" && eventEndKey(p) < today)
    .sort((a, b) => eventStartKey(b).localeCompare(eventStartKey(a)));


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

        <section aria-labelledby="public-health-series-heading" className="mb-8 rounded-lg border border-border bg-muted/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <h2 id="public-health-series-heading" className="text-xl font-semibold">
                What Is Public Health? Article Series
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore monthly Augusta Medical Examiner articles that explain public health topics in clear, community-focused language.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Category: {PUBLIC_HEALTH_SERIES_CATEGORY}
                {seriesPosts.length > 0 ? ` • ${seriesPosts.length} published entr${seriesPosts.length === 1 ? "y" : "ies"}` : ""}
              </p>
            </div>
            <Link
              to={PUBLIC_HEALTH_SERIES_PATH}
              className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              View article series <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

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

        {upcomingEvents.length > 0 && (
          <section aria-labelledby="upcoming-events-heading" className="mb-10">
            <h2 id="upcoming-events-heading" className="mb-4 text-2xl font-bold">
              Upcoming Events
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {upcomingEvents.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          </section>
        )}

        {newsPosts.length > 0 && (
          <section aria-labelledby="latest-news-heading" className="mb-10">
            <h2 id="latest-news-heading" className="mb-4 text-2xl font-bold">
              Latest News
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {newsPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section aria-labelledby="past-events-heading" className="mb-4">
            <h2 id="past-events-heading" className="mb-4 text-2xl font-bold">
              Past Events (Archive)
            </h2>
            <details className="rounded-lg border border-border bg-muted/30">
              <summary className="cursor-pointer rounded-lg px-4 py-4 text-base font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Show {pastEvents.length} past event{pastEvents.length === 1 ? "" : "s"}
              </summary>
              <div className="px-4 pb-5 pt-1">
                <p className="mb-4 text-sm text-muted-foreground">
                  Events are moved here automatically once their date has passed. Listed
                  newest to oldest.
                </p>
                <ul className="grid gap-6 sm:grid-cols-2">
                  {pastEvents.map((post) => (
                    <PostCard key={post.id} post={post} past />
                  ))}
                </ul>
              </div>
            </details>
          </section>
        )}

      </main>
      <SiteFooter />
    </div>
  );
};

export default News;
