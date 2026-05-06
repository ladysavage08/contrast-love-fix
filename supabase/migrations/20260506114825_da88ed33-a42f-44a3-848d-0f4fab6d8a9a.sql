ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS event_end_date date;
COMMENT ON COLUMN public.posts.event_end_date IS 'Final date of a multi-day or recurring event. If null, event_date is treated as the final date for archival.';
CREATE INDEX IF NOT EXISTS idx_posts_event_end_date ON public.posts(event_end_date);