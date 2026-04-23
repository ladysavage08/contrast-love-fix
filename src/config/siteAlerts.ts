/**
 * ============================================================================
 * SITE-WIDE ALERT CONFIGURATION  (edit this file — and ONLY this file)
 * ============================================================================
 *
 * This is the single source of truth for:
 *   1. The thin ALERT BANNER at the top of every page
 *   2. The pop-up MODAL that can appear when the site loads
 *
 * Non-developer quick guide:
 *   - To turn the banner ON or OFF .........  edit  banner.enabled
 *   - To change the banner text ............  edit  banner.message
 *   - To change the banner button ..........  edit  banner.button
 *   - To turn the modal ON or OFF ..........  edit  modal.enabled
 *   - To change which modal message shows ..  edit  modal.preset
 *   - To change modal text/title/button ....  edit  MODAL_PRESETS below
 *   - To auto-open the modal on page load ..  edit  modal.showOnLoad
 *   - To change auto-open delay ............  edit  modal.openDelaySeconds
 *
 * After saving this file the site picks up the change automatically.
 * No other file needs to be touched.
 * ============================================================================
 */

// ----- Shared types (you do NOT need to edit anything in this block) --------
export type AlertButton = {
  /** Visible text on the button, e.g. "Contact Us" */
  label: string;
  /** Where the button goes, e.g. "/contact" or "https://example.com" */
  href: string;
  /** true = open in a new tab (use for external links) */
  external?: boolean;
};

export type ModalPresetKey = "standard" | "ada" | "emergency" | "event" | "custom";

export type ModalContent = {
  title: string;
  /** Use a blank line ( \n\n ) to start a new paragraph. */
  message: string;
  /** Optional. Set to undefined to hide the action button. */
  button?: AlertButton;
};

// ============================================================================
// 1) TOP-OF-SITE ALERT BANNER
// ============================================================================
//   Use this for short, always-visible notices (1 sentence works best).
//   For longer announcements, use the modal below.
// ----------------------------------------------------------------------------
export const banner = {
  /** MASTER SWITCH — true shows the banner, false hides it everywhere. */
  enabled: true,

  /**
   * Visual style:
   *   "info"    — blue, neutral announcements (e.g. event reminder)
   *   "warning" — amber, important notices  (e.g. website update, ADA)
   *   "alert"   — red, urgent / emergency   (e.g. closure, outage)
   */
  style: "warning" as "info" | "warning" | "alert",

  /** The text shown in the banner. Keep it short. */
  message:
    "Website update in progress — some pages may look different. Need help? Call 706-721-5800.",

  /**
   * Optional button on the right side of the banner.
   * Set to `undefined` to hide the button entirely.
   */
  button: {
    label: "Contact Us",
    href: "/contact",
    // external: true,   // <- uncomment to open in a new tab
  } as AlertButton | undefined,

  /**
   * true  — visitors can close the banner (it stays closed for that browser tab)
   * false — banner cannot be dismissed (use for emergencies / must-see notices)
   */
  dismissible: true,
};

// ============================================================================
// 2) POP-UP MODAL — message library
// ============================================================================
//   Each entry below is a ready-to-use modal. Switch between them by changing
//   `modal.preset` further down. You can also edit any preset's text directly.
//
//   To add a new type of notice (e.g. "service-interruption"), copy one of
//   the entries, give it a new key, and add the same key to ModalPresetKey
//   at the top of this file.
// ----------------------------------------------------------------------------
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

  // ---- ADA / accessibility-focused version ----
  ada: {
    title: "Accessibility Update in Progress",
    message:
      "We are actively updating our website to meet accessibility standards and improve usability for all users. During this time, some content or features may be temporarily limited.\n\nIf you need assistance accessing any information or service, please call 706-721-5800. Our team is available to help ensure you receive the services you need.\n\nWe appreciate your patience as we work to improve accessibility for everyone.",
    button: {
      label: "Contact Us",
      href: "/contact",
    },
  },

  // ---- Emergency closure / service interruption ----
  emergency: {
    title: "Service Interruption Notice",
    message:
      "Due to unforeseen circumstances, some of our services may be temporarily unavailable.\n\nFor urgent assistance, please call 706-721-5800. We will update this notice as soon as services resume.\n\nThank you for your patience.",
    button: {
      label: "Call 706-721-5800",
      href: "tel:7067215800",
    },
  },

  // ---- Event or campaign announcement ----
  event: {
    title: "Upcoming Community Event",
    message:
      "Join the East Central Health District for an upcoming community event.\n\nLearn more about the date, time, and location on our events page.",
    button: {
      label: "View Events",
      href: "/calendar",
    },
  },

  // ---- Free-form custom message — edit freely ----
  custom: {
    title: "Important Notice",
    message: "Replace this text with your custom message.",
    button: undefined, // set to { label: "...", href: "..." } to show a button
  },
};

// ============================================================================
// 3) POP-UP MODAL — settings
// ============================================================================
export const modal = {
  /** MASTER SWITCH — true enables the pop-up, false disables it everywhere. */
  enabled: true,

  /**
   * Which message from MODAL_PRESETS above to display.
   * Allowed values: "standard" | "ada" | "emergency" | "event" | "custom"
   */
  preset: "standard" as ModalPresetKey,

  /**
   * true  — modal opens automatically once per browser session
   *         (it will NOT reappear after the user closes it until they open
   *          a new tab/window)
   * false — modal will not auto-open (you can still trigger it manually)
   */
  showOnLoad: true,

  /**
   * How long to wait before auto-opening the modal, in SECONDS.
   * Example: 0.8 = wait about 0.8 seconds after the page loads.
   */
  openDelaySeconds: 0.8,

  /**
   * Advanced: same delay expressed in milliseconds.
   * Leave this alone unless you specifically need millisecond precision.
   * If both are set, openDelaySeconds wins.
   */
  openDelayMs: 800,
};
