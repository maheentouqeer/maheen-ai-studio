-- Drop the existing function and trigger first
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
DROP FUNCTION IF EXISTS public.assign_admin_if_listed();

-- Create the function to auto-assign admin role on signup
CREATE FUNCTION public.assign_admin_if_listed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is in admin_emails
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = NEW.email) THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_if_listed();

-- Manually assign admin role to existing user with the email
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT au.id, au.email 
    FROM auth.users au
    INNER JOIN public.admin_emails ae ON au.email = ae.email
  LOOP
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_record.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;