# Pair Networks Deployment Guide

## What is included

- `dist/` — production-ready static build to upload to Pair
- `public/.htaccess` and `dist/.htaccess` — Apache SPA routing + caching config
- `src/`, `public/`, config files, and package files — full source for future edits/rebuilds
- `.env.example` — sample frontend environment file for rebuilding outside Lovable

## Important architecture note

This site is a **static frontend** that can be hosted on standard Apache hosting such as Pair Networks.

The frontend does **not** require Lovable hosting, but some live features still call the existing managed backend over HTTPS:

- News and events data
- Admin sign-in and admin content management
- Site alerts
- Contact form submission

That means Pair serves the website files, while the browser connects directly to the backend APIs for dynamic data.

## Files to upload to Pair

Upload the **contents** of `dist/` to your Pair web root (`public_html/`, `httpdocs/`, or equivalent), including hidden files:

- `index.html`
- `.htaccess`
- `assets/`
- `favicon.ico`
- `robots.txt`
- any other files inside `dist/`

Do **not** upload the `dist` folder itself as a nested directory unless you want the site to live under `/dist/`.

## Why `.htaccess` matters

The site uses React Router with clean URLs like:

- `/`
- `/news`
- `/wego`
- `/wego/services`
- `/wego/schedule`
- `/counties/richmond`

On Apache, refreshing one of those URLs would 404 unless `.htaccess` rewrites requests back to `index.html`. The included `.htaccess` already does this and should remain in the web root.

## Deploy steps

1. Build the site locally with `npm run build` or `bun run build`.
2. Open the generated `dist/` folder.
3. In FileZilla or Pair File Manager, upload **all contents** of `dist/` to your web root.
4. Make sure hidden files are visible so `.htaccess` is uploaded.
5. Visit the live domain and test a few deep links directly.

## Local verification before upload

Recommended checks after each build:

1. Start a local preview server:
   - `npm run preview`
   - or `bunx vite preview`
2. Open and test:
   - `/`
   - `/accessibility`
   - `/news`
   - `/wego/services`
   - `/wego/schedule`
   - one county detail page
3. Confirm images, CSS, and JavaScript all load.
4. Confirm the contact form, alerts, and news feed do not show mixed-content or HTTPS errors.

## Future update workflow

### Option A — Update in Lovable, then redeploy to Pair

1. Make changes in Lovable.
2. Export or download the latest code.
3. Run `npm install` once if needed.
4. Run `npm run build`.
5. Re-upload the updated contents of `dist/` to Pair via FTP.

This is safe and will not break routing as long as `.htaccess` remains in place.

### Option B — Use GitHub + local rebuilds

1. Connect the project to GitHub.
2. Pull the repo locally.
3. Make updates in Lovable or GitHub.
4. Run `npm run build` locally.
5. Upload the new `dist/` contents to Pair.

## Environment variables for rebuilding from source

The exported production build already contains the correct frontend configuration for deployment.

If you rebuild from source outside Lovable, create a `.env` file from `.env.example` and provide the public frontend values required by the existing backend.

## Accessibility features in the export

The production build includes the current accessibility work in the frontend bundle, including:

- Skip link
- Accessible navigation and menus
- Visible focus states
- Alert banner and modal
- Form labels and error handling
- Mobile tap target sizing
- Accessibility Statement page

These are implemented in the frontend code and are included in the static build.

## HTTPS compatibility

The build was checked for insecure `http://` asset and API references in application code. External integrations use HTTPS, so the site is compatible with secure hosting on Pair.