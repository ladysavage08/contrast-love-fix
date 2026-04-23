import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  banner as defaultBanner,
  modal as defaultModal,
  MODAL_PRESETS,
  type AlertButton,
  type ModalPresetKey,
} from "@/config/siteAlerts";

export type BannerSettings = typeof defaultBanner;
export type ModalSettings = typeof defaultModal & {
  /** Optional inline overrides for the active preset. */
  titleOverride?: string;
  messageOverride?: string;
  buttonOverride?: AlertButton | undefined;
};

export type SiteAlertsSettings = {
  banner: BannerSettings;
  modal: ModalSettings;
};

export const SITE_ALERTS_KEY = "site_alerts";

export const DEFAULT_SETTINGS: SiteAlertsSettings = {
  banner: defaultBanner,
  modal: defaultModal,
};

/** Resolve the modal content (preset + any inline overrides). */
export function resolveModalContent(modal: ModalSettings) {
  const base = MODAL_PRESETS[modal.preset as ModalPresetKey] ?? MODAL_PRESETS.standard;
  return {
    title: modal.titleOverride?.trim() ? modal.titleOverride : base.title,
    message: modal.messageOverride?.trim() ? modal.messageOverride : base.message,
    button:
      modal.buttonOverride === null
        ? undefined
        : modal.buttonOverride ?? base.button,
  };
}

/** Public hook used by the banner + modal components. Reads from DB, falls back to file. */
export function useSiteAlerts() {
  const [settings, setSettings] = useState<SiteAlertsSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", SITE_ALERTS_KEY)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value) {
        const v = data.value as Partial<SiteAlertsSettings>;
        setSettings({
          banner: { ...DEFAULT_SETTINGS.banner, ...(v.banner ?? {}) },
          modal: { ...DEFAULT_SETTINGS.modal, ...(v.modal ?? {}) },
        });
      }
      setLoaded(true);
    }
    load();

    const channel = supabase.channel(`site_settings_alerts_${Math.random().toString(36).slice(2)}`);
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings", filter: `key=eq.${SITE_ALERTS_KEY}` },
        () => load(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loaded };
}
