import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Upload, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type HeroSlideRow = {
  id: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  image_alt: string;
  focal: string | null;
  display_order: number;
  enabled: boolean;
};

const blankSlide = (order: number): Omit<HeroSlideRow, "id"> => ({
  eyebrow: "",
  title: "",
  subtitle: "",
  cta_label: "",
  cta_href: "",
  secondary_cta_label: "",
  secondary_cta_href: "",
  image_url: "",
  image_alt: "",
  focal: "",
  display_order: order,
  enabled: true,
});

const AdminHero = () => {
  const navigate = useNavigate();
  const { user, isAdmin, canManage, loading: authLoading } = useAdminAuth();
  const [slides, setSlides] = useState<HeroSlideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

  useEffect(() => {
    if (authLoading) return;
    if (!user) return navigate("/auth", { replace: true });
    if (!isAdmin) return navigate("/admin", { replace: true });
  }, [authLoading, user, isAdmin, navigate]);

  const loadSlides = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) {
      toast({ title: "Failed to load slides", description: error.message, variant: "destructive" });
    } else {
      setSlides((data ?? []) as HeroSlideRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) void loadSlides();
  }, [isAdmin, loadSlides]);

  const updateField = <K extends keyof HeroSlideRow>(id: string, key: K, value: HeroSlideRow[K]) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const saveSlide = async (slide: HeroSlideRow) => {
    if (!slide.title.trim()) {
      toast({ title: "Headline required", description: "Headline cannot be empty.", variant: "destructive" });
      return;
    }
    if (slide.image_url && !slide.image_alt.trim()) {
      toast({
        title: "Alt text required",
        description: "Please provide image alt text for accessibility.",
        variant: "destructive",
      });
      return;
    }
    setSavingId(slide.id);
    const { id, ...payload } = slide;
    const { error } = await supabase.from("hero_slides").update(payload).eq("id", id);
    setSavingId(null);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Hero slide updated." });
    }
  };

  const addSlide = async () => {
    const order = (slides[slides.length - 1]?.display_order ?? -1) + 1;
    const { data, error } = await supabase
      .from("hero_slides")
      .insert([blankSlide(order)])
      .select()
      .single();
    if (error) {
      toast({ title: "Add failed", description: error.message, variant: "destructive" });
      return;
    }
    setSlides((prev) => [...prev, data as HeroSlideRow]);
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Delete this slide? This cannot be undone.")) return;
    const { error } = await supabase.from("hero_slides").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Deleted" });
  };

  const uploadImage = async (slide: HeroSlideRow, file: File) => {
    setUploadingId(slide.id);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `hero/${slide.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("post-images")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploadingId(null);
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    updateField(slide.id, "image_url", data.publicUrl);
    setUploadingId(null);
    toast({ title: "Image uploaded", description: "Click Save to apply." });
  };

  if (authLoading || !user || !isAdmin) {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Homepage Hero</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <Link
              to="/admin"
              className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to admin
            </Link>
            <h1 className="text-3xl font-bold sm:text-4xl">Homepage Hero</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Edit the homepage hero banner slides. Changes appear on the live site immediately.
              Use the order field to reorder, the toggle to show/hide, and remember to save each slide.
            </p>
          </div>
          <button
            type="button"
            onClick={addSlide}
            className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add slide
          </button>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading slides…</p>
        ) : slides.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-6 text-center text-muted-foreground">
            No slides yet. The site is showing default slides. Click <strong>Add slide</strong> to create your first one.
          </p>
        ) : (
          <ul className="space-y-6">
            {slides.map((slide) => (
              <li key={slide.id} className="rounded-lg border border-border bg-card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) => updateField(slide.id, "enabled", e.target.checked)}
                        className="h-4 w-4"
                      />
                      Enabled
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      Order
                      <input
                        type="number"
                        value={slide.display_order}
                        onChange={(e) =>
                          updateField(slide.id, "display_order", Number(e.target.value) || 0)
                        }
                        className="w-20 rounded border border-input bg-background px-2 py-1"
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveSlide(slide)}
                      disabled={savingId === slide.id}
                      className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {savingId === slide.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSlide(slide.id)}
                      className="inline-flex items-center gap-1 rounded border border-destructive px-3 py-1.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Eyebrow (small label above headline)">
                    <input
                      type="text"
                      value={slide.eyebrow ?? ""}
                      onChange={(e) => updateField(slide.id, "eyebrow", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Headline *" required>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateField(slide.id, "title", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Subheadline / description" className="md:col-span-2">
                    <textarea
                      value={slide.subtitle ?? ""}
                      onChange={(e) => updateField(slide.id, "subtitle", e.target.value)}
                      rows={2}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>

                  <Field label="Primary button text">
                    <input
                      type="text"
                      value={slide.cta_label ?? ""}
                      onChange={(e) => updateField(slide.id, "cta_label", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Primary button link (e.g. /programs or https://…)">
                    <input
                      type="text"
                      value={slide.cta_href ?? ""}
                      onChange={(e) => updateField(slide.id, "cta_href", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>

                  <Field label="Secondary button text (optional)">
                    <input
                      type="text"
                      value={slide.secondary_cta_label ?? ""}
                      onChange={(e) => updateField(slide.id, "secondary_cta_label", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>
                  <Field label="Secondary button link (optional)">
                    <input
                      type="text"
                      value={slide.secondary_cta_href ?? ""}
                      onChange={(e) => updateField(slide.id, "secondary_cta_href", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>

                  <Field label="Background image" className="md:col-span-2">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt=""
                          className="h-24 w-40 rounded border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-40 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">
                          {uploadingId === slide.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {slide.image_url ? "Replace image" : "Upload image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void uploadImage(slide, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Or paste image URL"
                          value={slide.image_url ?? ""}
                          onChange={(e) => updateField(slide.id, "image_url", e.target.value)}
                          className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </Field>

                  <Field
                    label="Image alt text * (required when an image is set, for screen readers)"
                    className="md:col-span-2"
                  >
                    <input
                      type="text"
                      value={slide.image_alt}
                      onChange={(e) => updateField(slide.id, "image_alt", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2"
                    />
                  </Field>

                  <Field
                    label="Focal point classes (optional, advanced — e.g. object-[60%_center] sm:object-[70%_center])"
                    className="md:col-span-2"
                  >
                    <input
                      type="text"
                      value={slide.focal ?? ""}
                      onChange={(e) => updateField(slide.id, "focal", e.target.value)}
                      className="w-full rounded border border-input bg-background px-3 py-2 font-mono text-sm"
                    />
                  </Field>
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

const Field = ({
  label,
  children,
  className = "",
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) => (
  <label className={`block text-sm ${className}`}>
    <span className="mb-1 block font-medium text-foreground">
      {label}
      {required && <span className="sr-only"> (required)</span>}
    </span>
    {children}
  </label>
);

export default AdminHero;
