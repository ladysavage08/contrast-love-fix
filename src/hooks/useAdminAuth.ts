import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

export function useAdminAuth(): AdminAuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      // Defer role check to avoid recursion in auth callback
      if (s?.user) {
        setTimeout(() => {
          checkAdmin(s.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        checkAdmin(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    async function checkAdmin(userId: string) {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && !!data);
      setLoading(false);
    }

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user: session?.user ?? null, session, isAdmin, loading };
}
