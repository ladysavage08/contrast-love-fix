-- Contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- No public read/write/update/delete. Only the edge function (service role)
-- may insert and read submissions. End users submit via the edge function,
-- which uses the service role key and bypasses RLS.
-- We intentionally create NO policies so all anonymous/authenticated access
-- is denied by default.

CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
