ALTER TABLE public.posts
  ADD COLUMN homepage_expires_on date,
  ADD COLUMN homepage_featured boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.posts.homepage_expires_on IS 'Optional final Eastern-Time calendar date on which a news post may appear on the homepage; archive visibility is unaffected.';
COMMENT ON COLUMN public.posts.homepage_featured IS 'When true, an unexpired news post bypasses the homepage recent-publication window.';