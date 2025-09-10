-- Fix RLS policies with idempotent approach
DO $$
BEGIN
    -- Ensure contacts table RLS is enabled
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'contacts' AND relrowsecurity = true) THEN
        ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Ensure admin_emails table RLS is enabled  
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'admin_emails' AND relrowsecurity = true) THEN
        ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Ensure user_roles table RLS is enabled
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_roles' AND relrowsecurity = true) THEN
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Ensure rate_limits table RLS is enabled
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'rate_limits' AND relrowsecurity = true) THEN
        ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
    END IF;
END
$$;