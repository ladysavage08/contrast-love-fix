-- GO-LIVE ONLY, after the new Pair package is uploaded and the user approves.
-- Merges the 9 identical Compass for Hope copies into one event with 9 dates.
-- (All 9 copies have the same description, image, location, time, links and category; verified 2026-11-12.)
-- Nothing is deleted: copies are unpublished and their old addresses redirect.
INSERT INTO public.post_event_dates (post_id, event_date, start_time, end_time, event_time, location, source_post_id)
SELECT '96204ced-5c6d-409f-ac24-84ce02ddb233', p.event_date, '10:30', '12:30', p.event_time, NULL, p.id
FROM public.posts p
WHERE p.title = 'Compass for Hope – Showers at James Brown Arena' AND p.published = true AND p.post_type = 'event'
  AND NOT EXISTS (SELECT 1 FROM public.post_event_dates d WHERE d.post_id = '96204ced-5c6d-409f-ac24-84ce02ddb233' AND d.event_date = p.event_date);

INSERT INTO public.post_slug_redirects (old_slug, new_slug, active)
SELECT slug, 'compass-for-hope-showers', true FROM public.posts
WHERE title = 'Compass for Hope – Showers at James Brown Arena'
ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug, active = true;

UPDATE public.posts SET published = false
WHERE title = 'Compass for Hope – Showers at James Brown Arena' AND id <> '96204ced-5c6d-409f-ac24-84ce02ddb233';

-- Main date = next date that hasn't ended (Eastern), so even old cached pages show a correct date.
UPDATE public.posts SET
  slug = 'compass-for-hope-showers',
  event_date = COALESCE((SELECT min(event_date) FROM public.post_event_dates
     WHERE post_id = '96204ced-5c6d-409f-ac24-84ce02ddb233' AND NOT cancelled
       AND (event_date + time '12:30') > (now() AT TIME ZONE 'America/New_York')), '2026-12-27'),
  event_end_date = '2026-12-27'
WHERE id = '96204ced-5c6d-409f-ac24-84ce02ddb233';
