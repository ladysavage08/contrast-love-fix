# Show the real next event date, not the publish date

## What's wrong today
- The homepage News & Events list shows each item's **published date** for events too. That is why "Compass for Hope – Showers at James Brown Arena" reads "OCTOBER 30, 2026 • EVENT" (the day it was posted) instead of its event day.
- Several other spots fall back to the published date when an event has no event date.
- Compass for Hope is stored as **9 separate copies**, one per Sunday (Nov 1 – Dec 27). Project Refresh – Shower @ May Park has 2 copies (Oct 30, Nov 12). The copies clutter the listings, and changing a detail means editing every copy.

## What visitors will see
- Events show their actual date with the day of the week, for example **SUNDAY, NOVEMBER 15, 2026 • EVENT**. Multi-day events show **NOVEMBER 14–16, 2026 • EVENT**.
- An event with several confirmed dates appears **once** and shows its next upcoming date. Once that date has passed, it moves to the next confirmed date on its own, with no page refresh or admin step needed.
- After the last confirmed date passes, the event leaves the homepage and active listings and goes to Past Events. Nothing is deleted, and its page link keeps working.
- No "Every Sunday" or "Weekly" labels. No dates generated from a pattern. Only dates an administrator entered.
- An event with no confirmed date shows no date at all. It never shows the published date and is never archived based on the published date.
- News articles keep showing their published date and are never archived for being old.
- The event's own page shows the next date plus a short list of other upcoming confirmed dates.

## What administrators get (News admin page)
- Each event has an **Event Dates** list. Each row has a date, an optional end date and an optional time. Admins can **add**, **edit** or **remove** a row, or mark one date as canceled, without recreating the article.
- Published Date stays a separate field, and so do manual archive/reactivate.

## Cleaning up existing content
- Merge the 9 Compass for Hope copies into one event with its 9 dates. Dates that have already passed (Nov 1, Nov 8) go into history, so the site shows **Sunday, November 15, 2026** next.
- Merge the 2 Project Refresh – Shower @ May Park copies the same way. The separate "Project Refresh Holiday Event" (Dec 10) stays its own event.
- The extra copies are **unpublished, not deleted**.
- Mobile Health Clinic stops are left as they are (one stop per county per day), so the Mobile Clinic schedule doesn't change.

## Technical details
- New table `post_event_dates` (post_id, event_date, end_date, event_time, cancelled, sort). Public can read rows of published posts; admins can write. Grants and row-level security follow the `posts` table.
- Shared helper `nextOccurrence(post, dates, today)` in `src/lib/eventDate.ts`. The listing uses the occurrence table when it has rows and falls back to `posts.event_date`/`event_end_date`. The `published_at` fallback for events is removed everywhere (eventDateKey, eventEndKey, Index.tsx line 202 and line 286, News.tsx, usePosts sorting and archiving, Calendar).
- Calendar shows a dot on each confirmed occurrence. A 60-second check moves listings to the next date without a refresh.
- New formatter for event labels (weekday, month, day, year, plus multi-day ranges) used on the homepage, News & Events and the event page.
- Tests: next-occurrence selection, rollover after a date passes, archiving after the last date, no date when none is confirmed, no `published_at` fallback, and news never archived.
- Code changes, so a new Pair upload package is built at the end. The data merge is live immediately.
