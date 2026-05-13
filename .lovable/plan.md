## Goal

Make the existing admin-editable content (Alerts, Hero, Footer links, WeGo Schedule) reliable, dynamic, and **redeploy-free**, then layer on draft/preview, scheduling, audit fields, validation, and section toggles. Programs and Counties stay hard-coded for now.

## Audit findings

| Area | Today | Status |
|---|---|---|
| Alert banner + modal | DB row in `site_settings` (key `site_alerts`); read live by `useSiteAlerts` with realtime subscription; falls back to `src/config/siteAlerts.ts` only if the row is missing | Wired correctly. Needs scheduling windows, audit fields, link validation. |
| Homepage hero | DB table `hero_slides` with admin CRUD at `/admin/hero`; consumed by `useHeroSlides` → `HeroSlider` | Wired correctly. Needs draft/preview, audit fields, validation. |
| Site links / CTAs | DB table `site_links` consumed via `useSiteLinks` + `<ManagedLink>`; admin at `/admin/links`. **Table is currently empty (0 rows)** so every `<ManagedLink>` falls back to its hard-coded default. | Plumbing is fine. We need to seed the rows that already exist as `<ManagedLink slug="...">` defaults so admin edits actually apply. |
| Footer | `SiteFooter.tsx` has a hard-coded `/accessibility` link, hard-coded disclaimer, and hard-coded "Show Announcement" label. Phone shown on WeGo footer is passed in as a prop literal. | Migrate to `site_links` (link slugs) + a new `site_settings` key `footer_content` for editable copy (disclaimer, contact phone, contact email). |
| WeGo schedule | DB-driven via `posts` table (`post_type='event'`, category "Mobile Clinic"); admin at `/admin/news`; `WegoSchedule.tsx` reads via `useEvents`. Static `wegoSchedule.ts` only supplies type definitions + helpers, no event data. | Wired correctly. Add a clearly-labeled "Mobile Clinic Schedule" entry point in admin and surface draft/published + last-updated, plus the existing `cancelled` flag. |
| Programs / Counties | Still imported from `src/data/programs.ts` and `src/data/counties.ts`. | **Out of scope this round** per user. |

## Plan

### 1. Database changes (one migration)

Add to `site_settings`:
- New key `footer_content` → `{ disclaimer, contactPhone, contactEmail, showAnnouncementLink }`.

Extend `site_settings` row shape to track audit:
- New columns `updated_by_email text`, `status text default 'published' check (status in ('draft','published'))`, `draft_value jsonb`.
- `updated_at` already exists.

Extend `hero_slides`:
- `status text default 'published' check (status in ('draft','published'))`
- `updated_by_email text`
- `start_at timestamptz`, `end_at timestamptz` (optional scheduling)

Extend `site_links`:
- `updated_by_email text`
- (already has `active`, `updated_at`)

Add to alert payload (stored in JSON, no schema change):
- `banner.startAt`, `banner.endAt`
- `modal.startAt`, `modal.endAt`

Seed `site_links` with the slugs already referenced by `<ManagedLink>` so admin edits begin to apply (current defaults become the seeded `url`).

RLS: keep current model — public reads `active=true` / `published=true` / non-draft rows; admin + editor (via `is_admin_or_editor`) can write. Update policies to allow editors, not just admins, to write to `site_settings`, `hero_slides`, `site_links` (today only admins can).

### 2. Public site reads (make sure nothing renders stale fallbacks)

- `useSiteAlerts`: filter out banner/modal when `enabled=false` OR current time is outside `startAt`/`endAt`.
- `useHeroSlides`: filter `status='published'` AND in window.
- `<ManagedLink>`: already prefers DB; keep hard-coded default only as a last-resort fallback. After seeding, the DB always wins.
- `SiteFooter`: read `footer_content` from `site_settings` via a new `useFooterContent` hook; remove hard-coded disclaimer / accessibility label / phone literal.
- `WegoSchedule`: already DB-driven — no change beyond confirming `published=true` and not-`cancelled` filtering.

