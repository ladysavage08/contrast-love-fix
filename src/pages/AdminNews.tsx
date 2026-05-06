import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ExternalLink, ArrowLeft, Upload, X, Heading2, Heading3, Bold, Italic, List, Link as LinkIcon, Pilcrow } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Post } from "@/hooks/usePosts";
import { sortPostsChronologically } from "@/lib/sortPosts";
import { cn } from "@/lib/utils";
import { eventEndKey, todayKey as getTodayKey } from "@/lib/eventDate";

type Draft = {
  id?: string;
  title: string;
  slug: string;
  post_type: "news" | "event";
  category: string;
  author_name: string;
  publication_name: string;
  article_page_reference: string;
  external_publication_url: string;
  download_file_type: string;
  download_page_count: string;
  download_url: string;
  excerpt: string;
  body: string;
  featured_image_url: string;
  featured_image_alt: string;
  featured_image_decorative: boolean;
  published: boolean;
  published_at: string; // ISO date (YYYY-MM-DD) for input[type=date]
  event_date: string; // YYYY-MM-DD
  event_end_date: string; // YYYY-MM-DD (final/end date for multi-day or recurring events)
  event_time: string;
  event_location: string;
  event_link: string;
  cta_label: string;
  cta_url: string;
};

const emptyDraft = (): Draft => ({
  title: "",
  slug: "",
  post_type: "news",
  category: "",
  author_name: "",
  publication_name: "",
  article_page_reference: "",
  external_publication_url: "",
  download_file_type: "PDF",
  download_page_count: "",
  download_url: "",
  excerpt: "",
  body: "",
  featured_image_url: "",
  featured_image_alt: "",
  featured_image_decorative: false,
  published: true,
  published_at: new Date().toISOString().slice(0, 10),
  event_date: "",
  event_end_date: "",
  event_time: "",
  event_location: "",
  event_link: "",
  cta_label: "",
  cta_url: "",
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function postToDraft(p: Post): Draft {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    post_type: p.post_type,
    category: p.category ?? "",
    author_name: p.author_name ?? "",
    publication_name: p.publication_name ?? "",
    article_page_reference: p.article_page_reference ?? "",
    external_publication_url: p.external_publication_url ?? "",
    download_file_type: p.download_file_type ?? "PDF",
    download_page_count:
      typeof p.download_page_count === "number" ? String(p.download_page_count) : "",
    download_url: p.download_url ?? "",
    excerpt: p.excerpt ?? "",
    body: p.body ?? "",
    featured_image_url: p.featured_image_url ?? "",
    featured_image_alt: p.featured_image_alt ?? "",
    featured_image_decorative: p.featured_image_decorative ?? false,
    published: p.published,
    published_at: (p.published_at ?? "").slice(0, 10),
    event_date: p.event_date ?? "",
    event_end_date: p.event_end_date ?? "",
    event_time: p.event_time ?? "",
    event_location: p.event_location ?? "",
    event_link: p.event_link ?? "",
    cta_label: p.cta_label ?? "",
    cta_url: p.cta_url ?? "",
  };
}

const AdminNews = () => {
  const navigate = useNavigate();
  const { user, isAdmin, canManage, loading } = useAdminAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "news" | "event">("all");
  const [eventScope, setEventScope] = useState<"upcoming" | "archived" | "all">(
    "upcoming",
  );
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canManage) navigate("/", { replace: true });
  }, [user, canManage, loading, navigate]);

  async function loadPosts() {
    setListLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (error) {
      toast({
        title: "Couldn't load posts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts((data ?? []) as Post[]);
    }
    setListLoading(false);
  }

  useEffect(() => {
    if (user && isAdmin) loadPosts();
  }, [user, isAdmin]);

  const today = getTodayKey();
  const isArchived = (p: Post) => {
    if (p.post_type !== "event") return false;
    const end = eventEndKey(p);
    return !!end && end < today;
  };

  const filteredPosts = useMemo(() => {
    let scoped = filter === "all" ? posts : posts.filter((p) => p.post_type === filter);
    if (filter !== "news") {
      // Apply archive filter to events. When viewing "news only", scope doesn't apply.
      if (eventScope === "upcoming") {
        scoped = scoped.filter((p) => p.post_type !== "event" || !isArchived(p));
      } else if (eventScope === "archived") {
        scoped = scoped.filter((p) => p.post_type === "event" && isArchived(p));
      }
    }
    return sortPostsChronologically(scoped);
  }, [posts, filter, eventScope, today]);

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const slug = editing.slug.trim() || slugify(editing.title);
    if (!slug) {
      toast({ title: "Slug is required", variant: "destructive" });
      return;
    }
    if (
      editing.featured_image_url.trim() &&
      !editing.featured_image_decorative &&
      !editing.featured_image_alt.trim()
    ) {
      toast({
        title: "Alt text required",
        description:
          "For ADA compliance, describe the image or mark it as decorative.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const payload = {
      title: editing.title.trim(),
      slug,
      post_type: editing.post_type,
      category: editing.category.trim() || null,
      author_name: editing.author_name.trim() || null,
      publication_name: editing.publication_name.trim() || null,
      article_page_reference: editing.article_page_reference.trim() || null,
      external_publication_url: editing.external_publication_url.trim() || null,
      download_file_type: editing.download_url.trim()
        ? editing.download_file_type.trim() || "PDF"
        : null,
      download_page_count: editing.download_url.trim() && editing.download_page_count.trim()
        ? Number(editing.download_page_count)
        : null,
      download_url: editing.download_url.trim() || null,
      excerpt: editing.excerpt.trim() || null,
      body: editing.body.trim() || null,
      featured_image_url: editing.featured_image_url.trim() || null,
      featured_image_alt: editing.featured_image_url.trim()
        ? (editing.featured_image_decorative
            ? null
            : editing.featured_image_alt.trim() || null)
        : null,
      featured_image_decorative:
        !!editing.featured_image_url.trim() && editing.featured_image_decorative,
      published: editing.published,
      published_at: editing.published_at
        ? new Date(editing.published_at).toISOString()
        : new Date().toISOString(),
      event_date: editing.post_type === "event" && editing.event_date
        ? editing.event_date
        : null,
      event_end_date:
        editing.post_type === "event" && editing.event_end_date
          ? editing.event_end_date
          : null,
      event_time:
        editing.post_type === "event" && editing.event_time.trim()
          ? editing.event_time.trim()
          : null,
      event_location:
        editing.post_type === "event" && editing.event_location.trim()
          ? editing.event_location.trim()
          : null,
      event_link:
        editing.post_type === "event" && editing.event_link.trim()
          ? editing.event_link.trim()
          : null,
      cta_label: editing.cta_label.trim() || null,
      cta_url: editing.cta_url.trim() || null,
    };

    const { error } = editing.id
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);

    setSaving(false);
    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: editing.id ? "Post updated" : "Post created" });
    setEditing(null);
    loadPosts();
  }

  async function handleDelete(p: Post) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", p.id);
    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Post deleted" });
    loadPosts();
  }

  async function togglePublished(p: Post) {
    const { error } = await supabase
      .from("posts")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    loadPosts();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main id="main" className="container py-10">
          <p className="text-muted-foreground">Loading…</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main id="main" className="container py-10">
          <p className="text-sm">
            Your account does not have the <strong>admin</strong> role, so you
            can't edit posts. Ask an administrator to grant you the admin role.
          </p>
          <Link to="/admin" className="mt-4 inline-block text-primary underline">
            Back to Admin
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden>/</span>
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden>/</span>
          <span>News &amp; Events</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden />
            <h1 className="text-3xl font-bold sm:text-4xl">News &amp; Events</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create, edit, publish, or remove news posts and calendar events.
              Changes appear on the live site immediately.
            </p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(emptyDraft())}>
              <Plus className="mr-1 h-4 w-4" /> New post
            </Button>
          )}
        </header>

        {editing ? (
          <PostEditor
            draft={editing}
            saving={saving}
            onChange={setEditing}
            onCancel={() => setEditing(null)}
            onSave={handleSave}
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted-foreground">Filter:</span>
              {(["all", "news", "event"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-1 ${
                    filter === f
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {f === "all" ? "All" : f === "news" ? "News" : "Events"}
                </button>
              ))}
            </div>

            {filter !== "news" && (
              <div
                className="mb-3 flex flex-wrap items-center gap-2 text-sm"
                role="group"
                aria-label="Event archive filter"
              >
                <span className="text-muted-foreground">Events:</span>
                {([
                  { key: "upcoming", label: "Upcoming Events" },
                  { key: "archived", label: "Archived Events" },
                  { key: "all", label: "All Events" },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setEventScope(opt.key)}
                    aria-pressed={eventScope === opt.key}
                    className={`rounded-full border px-3 py-1 ${
                      eventScope === opt.key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {eventScope === "archived" && filter !== "news" && (
              <p
                role="note"
                className="mb-4 rounded-md border-l-4 border-accent-gold bg-muted/40 p-3 text-xs text-muted-foreground"
              >
                Archived events are hidden from the public site but saved for
                records. You can still edit, view, or restore them.
              </p>
            )}

            {listLoading ? (
              <p className="text-muted-foreground">Loading posts…</p>
            ) : filteredPosts.length === 0 ? (
              <p className="text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                {filteredPosts.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                        <span>
                          {new Date(p.published_at).toLocaleDateString()}
                        </span>
                        <span aria-hidden>•</span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-semibold ${
                            p.post_type === "event"
                              ? "bg-accent/20 text-accent-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {p.post_type}
                        </span>
                        {!p.published && (
                          <>
                            <span aria-hidden>•</span>
                            <span className="rounded bg-muted px-1.5 py-0.5 font-semibold text-muted-foreground">
                              Draft
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-1 truncate text-base font-semibold">
                        {p.title}
                      </h2>
                      <p className="truncate text-xs text-muted-foreground">
                        /{p.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Switch
                          checked={p.published}
                          onCheckedChange={() => togglePublished(p)}
                          aria-label="Toggle published"
                        />
                        <span className="text-muted-foreground">
                          {p.published ? "Live" : "Hidden"}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <Link to={`/news/${p.slug}`} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditing(postToDraft(p))}
                      >
                        <Pencil className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

function PostEditor({
  draft,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  draft: Draft;
  saving: boolean;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    onChange({ ...draft, [k]: v });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-6 rounded-lg border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-sm text-primary underline-offset-2 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>
        <h2 className="text-lg font-semibold">
          {draft.id ? "Edit post" : "New post"}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={draft.title}
            onChange={(e) => {
              const title = e.target.value;
              const auto =
                !draft.id && (!draft.slug || draft.slug === slugify(draft.title))
                  ? slugify(title)
                  : draft.slug;
              onChange({ ...draft, title, slug: auto });
            }}
            maxLength={200}
            required
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={draft.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            placeholder="my-post-slug"
            maxLength={100}
            required
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Appears in the URL: /news/{draft.slug || "your-slug"}
          </p>
        </div>

        <div>
          <Label htmlFor="post_type">Type</Label>
          <Select
            value={draft.post_type}
            onValueChange={(v) => set("post_type", v as "news" | "event")}
          >
            <SelectTrigger id="post_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="published_at">Published date</Label>
          <Input
            id="published_at"
            type="date"
            value={draft.published_at}
            onChange={(e) => set("published_at", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="category">Category (optional)</Label>
          <Input
            id="category"
            value={draft.category}
            onChange={(e) => set("category", e.target.value)}
            maxLength={80}
            placeholder="Announcement, Press release, etc."
          />
        </div>

        <div>
          <Label htmlFor="author_name">Author (optional)</Label>
          <Input
            id="author_name"
            value={draft.author_name}
            onChange={(e) => set("author_name", e.target.value)}
            maxLength={120}
            placeholder="Lee Donohue, MD"
          />
        </div>

        <div>
          <Label htmlFor="publication_name">Publication (optional)</Label>
          <Input
            id="publication_name"
            value={draft.publication_name}
            onChange={(e) => set("publication_name", e.target.value)}
            maxLength={160}
            placeholder="Augusta Medical Examiner"
          />
        </div>

        <div>
          <Label htmlFor="article_page_reference">Article pages (optional)</Label>
          <Input
            id="article_page_reference"
            value={draft.article_page_reference}
            onChange={(e) => set("article_page_reference", e.target.value)}
            maxLength={80}
            placeholder="Pages 1 and 3"
          />
        </div>

        <div>
          <Label htmlFor="external_publication_url">External article link (optional)</Label>
          <Input
            id="external_publication_url"
            type="url"
            value={draft.external_publication_url}
            onChange={(e) => set("external_publication_url", e.target.value)}
            maxLength={500}
            placeholder="https://issuu.com/..."
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Secondary link only. The article summary or full content should be readable on this site.
          </p>
        </div>

        <div>
          <Label htmlFor="download_url">Download link (optional)</Label>
          <Input
            id="download_url"
            type="url"
            value={draft.download_url}
            onChange={(e) => set("download_url", e.target.value)}
            maxLength={500}
            placeholder="https://...pdf"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Optional secondary download for a PDF or file attachment.
          </p>
        </div>

        <div>
          <Label htmlFor="download_file_type">Download file type (optional)</Label>
          <Input
            id="download_file_type"
            value={draft.download_file_type}
            onChange={(e) => set("download_file_type", e.target.value)}
            maxLength={40}
            placeholder="PDF"
          />
        </div>

        <div>
          <Label htmlFor="download_page_count">Download page count (optional)</Label>
          <Input
            id="download_page_count"
            type="number"
            inputMode="numeric"
            min={1}
            value={draft.download_page_count}
            onChange={(e) => set("download_page_count", e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="2"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt (short summary)</Label>
          <Textarea
            id="excerpt"
            value={draft.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            maxLength={500}
            rows={2}
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="body">Body</Label>
          <RichTextToolbar
            onInsert={(value) => set("body", insertIntoBody(draft.body, value))}
          />
          <Textarea
            id="body"
            value={draft.body}
            onChange={(e) => set("body", e.target.value)}
            rows={10}
            placeholder="Add the on-site article summary or full article using plain text or safe HTML."
            aria-describedby="body-help"
          />
          <p id="body-help" className="mt-2 text-xs text-muted-foreground">
            HTML formatting is supported. Use safe tags only. Do not paste scripts. For article series entries, this should contain the readable summary or full article shown on the website.
          </p>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="featured_image_url">Featured image (optional)</Label>
          <FeaturedImageField
            value={draft.featured_image_url}
            alt={draft.featured_image_alt}
            decorative={draft.featured_image_decorative}
            onChange={(v) => set("featured_image_url", v)}
            onAltChange={(v) => set("featured_image_alt", v)}
            onDecorativeChange={(v) => set("featured_image_decorative", v)}
          />
        </div>

        {draft.post_type === "event" && (
          <>
            <div>
              <Label htmlFor="event_date">Event date</Label>
              <Input
                id="event_date"
                type="date"
                value={draft.event_date}
                onChange={(e) => set("event_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="event_time">Event time</Label>
              <Input
                id="event_time"
                value={draft.event_time}
                onChange={(e) => set("event_time", e.target.value)}
                placeholder="9:00 AM – 12:00 PM"
                maxLength={80}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="event_location">Event location</Label>
              <Input
                id="event_location"
                value={draft.event_location}
                onChange={(e) => set("event_location", e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="event_link">Event link (optional)</Label>
              <Input
                id="event_link"
                type="url"
                value={draft.event_link}
                onChange={(e) => set("event_link", e.target.value)}
                placeholder="https://…"
                maxLength={500}
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="cta_label">Call-to-action label (optional)</Label>
          <Input
            id="cta_label"
            value={draft.cta_label}
            onChange={(e) => set("cta_label", e.target.value)}
            maxLength={80}
            placeholder="Register now"
          />
        </div>
        <div>
          <Label htmlFor="cta_url">Call-to-action URL (optional)</Label>
          <Input
            id="cta_url"
            type="url"
            value={draft.cta_url}
            onChange={(e) => set("cta_url", e.target.value)}
            maxLength={500}
            placeholder="https://…"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3 rounded-md border border-border bg-background p-3">
          <Switch
            id="published"
            checked={draft.published}
            onCheckedChange={(v) => set("published", v)}
          />
          <div>
            <Label htmlFor="published" className="cursor-pointer">
              Published
            </Label>
            <p className="text-xs text-muted-foreground">
              When off, this post is hidden from the public site.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : draft.id ? "Save changes" : "Create post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function insertIntoBody(current: string, addition: string) {
  const trimmedCurrent = current.trimEnd();
  const spacer = trimmedCurrent ? "\n\n" : "";
  return `${trimmedCurrent}${spacer}${addition}`;
}

function RichTextToolbar({ onInsert }: { onInsert: (value: string) => void }) {
  const actions: Array<{
    label: string;
    icon: typeof Heading2;
    insert: () => string | null;
  }> = [
    { label: "Heading 2", icon: Heading2, insert: () => "<h2>Section heading</h2>" },
    { label: "Heading 3", icon: Heading3, insert: () => "<h3>Subsection heading</h3>" },
    { label: "Paragraph", icon: Pilcrow, insert: () => "<p>Paragraph text.</p>" },
    { label: "Bold", icon: Bold, insert: () => "<strong>Bold text</strong>" },
    { label: "Italic", icon: Italic, insert: () => "<em>Italic text</em>" },
    { label: "Bullet list", icon: List, insert: () => "<ul>\n  <li>List item</li>\n  <li>List item</li>\n</ul>" },
    {
      label: "Link",
      icon: LinkIcon,
      insert: () => {
        const href = window.prompt("Enter the link URL", "https://");
        if (!href) return null;
        const text = window.prompt("Enter the link text", "Link text");
        if (!text) return null;
        const openInNewTab = window.confirm("Open this link in a new tab?");
        return openInNewTab
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
          : `<a href="${href}">${text}</a>`;
      },
    },
  ];

  return (
    <div className="mb-2 flex flex-wrap gap-2" aria-label="Body formatting tools">
      {actions.map(({ label, icon: Icon, insert }) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          size="sm"
          className={cn("min-h-11 px-3")}
          onClick={() => {
            const value = insert();
            if (value) onInsert(value);
          }}
          aria-label={`Insert ${label}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}

function FeaturedImageField({
  value,
  alt,
  decorative,
  onChange,
  onAltChange,
  onDecorativeChange,
}: {
  value: string;
  alt: string;
  decorative: boolean;
  onChange: (v: string) => void;
  onAltChange: (v: string) => void;
  onDecorativeChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const altMissing = !!value && !decorative && !alt.trim();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please choose an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Max 5 MB. Please resize and try again.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      setUploading(false);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
    toast({ title: "Image uploaded" });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-1 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload from computer"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange("")}
          >
            <X className="mr-1 h-4 w-4" /> Remove
          </Button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      <Input
        id="featured_image_url"
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={500}
        placeholder="…or paste an image URL"
      />
      {value && (
        <div className="mt-2 overflow-hidden rounded-md border border-border">
          <img
            src={value}
            alt={decorative ? "" : alt || "Featured image preview"}
            className="max-h-48 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {value && (
        <div className="mt-3 space-y-2 rounded-md border border-border bg-background p-3">
          <Label htmlFor="featured_image_alt" className="text-sm font-semibold">
            Alt text <span className="text-destructive">*</span>
          </Label>
          <Input
            id="featured_image_alt"
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            maxLength={200}
            disabled={decorative}
            placeholder="Describe what's in the image (e.g. 'Nurse administering a flu shot to a patient')"
            aria-describedby="alt-help"
            aria-invalid={altMissing}
          />
          <p id="alt-help" className="text-xs text-muted-foreground">
            Required for ADA / WCAG accessibility. Describe the image's
            content and purpose for users who can't see it. Don't start with
            "Image of…" — screen readers already announce that.
          </p>
          {altMissing && (
            <p role="alert" className="text-xs font-medium text-destructive">
              Add alt text or mark the image as decorative before saving.
            </p>
          )}
          <div className="flex items-start gap-3 pt-1">
            <Switch
              id="featured_image_decorative"
              checked={decorative}
              onCheckedChange={onDecorativeChange}
            />
            <div>
              <Label
                htmlFor="featured_image_decorative"
                className="cursor-pointer text-sm"
              >
                This image is decorative
              </Label>
              <p className="text-xs text-muted-foreground">
                Use only if the image adds no information (pure decoration).
                Screen readers will skip it.
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP up to 5 MB. Uploaded images are publicly accessible.
      </p>
    </div>
  );
}

export default AdminNews;

