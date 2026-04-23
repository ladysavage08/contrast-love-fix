CREATE UNIQUE INDEX IF NOT EXISTS staff_directory_email_unique
ON public.staff_directory ((lower(email)))
WHERE email IS NOT NULL AND email <> '';