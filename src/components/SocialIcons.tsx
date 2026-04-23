import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

/**
 * Shared social icon row — reused across home, about, counties, county, and wego pages.
 * `size` controls icon button dimensions while keeping markup/structure identical.
 *  - sm: 32px (default sidebar usage)
 *  - md: 36px (wego footer)
 *  - lg: 40-44px (sidebar "Stay Connected" blocks)
 */
type Size = "sm" | "md" | "lg";

const socials = [
  { name: "Facebook", href: "https://www.facebook.com/ECPHD", Icon: Facebook },
  { name: "X", href: "https://x.com/EastCentralPH", Icon: Twitter },
  { name: "YouTube", href: "https://www.youtube.com/@eastcentralhealthdistrict2885", Icon: Youtube },
  { name: "Instagram", href: "https://www.instagram.com/eastcentralhealth/", Icon: Instagram },
] as const;

const BUTTON_SIZE: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const ICON_SIZE: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

interface SocialIconsProps {
  size?: Size;
  /** Allow flex-wrap (used in wego footer). */
  wrap?: boolean;
}

const SocialIcons = ({ size = "sm", wrap = false }: SocialIconsProps) => (
  <ul className={`flex items-center gap-2 ${wrap ? "flex-wrap" : ""}`}>
    {socials.map(({ name, href, Icon }) => (
      <li key={name}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} (opens in new tab)`}
          className={`flex items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${BUTTON_SIZE[size]}`}
        >
          <Icon className={ICON_SIZE[size]} aria-hidden="true" />
        </a>
      </li>
    ))}
  </ul>
);

export default SocialIcons;
