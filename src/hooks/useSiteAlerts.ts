import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  banner as defaultBanner,
  modal as defaultModal,
  MODAL_PRESETS,
  type AlertButton,
  type ModalPresetKey,
} from "@/config/siteAlerts";

export type BannerSettings = typeof defaultBanner & {
  /** ISO timestamps; if set, banner only shows inside this window. */
  startAt?: string | null;
  endAt?: string | null;
};
export type ModalSettings = typeof defaultModal & {
  titleOverride?: string;
  messageOverride?: string;
  buttonOverride?: AlertButton | undefined;
  startAt?: string | null;
  endAt?: string | null;
};

export type SiteAlertsSettings = {
  banner: BannerSettings;
  modal: ModalSettings;
};

export type SiteAlertsMeta = {
  updatedAt: string | null;
  updatedByEmail: string | null;
  status: "draft" | "published";
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

/** True if the current time is within the (optional) start/end window. */
export function isWithinWindow(startAt?: string | null, endAt?: string | null) {
  const now = Date.now();
  if (startAt) {
    const t = Date.parse(startAt);
    if (!Number.isNaN(t) && now < t) return false;
  }
  if (endAt) {
    const t = Date.parse(endAt);
    if (!Number.isNaN(t) && now > t) return false;
  }
  return true;
}

/**
 * Public hook: returns settings + meta + a derived `effective` view that
 * applies the scheduling window so consumers can just check `effective.banner.enabled`.
 */
export function useSiteAlerts() {
  const [settings, setSettings] = useState<SiteAlertsSettings>(DEFAULT_SETTINGS);
  const [meta, setMeta] = useState<SiteAlertsMeta>({
    updatedAt: null,
    updatedByEmail: null,
    status: "published",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("site_settings")
        .select("value, updated_at, updated_by_email, status")
        .eq("key", SITE_ALERTS_KEY)
        .maybeSingle();
      if (cancelled) return;
      if (data?.value) {
        const v = data.value as Partial<SiteAlertsSettings>;
        setSettings({
          banner: { ...DEFAULT_SETTINGS.banner, ...(v.banner ?? {}) },
          modal: { ...DEFAULT_SETTINGS.modal, ...(v.modal ?? {}) },
        });
        setMeta({
          updatedAt: (data as any).updated_at ?? null,
          updatedByEmail: (data as any).updated_by_email ?? null,
          status: ((data as any).status ?? "published") as "draft" | "published",
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

  // Apply the scheduling window + draft gate so the public site honors them
  // without every consumer re-implementing the check.
  const effective = useMemo<SiteAlertsSettings>(() => {
    const isDraft = meta.status === "draft";
    const bannerInWindow = isWithinWindow(settings.banner.startAt, settings.banner.endAt);
    const modalInWindow = isWithinWindow(settings.modal.startAt, settings.modal.endAt);
    return {
      banner: { ...settings.banner, enabled: settings.banner.enabled && !isDraft && bannerInWindow },
      modal: { ...settings.modal, enabled: settings.modal.enabled && !isDraft && modalInWindow },
    };
  }, [settings, meta.status]);

  return { settings: effective, rawSettings: settings, meta, loaded };
}
