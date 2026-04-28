import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HeroSlide = {
  id: string;
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  image_url: string | null;
  image_alt: string;
  focal: string | null;
  display_order: number;
  enabled: boolean;
};

/**
 * Fetches enabled hero slides ordered by display_order.
 * Returns { slides, loading, error }. Caller decides whether to fall back
 * to defaults when slides is empty.
 */
export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("hero_slides")
        .select(
          "id, eyebrow, title, subtitle, cta_label, cta_href, secondary_cta_label, secondary_cta_href, image_url, image_alt, focal, display_order, enabled"
        )
        .eq("enabled", true)
        .order("display_order", { ascending: true });

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setSlides([]);
      } else {
        setSlides((data ?? []) as HeroSlide[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { slides, loading, error };
}
