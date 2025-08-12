-- Fix linter: set search_path for SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.assign_admin_if_listed()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
