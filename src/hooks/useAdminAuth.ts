import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  canManage: boolean; // admin OR editor
  loading: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setTimeout(() => {
          checkRoles(s.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsEditor(false);
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

    async function checkRoles(userId: string) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error || !data) {
        setIsAdmin(false);
        setIsEditor(false);
      } else {
        const roles = data.map((r) => r.role);
        setIsAdmin(roles.includes("admin"));
        setIsEditor(roles.includes("editor"));
      }
      setLoading(false);
    }

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    user: session?.user ?? null,
    session,
    isAdmin,
    isEditor,
    canManage: isAdmin || isEditor,
    loading,
  };
}
