
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS featured_image_alt text,
  ADD COLUMN IF NOT EXISTS featured_image_decorative boolean NOT NULL DEFAULT false;
