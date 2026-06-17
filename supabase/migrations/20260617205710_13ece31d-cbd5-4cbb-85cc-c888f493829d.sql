
-- Status enum
DO $$ BEGIN
  CREATE TYPE public.wego_request_status AS ENUM (
    'new','under_review','need_more_information','approved','denied','scheduled','completed','cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Venue type enum
DO $$ BEGIN
  CREATE TYPE public.wego_venue_type AS ENUM ('indoor','outdoor','both');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.wego_event_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Organization / contact
  organization_name text NOT NULL,
  contact_name text NOT NULL,
  contact_title text,
  email text NOT NULL,
  phone text NOT NULL,
  -- Event
  event_name text NOT NULL,
  event_date date NOT NULL,
  event_start_time time NOT NULL,
  event_end_time time NOT NULL,
  event_address text NOT NULL,
  event_city text NOT NULL,
  event_county text,
  expected_attendance integer NOT NULL,
  -- Logistics
  venue_type public.wego_venue_type NOT NULL,
  electricity_available boolean NOT NULL,
  space_for_unit boolean NOT NULL,
  parking_level_accessible boolean NOT NULL,
  onsite_contact_name text NOT NULL,
  onsite_contact_phone text NOT NULL,
  setup_instructions text,
  -- Services
  services_requested text[] NOT NULL DEFAULT '{}',
  services_other_detail text,
  additional_notes text,
  -- Status
  status public.wego_request_status NOT NULL DEFAULT 'new',
  status_notes text,
  status_updated_at timestamptz,
  status_updated_by uuid,
  -- Audit
  ip_hash text,
  user_agent text,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_wego_event_requests_created_at ON public.wego_event_requests (created_at DESC);
CREATE INDEX idx_wego_event_requests_status ON public.wego_event_requests (status);

-- Grants: no anon; authenticated can read/update only when policies allow
GRANT SELECT, UPDATE ON public.wego_event_requests TO authenticated;
GRANT ALL ON public.wego_event_requests TO service_role;

ALTER TABLE public.wego_event_requests ENABLE ROW LEVEL SECURITY;

-- Admin or editor can view
CREATE POLICY "Admin or editor can view wego event requests"
  ON public.wego_event_requests
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()));

-- Admin or editor can update (for status workflow)
CREATE POLICY "Admin or editor can update wego event requests"
  ON public.wego_event_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_or_editor(auth.uid()))
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- No INSERT/DELETE policies → blocked for both anon and authenticated;
-- inserts happen via the edge function using service_role.

-- updated_at trigger
CREATE TRIGGER update_wego_event_requests_updated_at
  BEFORE UPDATE ON public.wego_event_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
