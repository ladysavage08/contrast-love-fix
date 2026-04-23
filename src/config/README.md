# Site Alerts — How to Edit

All banner and pop-up modal text/settings live in **one file**:

```
src/config/siteAlerts.ts
```

You do **not** need to edit any other file to change a notice.

---

## What lives where

| File | Purpose | Edit it? |
|---|---|---|
| `src/config/siteAlerts.ts` | All editable text, on/off switches, button links, timing | ✅ Yes — this is the only file you edit |
| `src/components/SiteAlertBanner.tsx` | Renders the top-of-page banner using the config | ❌ No |
| `src/components/SiteAlertModal.tsx` | Renders the pop-up modal using the config | ❌ No |
| `src/App.tsx` | Mounts the banner + modal site-wide (already wired) | ❌ No |

---

## Common tasks

### Turn the banner ON or OFF
Open `siteAlerts.ts` → find `banner.enabled` → set `true` or `false`.

### Change the banner message or button
Open `siteAlerts.ts` → edit `banner.message`, `banner.button.label`, `banner.button.href`.
To hide the button entirely, set `banner.button: undefined`.

### Turn the pop-up modal ON or OFF
Open `siteAlerts.ts` → find `modal.enabled` → set `true` or `false`.

### Switch which message the modal shows
Open `siteAlerts.ts` → change `modal.preset` to one of:
- `"standard"` — default website update notice
- `"ada"` — accessibility-focused notice
- `"emergency"` — service interruption / closure
- `"event"` — community event / campaign
- `"custom"` — your own free-form message

### Edit the text of any preset
Scroll to `MODAL_PRESETS` in `siteAlerts.ts` and edit the `title`, `message`, or `button` for the preset you're using. Use `\n\n` to start a new paragraph.

### Stop the modal from auto-popping
Set `modal.showOnLoad: false`.

### Change how long before the modal appears
Set `modal.openDelaySeconds` (e.g. `0.8`, `2`, `5`).

### Add a brand-new notice type (e.g. "service-interruption")
1. In `siteAlerts.ts`, add the key to `ModalPresetKey`:
   ```ts
   export type ModalPresetKey =
     "standard" | "ada" | "emergency" | "event" | "custom" | "service-interruption";
   ```
2. Add a matching entry inside `MODAL_PRESETS` with `title`, `message`, and an optional `button`.
3. Set `modal.preset: "service-interruption"` to use it.

---

## Accessibility (already built in)

- **Banner**: uses `role="status"` (or `role="alert"` for the red style), keyboard-focusable dismiss button, semantic icon, and a tap target large enough for mobile.
- **Modal**: built on Radix Dialog — automatic focus trap, ESC-to-close, visible close button, ARIA title/description, body-scroll locking, and full keyboard support.
- **Contrast**: both components use the site's design tokens (`primary`, `accent`, `destructive`) so they inherit the ADA-conscious palette defined in `src/index.css`.
- **Session memory**: once a visitor closes the banner or the modal, it stays closed for the rest of that browser tab — they aren't nagged on every page change.

---

## Deploying changes

After editing `siteAlerts.ts`:

1. The Lovable preview updates instantly — confirm the banner/modal look right.
2. Build for Pair: `npm run build` → upload the contents of `dist/` to your web root.
3. No database, asset, or routing changes are needed for alert edits.
