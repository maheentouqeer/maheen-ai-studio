-- Fix security issues: Ensure contacts table has proper admin-only SELECT access
-- and fix admin_emails and user_roles public access

-- Drop existing policies if they exist and recreate them correctly
DROP POLICY IF EXISTS "Public can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can view contacts" ON public.contacts;

-- Ensure contacts table only allows admin SELECT access (keep existing admin policies)
CREATE POLICY "Admins view contacts" ON public.contacts
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix admin_emails table - remove any public access
DROP POLICY IF EXISTS "Public can view admin_emails" ON public.admin_emails;
DROP POLICY IF EXISTS "Anyone can view admin_emails" ON public.admin_emails;

-- Ensure admin_emails is admin-only
CREATE POLICY "Admins read admin_emails" ON public.admin_emails
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins write admin_emails" ON public.admin_emails
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles table - remove public access
DROP POLICY IF EXISTS "Public can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can view user_roles" ON public.user_roles;

-- Ensure user_roles only allows users to see their own roles and admins to see all
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins manage user_roles" ON public.user_roles
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));