# East Central Health District — Website

The official website for the East Central Health District (ECHD), serving 13
counties in East Central Georgia.

This is a single-page web application built with React and Vite. The pages,
news, events, and staff directory are loaded from a hosted database (Lovable
Cloud), so content can be updated without re-uploading the site.

---

## What's in this site

| Page | URL |
|---|---|
| Home | `/` |
| About | `/about` |
| Counties (13 county pages) | `/counties`, `/counties/<county-slug>` |
| Programs & Services | `/programs`, `/programs/<slug>` |
| Environmental Health | `/environmental-health` |
| Women's Health | `/womens-health` |
| WIC | `/wic` |
| News & Events | `/news`, `/news/<post-slug>` |
| Calendar of Events | `/calendar` |
| Mobile Health Clinic ("WeGo") | `/wego` and sub-pages |
| Staff Directory | `/directory` |
| Contact | `/contact` |
| Admin sign-in | `/auth` |

---

## Folder structure (only the parts you might touch)

```
/
├── index.html              ← page <title>, social-share image, etc.
├── public/
│   ├── .htaccess           ← Apache config for Pair (DO NOT delete)
│   ├── robots.txt          ← search engine rules
│   └── (place static images here if you don't want to import them in code)
├── src/
│   ├── assets/             ← images bundled with the site (hero photos, logos)
│   ├── pages/              ← one file per top-level page
│   ├── components/         ← reusable UI pieces (header, footer, navigation)
│   ├── data/               ← static lists (counties, programs, schedules)
│   └── index.css           ← site colors and design tokens
├── README.md               ← you are here
└── package.json
```

---

## Editing content (most common updates)

Most day-to-day content lives in the **database**, not in the code:

| What to change | Where |
|---|---|
| News posts and Events | Database → `posts` table (via the admin UI at `/auth`) |
| Calendar events | Same `posts` table — set `post_type` to `event` |
| Staff directory entries | Database → `staff_directory` table, or use the CSV import in the admin |
| Holiday hours | The "Holiday Hours" section in each county page (`src/data/counties.ts`) |

These code files only need editing for structural changes:

| What to change | File |
|---|---|
| Site colors / theme | `src/index.css` |
| Main navigation links | `src/components/PrimaryNav.tsx` |
| Footer | `src/components/SiteFooter.tsx` |
| Quick-links on homepage | `src/pages/Index.tsx` (the `quickLinks` array near the top) |
| Hero slider images / captions | `src/components/HeroSlider.tsx` |
| Programs list | `src/data/programs.ts` |
| Counties list / addresses | `src/data/counties.ts` |
| Mobile Clinic schedule fallback | `src/data/wegoSchedule.ts` |
| Page `<title>` and social-share preview | `index.html` |

To swap a hero image, replace the file in `src/assets/` with a new one of the
same name, or add a new file and update the `import` line at the top of
`src/components/HeroSlider.tsx`.

---

## Deploying to Pair hosting

The site needs to be **built** first (this turns the React code into a folder
of plain HTML, JS, and CSS that any web host can serve).

### One-time setup on your computer

1. Install [Node.js](https://nodejs.org/) (LTS version).
2. Open a terminal in this project folder.
3. Run: `npm install`

### Each time you want to deploy

1. Run: `npm run build`
   This creates a folder called **`dist/`** containing the entire site.
2. Open Pair's File Manager (or an FTP client like Cyberduck / FileZilla).
3. Upload **the contents of `dist/`** (not the folder itself) into your Pair
   web root — usually `public_html/` or `httpdocs/`.
   - Make sure the hidden file `.htaccess` is included. Some FTP clients hide
     dotfiles by default; turn on "show hidden files".
4. Done. Visit your domain to confirm.

> **Why `.htaccess` matters:** Without it, refreshing a page like
> `/calendar` returns a 404 on Pair. The `.htaccess` file (already in
> `public/`, automatically copied into `dist/`) tells Apache to serve
> `index.html` for any URL so the app can render the right page.

### Updating content vs. code

- **Content (news, events, staff, hours):** Edit in the admin / database. The
  live site picks it up immediately. **No re-deploy needed.**
- **Code (colors, nav links, page text):** Edit the files, run
  `npm run build` again, re-upload `dist/`.

---

## Putting this on GitHub

Storing the project on GitHub gives you version history and a backup.

The easiest way is to use Lovable's built-in GitHub sync:

1. In Lovable, open **Connectors** in the left sidebar.
2. Choose **GitHub → Connect project**.
3. Authorize the Lovable GitHub App on your GitHub account.
4. Pick the GitHub account/organization where the repo should live.
5. Click **Create Repository**. Lovable will push all the code over.

After that, every change you make in Lovable automatically pushes to GitHub,
and any change you push to GitHub from your computer flows back into Lovable.

To download a copy of the code from GitHub:
- Open the repo on github.com → click **Code → Download ZIP**
  *or* run `git clone <repo-url>` in a terminal.

---

## The backend (Lovable Cloud)

The site reads data from Lovable Cloud (database + serverless functions for
the contact form, etc.). When the site is hosted on Pair, browsers still talk
to Lovable Cloud directly over HTTPS — nothing extra to configure. The
connection details are baked into the build via the `.env` file.

If you ever migrate the backend, update `.env` and rebuild.

---

## Quick troubleshooting

| Symptom | Likely cause |
|---|---|
| Blank page after upload | Missing files — re-upload everything in `dist/`. |
| 404 when refreshing `/calendar` etc. | `.htaccess` didn't upload. Re-upload it (show hidden files in FTP). |
| Old content still showing | Browser cache. Hard-refresh (Ctrl+Shift+R / Cmd+Shift+R). |
| Contact form / login not working | Backend (Lovable Cloud) issue, not Pair. Check Cloud dashboard. |
| Images broken | A file in `src/assets/` was renamed — update the `import` line that referenced it. |
