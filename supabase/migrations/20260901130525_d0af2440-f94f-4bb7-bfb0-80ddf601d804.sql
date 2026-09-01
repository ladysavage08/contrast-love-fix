-- Expiry-aware role checks (admin/editor behavior unchanged: their rows have expires_at IS NULL)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role, 'editor'::app_role)
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.is_security_tester(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'security_tester'::app_role
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

REVOKE ALL ON FUNCTION public.is_security_tester(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_security_tester(uuid) TO authenticated;

-- Read-only policies for the security tester (SELECT only, authenticated only)
CREATE POLICY "Security tester can view alert and footer settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.is_security_tester(auth.uid()) AND key IN ('site_alerts', 'footer_content'));

CREATE POLICY "Security tester can view hero slides"
  ON public.hero_slides FOR SELECT TO authenticated
  USING (public.is_security_tester(auth.uid()));

CREATE POLICY "Security tester can view site links"
  ON public.site_links FOR SELECT TO authenticated
  USING (public.is_security_tester(auth.uid()));