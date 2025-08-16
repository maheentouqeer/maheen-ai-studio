-- Complete database security fix with safe DO blocks as requested
-- Apply Row Level Security (RLS) across all sensitive tables

-- Contacts Table Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Admin only can read contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contacts;
  DROP POLICY IF EXISTS "Admin can update contacts" ON public.contacts;
  DROP POLICY IF EXISTS "Admin can delete contacts" ON public.contacts;
  
  -- Create new secure policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Admin can select contacts'
  ) THEN
    CREATE POLICY "Admin can select contacts"
      ON public.contacts
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Anyone can insert contacts'
  ) THEN
    CREATE POLICY "Anyone can insert contacts"
      ON public.contacts
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Admin can update contacts'
  ) THEN
    CREATE POLICY "Admin can update contacts"
      ON public.contacts
      FOR UPDATE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'Admin can delete contacts'
  ) THEN
    CREATE POLICY "Admin can delete contacts"
      ON public.contacts
      FOR DELETE
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Admin Emails Table Security
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Admin exclusive access to admin_emails" ON public.admin_emails;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_emails' AND policyname = 'Admin can read admin_emails'
  ) THEN
    CREATE POLICY "Admin can read admin_emails"
      ON public.admin_emails
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'admin_emails' AND policyname = 'Admin can manage admin_emails'
  ) THEN
    CREATE POLICY "Admin can manage admin_emails"
      ON public.admin_emails
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- User Roles Table Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users view own roles only" ON public.user_roles;
  DROP POLICY IF EXISTS "Admin full access to user_roles" ON public.user_roles;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Users can read their own roles'
  ) THEN
    CREATE POLICY "Users can read their own roles"
      ON public.user_roles
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_roles' AND policyname = 'Admin can manage user_roles'
  ) THEN
    CREATE POLICY "Admin can manage user_roles"
      ON public.user_roles
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Rate Limits Table Security
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Anyone can insert rate_limits" ON public.rate_limits;
  DROP POLICY IF EXISTS "Admins can view rate_limits" ON public.rate_limits;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'rate_limits' AND policyname = 'Anyone can insert rate_limits'
  ) THEN
    CREATE POLICY "Anyone can insert rate_limits"
      ON public.rate_limits
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'rate_limits' AND policyname = 'Admin can read rate_limits'
  ) THEN
    CREATE POLICY "Admin can read rate_limits"
      ON public.rate_limits
      FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::app_role));
  END IF;
END $$;

-- Seed demo data for About section
INSERT INTO public.about (heading, content, image_url) 
VALUES (
  'About Me - AI Engineer & Developer',
  'Passionate AI engineer and full-stack developer with expertise in machine learning, web development, and innovative solutions. I specialize in creating intelligent applications that bridge the gap between cutting-edge AI technology and user-friendly interfaces. With a strong foundation in both technical development and creative problem-solving, I am dedicated to building the future of technology.',
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Seed demo data for Skills
INSERT INTO public.skills (skill_name, category, proficiency) VALUES
('Python', 'Programming', 95),
('JavaScript', 'Programming', 90),
('TypeScript', 'Programming', 85),
('React', 'Frontend', 90),
('Node.js', 'Backend', 85),
('Machine Learning', 'AI/ML', 95),
('TensorFlow', 'AI/ML', 85),
('PyTorch', 'AI/ML', 80),
('Computer Vision', 'AI/ML', 85),
('Natural Language Processing', 'AI/ML', 80),
('PostgreSQL', 'Database', 85),
('MongoDB', 'Database', 75),
('Docker', 'DevOps', 80),
('AWS', 'Cloud', 75),
('Git', 'Tools', 90)
ON CONFLICT (id) DO NOTHING;

-- Seed demo data for Education
INSERT INTO public.education (institution, degree, start_date, end_date, description) VALUES
('MIT - Massachusetts Institute of Technology', 'Master of Science in Artificial Intelligence', '2022-09-01', '2024-06-01', 'Advanced studies in machine learning, computer vision, and natural language processing. Thesis on "Multimodal AI Systems for Real-time Decision Making".'),
('Stanford University', 'Bachelor of Science in Computer Science', '2018-09-01', '2022-06-01', 'Comprehensive computer science education with focus on algorithms, data structures, and software engineering. Graduated Magna Cum Laude.'),
('Online Coursework', 'Various AI/ML Certifications', '2021-01-01', '2023-12-01', 'Continuous learning through platforms like Coursera, edX, and Udacity. Completed specializations in Deep Learning, Computer Vision, and MLOps.')
ON CONFLICT (id) DO NOTHING;

-- Seed demo data for Experience
INSERT INTO public.experience (company, role, start_date, end_date, description) VALUES
('TechCorp AI', 'Senior AI Engineer', '2024-01-01', NULL, 'Leading development of cutting-edge AI solutions for enterprise clients. Architecting scalable machine learning pipelines and mentoring junior developers.'),
('InnovateLab', 'Full Stack Developer', '2022-06-01', '2023-12-01', 'Developed end-to-end web applications using React, Node.js, and cloud technologies. Integrated AI capabilities into existing systems.'),
('StartupXYZ', 'Junior Developer', '2021-01-01', '2022-05-01', 'Built responsive web applications and mobile apps. Gained experience in agile development and collaborative coding practices.')
ON CONFLICT (id) DO NOTHING;

-- Create demo category
INSERT INTO public.categories (name) VALUES 
('AI & Machine Learning'),
('Web Development'),
('Mobile Apps'),
('Research Projects')
ON CONFLICT (id) DO NOTHING;

-- Seed demo projects
WITH demo_category AS (
  SELECT id FROM public.categories WHERE name = 'AI & Machine Learning' LIMIT 1
)
INSERT INTO public.projects (title, description, category_id, media_url, link_url, published) 
SELECT 
  'Intelligent Chat Assistant',
  'Advanced conversational AI system built with modern NLP techniques. Features real-time responses, context awareness, and multi-language support.',
  demo_category.id,
  NULL,
  'https://github.com/example/chat-assistant',
  true
FROM demo_category
ON CONFLICT (id) DO NOTHING;

WITH demo_category AS (
  SELECT id FROM public.categories WHERE name = 'Web Development' LIMIT 1
)
INSERT INTO public.projects (title, description, category_id, media_url, link_url, published) 
SELECT 
  'Portfolio Website Builder',
  'Dynamic portfolio generation platform with drag-and-drop interface, responsive design, and SEO optimization.',
  demo_category.id,
  NULL,
  'https://github.com/example/portfolio-builder',
  true
FROM demo_category
ON CONFLICT (id) DO NOTHING;

WITH demo_category AS (
  SELECT id FROM public.categories WHERE name = 'Research Projects' LIMIT 1
)
INSERT INTO public.projects (title, description, category_id, media_url, link_url, published) 
SELECT 
  'Computer Vision Research',
  'Novel approach to real-time object detection and tracking using advanced deep learning architectures.',
  demo_category.id,
  NULL,
  'https://arxiv.org/example-paper',
  true
FROM demo_category
ON CONFLICT (id) DO NOTHING;