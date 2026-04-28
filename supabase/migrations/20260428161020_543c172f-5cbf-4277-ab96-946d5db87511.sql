CREATE TABLE public.hero_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  eyebrow TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_label TEXT,
  cta_href TEXT,
  secondary_cta_label TEXT,
  secondary_cta_href TEXT,
  image_url TEXT,
  image_alt TEXT NOT NULL DEFAULT '',
  focal TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled hero slides"
ON public.hero_slides
FOR SELECT
USING (enabled = true);

CREATE POLICY "Admins can view all hero slides"
ON public.hero_slides
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert hero slides"
ON public.hero_slides
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update hero slides"
ON public.hero_slides
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete hero slides"
ON public.hero_slides
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hero_slides_updated_at
BEFORE UPDATE ON public.hero_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_hero_slides_order ON public.hero_slides (enabled, display_order);

-- Allow admins to manage hero images in the existing public post-images bucket under hero/ folder
CREATE POLICY "Admins can upload hero images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = 'hero'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update hero images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = 'hero'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete hero images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = 'hero'
  AND has_role(auth.uid(), 'admin'::app_role)
);