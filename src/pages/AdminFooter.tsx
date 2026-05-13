import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Save } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_FOOTER,
  FOOTER_CONTENT_KEY,
  type FooterContent,
} from "@/hooks/useFooterContent";

const PHONE_RE = /^[0-9+()\-\s]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminFooter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, canManage, loading: authLoading } = useAdminAuth();

  const [content, setContent] = useState<FooterContent>(DEFAULT_FOOTER);
  const [meta, setMeta] = useState<{ updated_at: string | null; updated_by_email: string | null }>(
    { updated_at: null, updated_by_email: null },
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canManage) navigate("/", { replace: true });
  }, [user, canManage, authLoading, navigate]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value, updated_at, updated_by_email")
        .eq("key", FOOTER_CONTENT_KEY)
        .maybeSingle();
      if (data?.value) {
        setContent({ ...DEFAULT_FOOTER, ...(data.value as Partial<FooterContent>) });
        setMeta({
          updated_at: (data as any).updated_at ?? null,
          updated_by_email: (data as any).updated_by_email ?? null,
        });
      }
      setLoading(false);
    })();
  }, []);

  if (authLoading || !user) return null;

  const update = (patch: Partial<FooterContent>) => setContent((c) => ({ ...c, ...patch }));

  const phoneError =
    content.contactPhone && !PHONE_RE.test(content.contactPhone)
      ? "Use digits, +, (), -, or spaces."
      : null;
  const emailError =
    content.contactEmail && !EMAIL_RE.test(content.contactEmail)
      ? "Enter a valid email."
      : null;

  async function handleSave() {
    if (phoneError || emailError) {
      toast({ title: "Fix errors first", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: FOOTER_CONTENT_KEY,
        value: content as any,
        updated_by: user!.id,
        updated_by_email: user!.email ?? null,
        status: "published",
      },
      { onConflict: "key" },
    );
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Saved",
        description: "Footer updated. Live site will reflect changes immediately.",
      });
      setMeta({ updated_at: new Date().toISOString(), updated_by_email: user!.email ?? null });
    }
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
          <Link to="/admin/content" className="text-primary underline-offset-2 hover:underline">
            Site Content
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Footer</span>
        </nav>

        <header className="mb-6 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">Footer Content</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Edit the disclaimer, contact phone/email, accessibility link label, and the
            "Show Announcement" toggle that appears in the footer of every page.
          </p>
          {meta.updated_at && (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated {new Date(meta.updated_at).toLocaleString()}
              {meta.updated_by_email ? ` by ${meta.updated_by_email}` : ""}
            </p>
          )}
        </header>

        {loading ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : (
          <section className="grid gap-5 rounded-lg border border-border bg-card p-5 max-w-3xl">
            <div>
              <Label htmlFor="ft-disclaimer">Disclaimer</Label>
              <Textarea
                id="ft-disclaimer"
                className="mt-1.5"
                rows={3}
                value={content.disclaimer}
                onChange={(e) => update({ disclaimer: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ft-phone">Contact phone</Label>
                <Input
                  id="ft-phone"
                  className="mt-1.5"
                  value={content.contactPhone}
                  onChange={(e) => update({ contactPhone: e.target.value })}
                  aria-invalid={!!phoneError}
                />
                {phoneError && <p className="mt-1 text-xs text-destructive">{phoneError}</p>}
              </div>
              <div>
                <Label htmlFor="ft-email">Contact email (optional)</Label>
                <Input
                  id="ft-email"
                  className="mt-1.5"
                  value={content.contactEmail}
                  onChange={(e) => update({ contactEmail: e.target.value })}
                  aria-invalid={!!emailError}
                />
                {emailError && <p className="mt-1 text-xs text-destructive">{emailError}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="ft-copyright">Copyright line</Label>
              <Input
                id="ft-copyright"
                className="mt-1.5"
                value={content.copyright}
                onChange={(e) => update({ copyright: e.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Shown after "© {new Date().getFullYear()}" on every page.
              </p>
            </div>
            <div>
              <Label htmlFor="ft-wego">WeGo extra copy</Label>
              <Input
                id="ft-wego"
                className="mt-1.5"
                value={content.wegoExtraCopy}
                onChange={(e) => update({ wegoExtraCopy: e.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Appended to the copyright line on Mobile Health Clinic pages.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
              <div>
                <Label htmlFor="ft-show-announce" className="text-sm font-medium">
                  Show "Announcement" link
                </Label>
                <p className="text-xs text-muted-foreground">
                  Re-opens the site alert modal when clicked.
                </p>
              </div>
              <Switch
                id="ft-show-announce"
                checked={content.showAnnouncementLink}
                onCheckedChange={(v) => update({ showAnnouncementLink: v })}
              />
            </div>
            <div>
              <Label htmlFor="ft-announce-label">Announcement link label</Label>
              <Input
                id="ft-announce-label"
                className="mt-1.5"
                value={content.announcementLinkLabel}
                onChange={(e) => update({ announcementLinkLabel: e.target.value })}
              />
            </div>
          </section>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save changes
          </Button>
          <Link to="/" className="text-sm text-primary underline-offset-2 hover:underline">
            Open homepage in new tab to verify
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AdminFooter;
