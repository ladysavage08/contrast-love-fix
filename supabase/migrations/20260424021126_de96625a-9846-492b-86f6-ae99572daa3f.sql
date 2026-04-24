
-- Create public bucket for post featured images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public can view post images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'post-images');

-- Admins can upload
CREATE POLICY "Admins can upload post images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Admins can update
CREATE POLICY "Admins can update post images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Admins can delete
CREATE POLICY "Admins can delete post images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
