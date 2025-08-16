-- Seed demo data for About section (if not exists)
INSERT INTO public.about (heading, content, image_url) 
VALUES (
  'About Me - AI Engineer & Developer',
  'Passionate AI engineer and full-stack developer with expertise in machine learning, web development, and innovative solutions. I specialize in creating intelligent applications that bridge the gap between cutting-edge AI technology and user-friendly interfaces. With a strong foundation in both technical development and creative problem-solving, I am dedicated to building the future of technology.',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  heading = EXCLUDED.heading,
  content = EXCLUDED.content;

-- Seed demo data for Skills (if not exists)
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
ON CONFLICT (skill_name) DO UPDATE SET
  category = EXCLUDED.category,
  proficiency = EXCLUDED.proficiency;

-- Seed demo data for Education (if not exists)
INSERT INTO public.education (institution, degree, start_date, end_date, description) VALUES
('MIT - Massachusetts Institute of Technology', 'Master of Science in Artificial Intelligence', '2022-09-01', '2024-06-01', 'Advanced studies in machine learning, computer vision, and natural language processing. Thesis on "Multimodal AI Systems for Real-time Decision Making".'),
('Stanford University', 'Bachelor of Science in Computer Science', '2018-09-01', '2022-06-01', 'Comprehensive computer science education with focus on algorithms, data structures, and software engineering. Graduated Magna Cum Laude.'),
('Online Coursework', 'Various AI/ML Certifications', '2021-01-01', '2023-12-01', 'Continuous learning through platforms like Coursera, edX, and Udacity. Completed specializations in Deep Learning, Computer Vision, and MLOps.')
ON CONFLICT (institution, degree) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  description = EXCLUDED.description;

-- Seed demo data for Experience (if not exists)
INSERT INTO public.experience (company, role, start_date, end_date, description) VALUES
('TechCorp AI', 'Senior AI Engineer', '2024-01-01', NULL, 'Leading development of cutting-edge AI solutions for enterprise clients. Architecting scalable machine learning pipelines and mentoring junior developers.'),
('InnovateLab', 'Full Stack Developer', '2022-06-01', '2023-12-01', 'Developed end-to-end web applications using React, Node.js, and cloud technologies. Integrated AI capabilities into existing systems.'),
('StartupXYZ', 'Junior Developer', '2021-01-01', '2022-05-01', 'Built responsive web applications and mobile apps. Gained experience in agile development and collaborative coding practices.')
ON CONFLICT (company, role) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  description = EXCLUDED.description;

-- Create demo categories (if not exists)
INSERT INTO public.categories (name) VALUES 
('AI & Machine Learning'),
('Mobile Apps'),
('Research Projects')
ON CONFLICT (name) DO NOTHING;

-- Seed demo projects (if not exists)
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
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Intelligent Chat Assistant');

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
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Portfolio Website Builder');

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
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'Computer Vision Research');