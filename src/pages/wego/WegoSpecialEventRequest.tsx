import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import WegoLayout from "@/components/wego/WegoLayout";
import { supabase } from "@/integrations/supabase/client";

/**
 * Mobile Health Clinic Special Event Request form.
 * Public form (no login). Submissions are sent to the `submit-wego-event`
 * edge function which validates input, persists to `wego_event_requests`,
 * and emails the WeGo coordinator.
 */

type ServiceKey =
  | "vaccines_immunizations"
  | "blood_pressure"
  | "glucose"
  | "hiv_testing"
  | "health_education"
  | "family_planning"
  | "sexual_health"
  | "wic_referrals"
  | "primary_care"
  | "sports_physicals"
  | "community_outreach_only"
  | "other";

const SERVICES: { key: ServiceKey; label: string }[] = [
  { key: "vaccines_immunizations", label: "Vaccines / Immunizations" },
  { key: "blood_pressure", label: "Blood Pressure Screenings" },
  { key: "glucose", label: "Glucose Screenings" },
  { key: "hiv_testing", label: "HIV Testing" },
  { key: "health_education", label: "Health Education" },
  { key: "family_planning", label: "Family Planning Information" },
  { key: "sexual_health", label: "Sexual Health Services" },
  { key: "wic_referrals", label: "WIC Referrals" },
  { key: "primary_care", label: "Primary Care / Screenings" },
  { key: "sports_physicals", label: "Sports Physicals" },
  { key: "community_outreach_only", label: "Community Outreach Only" },
  { key: "other", label: "Other" },
];

type FormState = {
  organization_name: string;
  contact_name: string;
  contact_title: string;
  email: string;
  phone: string;
  event_name: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  event_address: string;
  event_city: string;
  event_county: string;
  expected_attendance: string;
  venue_type: "" | "indoor" | "outdoor" | "both";
  electricity_available: "" | "yes" | "no";
  space_for_unit: "" | "yes" | "no";
  parking_level_accessible: "" | "yes" | "no";
  onsite_contact_name: string;
  onsite_contact_phone: string;
  setup_instructions: string;
  services_requested: ServiceKey[];
  services_other_detail: string;
  additional_notes: string;
};

