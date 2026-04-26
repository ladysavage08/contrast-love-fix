import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSiteAlerts, resolveModalContent } from "@/hooks/useSiteAlerts";

/**
 * Pop-up modal alert. Reads settings from the database (with the
 * src/config/siteAlerts.ts file as a fallback default).
 *
 * Behavior:
 * - Shows ONLY on the homepage ("/")
 * - Shows ONCE per browser session (uses sessionStorage)
 * - Does NOT re-trigger on SPA navigation or refresh within the same session
 * - Can be manually re-opened via the global `echd:open-site-alert` event
 */
const STORAGE_KEY = "siteAlertModalShown";

const SiteAlertModal = () => {
  const { settings, loaded } = useSiteAlerts();
  const modal = settings.modal;
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Auto-open: only on homepage, only once per session.
  useEffect(() => {
    if (!loaded) return;
    if (location.pathname !== "/") return;
    if (!modal.enabled || !modal.showOnLoad) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "true") return;

    const delayMs =
      typeof modal.openDelaySeconds === "number"
        ? Math.max(0, modal.openDelaySeconds * 1000)
        : modal.openDelayMs ?? 0;

    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, delayMs);

    return () => clearTimeout(t);
  }, [loaded, location.pathname, modal.enabled, modal.showOnLoad, modal.openDelaySeconds, modal.openDelayMs]);

  // Manual re-open via custom event (e.g., footer "Show Announcement" link).
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("echd:open-site-alert", handler);
    return () => window.removeEventListener("echd:open-site-alert", handler);
  }, []);

  if (!modal.enabled) return null;

  const content = resolveModalContent(modal);
  const paragraphs = content.message.split("\n\n").filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Important site notice
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {content.button && (
            <Button asChild>
              <a
                href={content.button.href}
                {...(content.button.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {content.button.label}
              </a>
            </Button>
          )}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SiteAlertModal;
