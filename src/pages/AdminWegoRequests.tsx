import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useIdleSignOut } from "@/hooks/useIdleSignOut";
import { supabase } from "@/integrations/supabase/client";

type Status =
  | "new"
  | "under_review"
  | "need_more_information"
  | "approved"
  | "denied"
  | "scheduled"
  | "completed"
  | "cancelled";

const STATUSES: { value: Status; label: string }[] = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "need_more_information", label: "Need More Information" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SERVICE_LABELS: Record<string, string> = {
  vaccines_immunizations: "Vaccines / Immunizations",
  blood_pressure: "Blood Pressure Screenings",
  glucose: "Glucose Screenings",
  hiv_testing: "HIV Testing",
  health_education: "Health Education",
  family_planning: "Family Planning Information",
  sexual_health: "Sexual Health Services",
  wic_referrals: "WIC Referrals",
  primary_care: "Primary Care / Screenings",
  sports_physicals: "Sports Physicals",
  community_outreach_only: "Community Outreach Only",
  other: "Other",
};

interface Row {
  id: string;
  created_at: string;
  organization_name: string;
  contact_name: string;
  contact_title: string | null;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_address: string;
  event_city: string;
  event_county: string | null;
  expected_attendance: number;
  venue_type: string;
  electricity_available: boolean;
  space_for_unit: boolean;
  parking_level_accessible: boolean;
  onsite_contact_name: string;
  onsite_contact_phone: string;
  setup_instructions: string | null;
  services_requested: string[];
  services_other_detail: string | null;
  additional_notes: string | null;
  status: Status;
  status_notes: string | null;
  status_updated_at: string | null;
  email_sent: boolean;
  email_error: string | null;
}

const statusBadge = (s: Status) => {
  const map: Record<Status, string> = {
    new: "bg-primary/10 text-primary",
    under_review: "bg-yellow-100 text-yellow-900",
    need_more_information: "bg-amber-100 text-amber-900",
    approved: "bg-green-100 text-green-900",
    denied: "bg-red-100 text-red-900",
    scheduled: "bg-blue-100 text-blue-900",
    completed: "bg-emerald-100 text-emerald-900",
    cancelled: "bg-muted text-muted-foreground",
  };
  return `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[s]}`;
};

