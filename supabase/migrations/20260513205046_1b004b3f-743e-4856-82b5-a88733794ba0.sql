
-- 1. Audit / scheduling / draft columns
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS updated_by_email text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS draft_value jsonb;

ALTER TABLE public.site_settings
  DROP CONSTRAINT IF EXISTS site_settings_status_check;
ALTER TABLE public.site_settings
  ADD CONSTRAINT site_settings_status_check
  CHECK (status IN ('draft','published'));

ALTER TABLE public.hero_slides
  ADD COLUMN IF NOT EXISTS updated_by_email text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS start_at timestamptz,
  ADD COLUMN IF NOT EXISTS end_at timestamptz;

ALTER TABLE public.hero_slides
  DROP CONSTRAINT IF EXISTS hero_slides_status_check;
ALTER TABLE public.hero_slides
  ADD CONSTRAINT hero_slides_status_check
  CHECK (status IN ('draft','published'));

ALTER TABLE public.site_links
  ADD COLUMN IF NOT EXISTS updated_by_email text;

-- 2. RLS: allow editors (not just admins) to write content tables.
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Editors can insert site settings"
  ON public.site_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can update site settings"
  ON public.site_settings FOR UPDATE TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can insert hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can update hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can view all hero slides" ON public.hero_slides;
CREATE POLICY "Editors can insert hero slides"
  ON public.hero_slides FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can update hero slides"
  ON public.hero_slides FOR UPDATE TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can view all hero slides"
  ON public.hero_slides FOR SELECT TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert site links" ON public.site_links;
DROP POLICY IF EXISTS "Admins can update site links" ON public.site_links;
DROP POLICY IF EXISTS "Admins can view all site links" ON public.site_links;
CREATE POLICY "Editors can insert site links"
  ON public.site_links FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can update site links"
  ON public.site_links FOR UPDATE TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));
CREATE POLICY "Editors can view all site links"
  ON public.site_links FOR SELECT TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- 3. Seed site_links with slugs the public site already references
INSERT INTO public.site_links (slug, label, url, location, active, notes)
VALUES
  ('employee-portal',  'Employee Portal',          'https://ecphd.com/intranet/login/',           'header/home',  true, 'Top-right portal link.'),
  ('patient-portal',   'Patient Portal',           'https://harrispublichealth.com/portal/',      'home',         true, 'Patient login button on the homepage.'),
  ('wic-apply',        'Apply for WIC',            'https://ecphd-getwic.qminder.site/#/',        'wic',          true, 'WIC application link. Also routed via /getwic.'),
  ('wic-foods',        'WIC Approved Foods',       'https://dph.georgia.gov/WIC',                 'wic',          true, NULL),
  ('ga-state-holidays','GA State Holidays',        'https://team.georgia.gov/state-holidays/',    'contact',      true, NULL),
  ('wego-site',        'Mobile Health Clinic',     'https://www.ecphd.com/wego',                  'wego',         true, NULL),
  ('social-facebook',  'Facebook',                 'https://www.facebook.com/ECPHD',              'footer/social',true, NULL),
  ('social-x',         'X (Twitter)',              'https://x.com/EastCentralPH',                 'footer/social',true, NULL),
  ('social-youtube',   'YouTube',                  'https://www.youtube.com/@eastcentralhealthdistrict2885', 'footer/social', true, NULL),
  ('social-instagram', 'Instagram',                'https://www.instagram.com/eastcentralhealth/','footer/social',true, NULL),
  ('footer-accessibility','Accessibility',         '/accessibility',                              'footer',       true, 'Footer accessibility statement link.')
ON CONFLICT (slug) DO NOTHING;

-- 4. Seed editable footer content
INSERT INTO public.site_settings (key, value)
VALUES (
  'footer_content',
  jsonb_build_object(
    'disclaimer', 'Automatic translation services are provided but have not been fully vetted by ECHD staff.',
    'contactPhone', '706-721-5800',
    'contactEmail', '',
    'wegoExtraCopy', 'Mobile Health Clinic: 1-877-884-WEGO',
    'showAnnouncementLink', true,
    'announcementLinkLabel', 'Show Announcement',
    'copyright', 'East Central Health District — Georgia Department of Public Health.'
  )
)
ON CONFLICT (key) DO NOTHING;

-- Need a unique constraint on key for ON CONFLICT to work next time, if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_key_key'
  ) THEN
    ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_key_key UNIQUE (key);
  END IF;
END $$;
