-- Complete database security and demo content migration
-- Fix RLS policies with safe checks and seed demo data

-- Ensure unique constraints exist before policies
DO $$ 
BEGIN
  -- Add unique constraint on admin_emails if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admin_emails_email_key' AND conrelid = 'public.admin_emails'::regclass
  ) THEN
    ALTER TABLE public.admin_emails ADD CONSTRAINT admin_emails_email_key UNIQUE (email);
  END IF;

  -- Add unique constraint on user_roles if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key' AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Drop existing policies safely
DO $$ 
BEGIN
  -- Drop contacts policies
  DROP POLICY IF EXISTS "Public can view contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Anyone can submit contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admins view contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admins update contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admins delete contacts" ON public.contacts;

  -- Drop admin_emails policies
  DROP POLICY IF EXISTS "Public can view admin_emails" ON public.admin_emails;
  DROP POLICY IF EXISTS "Admins read admin_emails" ON public.admin_emails;
  DROP POLICY IF EXISTS "Admins write admin_emails" ON public.admin_emails;

  -- Drop user_roles policies
  DROP POLICY IF EXISTS "Public can view user_roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins manage user_roles" ON public.user_roles;

  -- Drop rate_limits policies
  DROP POLICY IF EXISTS "Public can view rate_limits" ON public.rate_limits;
  DROP POLICY IF EXISTS "Anyone can insert rate_limits" ON public.rate_limits;
  DROP POLICY IF EXISTS "Admins view rate_limits" ON public.rate_limits;
END $$;

-- Enable RLS on all tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies

-- CONTACTS: Admin-only SELECT, anon/auth INSERT only
CREATE POLICY "Admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contacts" 
ON public.contacts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- ADMIN_EMAILS: Admin-only SELECT, no public read
CREATE POLICY "Admins manage admin_emails" 
ON public.admin_emails 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES: Only authenticated users can view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins manage user_roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RATE_LIMITS: Insert only, no public read
CREATE POLICY "Anyone can insert rate_limits" 
ON public.rate_limits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view rate_limits" 
ON public.rate_limits 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for media bucket
DO $$ 
BEGIN
  -- Create media bucket if not exists
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;

-- Create storage policies
CREATE POLICY "Public can view media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role));

-- Seed demo data
-- Clear existing demo data first
DELETE FROM public.about WHERE heading = 'About Me - Demo';
DELETE FROM public.skills WHERE skill_name LIKE '%Demo%';
DELETE FROM public.education WHERE institution LIKE '%Demo%';
DELETE FROM public.categories WHERE name IN ('Web Development', 'Mobile Apps', 'AI/ML');
DELETE FROM public.projects WHERE title LIKE '%Demo%';

-- Insert demo about content
INSERT INTO public.about (heading, content, image_url) VALUES (
  'About Me - Demo',
  'I am a passionate AI Engineer and Full-Stack Developer with expertise in cutting-edge technologies. I specialize in building intelligent systems that bridge the gap between artificial intelligence and practical applications. With a strong foundation in machine learning, neural networks, and modern web development, I create solutions that are both innovative and user-friendly. My experience spans from developing sophisticated AI models to crafting beautiful, responsive web applications that deliver exceptional user experiences.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
);

-- Insert demo skills
INSERT INTO public.skills (skill_name, proficiency, category) VALUES 
('Python Demo', 95, 'Programming'),
('JavaScript Demo', 90, 'Programming'),
('React Demo', 88, 'Frontend'),
('Node.js Demo', 85, 'Backend'),
('TensorFlow Demo', 82, 'AI/ML'),
('PyTorch Demo', 80, 'AI/ML'),
('SQL Demo', 87, 'Database'),
('Docker Demo', 75, 'DevOps'),
('AWS Demo', 78, 'Cloud'),
('Git Demo', 92, 'Tools');

-- Insert demo education
INSERT INTO public.education (institution, degree, start_date, end_date, description) VALUES 
('MIT Demo University', 'Master of Science in Artificial Intelligence', '2020-09-01', '2022-06-15', 'Advanced studies in machine learning, neural networks, and cognitive computing with focus on practical AI applications.'),
('Stanford Demo College', 'Bachelor of Science in Computer Science', '2016-09-01', '2020-05-20', 'Comprehensive computer science foundation with specialization in algorithms, data structures, and software engineering.');

-- Insert demo categories
INSERT INTO public.categories (name) VALUES 
('Web Development'),
('Mobile Apps'),
('AI/ML');

-- Insert demo projects
INSERT INTO public.projects (title, description, media_url, link_url, category_id, published) VALUES 
(
  'AI Portfolio Assistant Demo',
  'An intelligent portfolio assistant powered by machine learning that helps visitors navigate and understand my work. Features natural language processing, contextual responses, and seamless integration with portfolio content.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  'https://github.com/example/ai-portfolio',
  (SELECT id FROM public.categories WHERE name = 'AI/ML'),
  true
),
(
  'E-Commerce Platform Demo',
  'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include real-time inventory management, secure payment processing, and advanced analytics dashboard.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  'https://github.com/example/ecommerce',
  (SELECT id FROM public.categories WHERE name = 'Web Development'),
  true
),
(
  'Mobile Fitness Tracker Demo',
  'A cross-platform mobile application for fitness tracking with AI-powered workout recommendations. Built with React Native and integrated with health monitoring APIs.',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop',
  'https://github.com/example/fitness-tracker',
  (SELECT id FROM public.categories WHERE name = 'Mobile Apps'),
  true
),
(
  'Neural Network Visualizer Demo',
  'Interactive web application for visualizing neural network architectures and training processes. Helps students and researchers understand deep learning concepts through dynamic visualizations.',
  'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=600&h=400&fit=crop',
  'https://github.com/example/neural-viz',
  (SELECT id FROM public.categories WHERE name = 'AI/ML'),
  true
);

-- Add admin email for demo (replace with your actual email)
INSERT INTO public.admin_emails (email) VALUES ('admin@demo.com')
ON CONFLICT (email) DO NOTHING;