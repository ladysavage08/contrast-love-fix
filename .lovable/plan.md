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
- New table `post_event_dates` (post_id, event_date, end_date, start_time, end_time, event_time text, location, details, registration/link URL and label, cancelled, cancellation_note). Public can read rows of published posts; admins can write. Grants and row-level security follow the `posts` table.
- Shared helper `nextOccurrence(post, dates, today)` in `src/lib/eventDate.ts`. The listing uses the occurrence table when it has rows and falls back to `posts.event_date`/`event_end_date`. The `published_at` fallback for events is removed everywhere (eventDateKey, eventEndKey, Index.tsx line 202 and line 286, News.tsx, usePosts sorting and archiving, Calendar).
- Calendar shows a dot on each confirmed occurrence. A 60-second check moves listings to the next date without a refresh.
- New formatter for event labels (weekday, month, day, year, plus multi-day ranges) used on the homepage, News & Events and the event page.
- Tests: next-occurrence selection, rollover after a date passes, archiving after the last date, no date when none is confirmed, no `published_at` fallback, and news never archived.
- Code changes, so a new Pair upload package is built at the end. The data merge is live immediately.

## Your added safeguards
- **Old links keep working:** each merged copy's web address forwards to the combined event page, so no links break. A new redirect list is stored in the database.
- **Eastern Time:** all date checks use America/New_York. An event stays listed until its end time (for example 12:30 PM), or until 11:59 PM Eastern when it has no time.
- **Canceled dates:** a canceled date drops out of upcoming listings and the next confirmed date shows instead. Canceled dates stay in the event's history, labeled Canceled.
- **Events with no dates:** these are left out of upcoming listings but stay visible and editable for administrators.
- **No lost details:** before merging, I compare every copy's description, image, location, time, links and buttons. Anything that differs is kept on the date it belongs to or flagged to you, and nothing is merged blind.
- **Mobile Health Clinic:** its schedule, county records and features stay exactly as they are. Those posts get no date rows and use their current single date.
- **Deployment:** nothing goes to the live website without your approval. See the rollout order below.

## Event end time
- Each event date gets an optional **Start Time** and **End Time**.
- A date stays listed until its end time in Eastern Time. With no end time, it stays listed until 11:59 PM Eastern. A multi-day date uses the last day's end time, or the end of that day.
- Existing free-text times such as "10:30 AM – 12:30 PM" are converted into start and end times during the merge. The original text is kept.

## Rollout order (keeps the live calendar working the whole time)
1. **Now, safe for the live site:** add two new, empty database tables, one for event dates and one for redirects. Nothing is renamed or removed. The current live website doesn't read the new tables, so it keeps working exactly as it does today.
2. **Now, preview only:** build and test the new website code. When an event has no date rows, the new code falls back to the existing single date, so it also works correctly against today's live data.
3. **Now:** build the Pair package and give it to you. No live data changes have been made at this point.
4. **After your final approval:**
   - Back up every affected event record to a file.
   - You upload the package. The new code works with the current data, so the site keeps working throughout.
   - I then run the merge: add the date rows, unpublish the extra copies and turn on the redirects.
   - I set the remaining event's main date to its next date, so even a cached old page shows a correct date.
5. **Rollback:** the backup file plus a ready-to-run undo script that republishes the copies and removes the new date rows. The previous Pair package stays available to re-upload.

**Confirmation:** in this order, the website and database changes can go out together without disrupting the live events calendar. The one thing to avoid is running the merge before the new package is uploaded, because the old site would then show only one Compass for Hope date. That step waits for your approval.

## Links on Pair
- Old addresses of the merged copies get permanent (301) redirects in the site's Pair redirect file (`.htaccess`), the same method already used for the corrected "Just In Case" article. A matching in-app redirect covers the preview.

## Final checks before handing over the package
- Homepage dates are correct.
- No duplicate events on News & Events.
- Events move on to their next date automatically (tested with a simulated clock).
- Expired events move to Past Events.
- News articles are unchanged.
- The Mobile Health Clinic schedule is unchanged (compared before and after).
- Old event links work.
- The admin date editor works, including add, edit, remove and cancel.

## Details that differ by date
- Each event date can have its own location, note or description, registration link and button. When a date has a value, the site shows it for that date. Otherwise it uses the event's main details.
- The event page and listings always show the details that belong to the date on display.
- During the merge, any detail that differs between copies is saved on its own date, never overwritten.

## Full rehearsal before production
- I run the entire migration on a copy of the event data. The copy is fed into the preview through test fixtures, so the live database is never touched.
- The rehearsal covers the merge, keeping canceled and past dates, the redirects, and moving on to the next date (simulated clock: Nov 15 at 12:31 PM ET rolls over to Nov 22).
- Screenshots and checks reflect the website as it will look after the migration.
- I also run the exact merge script against a copy of the affected records in a throwaway area of the database. I compare the results and then delete the copy. Production records stay untouched.

## Scope of this round (steps 1–3 only)
- Create the new tables. They start empty and are safe for the live site.
- Build and test the new website code.
- Prepare the Pair package, the merge script, the backup query and the rollback instructions for your review.
- No production merging, unpublishing, redirects or deployment until your final approval. The new `.htaccess` redirects go in a separate file that is added only at go-live.
