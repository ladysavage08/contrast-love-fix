CREATE TABLE public.staff_directory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  job_title TEXT,
  department TEXT,
  county TEXT,
  phone TEXT,
  email TEXT,
  office_location TEXT,
  notes TEXT,
  photo_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_published ON public.staff_directory (published);
CREATE INDEX idx_staff_last_name ON public.staff_directory (last_name);

ALTER TABLE public.staff_directory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published staff"
ON public.staff_directory
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can insert staff"
ON public.staff_directory
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update staff"
ON public.staff_directory
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete staff"
ON public.staff_directory
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_staff_directory_updated_at
BEFORE UPDATE ON public.staff_directory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.staff_directory
  (full_name, last_name, job_title, department, county, phone, email, office_location, notes)
VALUES
  ('Lee Donohue, MD', 'Donohue', 'District Health Director', 'Administration', 'District Office', '(706) 667-4250', 'info@ecphd.com', 'Augusta District Office', 'Oversees public health operations across the East Central Health District.'),
  ('Jane Smith', 'Smith', 'Nursing Director', 'Clinical Services', 'Richmond', '(706) 667-4251', 'jane.smith@ecphd.com', 'Richmond County Health Department', 'Leads nursing programs and clinical services.'),
  ('Marcus Allen', 'Allen', 'Environmental Health Manager', 'Environmental Health', 'District Office', '(706) 667-4260', 'marcus.allen@ecphd.com', 'Augusta District Office', 'Manages food service, septic, and environmental programs.'),
  ('Carla Brown', 'Brown', 'WIC Coordinator', 'WIC', 'Columbia', '(706) 868-3330', 'carla.brown@ecphd.com', 'Columbia County Health Department', NULL),
  ('Robert Williams', 'Williams', 'County Nurse Manager', 'Clinical Services', 'Burke', '(706) 554-3464', 'robert.williams@ecphd.com', 'Burke County Health Department', NULL);