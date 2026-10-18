DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contacts;
DROP POLICY IF EXISTS "Anyone can insert rate_limits" ON public.rate_limits;
DROP POLICY IF EXISTS "Service role can insert rate_limits" ON public.rate_limits;
GRANT INSERT ON public.contacts TO service_role;
GRANT ALL ON public.rate_limits TO service_role;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Public read media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;