-- Phase 2: Database schema, RLS, and admin role setup

-- 1) Roles enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3) Helper function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Policies for user_roles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins manage user_roles'
  ) THEN
    CREATE POLICY "Admins manage user_roles"
      ON public.user_roles
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 4) Admin emails allowlist
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY
);
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can view/modify allowlist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_emails' AND policyname='Admins read admin_emails'
  ) THEN
    CREATE POLICY "Admins read admin_emails"
      ON public.admin_emails
      FOR SELECT TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='admin_emails' AND policyname='Admins write admin_emails'
  ) THEN
    CREATE POLICY "Admins write admin_emails"
      ON public.admin_emails
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Seed provided admin email
INSERT INTO public.admin_emails(email) VALUES ('maheentouqeer76@gmail.com')
ON CONFLICT DO NOTHING;

-- 5) Function to self-assign admin if email is allowlisted
-- Uses JWT claim for email; works without touching auth schema
CREATE OR REPLACE FUNCTION public.assign_admin_if_listed()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  uid uuid := auth.uid();
  uemail text := coalesce(nullif(current_setting('request.jwt.claim.email', true), ''), NULL);
  exists_in_list boolean := false;
BEGIN
  IF uid IS NULL OR uemail IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.admin_emails WHERE lower(email) = lower(uemail)) INTO exists_in_list;
  IF exists_in_list THEN
    INSERT INTO public.user_roles(user_id, role)
    VALUES (uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

-- 6) Content tables
CREATE TABLE IF NOT EXISTS public.about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  heading text NOT NULL,
  content text,
  image_url text
);
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text,
  skill_name text NOT NULL,
  proficiency int DEFAULT 0
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text,
  start_date date,
  end_date date,
  description text
);
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text,
  company text,
  start_date date,
  end_date date,
  description text
);
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  media_url text,
  link_url text
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.assistant_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text,
  answer text,
  dataset_file_url text
);
ALTER TABLE public.assistant_knowledge ENABLE ROW LEVEL SECURITY;

-- 7) Public read policies for content
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='about' AND policyname='Public can view about') THEN
    CREATE POLICY "Public can view about" ON public.about FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='skills' AND policyname='Public can view skills') THEN
    CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='education' AND policyname='Public can view education') THEN
    CREATE POLICY "Public can view education" ON public.education FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='experience' AND policyname='Public can view experience') THEN
    CREATE POLICY "Public can view experience" ON public.experience FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Public can view categories') THEN
    CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Public can view projects') THEN
    CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='assistant_knowledge' AND policyname='Public can view assistant knowledge') THEN
    CREATE POLICY "Public can view assistant knowledge" ON public.assistant_knowledge FOR SELECT USING (true);
  END IF;
END $$;

-- 8) Admin manage policies for content tables
DO $$ BEGIN
  PERFORM 1;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='about' AND policyname='Admins manage about') THEN
    CREATE POLICY "Admins manage about" ON public.about FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='skills' AND policyname='Admins manage skills') THEN
    CREATE POLICY "Admins manage skills" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='education' AND policyname='Admins manage education') THEN
    CREATE POLICY "Admins manage education" ON public.education FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='experience' AND policyname='Admins manage experience') THEN
    CREATE POLICY "Admins manage experience" ON public.experience FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Admins manage categories') THEN
    CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='projects' AND policyname='Admins manage projects') THEN
    CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='assistant_knowledge' AND policyname='Admins manage assistant_knowledge') THEN
    CREATE POLICY "Admins manage assistant_knowledge" ON public.assistant_knowledge FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
END $$;

-- 9) Contacts policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contacts' AND policyname='Anyone can submit contacts') THEN
    CREATE POLICY "Anyone can submit contacts" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contacts' AND policyname='Admins view contacts') THEN
    CREATE POLICY "Admins view contacts" ON public.contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contacts' AND policyname='Admins update contacts') THEN
    CREATE POLICY "Admins update contacts" ON public.contacts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='contacts' AND policyname='Admins delete contacts') THEN
    CREATE POLICY "Admins delete contacts" ON public.contacts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
  END IF;
END $$;

-- 10) Helpful index
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
