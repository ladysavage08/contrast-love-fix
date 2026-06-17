import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FOOTER_CONTENT_KEY = "footer_content";

export type FooterContent = {
  disclaimer: string;
  contactPhone: string;
  contactEmail: string;
  /** Extra copyright addendum displayed on WeGo pages. */
  wegoExtraCopy: string;
  showAnnouncementLink: boolean;
  announcementLinkLabel: string;
  copyright: string;
};

export const DEFAULT_FOOTER: FooterContent = {
  disclaimer:
    "Automatic translation services are provided but have not been fully vetted by ECHD staff.",
  contactPhone: "706-721-5800",
  contactEmail: "",
  wegoExtraCopy: "Mobile Health Clinic: 1-877-884-WEGO",
  showAnnouncementLink: true,
  announcementLinkLabel: "Show Announcement",
  copyright:
    "East Central Health District — Georgia Department of Public Health.",
};

export type FooterMeta = {
  updatedAt: string | null;
  updatedByEmail: string | null;
};

/** Read footer content from site_settings with realtime updates. */
export function useFooterContent() {
  const [content, setContent] = useState<FooterContent>(DEFAULT_FOOTER);
  const [meta, setMeta] = useState<FooterMeta>({ updatedAt: null, updatedByEmail: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("value, updated_at")
        .eq("key", FOOTER_CONTENT_KEY)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value) {
        setContent({ ...DEFAULT_FOOTER, ...(data.value as Partial<FooterContent>) });
        setMeta({
          updatedAt: (data as any).updated_at ?? null,
          updatedByEmail: null,
        });
      }
      setLoaded(true);
    }
    load();

    const channel = supabase
      .channel(`site_settings_footer_${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: `key=eq.${FOOTER_CONTENT_KEY}`,
        },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { content, meta, loaded };
}
