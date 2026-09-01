# CISA Security Testing Account (read-only, expiring)

Goal: give CISA an authenticated, clearly-labeled, time-limited login that can reach the admin-facing pages of ADA.ecphd.com without being able to change anything, see secrets, manage users, or read submitter PII. Existing admin and editor accounts are untouched.

## Approach

Reuse the existing role system (`user_roles` + `has_role`) rather than building a parallel one. Add one new role, `security_tester`, that is view-only, plus an expiry date on role assignments.

### 1. Database

- Add `security_tester` to the existing `app_role` list.
- Add a nullable `expires_at` column to `user_roles`. Existing rows stay `NULL` (never expire), so admin/editor behavior is unchanged.
- Update `has_role()` and `is_admin_or_editor()` to ignore rows whose `expires_at` has passed. This is the only change to existing functions and it is a no-op for current accounts.
- Add a `is_security_tester(uuid)` helper (security definer, expiry-aware).
- Add read-only policies for `security_tester` on exactly three tables: `hero_slides`, `site_links`, `site_settings`. No insert, update, or delete policies are added for this role anywhere.
- Deliberately NOT granted: `wego_event_requests` (submitter PII), `admin_audit_log`, `staff_directory` admin writes, `posts` writes, `contact_submissions` (already denied to everyone), `user_roles` management.

### 2. Application

- `useAdminAuth`: add `isSecurityTester` and a `canView` flag (`canManage || isSecurityTester`). `canManage` keeps its current meaning, so no existing write path changes.
- Admin route gates (`/admin`, `/admin/alerts`, `/admin/hero`, `/admin/links`, `/admin/content`, `/admin/footer`, `/admin/news`) switch their access check from `canManage` to `canView`; every save/delete/upload control on those pages is disabled when `!canManage`, and RLS blocks the write regardless.
- `/admin/wego-requests` stays gated on `canManage`, so the tester sees an access-denied redirect there (intentional, PII).
- The dashboard shows a persistent banner: "Temporary security testing account — read-only. Expires <date>."
- Audit log: entries from this account record `role: "security_tester"` in metadata, so its activity is distinguishable in `admin_audit_log`.

### 3. Account creation

- Create the user in the backend Users panel with a clearly labeled address, e.g. `security-testing@ecphd.com` (or an address you control that can receive the reset email).
- You set the password yourself via the reset flow — no password is written to code, chat, or the repository.
- Assign the `security_tester` role with an `expires_at` you choose (default suggestion: 30 days out).

## What you get at the end

- Login URL: `https://ada.ecphd.com/auth`, then the account lands on `/admin`.
- Permissions: read-only view of alerts, hero slides, site links, and site settings; no writes anywhere.
- Restricted: WeGo event requests, audit log, news/staff editing, user and role management, deletions, secrets, hosting, deployment, billing, and the Lovable/GitHub accounts (the test user has no access to any of those systems at all — it is a website login only).
- Disable instantly: delete the row in `user_roles` for that user, set its `expires_at` to a past date, or delete the user entirely in the backend Users panel. Any of the three cuts off admin access immediately.

## Notes

- The role change ships in the frontend bundle, so this requires one redeploy of the production package to ADA.ecphd.com before CISA can use it.
- Expiry is enforced server-side in the database functions, not just in the UI.
