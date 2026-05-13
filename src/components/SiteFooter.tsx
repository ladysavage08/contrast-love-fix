import SocialIcons from "@/components/SocialIcons";
import ManagedLink from "@/components/ManagedLink";
import { useFooterContent } from "@/hooks/useFooterContent";

/**
 * Shared site footer — identical disclaimer + copyright across all pages.
 * - `showSocials`: render the social row above the disclaimer (used by Counties + WeGo).
 * - `extraCopy`: optional trailing copy appended to the © line. If omitted on
 *    WeGo-style pages, the editable `wegoExtraCopy` from the footer settings
 *    can be supplied by the caller using `useWegoExtraCopy`.
 *
 * All visible text + the accessibility link are sourced from `site_settings`
 * (key `footer_content`) so admins can edit them without a redeploy.
 *
 * Layout/markup is intentionally locked. Do not restyle.
 */
interface SiteFooterProps {
  showSocials?: boolean;
  extraCopy?: string;
}

const SiteFooter = ({ showSocials = false, extraCopy }: SiteFooterProps) => {
  const { content } = useFooterContent();

  return (
    <footer className="border-t border-border bg-muted">
      <div className="container py-6 text-sm text-muted-foreground">
        {showSocials && (
          <div className="mb-4 flex items-center gap-3">
            <SocialIcons size="md" wrap />
          </div>
        )}
        {content.disclaimer && (
          <p>
            <strong className="text-foreground">Disclaimer:</strong>{" "}
            {content.disclaimer}
          </p>
        )}
        <nav aria-label="Footer" className="mt-4">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <li>
              <ManagedLink
                slug="footer-accessibility"
                defaultHref="/accessibility"
                defaultLabel="Accessibility"
                className="font-medium text-primary underline underline-offset-2 hover:underline focus-visible:underline"
              />
            </li>
            {content.showAnnouncementLink && (
              <li>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("echd:open-site-alert"))
                  }
                  className="font-medium text-primary underline underline-offset-2 hover:underline focus-visible:underline"
                >
                  {content.announcementLinkLabel || "Show Announcement"}
                </button>
              </li>
            )}
            {content.contactPhone && (
              <li>
                <a
                  href={`tel:${content.contactPhone.replace(/[^0-9+]/g, "")}`}
                  className="font-medium text-primary underline underline-offset-2 hover:underline focus-visible:underline"
                >
                  {content.contactPhone}
                </a>
              </li>
            )}
            {content.contactEmail && (
              <li>
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="font-medium text-primary underline underline-offset-2 hover:underline focus-visible:underline"
                >
                  {content.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </nav>
        <p className="mt-2">
          © {new Date().getFullYear()} {content.copyright}
          {extraCopy ? ` ${extraCopy}` : ""}
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
