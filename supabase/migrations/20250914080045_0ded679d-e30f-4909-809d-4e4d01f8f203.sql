-- Idempotent RLS Security Migration
-- Safe to re-run multiple times

DO $$ 
BEGIN
  -- Enable RLS on contacts table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'contacts' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS on admin_emails table if not already enabled  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'admin_emails' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS on user_roles table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'user_roles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS on rate_limits table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'rate_limits' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Contacts table policies (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'contacts' 
    AND policyname = 'Public can submit contact forms'
  ) THEN
    CREATE POLICY "Public can submit contact forms" 
    ON public.contacts 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'contacts' 
    AND policyname = 'Admin only can read contacts'
  ) THEN
    CREATE POLICY "Admin only can read contacts" 
    ON public.contacts 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'contacts' 
    AND policyname = 'Admin can update contacts'
  ) THEN
    CREATE POLICY "Admin can update contacts" 
    ON public.contacts 
    FOR UPDATE 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'contacts' 
    AND policyname = 'Admin can delete contacts'
  ) THEN
    CREATE POLICY "Admin can delete contacts" 
    ON public.contacts 
    FOR DELETE 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- Admin emails policies (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'admin_emails' 
    AND policyname = 'Admin exclusive access to admin_emails'
  ) THEN
    CREATE POLICY "Admin exclusive access to admin_emails" 
    ON public.admin_emails 
    FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- User roles policies (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' 
    AND policyname = 'Users view own roles only'
  ) THEN
    CREATE POLICY "Users view own roles only" 
    ON public.user_roles 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_roles' 
    AND policyname = 'Admin full access to user_roles'
  ) THEN
    CREATE POLICY "Admin full access to user_roles" 
    ON public.user_roles 
    FOR ALL 
    USING (has_role(auth.uid(), 'admin'::app_role))
    WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
  END IF;

  -- Rate limits policies (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'rate_limits' 
    AND policyname = 'Anyone can insert rate_limits'
  ) THEN
    CREATE POLICY "Anyone can insert rate_limits" 
    ON public.rate_limits 
    FOR INSERT 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'rate_limits' 
    AND policyname = 'Admins can view rate_limits'
  ) THEN
    CREATE POLICY "Admins can view rate_limits" 
    ON public.rate_limits 
    FOR SELECT 
    USING (has_role(auth.uid(), 'admin'::app_role));
  END IF;

END $$;