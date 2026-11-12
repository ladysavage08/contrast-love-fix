-- Undo the merge exactly. Then re-upload the previous Pair package if needed.
UPDATE public.posts SET slug = 'compass-for-hope-showers-2026-11-01', event_date = '2026-11-01', event_end_date = NULL
WHERE id = '96204ced-5c6d-409f-ac24-84ce02ddb233';
UPDATE public.posts SET published = true
WHERE title = 'Compass for Hope – Showers at James Brown Arena';
UPDATE public.post_slug_redirects SET active = false WHERE new_slug = 'compass-for-hope-showers';
DELETE FROM public.post_event_dates WHERE post_id = '96204ced-5c6d-409f-ac24-84ce02ddb233';
