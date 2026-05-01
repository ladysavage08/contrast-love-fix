import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2, Plus, Save, Trash2, X, Search, ExternalLink, Pencil,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { supabase } from "@/integrations/supabase/client";
import { siteLinkSchema, type SiteLinkInput } from "@/lib/siteLinkValidation";

interface SiteLinkRow {
  id: string;
  slug: string;
  label: string;
  url: string;
  location: string | null;
  active: boolean;
  notes: string | null;
  updated_at: string;
}

const EMPTY_FORM: SiteLinkInput = {
  slug: "",
  label: "",
  url: "",
  location: "",
  active: true,
  notes: "",
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const AdminLinks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, canManage, loading: authLoading } = useAdminAuth();

  const [rows, setRows] = useState<SiteLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null); // null = closed; "new" = create
  const [form, setForm] = useState<SiteLinkInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof SiteLinkInput, string>>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canManage) navigate("/", { replace: true });
  }, [user, canManage, authLoading, navigate]);

  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_links")
      .select("id, slug, label, url, location, active, notes, updated_at")
      .order("slug", { ascending: true });
    if (error) {
      toast({ title: "Could not load links", description: error.message, variant: "destructive" });
    }
    setRows((data as SiteLinkRow[] | null) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.slug, r.label, r.url, r.location ?? ""].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  }, [rows, filter]);

  function startCreate() {
    setEditingId("new");
    setForm(EMPTY_FORM);
    setErrors({});
  }
  function startEdit(row: SiteLinkRow) {
    setEditingId(row.id);
    setForm({
      slug: row.slug,
      label: row.label,
      url: row.url,
      location: row.location ?? "",
      active: row.active,
      notes: row.notes ?? "",
    });
    setErrors({});
  }
  function closeEditor() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  async function handleSave() {
    if (!isAdmin) {
      toast({ title: "Admin access required", variant: "destructive" });
      return;
    }
    const parsed = siteLinkSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof SiteLinkInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof SiteLinkInput;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSaving(true);
    const payload = {
      slug: parsed.data.slug,
      label: parsed.data.label,
      url: parsed.data.url,
      location: parsed.data.location || null,
      active: parsed.data.active,
      notes: parsed.data.notes || null,
    };

    let error;
    if (editingId === "new") {
      ({ error } = await supabase.from("site_links").insert(payload));
    } else if (editingId) {
      ({ error } = await supabase
        .from("site_links")
        .update(payload)
        .eq("id", editingId));
    }
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Saved",
      description: "Link saved. The live site will update within seconds.",
    });
    closeEditor();
    load();
  }

  async function toggleActive(row: SiteLinkRow) {
    if (!isAdmin) return;
    const { error } = await supabase
      .from("site_links")
      .update({ active: !row.active })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r)));
  }

  async function handleDelete(row: SiteLinkRow) {
    if (!isAdmin) return;
    if (!confirm(`Delete link "${row.slug}"? Pages using this slug will fall back to their hardcoded default URL.`)) return;
    const { error } = await supabase.from("site_links").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: `Removed "${row.slug}".` });
    load();
  }

  if (authLoading || !user) return null;

  const editorOpen = editingId !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Link Manager</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">Link Manager</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Update public-facing URLs without re-deploying. Buttons, CTAs, and external
              links across the site can read from this list. If a slug is missing or set
              inactive, the page falls back to its built-in default URL automatically.
            </p>
          </div>
          <Button onClick={startCreate} disabled={!isAdmin}>
            <Plus className="mr-2 h-4 w-4" /> New link
          </Button>
        </header>

        {!isAdmin && (
          <div role="status" className="mb-6 rounded-md border border-border bg-muted/40 p-4 text-sm">
            Your account does not have the <strong>admin</strong> role. You can view links but cannot edit them.
          </div>
        )}

        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search slug, label, URL, location…"
              className="pl-9"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter links"
            />
          </div>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading links…
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      {rows.length === 0
                        ? "No links yet. Click \"New link\" to add the first one."
                        : "No links match your filter."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.slug}</TableCell>
                      <TableCell>{row.label}</TableCell>
                      <TableCell className="max-w-[260px] truncate">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                          title={row.url}
                        >
                          <span className="truncate">{row.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.location ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={row.active}
                            onCheckedChange={() => toggleActive(row)}
                            disabled={!isAdmin}
                            aria-label={`${row.active ? "Deactivate" : "Activate"} ${row.slug}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {row.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(row.updated_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(row)}
                            disabled={!isAdmin}
                            aria-label={`Edit ${row.slug}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(row)}
                            disabled={!isAdmin}
                            aria-label={`Delete ${row.slug}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Editor */}
        {editorOpen && (
          <section
            aria-labelledby="link-editor-heading"
            className="mt-8 rounded-lg border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="link-editor-heading" className="text-xl font-semibold">
                {editingId === "new" ? "New link" : "Edit link"}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeEditor} aria-label="Close editor">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Label htmlFor="link-slug">Slug (key)</Label>
                <Input
                  id="link-slug"
                  className="mt-1.5 font-mono"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="wic-apply"
                  disabled={editingId !== "new"}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Stable identifier used by the code. Cannot be changed after creation.
                </p>
                {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug}</p>}
              </div>

              <div className="sm:col-span-1">
                <Label htmlFor="link-label">Label</Label>
                <Input
                  id="link-label"
                  className="mt-1.5"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Apply for WIC"
                />
                {errors.label && <p className="mt-1 text-xs text-destructive">{errors.label}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  className="mt-1.5"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://example.com or /path"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepts https:// URLs, site paths starting with /, tel:, mailto:, or #anchors.
                </p>
                {errors.url && <p className="mt-1 text-xs text-destructive">{errors.url}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="link-location">Page / location used (optional)</Label>
                <Input
                  id="link-location"
                  className="mt-1.5"
                  value={form.location ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="WIC page – Apply CTA"
                />
                {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="link-notes">Internal notes (optional)</Label>
                <Textarea
                  id="link-notes"
                  className="mt-1.5"
                  rows={2}
                  value={form.notes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes}</p>}
              </div>

              <div className="sm:col-span-2 flex items-center justify-between gap-4 rounded-md border border-border p-3">
                <div>
                  <Label htmlFor="link-active" className="text-sm font-medium">Active</Label>
                  <p className="text-xs text-muted-foreground">
                    When inactive, the live site falls back to the page's built-in default URL.
                  </p>
                </div>
                <Switch
                  id="link-active"
                  checked={form.active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={handleSave} disabled={saving || !isAdmin}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save link
              </Button>
              <Button variant="outline" onClick={closeEditor} disabled={saving}>
                Cancel
              </Button>
            </div>
          </section>
        )}

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Available slugs used in the site</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a row with one of these slugs to override the corresponding link on the live site.
            If the slug is missing or set inactive, the page uses the default URL shown.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {KNOWN_SLUGS.map((s) => (
              <li key={s.slug} className="grid gap-1 sm:grid-cols-[200px_1fr]">
                <code className="font-mono text-xs">{s.slug}</code>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">{s.location}</strong> — default{" "}
                  <span className="break-all">{s.defaultUrl}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

const KNOWN_SLUGS: { slug: string; location: string; defaultUrl: string }[] = [
  { slug: "wic-apply", location: "WIC page – Apply CTA", defaultUrl: "https://ecphd-getwic.qminder.site/#/" },
  { slug: "wic-foods", location: "WIC page – GA WIC foods link", defaultUrl: "https://dph.georgia.gov/WIC" },
  { slug: "employee-portal", location: "Header – Employee Portal", defaultUrl: "https://ecphd.com/intranet/login/" },
  { slug: "patient-portal", location: "Header – Patient Portal", defaultUrl: "https://harrispublichealth.com/portal/" },
  { slug: "social-facebook", location: "Social icons – Facebook", defaultUrl: "https://www.facebook.com/ECPHD" },
  { slug: "social-x", location: "Social icons – X (Twitter)", defaultUrl: "https://x.com/EastCentralPH" },
  { slug: "social-youtube", location: "Social icons – YouTube", defaultUrl: "https://www.youtube.com/@eastcentralhealthdistrict2885" },
  { slug: "social-instagram", location: "Social icons – Instagram", defaultUrl: "https://www.instagram.com/eastcentralhealth/" },
  { slug: "wego-site", location: "WeGo schedule footer – ecphd.com/wego", defaultUrl: "https://www.ecphd.com/wego" },
  { slug: "ga-state-holidays", location: "Contact page – GA state holidays", defaultUrl: "https://team.georgia.gov/state-holidays/" },
];

export default AdminLinks;
