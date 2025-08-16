-- Fix remaining RLS policy issues for security scan
-- Ensure proper access control

-- Drop all existing problematic policies
DO $$ 
BEGIN
  -- Drop and recreate contacts policies with stricter access
  DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Anyone can submit contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admins can update contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admins can delete contacts" ON public.contacts;
  
  -- Drop and recreate admin_emails policies
  DROP POLICY IF EXISTS "Admins manage admin_emails" ON public.admin_emails;
  
  -- Drop and recreate user_roles policies
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins manage user_roles" ON public.user_roles;
END $$;

-- Create SECURE RLS policies

-- CONTACTS: Strictest security - admin read only, public can only insert
CREATE POLICY "Admin only can read contacts" 
ON public.contacts 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can submit contact forms" 
ON public.contacts 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin can update contacts" 
ON public.contacts 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete contacts" 
ON public.contacts 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ADMIN_EMAILS: Complete admin-only access
CREATE POLICY "Admin exclusive access to admin_emails" 
ON public.admin_emails 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES: Users see own roles, admins see all
CREATE POLICY "Users view own roles only" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admin full access to user_roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));