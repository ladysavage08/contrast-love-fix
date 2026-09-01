# CISA Security Testing Account (read-only, server-enforced expiry)

A separate, clearly-labeled, time-limited website login for CISA authenticated testing. Read-only, enforced in the database (RLS), not in the UI. Existing admin and editor accounts are untouched.

## Page-to-table audit (verified in code)

| Page | Reads |
|---|---|
| `/admin` (dashboard) | `user_roles` (own row only) |
| `/admin/alerts` | `site_settings` |
| `/admin/hero` | `hero_slides` |
| `/admin/links` | `site_links` |
| `/admin/footer` | `site_settings` |
| `/admin/content` | no direct queries — a hub linking to the pages above |
| `/admin/news` | `posts` |
| `/admin/wego-requests` | `wego_event_requests` |
| `/directory` admin tools | `staff_directory` |

So the approved set (dashboard, alerts, hero, links, settings/footer) needs read access to exactly three tables: `site_settings`, `hero_slides`, `site_links`. `/admin/content` needs no grants at all.

Per your instruction not to grant permissions just to avoid an error, `/admin/news` stays **inaccessible** to the tester (it gates on `isAdmin` today and will keep doing so). `/admin/wego-requests` and the directory import tools likewise stay inaccessible.

## Database changes (one migration)

1. Add `security_tester` to the `app_role` list.
2. Add nullable `expires_at` to `user_roles`. Existing rows are `NULL` = never expires, so admin/editor behavior is unchanged. The date is set per assignment — you choose it based on CISA's window; no default is applied.
3. Update `has_role()` and `is_admin_or_editor()` to ignore rows whose `expires_at <= now()`. Both keep `SECURITY DEFINER`, `STABLE`, and `SET search_path = public`, and neither will ever return true for `security_tester` — `is_admin_or_editor` matches only `admin` and `editor` explicitly, so no inherited write rights are possible.
4. New `public.is_security_tester(uuid)` — `SECURITY DEFINER`, `STABLE`, `SET search_path = public`, execute granted to `authenticated` only (not `public`/`anon`), matching how the existing helpers were locked down.
5. Three new policies, all `FOR SELECT` only, all `TO authenticated`:
   - `site_settings`, `hero_slides`, `site_links` — `USING (public.is_security_tester(auth.uid()))`.
   No INSERT/UPDATE/DELETE policy is created for this role anywhere, so every write is rejected by RLS regardless of what the client sends.
6. Nothing granted on: `wego_event_requests`, `contact_submissions` (already denied to all clients), `admin_audit_log` (read stays admin-only; the existing insert-your-own-row policy lets the tester's activity be logged without letting it read the log), `staff_directory` writes, `posts` writes, `user_roles` management.

Expiry is evaluated inside these functions on every request, so an expired role loses access on the next database call even with a live browser session — nothing is cached in the JWT.

## Application changes (minimal)

- `src/hooks/useAdminAuth.ts` — also read `expires_at` when loading roles; add `isSecurityTester` (role present and not expired) and `canView = canManage || isSecurityTester`. `canManage` keeps its exact current meaning.
- `src/pages/Admin.tsx` — gate on `canView`; hide the WeGo Requests, News, Staff Directory, and Staff Import tiles when `!canManage`; render the persistent banner: **"Temporary CISA security testing account — READ ONLY — Expires [date]."**; record `role: "security_tester"` in the audit-log metadata for this account.
- `src/pages/AdminAlerts.tsx`, `AdminHero.tsx`, `AdminLinks.tsx`, `AdminFooter.tsx`, `AdminContent.tsx` — route gate changes from `canManage` to `canView`; save/delete/upload controls disabled when `!canManage` (convenience only — RLS is the actual control).
- `src/pages/AdminNews.tsx` and `AdminWegoRequests.tsx` — unchanged, still `canManage`/`isAdmin`, so the tester is redirected out.

No other files change. No schema or policy changes for admin/editor.

## Account setup

- Create the user in the backend Users panel as `cisa-security-testing@ecphd.com` (or an address you control that receives the reset email).
- You set the password yourself through the reset flow — it is never placed in code, chat, the repo, or the deployment package.
- Assign the role with the expiry you choose: one row in `user_roles` with `role = 'security_tester'` and your `expires_at`.

## Verification before deployment

I will sign in as the test account in the preview and confirm each item, reporting pass/fail:
- login at `/auth` works and `/admin` loads with the banner
- alerts, hero, links, footer, content pages render with real data
- save / edit / delete / upload all fail
- direct database write attempts as the tester role are rejected by RLS (tested at the API level, not just the UI)
- `/admin/wego-requests`, `/admin/news`, audit log, and role management are all denied
- setting `expires_at` to the past immediately removes `/admin` access
- an existing admin and an existing editor account still work normally

Then I'll report the exact files, migration, policies, and functions changed, and rebuild the Pair deployment package (one redeploy is required since the role logic ships in the frontend bundle).

## Removing the account

Any one of these cuts access immediately: delete the `user_roles` row, set its `expires_at` to a past timestamp, or delete the user in the backend Users panel.
