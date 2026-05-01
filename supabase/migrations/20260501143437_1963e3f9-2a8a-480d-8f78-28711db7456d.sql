-- Site Links: admin-managed public-facing links
CREATE TABLE public.site_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_links_slug ON public.site_links(slug);
CREATE INDEX idx_site_links_active ON public.site_links(active);

ALTER TABLE public.site_links ENABLE ROW LEVEL SECURITY;

-- Public can read active links
CREATE POLICY "Anyone can view active site links"
  ON public.site_links
  FOR SELECT
  TO public
  USING (active = true);

-- Admins can read all (including inactive) and manage
CREATE POLICY "Admins can view all site links"
  ON public.site_links
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert site links"
  ON public.site_links
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site links"
  ON public.site_links
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site links"
  ON public.site_links
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE TRIGGER update_site_links_updated_at
  BEFORE UPDATE ON public.site_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for instant public-site updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_links;
ALTER TABLE public.site_links REPLICA IDENTITY FULL;