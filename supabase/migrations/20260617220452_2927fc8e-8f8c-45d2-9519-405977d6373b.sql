
-- 1. Fix audit log open insert
DROP POLICY IF EXISTS "Anyone can insert audit entries" ON public.admin_audit_log;
CREATE POLICY "Authenticated users can insert their own audit entries"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 2. Restrict site_settings public read: only published rows, and revoke sensitive columns from anon
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Public can view published site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (status = 'published');

REVOKE SELECT ON public.site_settings FROM anon;
GRANT SELECT (id, key, value, status, updated_at) ON public.site_settings TO anon;

-- Editors/admins keep full read via existing policies on authenticated role
CREATE POLICY "Editors can view all site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (is_admin_or_editor(auth.uid()));

-- 3. Remove site_links from realtime publication (no channel-level RLS in place)
ALTER PUBLICATION supabase_realtime DROP TABLE public.site_links;

-- 4. Revoke EXECUTE on SECURITY DEFINER role-check helpers from anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_editor(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_editor(uuid) TO authenticated, service_role;
