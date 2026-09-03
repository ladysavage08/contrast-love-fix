import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Plus, Save, Trash2, X, ExternalLink, Pencil } from "lucide-react";
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
import SecurityTesterBanner from "@/components/SecurityTesterBanner";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { supabase } from "@/integrations/supabase/client";
import { counties } from "@/data/counties";
import { RECORDING_PLATFORMS, formatMeetingDate } from "@/hooks/useBohRecordings";

interface Row {
  id: string;
  county_slug: string;
  meeting_date: string;
  title: string | null;
  recording_url: string;
  platform: string;
  notes: string | null;
  duration: string | null;
  published: boolean;
  archived: boolean;
}

type FormState = {
  county_slug: string;
  meeting_date: string;
  title: string;
  recording_url: string;
  platform: string;
  notes: string;
  duration: string;
  published: boolean;
  archived: boolean;
};

const EMPTY: FormState = {
  county_slug: counties[0]?.slug ?? "",
  meeting_date: "",
  title: "",
  recording_url: "",
  platform: "YouTube",
  notes: "",
  duration: "",
  published: true,
  archived: false,
};

const AdminBohRecordings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user, canView, canManage, isSecurityTester, securityTesterExpiresAt, loading: authLoading,
  } = useAdminAuth();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [countyFilter, setCountyFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canView) navigate("/", { replace: true });
  }, [user, canView, authLoading, navigate]);

  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("boh_recordings")
      .select("*")
      .order("meeting_date", { ascending: false });
    if (error) {
      toast({ title: "Could not load recordings", description: error.message, variant: "destructive" });
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (canView) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  const visible = useMemo(
    () => (countyFilter === "all" ? rows : rows.filter((r) => r.county_slug === countyFilter)),
    [rows, countyFilter],
  );

  function openNew() {
    setForm(EMPTY);
    setErrors({});
    setEditingId("new");
  }

  function openEdit(r: Row) {
    setForm({
      county_slug: r.county_slug,
      meeting_date: r.meeting_date,
      title: r.title ?? "",
      recording_url: r.recording_url,
      platform: r.platform,
      notes: r.notes ?? "",
      duration: r.duration ?? "",
      published: r.published,
      archived: r.archived,
    });
    setErrors({});
    setEditingId(r.id);
  }

  function validate(f: FormState) {
    const e: Record<string, string> = {};
    if (!f.county_slug) e.county_slug = "Choose a county.";
    if (!f.meeting_date) e.meeting_date = "Meeting date is required.";
    if (!/^https?:\/\/.+/i.test(f.recording_url.trim()))
      e.recording_url = "Enter a full link starting with https://";
    return e;
  }

  async function save() {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const payload = {
      county_slug: form.county_slug,
      meeting_date: form.meeting_date,
      title: form.title.trim() || null,
      recording_url: form.recording_url.trim(),
      platform: form.platform,
      notes: form.notes.trim() || null,
      duration: form.duration.trim() || null,
      published: form.published,
      archived: form.archived,
      updated_by_email: user?.email ?? null,
    };
    const res =
      editingId === "new"
        ? await supabase.from("boh_recordings").insert(payload)
        : await supabase.from("boh_recordings").update(payload).eq("id", editingId!);
    setSaving(false);
    if (res.error) {
      toast({ title: "Save failed", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Recording saved" });
    setEditingId(null);
    load();
  }

  async function toggle(r: Row, field: "published" | "archived") {
    const { error } = await supabase
      .from("boh_recordings")
      .update({ [field]: !r[field], updated_by_email: user?.email ?? null })
      .eq("id", r.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  }

  async function remove(r: Row) {
    if (!confirm("Permanently delete this recording? Consider archiving instead.")) return;
    const { error } = await supabase.from("boh_recordings").delete().eq("id", r.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  }

  if (authLoading || !user || !canView) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">Admin</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/admin/content" className="text-primary underline-offset-2 hover:underline">
            Site Content Manager
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>BOH Meeting Recordings</span>
        </nav>

        {isSecurityTester && <SecurityTesterBanner expiresAt={securityTesterExpiresAt} />}

        <header className="mb-6 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">BOH Meeting Recordings</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Add, edit, unpublish, or archive Board of Health meeting recordings for each county.
            Published, non-archived recordings appear on that county's recordings page immediately.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="county-filter">Filter by county</Label>
            <select
              id="county-filter"
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
              className="mt-1 block h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All counties</option>
              {counties.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          {canManage && (
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> Add recording
            </Button>
          )}
        </div>

        {editingId && canManage && (
          <section aria-labelledby="edit-heading" className="mb-6 rounded-lg border border-border p-5">
            <h2 id="edit-heading" className="mb-4 text-xl font-semibold">
              {editingId === "new" ? "Add recording" : "Edit recording"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="f-county">County</Label>
                <select
                  id="f-county"
                  value={form.county_slug}
                  onChange={(e) => setForm({ ...form, county_slug: e.target.value })}
                  className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {counties.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                {errors.county_slug && <p className="mt-1 text-sm text-destructive">{errors.county_slug}</p>}
              </div>
              <div>
                <Label htmlFor="f-date">Meeting date</Label>
                <Input
                  id="f-date" type="date" value={form.meeting_date}
                  onChange={(e) => setForm({ ...form, meeting_date: e.target.value })}
                />
                {errors.meeting_date && <p className="mt-1 text-sm text-destructive">{errors.meeting_date}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="f-title">Title (optional)</Label>
                <Input
                  id="f-title" value={form.title}
                  placeholder="Board of Health Regular Meeting"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="f-url">Recording link</Label>
                <Input
                  id="f-url" type="url" inputMode="url" value={form.recording_url}
                  placeholder="https://www.youtube.com/watch?v=…"
                  onChange={(e) => setForm({ ...form, recording_url: e.target.value })}
                />
                {errors.recording_url && <p className="mt-1 text-sm text-destructive">{errors.recording_url}</p>}
              </div>
              <div>
                <Label htmlFor="f-platform">Platform</Label>
                <select
                  id="f-platform" value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {RECORDING_PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="f-duration">Duration (optional)</Label>
                <Input
                  id="f-duration" value={form.duration} placeholder="1 hr 12 min"
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="f-notes">Notes (optional)</Label>
                <Textarea
                  id="f-notes" value={form.notes} rows={2}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="f-published" checked={form.published}
                  onCheckedChange={(v) => setForm({ ...form, published: v })}
                />
                <Label htmlFor="f-published">Published (visible on the website)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="f-archived" checked={form.archived}
                  onCheckedChange={(v) => setForm({ ...form, archived: v })}
                />
                <Label htmlFor="f-archived">Archived (hidden, kept in the database)</Label>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button onClick={save} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)} className="gap-2">
                <X className="h-4 w-4" aria-hidden="true" /> Cancel
              </Button>
            </div>
          </section>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading recordings…</p>
        ) : visible.length === 0 ? (
          <p className="text-muted-foreground">No recordings yet. Use “Add recording” to create one.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <caption className="sr-only">Board of Health meeting recordings</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">County</TableHead>
                  <TableHead scope="col">Meeting date</TableHead>
                  <TableHead scope="col">Title</TableHead>
                  <TableHead scope="col">Link</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{counties.find((c) => c.slug === r.county_slug)?.name ?? r.county_slug}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatMeetingDate(r.meeting_date)}</TableCell>
                    <TableCell>{r.title ?? "—"}</TableCell>
                    <TableCell>
                      <a
                        href={r.recording_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                      >
                        {r.platform}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {r.archived ? "Archived" : r.published ? "Published" : "Unpublished"}
                    </TableCell>
                    <TableCell>
                      {canManage ? (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(r)} className="gap-1">
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggle(r, "published")}>
                            {r.published ? "Unpublish" : "Publish"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toggle(r, "archived")}>
                            {r.archived ? "Unarchive" : "Archive"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => remove(r)} className="gap-1">
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Read only</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default AdminBohRecordings;
