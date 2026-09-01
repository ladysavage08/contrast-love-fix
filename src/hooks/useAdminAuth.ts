import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  canManage: boolean; // admin OR editor (write-capable)
  isSecurityTester: boolean; // temporary read-only testing account
  securityTesterExpiresAt: string | null;
  canView: boolean; // canManage OR active security tester (read-only)
  loading: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isSecurityTester, setIsSecurityTester] = useState(false);
  const [securityTesterExpiresAt, setSecurityTesterExpiresAt] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => {
          checkRoles(s.user.id);
        }, 0);
      } else {
        resetRoles();
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        checkRoles(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    function resetRoles() {
      setIsAdmin(false);
      setIsEditor(false);
      setIsSecurityTester(false);
      setSecurityTesterExpiresAt(null);
    }

    async function checkRoles(userId: string) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role, expires_at")
        .eq("user_id", userId);
      if (error || !data) {
        resetRoles();
      } else {
        const now = Date.now();
        // Expiry is authoritative server-side (RLS functions); this mirrors it
        // in the UI so expired accounts don't see an admin shell.
        const active = data.filter(
          (r) =>
            !r.expires_at || new Date(r.expires_at as string).getTime() > now,
        );
        const roles = active.map((r) => r.role as string);
        setIsAdmin(roles.includes("admin"));
        setIsEditor(roles.includes("editor"));
        const tester = active.find((r) => r.role === "security_tester");
        setIsSecurityTester(!!tester);
        setSecurityTesterExpiresAt((tester?.expires_at as string | null) ?? null);
      }
      setLoading(false);
    }

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const canManage = isAdmin || isEditor;

  return {
    user: session?.user ?? null,
    session,
    isAdmin,
    isEditor,
    canManage,
    isSecurityTester,
    securityTesterExpiresAt,
    canView: canManage || isSecurityTester,
    loading,
  };
}
