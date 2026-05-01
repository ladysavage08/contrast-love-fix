import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { useSiteLink } from "@/hooks/useSiteLinks";
import { isExternalHref } from "@/lib/siteLinkValidation";

interface ManagedLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Stable key matching a row in the site_links table. */
  slug: string;
  /** Hardcoded fallback URL used when no active site_links row exists. */
  defaultHref: string;
  /** Default visible label / aria fallback. */
  defaultLabel?: string;
  /**
   * If provided, used as the visible content. Otherwise the managed/default
   * label is rendered. Use this when the visual content is icons/custom JSX
   * but you still want the URL + a11y label managed centrally.
   */
  children?: ReactNode;
  /**
   * Force open in a new tab. By default, http(s) URLs open in a new tab and
   * relative/tel/mailto stay in-page.
   */
  forceExternal?: boolean;
}

/**
 * Public-facing anchor whose URL & label can be overridden at runtime by an
 * admin via the Link Manager. Falls back to `defaultHref` / `defaultLabel`
 * when no managed row exists, so the live site never breaks.
 *
 * Safety:
 *  - external links automatically get target="_blank" + rel="noopener noreferrer"
 *  - aria-label always set with "(opens in new tab)" for external
 *  - children fall back to managed/default label for accessible link text
 */
const ManagedLink = forwardRef<HTMLAnchorElement, ManagedLinkProps>(
  (
    {
      slug,
      defaultHref,
      defaultLabel,
      children,
      forceExternal,
      "aria-label": ariaLabelProp,
      ...rest
    },
    ref,
  ) => {
    const { url, label } = useSiteLink(slug, {
      url: defaultHref,
      label: defaultLabel,
    });

    const external = forceExternal ?? isExternalHref(url);
    const visibleLabel = label || defaultLabel || "";
    const accessibleLabel =
      ariaLabelProp ??
      (external
        ? `${visibleLabel || "Link"} (opens in new tab)`
        : visibleLabel || undefined);

    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <a
        ref={ref}
        href={url}
        aria-label={accessibleLabel}
        {...externalProps}
        {...rest}
      >
        {children ?? visibleLabel}
        {external && !children && (
          <span className="sr-only"> (opens in new tab)</span>
        )}
      </a>
    );
  },
);
ManagedLink.displayName = "ManagedLink";

export default ManagedLink;
