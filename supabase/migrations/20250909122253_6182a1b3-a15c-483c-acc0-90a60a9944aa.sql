-- Create hire_links table for admin management
CREATE TABLE IF NOT EXISTS public.hire_links (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    platform text NOT NULL,
    url text NOT NULL,
    description text,
    rate text,
    rating text,
    projects text,
    available boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hire_links ENABLE ROW LEVEL SECURITY;

-- Create policies for hire_links
CREATE POLICY "Public can view published hire links" 
ON public.hire_links 
FOR SELECT 
USING (available = true);

CREATE POLICY "Admins manage hire_links" 
ON public.hire_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hire_links_updated_at
    BEFORE UPDATE ON public.hire_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();