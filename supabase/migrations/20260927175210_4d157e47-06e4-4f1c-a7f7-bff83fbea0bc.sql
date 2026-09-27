ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
WITH o AS (SELECT id, row_number() OVER (ORDER BY created_at DESC) AS rn FROM public.projects)
UPDATE public.projects p SET sort_order = o.rn FROM o WHERE o.id = p.id;