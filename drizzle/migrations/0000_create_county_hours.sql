CREATE TABLE public.county_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug text NOT NULL,
  site_name text,
  hours_summary jsonb,
  lunch_closure text,
  hours jsonb,
  walk_in_hours jsonb,
  notes jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by_email text
);

CREATE UNIQUE INDEX county_hours_unique_target
  ON public.county_hours (county_slug, coalesce(site_name, ''));

GRANT SELECT ON public.county_hours TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.county_hours TO authenticated;
GRANT ALL ON public.county_hours TO service_role;

ALTER TABLE public.county_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published county hours"
  ON public.county_hours FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "Editors can view all county hours"
  ON public.county_hours FOR SELECT TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can insert county hours"
  ON public.county_hours FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Editors can update county hours"
  ON public.county_hours FOR UPDATE TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins can delete county hours"
  ON public.county_hours FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER county_hours_set_updated_at
  BEFORE UPDATE ON public.county_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();