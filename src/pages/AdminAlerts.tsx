import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Save, RotateCcw } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_SETTINGS,
  SITE_ALERTS_KEY,
  type SiteAlertsSettings,
} from "@/hooks/useSiteAlerts";
import { MODAL_PRESETS, type ModalPresetKey } from "@/config/siteAlerts";

const AdminAlerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAdminAuth();

  const [settings, setSettings] = useState<SiteAlertsSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", SITE_ALERTS_KEY)
        .maybeSingle();
      if (data?.value) {
        const v = data.value as Partial<SiteAlertsSettings>;
        setSettings({
          banner: { ...DEFAULT_SETTINGS.banner, ...(v.banner ?? {}) },
          modal: { ...DEFAULT_SETTINGS.modal, ...(v.modal ?? {}) },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  if (authLoading || !user) return null;

  const updateBanner = (patch: Partial<SiteAlertsSettings["banner"]>) =>
    setSettings((s) => ({ ...s, banner: { ...s.banner, ...patch } }));

  const updateModal = (patch: Partial<SiteAlertsSettings["modal"]>) =>
    setSettings((s) => ({ ...s, modal: { ...s.modal, ...patch } }));

  const updateBannerButton = (patch: Partial<NonNullable<SiteAlertsSettings["banner"]["button"]>>) =>
    setSettings((s) => ({
      ...s,
      banner: {
        ...s.banner,
        button: { label: "", href: "", ...(s.banner.button ?? {}), ...patch },
      },
    }));

  async function handleSave() {
    if (!isAdmin) {
      toast({ title: "Admin access required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: SITE_ALERTS_KEY, value: settings as any, updated_by: user!.id },
        { onConflict: "key" },
      );
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Alert settings updated. Live site will reflect changes immediately." });
    }
  }

  function handleResetToDefaults() {
    setSettings(DEFAULT_SETTINGS);
    toast({ title: "Reverted", description: "Form reset to file defaults. Click Save to apply." });
  }

  const activePreset = MODAL_PRESETS[settings.modal.preset as ModalPresetKey] ?? MODAL_PRESETS.standard;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Alerts</span>
        </nav>

        <header className="mb-6 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">Site Alerts</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Edit the top-of-site banner and pop-up modal. Changes save to the
            database and update the live site immediately.
          </p>
        </header>

        {!isAdmin && (
          <div role="status" className="mb-6 rounded-md border border-border bg-muted/40 p-4 text-sm">
            Your account does not have the <strong>admin</strong> role. You can preview the form but cannot save.
          </div>
        )}

        {loading ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading current settings…
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* ---------------- Banner ---------------- */}
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-xl font-semibold">Top-of-site banner</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Short notice shown at the very top of every page.
              </p>

              <div className="mt-5 space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div>
                    <Label htmlFor="banner-enabled" className="text-sm font-medium">Banner enabled</Label>
                    <p className="text-xs text-muted-foreground">Master on/off switch.</p>
                  </div>
                  <Switch
                    id="banner-enabled"
                    checked={settings.banner.enabled}
                    onCheckedChange={(v) => updateBanner({ enabled: v })}
                  />
                </div>

                <div>
                  <Label htmlFor="banner-style">Style</Label>
                  <Select
                    value={settings.banner.style}
                    onValueChange={(v) => updateBanner({ style: v as "info" | "warning" | "alert" })}
                  >
                    <SelectTrigger id="banner-style" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info (blue)</SelectItem>
                      <SelectItem value="warning">Warning (amber)</SelectItem>
                      <SelectItem value="alert">Alert (red)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="banner-message">Message</Label>
                  <Textarea
                    id="banner-message"
                    className="mt-1.5"
                    rows={2}
                    value={settings.banner.message}
                    onChange={(e) => updateBanner({ message: e.target.value })}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="banner-btn-label">Button label (optional)</Label>
                    <Input
                      id="banner-btn-label"
                      className="mt-1.5"
                      value={settings.banner.button?.label ?? ""}
                      onChange={(e) => {
                        const label = e.target.value;
                        if (!label && !settings.banner.button?.href) {
                          updateBanner({ button: undefined });
                        } else {
                          updateBannerButton({ label });
                        }
                      }}
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="banner-btn-href">Button link</Label>
                    <Input
                      id="banner-btn-href"
                      className="mt-1.5"
                      value={settings.banner.button?.href ?? ""}
                      onChange={(e) => updateBannerButton({ href: e.target.value })}
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div>
                    <Label htmlFor="banner-external" className="text-sm font-medium">Open button in new tab</Label>
                    <p className="text-xs text-muted-foreground">Use for external links.</p>
                  </div>
                  <Switch
                    id="banner-external"
                    checked={!!settings.banner.button?.external}
                    onCheckedChange={(v) => updateBannerButton({ external: v })}
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div>
                    <Label htmlFor="banner-dismissible" className="text-sm font-medium">Dismissible</Label>
                    <p className="text-xs text-muted-foreground">Visitors can close it for the session.</p>
                  </div>
                  <Switch
                    id="banner-dismissible"
                    checked={settings.banner.dismissible}
                    onCheckedChange={(v) => updateBanner({ dismissible: v })}
                  />
                </div>
              </div>
            </section>

            {/* ---------------- Modal ---------------- */}
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-xl font-semibold">Pop-up modal</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Larger announcement shown once per browser session.
              </p>

              <div className="mt-5 space-y-5">
                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div>
                    <Label htmlFor="modal-enabled" className="text-sm font-medium">Modal enabled</Label>
                    <p className="text-xs text-muted-foreground">Master on/off switch.</p>
                  </div>
                  <Switch
                    id="modal-enabled"
                    checked={settings.modal.enabled}
                    onCheckedChange={(v) => updateModal({ enabled: v })}
                  />
                </div>

                <div>
                  <Label htmlFor="modal-preset">Message preset</Label>
                  <Select
                    value={settings.modal.preset}
                    onValueChange={(v) => {
                      const p = MODAL_PRESETS[v as ModalPresetKey] ?? MODAL_PRESETS.standard;
                      updateModal({
                        preset: v as ModalPresetKey,
                        titleOverride: p.title,
                        messageOverride: p.message,
                        buttonOverride: p.button ? { ...p.button } : undefined,
                      });
                    }}
                  >
                    <SelectTrigger id="modal-preset" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard update</SelectItem>
                      <SelectItem value="ada">ADA / accessibility</SelectItem>
                      <SelectItem value="emergency">Emergency / interruption</SelectItem>
                      <SelectItem value="event">Event / campaign</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pick a preset to load its text into the fields below, then edit freely.
                  </p>
                </div>

                <div>
                  <Label htmlFor="modal-title">Title</Label>
                  <Input
                    id="modal-title"
                    className="mt-1.5"
                    value={settings.modal.titleOverride ?? activePreset.title}
                    onChange={(e) => updateModal({ titleOverride: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="modal-message">Message</Label>
                  <Textarea
                    id="modal-message"
                    className="mt-1.5"
                    rows={6}
                    value={settings.modal.messageOverride ?? activePreset.message}
                    onChange={(e) => updateModal({ messageOverride: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Separate paragraphs with a blank line.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="modal-btn-label">Button label</Label>
                    <Input
                      id="modal-btn-label"
                      className="mt-1.5"
                      value={settings.modal.buttonOverride?.label ?? activePreset.button?.label ?? ""}
                      onChange={(e) =>
                        updateModal({
                          buttonOverride: {
                            label: e.target.value,
                            href:
                              settings.modal.buttonOverride?.href ??
                              activePreset.button?.href ??
                              "",
                          },
                        })
                      }
                      placeholder="Contact Us"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modal-btn-href">Button link</Label>
                    <Input
                      id="modal-btn-href"
                      className="mt-1.5"
                      value={settings.modal.buttonOverride?.href ?? activePreset.button?.href ?? ""}
                      onChange={(e) =>
                        updateModal({
                          buttonOverride: {
                            label:
                              settings.modal.buttonOverride?.label ??
                              activePreset.button?.label ??
                              "",
                            href: e.target.value,
                          },
                        })
                      }
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div>
                    <Label htmlFor="modal-show-onload" className="text-sm font-medium">Auto-show on page load</Label>
                    <p className="text-xs text-muted-foreground">Once per browser session.</p>
                  </div>
                  <Switch
                    id="modal-show-onload"
                    checked={settings.modal.showOnLoad}
                    onCheckedChange={(v) => updateModal({ showOnLoad: v })}
                  />
                </div>

                <div>
                  <Label htmlFor="modal-delay">Delay before opening (seconds)</Label>
                  <Input
                    id="modal-delay"
                    className="mt-1.5"
                    type="number"
                    min={0}
                    step={0.1}
                    value={settings.modal.openDelaySeconds ?? 0}
                    onChange={(e) =>
                      updateModal({ openDelaySeconds: Number(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button onClick={handleSave} disabled={saving || !isAdmin}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save changes
          </Button>
          <Button variant="outline" onClick={handleResetToDefaults} disabled={saving}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset form to file defaults
          </Button>
          <p className="text-xs text-muted-foreground">
            Tip: clear your <code>echd-modal-shown</code> session storage to re-trigger the modal while testing.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AdminAlerts;
