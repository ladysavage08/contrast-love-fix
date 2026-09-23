import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink, X } from "lucide-react";

/**
 * Sitewide "you are leaving ECHD" notice.
 *
 * Mounted once in App. A capture-phase document click listener intercepts any
 * anchor that points at a host outside ecphd.com and shows an accessible
 * confirmation dialog before navigation happens.
 *
 * Opt a specific link out with `data-no-external-warning` on the anchor, or by
 * adding its exact URL to EXEMPT_URLS below. Whole domains are intentionally
 * never exempted.
 */

const INTERNAL_ROOT = "ecphd.com";

/** Exact URLs (not domains) that intentionally bypass the warning. */
const EXEMPT_URLS = new Set<string>([
  // Confidential condom request form
  "https://forms.cloud.microsoft/g/5avd7qg7TA",
  // HOPWA DocuSign application
  "https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=1194ecf0-9e51-45e5-8999-e4f9cdb5de48&env=na3&acct=bf407b1b-6cb7-4aa9-8071-158b99ee1247&v=2",
]);

const isInternalHost = (hostname: string) => {
  const host = hostname.toLowerCase();
  if (host === window.location.hostname.toLowerCase()) return true;
  return host === INTERNAL_ROOT || host.endsWith(`.${INTERNAL_ROOT}`);
};

const displayDomain = (hostname: string) => hostname.replace(/^www\./i, "");

interface Pending {
  href: string;
  domain: string;
  newTab: boolean;
}

const ExternalLinkInterstitial = () => {
  const [pending, setPending] = useState<Pending | null>(null);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Leave deliberate browser actions alone (new tab / new window / download)
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.hasAttribute("data-no-external-warning")) return;
      if (anchor.hasAttribute("download")) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;
      if (rawHref.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      // tel:, mailto:, javascript:, etc.
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (isInternalHost(url.hostname)) return;
      if (EXEMPT_URLS.has(url.href) || EXEMPT_URLS.has(rawHref)) return;

      event.preventDefault();
      triggerRef.current = anchor;
      setPending({
        href: url.href,
        domain: displayDomain(url.hostname),
        newTab: anchor.target === "_blank",
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const close = useCallback(() => {
    setPending(null);
    // Radix restores focus to the trigger it owns; we opened programmatically,
    // so return focus to the link the visitor actually clicked.
    const el = triggerRef.current;
    window.setTimeout(() => el?.focus?.(), 0);
  }, []);

  const handleContinue = useCallback(() => {
    if (!pending) return;
    const { href, newTab } = pending;
    setPending(null);
    if (newTab) {
      window.open(href, "_blank", "noopener,noreferrer");
      const el = triggerRef.current;
      window.setTimeout(() => el?.focus?.(), 0);
    } else {
      window.location.assign(href);
    }
  }, [pending]);

  return (
    <AlertDialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <AlertDialogContent className="max-w-lg">
        <button
          type="button"
          onClick={close}
          aria-label="Close this notice and stay on the East Central Health District website"
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <AlertDialogHeader className="pr-12 text-left">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
            <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>External Link Notice</span>
          </p>
          <AlertDialogTitle className="text-left text-xl font-bold">
            You&rsquo;re about to leave the East Central Health District website.
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-base leading-relaxed text-foreground">
            You will be directed to the{" "}
            <strong className="font-semibold">{pending?.domain}</strong> website. We do not control
            this website and do not guarantee the accessibility, accuracy, completeness, or
            timeliness of information contained there. We encourage you to review the site&rsquo;s
            privacy and accessibility policies, which may differ from those of the East Central
            Health District.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel className="mt-0 min-h-11 w-full sm:w-auto" onClick={close}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="min-h-11 w-full sm:w-auto" onClick={handleContinue}>
            Continue
            {pending?.newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExternalLinkInterstitial;
