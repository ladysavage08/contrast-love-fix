CREATE TABLE public.boh_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug text NOT NULL,
  meeting_date date NOT NULL,
  title text,
  recording_url text NOT NULL,
  platform text NOT NULL DEFAULT 'other',
  notes text,
  duration text,
  published boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by_email text
);

GRANT SELECT ON public.boh_recordings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.boh_recordings TO authenticated;
GRANT ALL ON public.boh_recordings TO service_role;

ALTER TABLE public.boh_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published recordings"
  ON public.boh_recordings FOR SELECT
  USING (published = true AND archived = false);

CREATE POLICY "Editors can view all recordings"
  ON public.boh_recordings FOR SELECT TO authenticated
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Security tester can view recordings"
  ON public.boh_recordings FOR SELECT TO authenticated
  USING (is_security_tester(auth.uid()));

CREATE POLICY "Editors can insert recordings"
  ON public.boh_recordings FOR INSERT TO authenticated
  WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update recordings"
  ON public.boh_recordings FOR UPDATE TO authenticated
  USING (is_admin_or_editor(auth.uid()))
  WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete recordings"
  ON public.boh_recordings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX boh_recordings_county_date_idx
  ON public.boh_recordings (county_slug, meeting_date DESC);

CREATE TRIGGER update_boh_recordings_updated_at
  BEFORE UPDATE ON public.boh_recordings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();