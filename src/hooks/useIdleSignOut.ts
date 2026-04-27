import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const IDLE_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Signs the user out after a period of inactivity. Only active when `enabled`.
 * Resets timer on user input events.
 */
export function useIdleSignOut(enabled: boolean, onSignOut?: () => void) {
  useEffect(() => {
    if (!enabled) return;
    let timer: number | undefined;

    const reset = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(async () => {
        await supabase.auth.signOut();
        onSignOut?.();
      }, IDLE_MS);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [enabled, onSignOut]);
}
