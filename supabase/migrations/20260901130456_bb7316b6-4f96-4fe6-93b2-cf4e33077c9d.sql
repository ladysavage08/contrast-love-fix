-- 1. New role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'security_tester';

-- 2. Optional, per-assignment expiry (NULL = never expires; all existing rows unaffected)
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

COMMENT ON COLUMN public.user_roles.expires_at IS
  'Optional expiry for a role assignment. NULL = never expires. Enforced server-side by has_role(), is_admin_or_editor() and is_security_tester().';