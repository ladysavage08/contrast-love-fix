import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, AlertOctagon } from "lucide-react";
import { useSiteAlerts, type BannerSettings } from "@/hooks/useSiteAlerts";

/**
 * Top-of-site alert banner(s). Reads settings from the database. Supports
 * an optional secondary banner stacked above the primary one — each is
 * dismissible independently and can be toggled/scheduled separately.
 */
const STORAGE_KEY_PRIMARY = "echd-banner-dismissed";
const STORAGE_KEY_SECONDARY = "echd-banner-secondary-dismissed";

const STYLE_CLASSES = {
  info: "bg-primary text-primary-foreground border-b border-primary",
  warning: "bg-accent text-accent-foreground border-b border-accent",
  alert: "bg-destructive text-destructive-foreground border-b border-destructive",
} as const;

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  alert: AlertOctagon,
} as const;

function BannerRow({ banner, storageKey }: { banner: BannerSettings; storageKey: string }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banner.dismissible && sessionStorage.getItem(storageKey) === "1") {
      setDismissed(true);
    }
  }, [banner.dismissible, storageKey]);

  if (!banner.enabled || dismissed || !banner.message?.trim()) return null;

  const Icon = ICONS[banner.style];
  const role = banner.style === "alert" ? "alert" : "status";

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, "1");
    setDismissed(true);
  };

  return (
    <div
      role={role}
      aria-live={banner.style === "alert" ? "assertive" : "polite"}
      className={STYLE_CLASSES[banner.style]}
    >
      <div className="container flex flex-col items-start gap-2 py-2.5 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-1 items-start gap-2 text-sm sm:items-center">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" aria-hidden="true" />
          <p className="leading-snug">{banner.message}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {banner.button && banner.button.label && banner.button.href && (
            <a
              href={banner.button.href}
              {...(banner.button.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="rounded border border-current px-3 py-1 text-xs font-semibold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              {banner.button.label}
            </a>
          )}
          {banner.dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss notice"
              className="rounded p-1 hover:bg-background/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const SiteAlertBanner = () => {
  const { settings } = useSiteAlerts();
  return (
    <>
      {settings.secondaryBanner && (
        <BannerRow banner={settings.secondaryBanner} storageKey={STORAGE_KEY_SECONDARY} />
      )}
      <BannerRow banner={settings.banner} storageKey={STORAGE_KEY_PRIMARY} />
    </>
  );
};

export default SiteAlertBanner;
