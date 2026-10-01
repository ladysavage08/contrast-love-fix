import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SecurityTesterBanner from "@/components/SecurityTesterBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { supabase } from "@/integrations/supabase/client";
import { counties } from "@/data/counties";
import { ACCESS_LABELS, formatClinicDate, todayKeyET, type FluClinic } from "@/hooks/useFluClinics";

type Form = Omit<FluClinic, "id">;
const EMPTY: Form = {
  county_slug: counties[0]?.slug ?? "",
  name: "",
  clinic_date: "",
  start_time: "",
  end_time: "",
  street_address: "",
  city_state_zip: "",
  access_type: "walk_in",
  registration_url: "",
  special_instructions: "",
  contact_info: "",
  published: true,
  archived: false,
};

const AdminFluClinics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, canView, canManage, isSecurityTester, securityTesterExpiresAt, loading: authLoading } =
    useAdminAuth();
  const [rows, setRows] = useState<FluClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canView) navigate("/", { replace: true });
  }, [user, canView, authLoading, navigate]);
  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("flu_clinics").select("*").order("clinic_date", { ascending: false });
    if (error) toast({ title: "Could not load clinics", description: error.message, variant: "destructive" });
    setRows((data ?? []) as FluClinic[]);
    setLoading(false);
  };
  useEffect(() => { if (canView) load(); }, [canView]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const startEdit = (r?: FluClinic) => {
    setError("");
    setEditingId(r?.id ?? null);
    setForm(r ? { ...EMPTY, ...r } : EMPTY);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.clinic_date || !form.county_slug) {
      setError("County, clinic name, and date are required.");
      return;
    }
    if (form.registration_url && !/^https?:\/\//i.test(form.registration_url)) {
      setError("Registration link must start with https://");
      return;
    }
    setSaving(true);
    const blank = (v: string | null) => (v && v.trim() ? v.trim() : null);
    const payload = {
      ...form,
      name: form.name.trim(),
      start_time: blank(form.start_time),
      end_time: blank(form.end_time),
      street_address: blank(form.street_address),
      city_state_zip: blank(form.city_state_zip),
      registration_url: blank(form.registration_url),
      special_instructions: blank(form.special_instructions),
      contact_info: blank(form.contact_info),
      updated_by_email: user?.email ?? null,
    };
    const res = editingId
      ? await supabase.from("flu_clinics").update(payload).eq("id", editingId)
      : await supabase.from("flu_clinics").insert(payload);
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    toast({ title: editingId ? "Clinic updated" : "Clinic added" });
    setShowForm(false);
    load();
  };

  const remove = async (r: FluClinic) => {
    if (!confirm(`Delete "${r.name}" permanently? Use Archive to keep a record instead.`)) return;
    const { error } = await supabase.from("flu_clinics").delete().eq("id", r.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  const toggle = async (r: FluClinic, field: "published" | "archived") => {
    const { error } = await supabase.from("flu_clinics")
      .update((field === "published" ? { published: !r.published } : { archived: !r.archived })).eq("id", r.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  if (authLoading) return null;
  const today = todayKeyET();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        {isSecurityTester && <SecurityTesterBanner expiresAt={securityTesterExpiresAt} />}
        <p className="mb-2 text-sm"><Link to="/admin/content" className="text-primary underline">← Content admin</Link></p>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Flu Clinics</h1>
            <p className="text-muted-foreground">
              Listings shown on <Link to="/flushot" className="text-primary underline">/flushot</Link>.
              Published, non-archived clinics dated today or later appear publicly.
            </p>
          </div>
          {canManage && (
            <Button onClick={() => startEdit()}><Plus aria-hidden="true" className="mr-2 h-4 w-4" />Add clinic</Button>
          )}
        </div>

        {showForm && canManage && (
          <section aria-labelledby="form-heading" className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 id="form-heading" className="mb-4 text-xl font-semibold">{editingId ? "Edit clinic" : "Add clinic"}</h2>
            <p className="mb-4 text-sm">Fields marked * are required.</p>
            {error && <p role="alert" className="mb-4 rounded border border-destructive p-3 font-medium text-destructive">{error}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fc-county">County *</Label>
                <select id="fc-county" value={form.county_slug} onChange={(e) => set("county_slug", e.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3">
                  {counties.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="fc-name">Health department or event name *</Label>
                <Input id="fc-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-date">Date * (day of week is shown automatically)</Label>
                <Input id="fc-date" type="date" value={form.clinic_date} onChange={(e) => set("clinic_date", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-access">Appointment or walk-in</Label>
                <select id="fc-access" value={form.access_type}
                  onChange={(e) => set("access_type", e.target.value as Form["access_type"])}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3">
                  {Object.entries(ACCESS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="fc-start">Start time (e.g. 9:00 AM)</Label>
                <Input id="fc-start" value={form.start_time ?? ""} onChange={(e) => set("start_time", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-end">End time (e.g. 12:00 PM)</Label>
                <Input id="fc-end" value={form.end_time ?? ""} onChange={(e) => set("end_time", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-street">Street address</Label>
                <Input id="fc-street" value={form.street_address ?? ""} onChange={(e) => set("street_address", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-city">City, state and ZIP</Label>
                <Input id="fc-city" value={form.city_state_zip ?? ""} onChange={(e) => set("city_state_zip", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-reg">Registration link (optional)</Label>
                <Input id="fc-reg" type="url" placeholder="https://" value={form.registration_url ?? ""} onChange={(e) => set("registration_url", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fc-contact">Contact information (optional)</Label>
                <Input id="fc-contact" value={form.contact_info ?? ""} onChange={(e) => set("contact_info", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="fc-notes">Special instructions (optional)</Label>
                <Textarea id="fc-notes" value={form.special_instructions ?? ""} onChange={(e) => set("special_instructions", e.target.value)} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="fc-pub" checked={form.published} onCheckedChange={(v) => set("published", v)} />
                <Label htmlFor="fc-pub">Published</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="fc-arch" checked={form.archived} onCheckedChange={(v) => set("archived", v)} />
                <Label htmlFor="fc-arch">Archived</Label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button onClick={save} disabled={saving}>
                {saving ? <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> : <Save aria-hidden="true" className="mr-2 h-4 w-4" />}
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}><X aria-hidden="true" className="mr-2 h-4 w-4" />Cancel</Button>
            </div>
          </section>
        )}

        {loading ? <p role="status">Loading…</p> : rows.length === 0 ? (
          <p>No flu clinics entered yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const status = r.archived ? "Archived" : !r.published ? "Unpublished" : r.clinic_date < today ? "Past" : "Live";
              return (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                  <div>
                    <p className="font-semibold">{r.name} <span className="ml-2 rounded border border-border px-2 py-0.5 text-xs font-bold">{status}</span></p>
                    <p className="text-sm text-muted-foreground">
                      {counties.find((c) => c.slug === r.county_slug)?.name} County · {formatClinicDate(r.clinic_date)}
                      {r.start_time ? ` · ${r.start_time}${r.end_time ? ` – ${r.end_time}` : ""}` : ""}
                    </p>
                  </div>
                  {canManage && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(r)} aria-label={`Edit ${r.name}`}><Pencil aria-hidden="true" className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => toggle(r, "published")}>{r.published ? "Unpublish" : "Publish"}</Button>
                      <Button size="sm" variant="outline" onClick={() => toggle(r, "archived")}>{r.archived ? "Unarchive" : "Archive"}</Button>
                      <Button size="sm" variant="outline" onClick={() => remove(r)} aria-label={`Delete ${r.name}`}><Trash2 aria-hidden="true" className="h-4 w-4" /></Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default AdminFluClinics;
