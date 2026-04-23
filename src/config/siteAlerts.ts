/**
 * SITE-WIDE ALERT CONFIGURATION
 * =============================
 * This is the ONE place to edit the alert banner (top of every page) and the
 * pop-up modal alert. To change a message, toggle on/off, or switch presets,
 * edit the values below — no other file needs to change.
 *
 * Quick reference:
 *   - Turn the banner on/off:  banner.enabled = true | false
 *   - Turn the modal on/off:   modal.enabled  = true | false
 *   - Switch modal message:    modal.preset   = "standard" | "ada" | "custom"
 *   - Edit "custom" text below in MODAL_PRESETS.custom
 */

export type AlertButton = {
  label: string;
  href: string;
  /** If true, opens in a new tab (use for external links). */
  external?: boolean;
};

export type ModalPresetKey = "standard" | "ada" | "custom";

export type ModalContent = {
  title: string;
  message: string;
  button?: AlertButton;
};

// ---------------------------------------------------------------------------
// 1. TOP-OF-SITE BANNER
// ---------------------------------------------------------------------------
export const banner = {
  /** Master switch — set to false to hide the banner site-wide. */
  enabled: true,

  /**
   * Visual style:
   *   "info"    — blue, neutral announcements
   *   "warning" — amber, important notices (default for ADA / update)
   *   "alert"   — red, urgent / emergency
   */
  style: "warning" as "info" | "warning" | "alert",

  /** Short message shown inline. Keep it brief — long copy belongs in the modal. */
  message:
    "Website update in progress — some pages may look different. Need help? Call 706-721-5800.",

  /** Optional inline button. Set to undefined to hide it. */
  button: {
    label: "Contact Us",
    href: "/contact",
  } as AlertButton | undefined,

  /**
   * If true, the user can dismiss the banner for the current browser session.
   * Set to false for emergency / must-see notices.
   */
  dismissible: true,
};

// ---------------------------------------------------------------------------
// 2. POP-UP MODAL
// ---------------------------------------------------------------------------
export const MODAL_PRESETS: Record<ModalPresetKey, ModalContent> = {
  // ---- Standard website update notice (default) ----
  standard: {
    title: "Website Update Notice",
    message:
      "We are currently updating our website to improve accessibility and user experience. Some pages may look different or be temporarily unavailable.\n\nIf you need assistance, please call 706-721-5800 or visit our main site for additional resources.\n\nThank you for your patience as we continue working to better serve our community.",
    button: {
      label: "Contact Us",
      href: "/contact",
    },
  },

  // ---- ADA-focused / stronger version ----
  ada: {
    title: "Accessibility Update in Progress",
    message:
      "We are actively updating our website to meet accessibility standards and improve usability for all users. During this time, some content or features may be temporarily limited.\n\nIf you need assistance accessing any information or service, please call 706-721-5800. Our team is available to help ensure you receive the services you need.\n\nWe appreciate your patience as we work to improve accessibility for everyone.",
    button: {
      label: "Contact Us",
      href: "/contact",
    },
  },

  // ---- Free-form custom message — edit freely ----
  custom: {
    title: "Important Notice",
    message: "Replace this text with your custom message.",
    button: undefined,
  },
};

export const modal = {
  /** Master switch — set to false to disable the pop-up entirely. */
  enabled: true,

  /** Which preset above to show. */
  preset: "standard" as ModalPresetKey,

  /**
   * If true, the modal opens automatically once per browser session
   * (it will NOT reappear after the user closes it until they open a new tab).
   */
  showOnLoad: true,

  /** Delay before auto-opening, in milliseconds. */
  openDelayMs: 800,
};
