CREATE TABLE public.flu_clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county_slug text NOT NULL,
  name text NOT NULL,
  clinic_date date NOT NULL,
  start_time text,
  end_time text,
  street_address text,
  city_state_zip text,
  access_type text NOT NULL DEFAULT 'walk_in' CHECK (access_type IN ('walk_in','appointment','both')),
  registration_url text,
  special_instructions text,
  contact_info text,
  published boolean NOT NULL DEFAULT true,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by_email text
);
GRANT SELECT ON public.flu_clinics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.flu_clinics TO authenticated;
GRANT ALL ON public.flu_clinics TO service_role;
ALTER TABLE public.flu_clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published flu clinics" ON public.flu_clinics FOR SELECT TO anon, authenticated USING (published = true AND archived = false);
CREATE POLICY "Editors can view all flu clinics" ON public.flu_clinics FOR SELECT TO authenticated USING (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Security tester can view flu clinics" ON public.flu_clinics FOR SELECT TO authenticated USING (public.is_security_tester(auth.uid()));
CREATE POLICY "Editors can insert flu clinics" ON public.flu_clinics FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can update flu clinics" ON public.flu_clinics FOR UPDATE TO authenticated USING (public.is_admin_or_editor(auth.uid())) WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admins can delete flu clinics" ON public.flu_clinics FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER flu_clinics_updated_at BEFORE UPDATE ON public.flu_clinics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();