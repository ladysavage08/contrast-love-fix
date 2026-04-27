import { supabase } from "@/integrations/supabase/client";

type AuditEvent = "login_success" | "login_failed" | "admin_access";

export async function logAuditEvent(
  event_type: AuditEvent,
  details: { email?: string | null; user_id?: string | null; metadata?: Record<string, unknown> } = {},
) {
  try {
    await supabase.from("admin_audit_log").insert([
      {
        event_type,
        email: details.email ?? undefined,
        user_id: details.user_id ?? undefined,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        metadata: (details.metadata ?? {}) as never,
      },
    ]);
  } catch {
    // Never let logging break auth flow.
  }
}
