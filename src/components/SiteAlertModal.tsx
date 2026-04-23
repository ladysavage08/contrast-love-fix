import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { modal, MODAL_PRESETS } from "@/config/siteAlerts";

/**
 * Pop-up modal alert. Opens once per browser session when enabled.
 * Reads all content from src/config/siteAlerts.ts (preset + toggle).
 * Radix Dialog handles focus trap, ESC key, and ARIA roles automatically.
 */
const STORAGE_KEY = "echd-modal-shown";

const SiteAlertModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!modal.enabled || !modal.showOnLoad) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const delayMs =
      typeof modal.openDelaySeconds === "number"
        ? Math.max(0, modal.openDelaySeconds * 1000)
        : modal.openDelayMs ?? 0;

    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, delayMs);

    return () => clearTimeout(t);
  }, []);

  if (!modal.enabled) return null;

  const content = MODAL_PRESETS[modal.preset];
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
