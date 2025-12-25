-- Create portfolio-assets storage bucket
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('portfolio-assets', 'portfolio-assets', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage policies for portfolio-assets bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can view portfolio assets' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public can view portfolio assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can upload portfolio assets' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admins can upload portfolio assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update portfolio assets' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admins can update portfolio assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete portfolio assets' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admins can delete portfolio assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Fix RLS policies for all managed tables
DROP POLICY IF EXISTS "Admins manage skills" ON public.skills;
CREATE POLICY "Admins manage skills"
ON public.skills FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage about" ON public.about;
CREATE POLICY "Admins manage about"
ON public.about FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage education" ON public.education;
CREATE POLICY "Admins manage education"
ON public.education FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage experience" ON public.experience;
CREATE POLICY "Admins manage experience"
ON public.experience FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage projects" ON public.projects;
CREATE POLICY "Admins manage projects"
ON public.projects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage hire_links" ON public.hire_links;
CREATE POLICY "Admins manage hire_links"
ON public.hire_links FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Set replica identity for realtime
ALTER TABLE public.skills REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.about REPLICA IDENTITY FULL;
ALTER TABLE public.education REPLICA IDENTITY FULL;
ALTER TABLE public.experience REPLICA IDENTITY FULL;