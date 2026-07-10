
## Root cause (confirmed)

The runtime code is fully dynamic: `useSiteAlerts` fetches `site_settings` on every mount, subscribes to realtime, and applies the schedule window. `SiteAlertBanner` renders both `secondaryBanner` and `banner` from that live data. The DB row already has `secondaryBanner` enabled inside its window.

The only reason it doesn't appear on the live site is that **the currently deployed production JS predates the secondary-banner code** (added after the last `bun run package` upload). The deployed bundle simply has no code path that reads `secondaryBanner` — no admin toggle can fix that. Both hosts point at the same backend (`bqrzsvipbbrtfxpbjsjg`), so it's purely a stale-bundle problem, not env or caching.

After a one-time redeploy of the current code to both hosts, every future admin edit (enable/disable, message, schedule) will update the live site instantly with no rebuild, exactly like the primary banner does today.

## Plan

No source code changes. Two one-time deployments:

1. **Lovable published URL** (`contrast-love-fix.lovable.app`)
   - Run a security scan, then call `preview_ui--publish` to push the current code. Lovable rebuilds automatically.

2. **Pair-hosted domain**
   - Run `bun run package` in the sandbox to produce `echd-pair-deploy.zip`.
   - Report the sandbox path so you can download the zip and upload its contents to the Pair web root (replacing `index.html`, `assets/`, `.htaccess`, per `PAIR_DEPLOYMENT.md`).
   - Delete the zip from the repo afterward (10 MB repo limit).

3. **Verify on each live host**
   - Hard-refresh, confirm both banners render.
   - Toggle `secondaryBanner.enabled` off in `/admin/alerts` and confirm it disappears within seconds with no further deploy — proving the dynamic pipeline works end-to-end for the secondary banner from now on.

## What will NOT change

- No edits to `SiteAlertBanner.tsx`, `useSiteAlerts.ts`, `AdminAlerts.tsx`, `site_settings`, or any unrelated page.
- No service worker, no static banner JSON, no hardcoded banner content is introduced.
- Primary banner behavior is untouched.