const AdminWegoRequests = () => {
  const navigate = useNavigate();
  const { user, canManage, loading } = useAdminAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (!canManage) {
      navigate("/", { replace: true });
    }
  }, [user, canManage, loading, navigate]);

  useIdleSignOut(!!user, () => navigate("/auth", { replace: true }));

  useEffect(() => {
    if (!canManage) return;
    void load();
  }, [canManage]);

  async function load() {
    setLoadError(null);
    const { data, error } = await supabase
      .from("wego_event_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoadError(error.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as Row[]);
  }

  async function updateRow(id: string, patch: Partial<Row>) {
    setSavingId(id);
    const { error } = await supabase
      .from("wego_event_requests")
      .update({
        ...patch,
        status_updated_at: new Date().toISOString(),
        status_updated_by: user?.id ?? null,
      })
      .eq("id", id);
    setSavingId(null);
    if (error) {
      alert(`Update failed: ${error.message}`);
      return;
    }
    setRows((rs) =>
      rs ? rs.map((r) => (r.id === id ? { ...r, ...patch } : r)) : rs,
    );
  }

  const filtered = useMemo(() => {
    if (!rows) return null;
    return filter === "all" ? rows : rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  if (loading || !user || !canManage) {
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
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link to="/admin" className="text-primary underline-offset-2 hover:underline">
            Admin
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>WeGo Event Requests</span>
        </nav>

        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
            <h1 className="text-3xl font-bold sm:text-4xl">
              Mobile Health Clinic Event Requests
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Review and track special event requests submitted through the
              public WeGo request form.
            </p>
          </div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 rounded border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to dashboard
          </Link>
        </header>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filter:
          </label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | Status)}
            className="rounded border border-border bg-background px-2 py-1.5 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {filtered ? `${filtered.length} request${filtered.length === 1 ? "" : "s"}` : ""}
          </span>
        </div>

        {loadError && (
          <div role="alert" className="mb-4 rounded border border-destructive/40 bg-background p-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {!filtered ? (
          <p className="text-muted-foreground">Loading requests…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No requests found.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r) => {
              const isOpen = expanded === r.id;
              return (
                <li key={r.id} className="rounded-lg border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    aria-expanded={isOpen}
                    className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span className="font-medium">{r.organization_name}</span>
                    <span className="text-sm text-muted-foreground">— {r.event_name}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {r.event_date}
                    </span>
                    <span className={statusBadge(r.status)}>
                      {STATUSES.find((s) => s.value === r.status)?.label ?? r.status}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border p-4 text-sm">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Detail label="Submitted" value={new Date(r.created_at).toLocaleString()} />
                        <Detail label="Contact" value={`${r.contact_name}${r.contact_title ? ` (${r.contact_title})` : ""}`} />
                        <Detail label="Email" value={<a className="text-primary underline-offset-2 hover:underline" href={`mailto:${r.email}`}>{r.email}</a>} />
                        <Detail label="Phone" value={<a className="text-primary underline-offset-2 hover:underline" href={`tel:${r.phone}`}>{r.phone}</a>} />
                        <Detail label="Event time" value={`${r.event_start_time} – ${r.event_end_time}`} />
                        <Detail label="Expected attendance" value={String(r.expected_attendance)} />
                        <Detail label="Location" value={`${r.event_address}, ${r.event_city}${r.event_county ? `, ${r.event_county} County` : ""}`} />
                        <Detail label="Venue type" value={r.venue_type} />
                        <Detail label="Electricity available" value={r.electricity_available ? "Yes" : "No"} />
                        <Detail label="Space for mobile unit" value={r.space_for_unit ? "Yes" : "No"} />
                        <Detail label="Parking level & accessible" value={r.parking_level_accessible ? "Yes" : "No"} />
                        <Detail label="On-site contact" value={`${r.onsite_contact_name} — ${r.onsite_contact_phone}`} />
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold">Services requested</h4>
                        <ul className="mt-1 list-disc pl-5">
                          {r.services_requested.map((s) => (
                            <li key={s}>{SERVICE_LABELS[s] ?? s}</li>
                          ))}
                        </ul>
                        {r.services_other_detail && (
                          <p className="mt-2"><strong>Other:</strong> {r.services_other_detail}</p>
                        )}
                      </div>

                      {r.setup_instructions && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Setup / parking / access</h4>
                          <p className="mt-1 whitespace-pre-wrap">{r.setup_instructions}</p>
                        </div>
                      )}

                      {r.additional_notes && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Additional notes</h4>
                          <p className="mt-1 whitespace-pre-wrap">{r.additional_notes}</p>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-muted-foreground">
                        Email notification:{" "}
                        {r.email_sent
                          ? "sent"
                          : r.email_error
                          ? `failed (${r.email_error})`
                          : "not sent"}
                      </div>

                      <div className="mt-5 rounded border border-border bg-background p-3">
                        <h4 className="text-sm font-semibold">Update status</h4>
                        <div className="mt-2 grid gap-3 md:grid-cols-[200px_1fr_auto]">
                          <select
                            value={r.status}
                            onChange={(e) =>
                              setRows((rs) =>
                                rs ? rs.map((x) => (x.id === r.id ? { ...x, status: e.target.value as Status } : x)) : rs,
                              )
                            }
                            className="rounded border border-border bg-background px-2 py-1.5 text-sm"
                          >
                            {STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Status notes (optional)"
                            defaultValue={r.status_notes ?? ""}
                            onBlur={(e) =>
                              setRows((rs) =>
                                rs ? rs.map((x) => (x.id === r.id ? { ...x, status_notes: e.target.value } : x)) : rs,
                              )
                            }
                            className="rounded border border-border bg-background px-2 py-1.5 text-sm"
                          />
                          <button
                            type="button"
                            disabled={savingId === r.id}
                            onClick={() =>
                              updateRow(r.id, {
                                status: r.status,
                                status_notes: r.status_notes ?? null,
                              })
                            }
                            className="inline-flex items-center justify-center gap-2 rounded bg-brand px-3 py-1.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover disabled:opacity-60"
                          >
                            {savingId === r.id && <Loader2 className="h-3 w-3 animate-spin" />}
                            Save
                          </button>
                        </div>
                        {r.status_updated_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Last updated {new Date(r.status_updated_at).toLocaleString()}
                          </p>
                        )}
                      </div>
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

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-0.5">{value}</div>
  </div>
);

export default AdminWegoRequests;
