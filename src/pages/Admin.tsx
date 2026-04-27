import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Users, Upload, Newspaper, LogOut, ExternalLink, Megaphone } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { logAuditEvent } from "@/lib/auditLog";
import { supabase } from "@/integrations/supabase/client";

type Tool = {
  title: string;
  description: string;
  to?: string;
  href?: string;
  icon: LucideIcon;
  cta: string;
};

const tools: Tool[] = [
  {
    title: "Staff Directory",
    description:
      "Browse and manage published ECPHD staff entries. Admin tools (CSV import) appear on this page when signed in as an admin.",
    to: "/directory",
    icon: Users,
    cta: "Open directory",
  },
  {
    title: "Staff Import (CSV)",
    description:
      "Bulk-add or update staff via a CSV upload. Available within the directory page when signed in as an admin.",
    to: "/directory#import",
    icon: Upload,
    cta: "Go to import",
  },
  {
    title: "News & Events",
    description:
      "Create, edit, publish, or remove news posts and calendar events. Changes go live immediately.",
    to: "/admin/news",
    icon: Newspaper,
    cta: "Manage posts",
  },
  {
    title: "Site Alerts",
    description:
      "Edit the top-of-site banner and pop-up modal — text, button, on/off, auto-show, and delay. Saves live.",
    to: "/admin/alerts",
    icon: Megaphone,
    cta: "Edit alerts",
  },
];

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isEditor, canManage, loading } = useAdminAuth();
  const loggedAccessRef = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    // Role gate: only admin OR editor can access /admin
    if (!canManage) {
      navigate("/", { replace: true });
      return;
    }
    if (!loggedAccessRef.current) {
      loggedAccessRef.current = true;
      void logAuditEvent("admin_access", {
        email: user.email ?? null,
        user_id: user.id,
        metadata: { role: isAdmin ? "admin" : "editor" },
      });
    }
  }, [user, canManage, isAdmin, loading, navigate]);

  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>Admin</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">Admin Dashboard</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Welcome{user.email ? `, ${user.email}` : ""}. Use the tools below to manage
              site content.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                isAdmin
                  ? "bg-accent/20 text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isAdmin ? "Admin" : "Signed in (no admin role)"}
            </span>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth", { replace: true });
              }}
              className="inline-flex items-center gap-1 rounded border border-input bg-background px-3 py-1.5 font-medium hover:bg-muted"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
            </button>
          </div>
        </header>

        {!isAdmin && (
          <div
            role="status"
            className="mb-6 rounded-md border border-border bg-muted/40 p-4 text-sm"
          >
            Your account is signed in but does not have the <strong>admin</strong> role.
            Most management tools below will be read-only. Ask an administrator to grant
            you the admin role.
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <li
                key={t.title}
                className="flex flex-col rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden={true} />
                </div>
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {t.description}
                </p>
                {t.to ? (
                  <Link
                    to={t.to}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {t.cta}
                  </Link>
                ) : t.href ? (
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {t.cta}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>

        <section className="mt-10 rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Tips</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Bookmark <code className="rounded bg-muted px-1">/admin</code> for quick
              access after signing in.
            </li>
            <li>
              News, Events, and Staff content live in the backend database. Edits made
              there appear on the live site immediately.
            </li>
            <li>
              To grant another user admin access, add a row to the{" "}
              <code className="rounded bg-muted px-1">user_roles</code> table with their
              user ID and role <code className="rounded bg-muted px-1">admin</code>.
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Admin;
