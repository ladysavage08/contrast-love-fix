-- Explicit deny-all policy so the linter sees an intentional policy and
-- the table remains fully locked from anon/authenticated clients.
CREATE POLICY "Deny all client access to contact_submissions"
ON public.contact_submissions
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);
