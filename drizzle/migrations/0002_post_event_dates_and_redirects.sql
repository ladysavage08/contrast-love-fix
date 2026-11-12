CREATE TABLE public.post_event_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  end_date date,
  start_time time,
  end_time time,
  event_time text,
  location text,
  details text,
  link_url text,
  link_label text,
  cancelled boolean NOT NULL DEFAULT false,
  cancellation_note text,
  source_post_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX post_event_dates_post_idx ON public.post_event_dates(post_id, event_date);
GRANT SELECT ON public.post_event_dates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_event_dates TO authenticated;
GRANT ALL ON public.post_event_dates TO service_role;
ALTER TABLE public.post_event_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view dates of published posts" ON public.post_event_dates FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.published = true));
CREATE POLICY "Admins can view all event dates" ON public.post_event_dates FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert event dates" ON public.post_event_dates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update event dates" ON public.post_event_dates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete event dates" ON public.post_event_dates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_post_event_dates_updated_at BEFORE UPDATE ON public.post_event_dates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.post_slug_redirects (
  old_slug text PRIMARY KEY,
  new_slug text NOT NULL,
  active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.post_slug_redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_slug_redirects TO authenticated;
GRANT ALL ON public.post_slug_redirects TO service_role;
ALTER TABLE public.post_slug_redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active slug redirects" ON public.post_slug_redirects FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage slug redirects" ON public.post_slug_redirects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));