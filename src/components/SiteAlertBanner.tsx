import { useEffect, useState } from "react";
import { X, Info, AlertTriangle, AlertOctagon } from "lucide-react";
import { banner } from "@/config/siteAlerts";

/**
 * Top-of-site alert banner. Reads everything from src/config/siteAlerts.ts.
 * Renders nothing when disabled or after the user dismisses it for the session.
 */
const STORAGE_KEY = "echd-banner-dismissed";

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

const SiteAlertBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banner.dismissible && sessionStorage.getItem(STORAGE_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (!banner.enabled || dismissed) return null;

  const Icon = ICONS[banner.style];
  const role = banner.style === "alert" ? "alert" : "status";

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
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
          {banner.button && (
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
};

export default SiteAlertBanner;
