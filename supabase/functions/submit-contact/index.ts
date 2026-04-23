// Public edge function: receives contact form submissions, applies bot
// resistance (honeypot + time-trap), stores the submission, and emails
// ecphd@dph.ga.gov via Resend if RESEND_API_KEY is configured.
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

const RECIPIENT = "ecphd@dph.ga.gov";
const MIN_FILL_MS = 3000; // submissions faster than this are treated as bots
const MAX_LEN = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 200,
  message: 5000,
};

interface Payload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  // Bot traps
  website?: unknown; // honeypot — must be empty
  hp_company?: unknown; // honeypot — must be empty
  started_at?: unknown; // ms epoch when form was rendered
}

const isString = (v: unknown): v is string => typeof v === "string";

const trimTo = (v: unknown, max: number): string =>
  (isString(v) ? v : "").trim().slice(0, max);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid JSON" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ===== Bot resistance: honeypots =====
  const honeypot1 = isString(body.website) ? body.website : "";
  const honeypot2 = isString(body.hp_company) ? body.hp_company : "";
  if (honeypot1.trim() !== "" || honeypot2.trim() !== "") {
    // Pretend success so bots don't learn they were caught.
    console.log("[submit-contact] honeypot tripped");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ===== Bot resistance: time-trap =====
  const startedAt = Number(body.started_at);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    console.log("[submit-contact] time-trap tripped");
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ===== Validate fields =====
  const name = trimTo(body.name, MAX_LEN.name);
  const email = trimTo(body.email, MAX_LEN.email).toLowerCase();
  const phone = trimTo(body.phone, MAX_LEN.phone);
  const subject = trimTo(body.subject, MAX_LEN.subject);
  const message = trimTo(body.message, MAX_LEN.message);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Name is required.";
  if (!email || !EMAIL_RE.test(email))
    fieldErrors.email = "A valid email is required.";
  if (!subject) fieldErrors.subject = "Subject is required.";
  if (!message || message.length < 10)
    fieldErrors.message = "Message must be at least 10 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return new Response(
      JSON.stringify({ ok: false, fieldErrors }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ===== Persist submission (always) =====
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
    .from("contact_submissions")
    .insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[submit-contact] insert error:", insertError);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "We couldn't save your message. Please try again shortly.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ===== Email via Resend (best effort) =====
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromAddress =
    Deno.env.get("CONTACT_FROM_ADDRESS") || "ECPHD Contact Form <onboarding@resend.dev>";

  let emailSent = false;
  let emailError: string | null = null;

  if (resendKey) {
    const html = `
      <h2>New ECPHD contact form submission</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || "—")}</td></tr>
        <tr><td><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:14px;">${escapeHtml(message)}</p>
      <hr/>
      <p style="color:#666;font-size:12px;font-family:Arial,sans-serif;">
        Submitted ${new Date().toISOString()} • Submission ID: ${inserted.id}
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
          subject: `[ECPHD Contact] ${subject}`,
          html,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        emailError = `Resend ${resp.status}: ${txt.slice(0, 500)}`;
        console.error("[submit-contact] resend error:", emailError);
      } else {
        emailSent = true;
      }
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e);
      console.error("[submit-contact] resend exception:", emailError);
    }
  } else {
    emailError = "RESEND_API_KEY not configured";
    console.warn("[submit-contact] " + emailError);
  }

  // Update the row with email status (best-effort, non-blocking failure)
  await supabase
    .from("contact_submissions")
    .update({ email_sent: emailSent, email_error: emailError })
    .eq("id", inserted.id);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
