import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Megaphone,
  Image as ImageIcon,
  Link2,
  Calendar as CalendarIcon,
  PanelBottom,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type Section = {
  title: string;
  description: string;
  to: string;
  icon: typeof Megaphone;
  badge?: string;
};

const sections: Section[] = [
  {
    title: "Alert Banner & Modal",
    description:
      "Top-of-site banner and pop-up modal text, button, visibility, and start/end schedule.",
    to: "/admin/alerts",
    icon: Megaphone,
  },
  {
    title: "Homepage Hero",
    description:
      "Hero slides — headline, image, alt text, CTAs, order, draft/published, and schedule.",
    to: "/admin/hero",
    icon: ImageIcon,
  },
  {
    title: "Site Links",
    description:
      "All managed URLs across the site (portals, WIC, social, footer). Validated for broken links.",
    to: "/admin/links",
    icon: Link2,
  },
  {
    title: "Footer Content",
    description:
      "Disclaimer, contact phone/email, copyright line, accessibility & announcement links.",
    to: "/admin/footer",
    icon: PanelBottom,
  },
  {
    title: "Mobile Clinic Schedule",
    description:
      "Add, edit, cancel, or uncancel Mobile Health Clinic stops shown on the WeGo schedule.",
    to: "/admin/news",
    icon: CalendarIcon,
    badge: "Events",
  },
];

const AdminContent = () => {
  const navigate = useNavigate();
  const { user, canManage, loading } = useAdminAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth", { replace: true });
    else if (!canManage) navigate("/", { replace: true });
  }, [user, canManage, loading, navigate]);

  if (loading || !user || !canManage) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Site Content Manager</span>
        </nav>

        <header className="mb-6 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">Site Content Manager</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Edit live website content — alerts, hero, footer, links, and the Mobile Clinic
            schedule. All changes save to the database and appear on the live site immediately;
            no redeploy required.
          </p>
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.to}
                className="flex flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  {s.badge && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {s.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{s.description}</p>
                <Link
                  to={s.to}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  Manage
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">How publishing works</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              All edits made here save to the live database. The public site
              re-fetches automatically — no rebuild, repackage, or FTP upload needed.
            </li>
            <li>
              Use <strong>Visible</strong>/<strong>Active</strong> toggles to hide content
              without deleting it. Use the <strong>Start/End date</strong> fields on alerts
              and hero slides for scheduled publishing.
            </li>
            <li>
              Hero slides and the alert system support a <strong>Draft</strong> status. Drafts
              are never shown on the live site; only items marked <strong>Published</strong>
              and inside their schedule window are public.
            </li>
            <li>
              Code, design, layout, and feature changes still require a redeploy.
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default AdminContent;
