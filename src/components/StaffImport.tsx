import { useRef, useState } from "react";
import Papa from "papaparse";
import { z } from "zod";
import { Upload, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Admin-only CSV bulk import for the staff directory.
 *
 * Behaviour:
 *  - Accepts a CSV with a header row.
 *  - Recognised columns (header names, case-insensitive, snake_case or "Friendly Name"):
 *      full_name (required), job_title, department, county,
 *      phone, email, office_location, notes, photo_url, display_order, published
 *  - Each row is validated with zod. Invalid rows are reported and skipped.
 *  - Rows with an email upsert by email (insert or update existing).
 *  - Rows without an email are inserted as new entries.
 *  - last_name is derived automatically from full_name if not provided.
 */

type RowResult = { row: number; status: "ok" | "error"; message?: string };

const headerAliases: Record<string, string> = {
  "full name": "full_name",
  "name": "full_name",
  "job title": "job_title",
  "title": "job_title",
  "department": "department",
  "program": "department",
  "county": "county",
  "location": "county",
  "phone": "phone",
  "phone number": "phone",
  "email": "email",
  "email address": "email",
  "office location": "office_location",
  "office": "office_location",
  "notes": "notes",
  "photo url": "photo_url",
  "display order": "display_order",
  "published": "published",
};

const normaliseHeader = (h: string) => {
  const key = h.trim().toLowerCase();
  return headerAliases[key] ?? key.replace(/\s+/g, "_");
};

const rowSchema = z.object({
  full_name: z.string().trim().min(1, "full_name is required").max(200),
  last_name: z.string().trim().max(100).optional(),
  job_title: z.string().trim().max(200).optional().nullable(),
  department: z.string().trim().max(200).optional().nullable(),
  county: z.string().trim().max(100).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Invalid email")
    .optional()
    .nullable()
    .or(z.literal("")),
  office_location: z.string().trim().max(255).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  photo_url: z.string().trim().url("Invalid URL").max(500).optional().nullable().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).max(100000).optional(),
  published: z
    .union([z.boolean(), z.string()])
    .transform((v) => {
      if (typeof v === "boolean") return v;
      const s = v.toString().trim().toLowerCase();
      return !["false", "0", "no", "n", ""].includes(s);
    })
    .optional(),
});

const deriveLastName = (full: string) => {
  const parts = full.trim().split(/\s+/);
  const last = parts[parts.length - 1] ?? "";
  // Strip trailing credentials like "MD", "RN", "PhD"
  return last.replace(/[,.]/g, "");
};

export const StaffImport = ({ onComplete }: { onComplete?: () => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<RowResult[] | null>(null);
  const [summary, setSummary] = useState<{ ok: number; failed: number } | null>(null);

  const handleFile = (file: File) => {
    setBusy(true);
    setResults(null);
    setSummary(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normaliseHeader,
      complete: async (parsed) => {
        const rows = parsed.data;
        const out: RowResult[] = [];
        let okCount = 0;
        let failCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const raw = rows[i];
          const cleaned = Object.fromEntries(
            Object.entries(raw).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]),
          );

          const validated = rowSchema.safeParse(cleaned);
          if (!validated.success) {
            failCount++;
            out.push({
              row: i + 2,
              status: "error",
              message: validated.error.issues
                .map((iss) => `${iss.path.join(".")}: ${iss.message}`)
                .join("; "),
            });
            continue;
          }

          const data = validated.data;
          const payload = {
            full_name: data.full_name,
            last_name: data.last_name?.trim() || deriveLastName(data.full_name),
            job_title: data.job_title || null,
            department: data.department || null,
            county: data.county || null,
            phone: data.phone || null,
            email: data.email && data.email !== "" ? data.email.toLowerCase() : null,
            office_location: data.office_location || null,
            notes: data.notes || null,
            photo_url: data.photo_url && data.photo_url !== "" ? data.photo_url : null,
            display_order: data.display_order ?? 0,
            published: data.published ?? true,
          };

          // Upsert by email when present; otherwise plain insert.
          let res;
          if (payload.email) {
            res = await supabase
              .from("staff_directory")
              .upsert(payload, { onConflict: "email" });
          } else {
            res = await supabase.from("staff_directory").insert(payload);
          }

          if (res.error) {
            failCount++;
            out.push({ row: i + 2, status: "error", message: res.error.message });
          } else {
            okCount++;
            out.push({ row: i + 2, status: "ok" });
          }
        }

        setResults(out);
        setSummary({ ok: okCount, failed: failCount });
        setBusy(false);
        onComplete?.();
        if (inputRef.current) inputRef.current.value = "";
      },
      error: (err) => {
        setBusy(false);
        setResults([{ row: 0, status: "error", message: `Parse error: ${err.message}` }]);
        setSummary({ ok: 0, failed: 1 });
      },
    });
  };

  const downloadTemplate = () => {
    const csv =
      "full_name,job_title,department,county,phone,email,office_location,notes,photo_url,display_order,published\n" +
      "Jane Doe,Director,Administration,District Office,(706) 555-0100,jane.doe@example.com,Augusta District Office,Notes about Jane,,0,true\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ecphd-directory-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-labelledby="staff-import-heading"
      className="mb-6 rounded-lg border border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="staff-import-heading" className="text-lg font-semibold">
            Bulk Import Staff (CSV)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a CSV to add or update directory entries. Existing entries are
            matched and updated by email.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download template
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
          <Upload className="h-4 w-4" aria-hidden="true" />
          {busy ? "Importing…" : "Choose CSV file"}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="sr-only"
          />
        </label>
        <span className="text-xs text-muted-foreground">
          Required column: <code>full_name</code>. Email is used for matching.
        </span>
      </div>

      {summary && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex items-center gap-2 rounded border border-border bg-muted/40 p-3 text-sm"
        >
          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            <strong>{summary.ok}</strong> row{summary.ok === 1 ? "" : "s"} imported
            {summary.failed > 0 && (
              <>
                {" • "}
                <strong className="text-destructive">{summary.failed}</strong> failed
              </>
            )}
          </span>
        </div>
      )}

      {results && results.some((r) => r.status === "error") && (
        <details className="mt-3 rounded border border-destructive/40 bg-destructive/5 p-3 text-sm">
          <summary className="flex cursor-pointer items-center gap-2 font-medium text-destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            Errors ({results.filter((r) => r.status === "error").length})
          </summary>
          <ul className="mt-2 space-y-1 text-xs">
            {results
              .filter((r) => r.status === "error")
              .map((r, idx) => (
                <li key={idx}>
                  <span className="font-mono">Row {r.row}:</span> {r.message}
                </li>
              ))}
          </ul>
        </details>
      )}
    </section>
  );
};

export default StaffImport;