const initial: FormState = {
  organization_name: "",
  contact_name: "",
  contact_title: "",
  email: "",
  phone: "",
  event_name: "",
  event_date: "",
  event_start_time: "",
  event_end_time: "",
  event_address: "",
  event_city: "",
  event_county: "",
  expected_attendance: "",
  venue_type: "",
  electricity_available: "",
  space_for_unit: "",
  parking_level_accessible: "",
  onsite_contact_name: "",
  onsite_contact_phone: "",
  setup_instructions: "",
  services_requested: [],
  services_other_detail: "",
  additional_notes: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const TODAY = new Date().toISOString().slice(0, 10);

const inputBase =
  "w-full rounded border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary md:text-sm";
const labelBase = "block text-sm font-medium text-foreground";
const errorTextBase = "mt-1 text-sm text-destructive";

const sanitizePhoneInput = (v: string) =>
  v.replace(/[^\d+()\-.\s]/g, "").slice(0, 40);

const WegoSpecialEventRequest = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAtRef = useRef<number>(Date.now());
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Mobile Health Clinic Special Event Request | ECPHD";
    startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "error" && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
    if (status === "success" && successRef.current) {
      successRef.current.focus();
    }
  }, [status]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleService = (key: ServiceKey) => {
    setForm((f) => {
      const has = f.services_requested.includes(key);
      return {
        ...f,
        services_requested: has
          ? f.services_requested.filter((s) => s !== key)
          : [...f.services_requested, key],
      };
    });
    if (errors.services_requested)
      setErrors((e) => ({ ...e, services_requested: undefined }));
  };

  const validate = (): FieldErrors => {
    const fe: FieldErrors = {};
    if (!form.organization_name.trim())
      fe.organization_name = "Organization name is required.";
    if (!form.contact_name.trim()) fe.contact_name = "Contact name is required.";
    const email = form.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fe.email = "Enter a valid email address.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7)
      fe.phone = "Enter a valid phone number.";
    if (!form.event_name.trim()) fe.event_name = "Event name is required.";
    if (!form.event_date) {
      fe.event_date = "Event date is required.";
    } else if (form.event_date < TODAY) {
      fe.event_date = "Event date cannot be in the past.";
    }
    if (!form.event_start_time) fe.event_start_time = "Start time is required.";
    if (!form.event_end_time) fe.event_end_time = "End time is required.";
    if (
      form.event_start_time &&
      form.event_end_time &&
      form.event_end_time <= form.event_start_time
    ) {
      fe.event_end_time = "End time must be after start time.";
    }
    if (!form.event_address.trim()) fe.event_address = "Address is required.";
    if (!form.event_city.trim()) fe.event_city = "City is required.";
    const attendance = Number(form.expected_attendance);
    if (
      !form.expected_attendance ||
      !Number.isFinite(attendance) ||
      !Number.isInteger(attendance) ||
      attendance <= 0
    ) {
      fe.expected_attendance = "Enter a positive number.";
    }
    if (!form.venue_type) fe.venue_type = "Select indoor, outdoor, or both.";
    if (!form.electricity_available)
      fe.electricity_available = "Please answer this question.";
    if (!form.space_for_unit)
      fe.space_for_unit = "Please answer this question.";
    if (!form.parking_level_accessible)
      fe.parking_level_accessible = "Please answer this question.";
    if (!form.onsite_contact_name.trim())
      fe.onsite_contact_name = "On-site contact name is required.";
    if (
      !form.onsite_contact_phone.trim() ||
      form.onsite_contact_phone.replace(/\D/g, "").length < 7
    )
      fe.onsite_contact_phone = "On-site contact phone is required.";
    if (form.services_requested.length === 0)
      fe.services_requested = "Select at least one service.";
    if (
      form.services_requested.includes("other") &&
      !form.services_other_detail.trim()
    )
      fe.services_other_detail =
        "Please describe the other services requested.";
    return fe;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const fe = validate();
    if (Object.keys(fe).length > 0) {
      setErrors(fe);
      setStatus("error");
      setErrorMsg("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");

    const formEl = e.currentTarget;
    const website =
      (formEl.elements.namedItem("website") as HTMLInputElement)?.value ?? "";
    const hp_company =
      (formEl.elements.namedItem("hp_company") as HTMLInputElement)?.value ?? "";

    try {
      const { data, error } = await supabase.functions.invoke(
        "submit-wego-event",
        {
          body: {
            organization_name: form.organization_name.trim(),
            contact_name: form.contact_name.trim(),
            contact_title: form.contact_title.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            event_name: form.event_name.trim(),
            event_date: form.event_date,
            event_start_time: form.event_start_time,
            event_end_time: form.event_end_time,
            event_address: form.event_address.trim(),
            event_city: form.event_city.trim(),
            event_county: form.event_county.trim(),
            expected_attendance: Number(form.expected_attendance),
            venue_type: form.venue_type,
            electricity_available: form.electricity_available === "yes",
            space_for_unit: form.space_for_unit === "yes",
            parking_level_accessible: form.parking_level_accessible === "yes",
            onsite_contact_name: form.onsite_contact_name.trim(),
            onsite_contact_phone: form.onsite_contact_phone.trim(),
            setup_instructions: form.setup_instructions.trim(),
            services_requested: form.services_requested,
            services_other_detail: form.services_other_detail.trim(),
            additional_notes: form.additional_notes.trim(),
            website,
            hp_company,
            started_at: startedAtRef.current,
          },
        },
      );

      if (error) throw new Error(error.message || "Submission failed.");

      const result = data as {
        ok: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };
      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus("error");
        setErrorMsg(result.error || "Please review the form and try again.");
        return;
      }
      setStatus("success");
      setForm(initial);
      startedAtRef.current = Date.now();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or call 1-877-884-WEGO.",
      );
    }
  };

  const fieldError = (key: keyof FormState) =>
    errors[key] ? (
      <p id={`${key}-error`} className={errorTextBase}>
        {errors[key]}
      </p>
    ) : null;

  return (
    <WegoLayout
      breadcrumb={[{ label: "Special Event Request" }]}
    >
      <section className="container py-8 md:py-12">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
            Mobile Health Clinic
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            Mobile Health Clinic Special Event Request
          </h1>
          <div aria-hidden="true" className="mt-3 h-1 w-16 bg-accent-gold" />
          <p className="mt-4 text-base leading-relaxed text-foreground/90">
            Use this form to request the East Central Health District Mobile
            Health Clinic for a community event. We recommend submitting
            requests at least 4 weeks in advance so our team has time to
            review logistics and confirm availability. For questions, call{" "}
            <a
              href="tel:18778849346"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              1-877-884-WEGO (9346)
            </a>
            .
          </p>
        </header>

        {status === "success" ? (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="mt-8 max-w-3xl rounded-lg border border-border bg-background p-6 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 h-6 w-6 text-primary"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-semibold">Request received</h2>
                <p className="mt-2 text-base leading-relaxed text-foreground/90">
                  Thank you — your Mobile Health Clinic event request has been
                  submitted. A member of the WeGo team will review your
                  request and follow up using the contact information you
                  provided. For urgent questions, call{" "}
                  <a
                    href="tel:18778849346"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    1-877-884-WEGO (9346)
                  </a>
                  .
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center rounded border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Submit another request
                  </button>
                  <Link
                    to="/wego"
                    className="inline-flex items-center justify-center rounded bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand-hover"
                  >
                    Back to Mobile Health Clinic
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={errorMsg ? "form-error" : undefined}
            className="mt-8 max-w-3xl space-y-8"
          >
            {/* Honeypots */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="website">Website (leave blank)</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              <label htmlFor="hp_company">Company (leave blank)</label>
              <input id="hp_company" name="hp_company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <p className="text-sm text-muted-foreground">
              Fields marked with <span aria-hidden="true">*</span> are required.
            </p>

            {/* ===== Organization & contact ===== */}
            <fieldset className="space-y-5 rounded-lg border border-border p-5">
              <legend className="px-2 text-base font-semibold">
                Organization &amp; contact
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="organization_name" className={labelBase}>
                    Organization / group name <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="organization_name"
                    type="text"
                    required
                    value={form.organization_name}
                    onChange={(e) => set("organization_name", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.organization_name}
                    aria-describedby={errors.organization_name ? "organization_name-error" : undefined}
                  />
                  {fieldError("organization_name")}
                </div>
                <div>
                  <label htmlFor="contact_title" className={labelBase}>
                    Your title <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="contact_title"
                    type="text"
                    value={form.contact_title}
                    onChange={(e) => set("contact_title", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label htmlFor="contact_name" className={labelBase}>
                    Your name <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact_name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.contact_name}
                    onChange={(e) => set("contact_name", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.contact_name}
                    aria-describedby={errors.contact_name ? "contact_name-error" : undefined}
                  />
                  {fieldError("contact_name")}
                </div>
                <div>
                  <label htmlFor="email" className={labelBase}>
                    Email <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {fieldError("email")}
                </div>
                <div>
                  <label htmlFor="phone" className={labelBase}>
                    Phone <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", sanitizePhoneInput(e.target.value))}
                    className={inputBase}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {fieldError("phone")}
                </div>
              </div>
            </fieldset>

            {/* ===== Event details ===== */}
            <fieldset className="space-y-5 rounded-lg border border-border p-5">
              <legend className="px-2 text-base font-semibold">Event details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="event_name" className={labelBase}>
                    Event name <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_name"
                    type="text"
                    required
                    value={form.event_name}
                    onChange={(e) => set("event_name", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_name}
                    aria-describedby={errors.event_name ? "event_name-error" : undefined}
                  />
                  {fieldError("event_name")}
                </div>
                <div>
                  <label htmlFor="event_date" className={labelBase}>
                    Event date <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_date"
                    type="date"
                    required
                    min={TODAY}
                    value={form.event_date}
                    onChange={(e) => set("event_date", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_date}
                    aria-describedby={errors.event_date ? "event_date-error" : undefined}
                  />
                  {fieldError("event_date")}
                </div>
                <div>
                  <label htmlFor="expected_attendance" className={labelBase}>
                    Expected attendance <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="expected_attendance"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    required
                    value={form.expected_attendance}
                    onChange={(e) => set("expected_attendance", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.expected_attendance}
                    aria-describedby={errors.expected_attendance ? "expected_attendance-error" : undefined}
                  />
                  {fieldError("expected_attendance")}
                </div>
                <div>
                  <label htmlFor="event_start_time" className={labelBase}>
                    Start time <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_start_time"
                    type="time"
                    required
                    value={form.event_start_time}
                    onChange={(e) => set("event_start_time", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_start_time}
                    aria-describedby={errors.event_start_time ? "event_start_time-error" : undefined}
                  />
                  {fieldError("event_start_time")}
                </div>
                <div>
                  <label htmlFor="event_end_time" className={labelBase}>
                    End time <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_end_time"
                    type="time"
                    required
                    value={form.event_end_time}
                    onChange={(e) => set("event_end_time", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_end_time}
                    aria-describedby={errors.event_end_time ? "event_end_time-error" : undefined}
                  />
                  {fieldError("event_end_time")}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="event_address" className={labelBase}>
                    Event street address <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_address"
                    type="text"
                    required
                    autoComplete="street-address"
                    value={form.event_address}
                    onChange={(e) => set("event_address", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_address}
                    aria-describedby={errors.event_address ? "event_address-error" : undefined}
                  />
                  {fieldError("event_address")}
                </div>
                <div>
                  <label htmlFor="event_city" className={labelBase}>
                    City <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="event_city"
                    type="text"
                    required
                    value={form.event_city}
                    onChange={(e) => set("event_city", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.event_city}
                    aria-describedby={errors.event_city ? "event_city-error" : undefined}
                  />
                  {fieldError("event_city")}
                </div>
                <div>
                  <label htmlFor="event_county" className={labelBase}>
                    County <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    id="event_county"
                    type="text"
                    value={form.event_county}
                    onChange={(e) => set("event_county", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>
            </fieldset>

            {/* ===== Venue & logistics ===== */}
            <fieldset className="space-y-5 rounded-lg border border-border p-5">
              <legend className="px-2 text-base font-semibold">Venue &amp; logistics</legend>

              <div>
                <span className={labelBase}>
                  Will the event be indoor, outdoor, or both? <span className="text-destructive" aria-hidden="true">*</span>
                </span>
                <div role="radiogroup" aria-invalid={!!errors.venue_type} className="mt-2 flex flex-wrap gap-4">
                  {(["indoor", "outdoor", "both"] as const).map((v) => (
                    <label key={v} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="venue_type"
                        value={v}
                        checked={form.venue_type === v}
                        onChange={() => set("venue_type", v)}
                      />
                      <span className="capitalize">{v}</span>
                    </label>
                  ))}
                </div>
                {fieldError("venue_type")}
              </div>

              {(
                [
                  ["electricity_available", "Is electricity available on site?"],
                  ["space_for_unit", "Is there enough space for the mobile unit to safely park?"],
                  ["parking_level_accessible", "Is the parking area level and accessible?"],
                ] as const
              ).map(([key, question]) => (
                <div key={key}>
                  <span className={labelBase}>
                    {question} <span className="text-destructive" aria-hidden="true">*</span>
                  </span>
                  <div
                    role="radiogroup"
                    aria-invalid={!!errors[key]}
                    className="mt-2 flex flex-wrap gap-4"
                  >
                    {(["yes", "no"] as const).map((v) => (
                      <label key={v} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={key}
                          value={v}
                          checked={form[key] === v}
                          onChange={() => set(key, v)}
                        />
                        <span className="capitalize">{v}</span>
                      </label>
                    ))}
                  </div>
                  {fieldError(key)}
                </div>
              ))}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="onsite_contact_name" className={labelBase}>
                    On-site contact name <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="onsite_contact_name"
                    type="text"
                    required
                    value={form.onsite_contact_name}
                    onChange={(e) => set("onsite_contact_name", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.onsite_contact_name}
                    aria-describedby={errors.onsite_contact_name ? "onsite_contact_name-error" : undefined}
                  />
                  {fieldError("onsite_contact_name")}
                </div>
                <div>
                  <label htmlFor="onsite_contact_phone" className={labelBase}>
                    On-site contact phone <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="onsite_contact_phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={form.onsite_contact_phone}
                    onChange={(e) => set("onsite_contact_phone", sanitizePhoneInput(e.target.value))}
                    className={inputBase}
                    aria-invalid={!!errors.onsite_contact_phone}
                    aria-describedby={errors.onsite_contact_phone ? "onsite_contact_phone-error" : undefined}
                  />
                  {fieldError("onsite_contact_phone")}
                </div>
              </div>

              <div>
                <label htmlFor="setup_instructions" className={labelBase}>
                  Special setup, parking, or access instructions{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="setup_instructions"
                  rows={4}
                  value={form.setup_instructions}
                  onChange={(e) => set("setup_instructions", e.target.value)}
                  className={inputBase}
                />
              </div>
            </fieldset>

            {/* ===== Services ===== */}
            <fieldset className="space-y-3 rounded-lg border border-border p-5">
              <legend className="px-2 text-base font-semibold">
                Services requested <span className="text-destructive" aria-hidden="true">*</span>
              </legend>
              <p className="text-sm text-muted-foreground">
                Select all that apply. Final services are confirmed by the WeGo team based on availability.
              </p>
              <ul
                className="grid gap-2 sm:grid-cols-2"
                aria-invalid={!!errors.services_requested}
              >
                {SERVICES.map((s) => (
                  <li key={s.key}>
                    <label className="flex items-start gap-2 rounded p-1 text-sm hover:bg-muted/50">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={form.services_requested.includes(s.key)}
                        onChange={() => toggleService(s.key)}
                      />
                      <span>{s.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              {fieldError("services_requested")}

              {form.services_requested.includes("other") && (
                <div>
                  <label htmlFor="services_other_detail" className={labelBase}>
                    Please describe the other services requested{" "}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="services_other_detail"
                    rows={3}
                    value={form.services_other_detail}
                    onChange={(e) => set("services_other_detail", e.target.value)}
                    className={inputBase}
                    aria-invalid={!!errors.services_other_detail}
                    aria-describedby={errors.services_other_detail ? "services_other_detail-error" : undefined}
                  />
                  {fieldError("services_other_detail")}
                </div>
              )}
            </fieldset>

            {/* ===== Notes ===== */}
            <div>
              <label htmlFor="additional_notes" className={labelBase}>
                Additional notes <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id="additional_notes"
                rows={4}
                value={form.additional_notes}
                onChange={(e) => set("additional_notes", e.target.value)}
                className={inputBase}
              />
            </div>

            {status === "error" && errorMsg && (
              <div
                ref={errorSummaryRef}
                id="form-error"
                tabIndex={-1}
                role="alert"
                className="flex items-start gap-2 rounded border border-destructive/40 bg-background p-3 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {status === "submitting" ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        )}
      </section>
    </WegoLayout>
  );
};

export default WegoSpecialEventRequest;
