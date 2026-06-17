// Public edge function: receives Mobile Health Clinic (WeGo) special event
// requests, applies bot resistance (honeypot + time-trap), stores the
// submission in `wego_event_requests`, and emails the WeGo coordinator.
//
// verify_jwt is left at the project default; this function is intentionally
// public (anonymous form submissions) and validates input itself.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECIPIENT = "zynith.robinson@dph.ga.gov";
const MIN_FILL_MS = 3000;

const MAX = {
  short: 200,
  medium: 500,
  long: 5000,
  email: 254,
  phone: 40,
};

const ALLOWED_SERVICES = new Set([
  "vaccines_immunizations",
  "blood_pressure",
  "glucose",
  "hiv_testing",
  "health_education",
  "family_planning",
  "sexual_health",
  "wic_referrals",
  "primary_care",
  "sports_physicals",
  "community_outreach_only",
  "other",
]);

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

const VENUE_TYPES = new Set(["indoor", "outdoor", "both"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isString = (v: unknown): v is string => typeof v === "string";
const trimTo = (v: unknown, max: number): string =>
  (isString(v) ? v : "").trim().slice(0, max);
const sanitizePhone = (v: unknown): string =>
  (isString(v) ? v : "")
    .replace(/[^\d+()\-.\s]/g, "")
    .trim()
    .slice(0, MAX.phone);

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const yesNo = (b: boolean) => (b ? "Yes" : "No");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ===== Bot resistance =====
  const hp1 = isString(body.website) ? body.website : "";
  const hp2 = isString(body.hp_company) ? body.hp_company : "";
  if (hp1.trim() !== "" || hp2.trim() !== "") {
    console.log("[submit-wego-event] honeypot tripped");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const startedAt = Number(body.started_at);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    console.log("[submit-wego-event] time-trap tripped");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ===== Validate / normalize =====
  const fieldErrors: Record<string, string> = {};

  const organization_name = trimTo(body.organization_name, MAX.short);
  const contact_name = trimTo(body.contact_name, MAX.short);
  const contact_title = trimTo(body.contact_title, MAX.short);
  const email = trimTo(body.email, MAX.email).toLowerCase();
  const phone = sanitizePhone(body.phone);
  const event_name = trimTo(body.event_name, MAX.short);
  const event_date = trimTo(body.event_date, 20);
  const event_start_time = trimTo(body.event_start_time, 20);
  const event_end_time = trimTo(body.event_end_time, 20);
  const event_address = trimTo(body.event_address, MAX.medium);
  const event_city = trimTo(body.event_city, MAX.short);
  const event_county = trimTo(body.event_county, MAX.short);
  const expected_attendance_raw = body.expected_attendance;
  const venue_type = trimTo(body.venue_type, 20).toLowerCase();
  const electricity_available = body.electricity_available === true;
  const space_for_unit = body.space_for_unit === true;
  const parking_level_accessible = body.parking_level_accessible === true;
  const onsite_contact_name = trimTo(body.onsite_contact_name, MAX.short);
  const onsite_contact_phone = sanitizePhone(body.onsite_contact_phone);
  const setup_instructions = trimTo(body.setup_instructions, MAX.long);
  const additional_notes = trimTo(body.additional_notes, MAX.long);
  const services_other_detail = trimTo(body.services_other_detail, MAX.medium);

  const rawServices = Array.isArray(body.services_requested)
    ? (body.services_requested as unknown[])
    : [];
  const services_requested = Array.from(
    new Set(
      rawServices
        .filter(isString)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => ALLOWED_SERVICES.has(s)),
    ),
  );

  if (!organization_name) fieldErrors.organization_name = "Organization name is required.";
  if (!contact_name) fieldErrors.contact_name = "Contact name is required.";
  if (!email || !EMAIL_RE.test(email))
    fieldErrors.email = "A valid email is required.";
  if (!phone || phone.replace(/\D/g, "").length < 7)
    fieldErrors.phone = "A valid phone number is required.";
  if (!event_name) fieldErrors.event_name = "Event name is required.";
  if (!event_address) fieldErrors.event_address = "Event address is required.";
  if (!event_city) fieldErrors.event_city = "Event city is required.";

  if (!DATE_RE.test(event_date)) {
    fieldErrors.event_date = "Event date is required.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ed = new Date(`${event_date}T00:00:00`);
    if (Number.isNaN(ed.getTime())) {
      fieldErrors.event_date = "Event date is invalid.";
    } else if (ed < today) {
      fieldErrors.event_date = "Event date cannot be in the past.";
    }
  }

  if (!TIME_RE.test(event_start_time))
    fieldErrors.event_start_time = "Start time is required.";
  if (!TIME_RE.test(event_end_time))
    fieldErrors.event_end_time = "End time is required.";
  if (
    TIME_RE.test(event_start_time) &&
    TIME_RE.test(event_end_time) &&
    event_end_time <= event_start_time
  ) {
    fieldErrors.event_end_time = "End time must be after start time.";
  }

  const expected_attendance = Number(expected_attendance_raw);
  if (
    !Number.isFinite(expected_attendance) ||
    !Number.isInteger(expected_attendance) ||
    expected_attendance <= 0
  ) {
    fieldErrors.expected_attendance = "Expected attendance must be a positive number.";
  }

  if (!VENUE_TYPES.has(venue_type))
    fieldErrors.venue_type = "Select indoor, outdoor, or both.";

  if (typeof body.electricity_available !== "boolean")
    fieldErrors.electricity_available = "Please answer the electricity question.";
  if (typeof body.space_for_unit !== "boolean")
    fieldErrors.space_for_unit = "Please answer the space question.";
  if (typeof body.parking_level_accessible !== "boolean")
    fieldErrors.parking_level_accessible = "Please answer the parking question.";

  if (!onsite_contact_name)
    fieldErrors.onsite_contact_name = "On-site contact name is required.";
  if (!onsite_contact_phone || onsite_contact_phone.replace(/\D/g, "").length < 7)
    fieldErrors.onsite_contact_phone = "On-site contact phone is required.";

  if (services_requested.length === 0)
    fieldErrors.services_requested = "Select at least one service.";

  if (services_requested.includes("other") && !services_other_detail)
    fieldErrors.services_other_detail =
      "Please describe the other services requested.";

  if (Object.keys(fieldErrors).length > 0) {
    return new Response(JSON.stringify({ ok: false, fieldErrors }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ===== Persist =====
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const ipHash = ip === "unknown" ? null : await hashIp(ip);
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;

  const { data: inserted, error: insertError } = await supabase
    .from("wego_event_requests")
    .insert({
      organization_name,
      contact_name,
      contact_title: contact_title || null,
      email,
      phone,
      event_name,
      event_date,
      event_start_time,
      event_end_time,
      event_address,
      event_city,
      event_county: event_county || null,
      expected_attendance,
      venue_type,
      electricity_available,
      space_for_unit,
      parking_level_accessible,
      onsite_contact_name,
      onsite_contact_phone,
      setup_instructions: setup_instructions || null,
      services_requested,
      services_other_detail: services_other_detail || null,
      additional_notes: additional_notes || null,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[submit-wego-event] insert error:", insertError);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "We couldn't save your request. Please try again shortly.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ===== Email via Resend =====
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromAddress =
    Deno.env.get("CONTACT_FROM_ADDRESS") ||
    "ECPHD WeGo Requests <onboarding@resend.dev>";

  let emailSent = false;
  let emailError: string | null = null;

  if (resendKey) {
    const serviceList = services_requested
      .map((s) => `<li>${escapeHtml(SERVICE_LABELS[s] ?? s)}</li>`)
      .join("");

    const html = `
      <h2>New Mobile Health Clinic Special Event Request</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td><strong>Organization</strong></td><td>${escapeHtml(organization_name)}</td></tr>
        <tr><td><strong>Contact</strong></td><td>${escapeHtml(contact_name)}${contact_title ? ` (${escapeHtml(contact_title)})` : ""}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
        <tr><td><strong>Event</strong></td><td>${escapeHtml(event_name)}</td></tr>
        <tr><td><strong>Date</strong></td><td>${escapeHtml(event_date)}</td></tr>
        <tr><td><strong>Time</strong></td><td>${escapeHtml(event_start_time)} – ${escapeHtml(event_end_time)}</td></tr>
        <tr><td><strong>Location</strong></td><td>${escapeHtml(event_address)}, ${escapeHtml(event_city)}${event_county ? `, ${escapeHtml(event_county)} County` : ""}</td></tr>
        <tr><td><strong>Expected attendance</strong></td><td>${expected_attendance}</td></tr>
        <tr><td><strong>Venue</strong></td><td>${escapeHtml(venue_type)}</td></tr>
        <tr><td><strong>Electricity available</strong></td><td>${yesNo(electricity_available)}</td></tr>
        <tr><td><strong>Space for mobile unit</strong></td><td>${yesNo(space_for_unit)}</td></tr>
        <tr><td><strong>Parking level &amp; accessible</strong></td><td>${yesNo(parking_level_accessible)}</td></tr>
        <tr><td><strong>On-site contact</strong></td><td>${escapeHtml(onsite_contact_name)} — ${escapeHtml(onsite_contact_phone)}</td></tr>
      </table>
      <h3>Services requested</h3>
      <ul>${serviceList}</ul>
      ${services_other_detail ? `<p><strong>Other services detail:</strong><br/>${escapeHtml(services_other_detail)}</p>` : ""}
      ${setup_instructions ? `<h3>Setup / parking / access instructions</h3><p style="white-space:pre-wrap">${escapeHtml(setup_instructions)}</p>` : ""}
      ${additional_notes ? `<h3>Additional notes</h3><p style="white-space:pre-wrap">${escapeHtml(additional_notes)}</p>` : ""}
      <hr/>
      <p style="color:#666;font-size:12px;font-family:Arial,sans-serif;">
        Submitted ${new Date().toISOString()} • Request ID: ${inserted.id}
      </p>
    `;

    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [RECIPIENT],
          reply_to: email,
          subject: `[WeGo Event Request] ${event_name} — ${event_date}`,
          html,
        }),
      });
      if (!resp.ok) {
        emailError = `Resend ${resp.status}: ${(await resp.text()).slice(0, 500)}`;
        console.error("[submit-wego-event] resend error:", emailError);
      } else {
        emailSent = true;
      }
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("[submit-wego-event] resend exception:", emailError);
    }
  } else {
    emailError = "RESEND_API_KEY not configured";
    console.warn("[submit-wego-event] " + emailError);
  }

  await supabase
    .from("wego_event_requests")
    .update({ email_sent: emailSent, email_error: emailError })
    .eq("id", inserted.id);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
