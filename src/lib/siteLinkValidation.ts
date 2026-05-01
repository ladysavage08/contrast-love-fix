import { z } from "zod";

/**
 * URL/href validation for the Link Manager.
 * Allowed:
 *  - Absolute http(s) URLs
 *  - Site-relative paths starting with "/"
 *  - tel: and mailto: schemes
 *  - Hash anchors starting with "#"
 */
const HREF_REGEX = /^(https?:\/\/[^\s]+|\/[^\s]*|tel:[^\s]+|mailto:[^\s]+|#[^\s]*)$/i;

export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

export const siteLinkSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug must be 80 characters or fewer")
    .regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only"),
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(120, "Label must be 120 characters or fewer"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2000, "URL is too long")
    .regex(
      HREF_REGEX,
      "Must be a full URL (https://…), a site path (/path), tel:, mailto:, or #anchor",
    ),
  location: z
    .string()
    .trim()
    .max(160, "Location must be 160 characters or fewer")
    .optional()
    .or(z.literal("")),
  active: z.boolean(),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

export type SiteLinkInput = z.infer<typeof siteLinkSchema>;

/** True when the href points to a different site (and should open in a new tab safely). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
