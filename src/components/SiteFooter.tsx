import SocialIcons from "@/components/SocialIcons";

/**
 * Shared site footer — identical disclaimer + copyright across all pages.
 * - `showSocials`: render the social row above the disclaimer (used by Counties + WeGo).
 * - `extraCopy`: optional trailing copy appended to the © line (used by WeGo for clinic phone).
 *
 * Layout/markup is intentionally locked. Do not restyle.
 */
interface SiteFooterProps {
  showSocials?: boolean;
  extraCopy?: string;
}

const SiteFooter = ({ showSocials = false, extraCopy }: SiteFooterProps) => {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container py-6 text-sm text-muted-foreground">
        {showSocials && (
          <div className="mb-4 flex items-center gap-3">
            <SocialIcons size="md" wrap />
          </div>
        )}
        <p>
          <strong className="text-foreground">Disclaimer:</strong> Automatic
          translation services are provided but have not been fully vetted by
          ECHD staff.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} East Central Health District — Georgia
          Department of Public Health.{extraCopy ? ` ${extraCopy}` : ""}
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
