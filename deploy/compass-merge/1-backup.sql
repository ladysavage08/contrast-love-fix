-- Run at go-live BEFORE the merge (read-only). Saves every affected record.
\copy (select * from public.posts where title = 'Compass for Hope – Showers at James Brown Arena') to 'compass-posts-backup.csv' csv header
\copy (select * from public.post_event_dates where post_id = '96204ced-5c6d-409f-ac24-84ce02ddb233') to 'compass-dates-backup.csv' csv header
\copy (select * from public.post_slug_redirects where new_slug = 'compass-for-hope-showers') to 'compass-redirects-backup.csv' csv header
