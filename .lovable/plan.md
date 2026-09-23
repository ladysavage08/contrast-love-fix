# Sitewide External Link Warning

A single pop-up notice appears whenever someone clicks a link that leaves the ECHD website. It works everywhere automatically, including links added in the future, with no per-link setup.

## What visitors see

A centered pop-up over the current page:

- Heading: "You're about to leave the East Central Health District website."
- Message: "You will be directed to the [destination domain] website. We do not control this website and do not guarantee the accessibility, accuracy, completeness, or timeliness of information contained there. We encourage you to review the site's privacy and accessibility policies, which may differ from those of the East Central Health District."
- The domain is filled in automatically from the link that was clicked (for example `dph.georgia.gov`).
- Buttons: **Continue** (goes to the outside site) and **Cancel** (stays put), plus an **X** in the upper-right corner.
- Styled with the existing ECHD colors, buttons, and typography — same look as the other pop-ups on the site.

## When it appears

Appears for any link whose address is on a different website than ecphd.com — including PDFs and documents hosted elsewhere.

Never appears for:

- Links inside the ECHD site, including all ecphd.com addresses such as archive.ecphd.com
- Jump links to a spot on the same page
- Phone (`tel:`) and email (`mailto:`) links
- Buttons and controls that aren't links
- Files hosted on our own site

Skipped by request for a small set of service links where an extra step could cause people to abandon the task:

- The confidential condom request form (forms.cloud.microsoft)
- The HOPWA DocuSign apply button

## Behavior details

- The clicked address is stored exactly as-is; Continue opens that exact address (in a new tab if the link was set to open in one).
- Cancel, X, or the Esc key discards it and keeps the visitor where they were.
- Middle-click, Ctrl/Cmd-click, and right-click "open in new tab" are left alone, as those are deliberate browser actions.

## Accessibility

- Proper dialog semantics (`role="dialog"`, `aria-modal="true"`) with an accessible title and description tied to the heading and message.
- Focus moves into the pop-up on open, stays trapped inside while open, and returns to the original link on Cancel/X/Esc.
- Background page is inert and not scrollable while open.
- Visible focus outlines, ECHD-contrast-compliant text, and distinct button labels and shapes so nothing depends on color alone.
- Responsive: full-width-with-margins layout and stacked buttons on phones.

## Technical notes

- New `src/components/ExternalLinkInterstitial.tsx` built on the existing shadcn `AlertDialog` (Radix handles focus trap, Esc, aria-modal, and background inertness).
- Mounted once inside `BrowserRouter` in `src/App.tsx`, next to `SiteAlertModal`, so it covers every route.
- A document-level capture-phase `click` listener resolves `event.target.closest("a[href]")`, parses the href against `window.location.origin`, and opens the dialog only when the protocol is http/https and the hostname is not `ecphd.com` or a `*.ecphd.com` subdomain. Skips when `defaultPrevented`, when modifier keys or non-primary buttons are used, or when the link carries a `data-no-external-warning` attribute.
- Domain shown in the message is `url.hostname` with a leading `www.` stripped.
- Continue calls `window.open(href, target)` for `target="_blank"` links (with `noopener,noreferrer`) or `window.location.assign(href)` otherwise, using the stored href verbatim.
- Allow-list constant holds the two skipped hosts (`forms.cloud.microsoft`, `*.docusign.net`); `data-no-external-warning` is available for future opt-outs.
- Focus return uses the stored `HTMLAnchorElement` reference on close.
