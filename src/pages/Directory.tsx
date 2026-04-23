import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

type Staff = {
  id: string;
  full_name: string;
  last_name: string;
  job_title: string | null;
  department: string | null;
  county: string | null;
  phone: string | null;
  email: string | null;
  office_location: string | null;
  notes: string | null;
  photo_url: string | null;
};

const useStaff = () =>
  useQuery({
    queryKey: ["staff_directory"],
    queryFn: async (): Promise<Staff[]> => {
      const { data, error } = await supabase
        .from("staff_directory")
        .select("*")
        .eq("published", true)
        .order("last_name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Staff[];
    },
  });

const Directory = () => {
  const { data: staff = [], isLoading, error } = useStaff();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [county, setCounty] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(staff.map((s) => s.department).filter(Boolean))).sort() as string[],
    [staff],
  );
  const counties = useMemo(
    () => Array.from(new Set(staff.map((s) => s.county).filter(Boolean))).sort() as string[],
    [staff],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staff.filter((s) => {
      if (department && s.department !== department) return false;
      if (county && s.county !== county) return false;
      if (!q) return true;
      const haystack = [
        s.full_name,
        s.last_name,
        s.job_title,
        s.department,
        s.county,
        s.office_location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [staff, query, department, county]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="container py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>ECPHD Directory</span>
        </nav>

        <header className="mb-6 border-b border-border pb-4">
          <div className="mb-2 h-1 w-16 rounded bg-accent" aria-hidden="true" />
          <h1 className="text-3xl font-bold sm:text-4xl">ECPHD Directory</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Search for East Central Public Health District staff and department
            contacts. Filter by department or county to narrow your results.
          </p>
        </header>

        {/* Search + filters */}
        <section
          aria-label="Directory search and filters"
          className="mb-6 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_auto]"
        >
          <label className="relative block">
            <span className="sr-only">Search by name, title, department, or location</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, title, department…"
              className="w-full rounded border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by department</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Filter by county</span>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full rounded border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <option value="">All Counties / Locations</option>
              {counties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </section>

        <p className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
          {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`}
        </p>

        {error && (
          <p className="text-destructive">We couldn't load the directory. Please try again later.</p>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="rounded border border-dashed border-border p-6 text-center text-muted-foreground">
            No staff entries match your search.
          </p>
        )}

        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => {
            const isOpen = expanded === s.id;
            return (
              <li
                key={s.id}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="flex gap-4 p-5">
                  <div
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-muted-foreground"
                  >
                    {s.photo_url ? (
                      <img src={s.photo_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold">{s.full_name}</h2>
                    {s.job_title && (
                      <p className="text-sm text-muted-foreground">{s.job_title}</p>
                    )}
                    <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {[s.department, s.county].filter(Boolean).join(" • ")}
                    </p>

                    <ul className="mt-3 space-y-1.5 text-sm">
                      {s.phone && (
                        <li className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                          <a
                            href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                            className="text-primary underline-offset-2 hover:underline"
                            aria-label={`Call ${s.full_name} at ${s.phone}`}
                          >
                            {s.phone}
                          </a>
                        </li>
                      )}
                      {s.email && (
                        <li className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                          <a
                            href={`mailto:${s.email}`}
                            className="break-all text-primary underline-offset-2 hover:underline"
                            aria-label={`Email ${s.full_name}`}
                          >
                            {s.email}
                          </a>
                        </li>
                      )}
                      {s.office_location && (
                        <li className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                          <span>{s.office_location}</span>
                        </li>
                      )}
                    </ul>

                    {s.notes && (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : s.id)}
                          aria-expanded={isOpen}
                          aria-controls={`notes-${s.id}`}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          {isOpen ? "Hide details" : "Show details"}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          id={`notes-${s.id}`}
                          hidden={!isOpen}
                          className="mt-2 rounded bg-muted/40 p-3 text-sm text-foreground"
                        >
                          {s.notes}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Directory;
