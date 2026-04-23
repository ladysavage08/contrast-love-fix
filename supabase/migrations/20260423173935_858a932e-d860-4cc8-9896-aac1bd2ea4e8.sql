-- Posts table for News & Events
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT,
  featured_image_url TEXT,
  post_type TEXT NOT NULL DEFAULT 'news' CHECK (post_type IN ('news','event')),
  category TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_date DATE,
  event_time TEXT,
  event_location TEXT,
  event_link TEXT,
  cta_label TEXT,
  cta_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_published_at ON public.posts (published_at DESC);
CREATE INDEX idx_posts_published ON public.posts (published);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read only published posts
CREATE POLICY "Anyone can view published posts"
ON public.posts
FOR SELECT
USING (published = true);

-- Authenticated users can manage posts
CREATE POLICY "Authenticated users can insert posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (true);

-- Reuse / create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed example posts
INSERT INTO public.posts (title, slug, excerpt, body, post_type, category, published_at)
VALUES
('Free Flu Shots Available at All County Health Departments',
 'free-flu-shots-available',
 'Protect yourself and your family this season with free flu vaccinations at any East Central Public Health location.',
 'East Central Public Health is offering free flu shots to all community members at every county health department. No appointment necessary. Walk-ins welcome during regular business hours.\n\nVaccination is the best way to protect yourself and your loved ones from seasonal influenza. Talk to your local health department for more information.',
 'news', 'Announcement', now() - interval '1 day'),
('Community Health Fair – Saturday, May 10',
 'community-health-fair-may-10',
 'Join us for free screenings, health education, and family activities at our annual community health fair.',
 'Our annual Community Health Fair brings together local providers, educators, and community partners for a day of free screenings and health resources. Activities include blood pressure checks, glucose screenings, child wellness booths, and more.',
 'event', 'Event', now() - interval '3 days'),
('New Mobile Clinic Schedule Released for Spring',
 'mobile-clinic-spring-schedule',
 'The WeGo Mobile Clinic has expanded its service routes. View the new schedule and stops near you.',
 'We have updated the WeGo Mobile Clinic schedule with additional stops across the region. The mobile clinic provides preventive care, screenings, and health education directly in the communities we serve.',
 'news', 'Update', now() - interval '7 days');