### 3. Admin portal — Site Content Manager

Add a new dashboard tile **Site Content Manager** at `/admin/content` that links to:
- Alerts (existing `/admin/alerts`) — add Start/End date pickers for banner + modal, status pill, last-updated row.
- Hero slides (existing `/admin/hero`) — add Draft/Published toggle per slide, scheduling window, validation (image URL reachable, required fields).
- Site links (existing `/admin/links`) — add link validation (URL parses, optional HEAD probe with timeout), warn on empty/broken, show last-updated-by.
- Footer content (new `/admin/footer`) — edit disclaimer, contact phone, contact email, accessibility link label, "Show Announcement" toggle.
- Mobile Clinic Schedule (new shortcut to `/admin/news?type=event&category=Mobile+Clinic`) — opens existing news editor pre-filtered to clinic events, with cancel/uncancel + draft toggle visible.

Cross-cutting UI on every editor:
- Status badge: **Draft** / **Published** / **Scheduled**.
- "Last updated MM/DD/YYYY HH:mm by name@example.com".
- **Save as draft** vs **Publish** buttons.
- **Preview** button → opens `/preview/<section>?draft=1` in a new tab.
- Inline validation: required fields, URL format, dates (end > start), image alt text required when image present.

### 4. Admin-only preview route

- New route `/preview/*` (e.g. `/preview/home`, `/preview/wego/schedule`, `/preview/alerts`) gated by `useAdminAuth` + `canManage`.
- Preview pages render the same components but pass `draftMode=true`, which makes hooks return `draft_value` instead of `value` and ignore the `published`/`status` filter.
- Public routes never read drafts.

### 5. Roles

Keep current model (admin + editor both edit content; admin-only manages user roles). Update RLS so editors can write the content tables listed above using `is_admin_or_editor`.

### 6. Validation rules

- Alert banner: message required (≤ 280 chars), button label+href both required if either present, `href` must be a valid URL or start with `/`, end date > start date.
- Hero slide: title + image URL + alt required (alt may be empty only if `decorative=true`), CTA href validated like above.
- Site link: `slug` matches `^[a-z0-9-]+$`, `url` parses with `new URL()` or starts with `/` or `tel:`/`mailto:`, warn (don't block) if HEAD probe returns non-2xx.
- Footer: phone matches `^[0-9+()\-\s]+$`, email is a valid email.

### 7. Out of scope this round

- Programs (`src/data/programs.ts`) and Counties (`src/data/counties.ts`) stay as-is.
- No new CMS dependency. We use Lovable Cloud (Supabase) tables only.

## Technical details

- New hook `useFooterContent` mirrors `useSiteAlerts` (DB read + realtime subscription).
- New hook `useDraftMode()` reads `?draft=1` and verifies admin role.
- `<ManagedLink>` unchanged in API; relies on seeded `site_links`.
- Single migration file, no destructive changes; all new columns are nullable or have defaults so existing data keeps working.
- Realtime: continue using `postgres_changes` subscriptions on `site_settings`, `hero_slides`, `site_links` so changes appear without page refresh on already-open tabs.

## Deliverables (in order)

1. Migration: add columns + seed `site_links` + add `footer_content` row.
2. RLS update: editors can write the four content tables.
3. Hooks: extend `useSiteAlerts` + `useHeroSlides` for scheduling + draft, add `useFooterContent`, add `useDraftMode`.
4. Public components: `SiteFooter` + `SiteAlertBanner` + `SiteAlertModal` + `HeroSlider` honor draft/scheduling.
5. Admin: extend `AdminAlerts`, `AdminHero`, `AdminLinks`; add `AdminFooter`; add `/admin/content` index tile; add status / audit / preview UI.
6. Preview route: `/preview/*` admin-gated.
7. Smoke test in preview: edit each section, confirm public route updates without rebuild; confirm draft does not leak; confirm scheduling window hides expired alerts.
