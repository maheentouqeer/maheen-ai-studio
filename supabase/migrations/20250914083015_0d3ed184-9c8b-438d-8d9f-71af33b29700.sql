-- Simple seed content for the portfolio (no conflicts)
-- Delete existing sample data first to avoid duplicates
DELETE FROM public.projects WHERE title LIKE '%Demo%' OR title IN ('AI Chatbot Platform', 'Computer Vision Analytics', 'Full-Stack E-commerce');
DELETE FROM public.skills WHERE skill_name IN ('Python', 'JavaScript/TypeScript', 'React/Next.js');
DELETE FROM public.education WHERE institution LIKE 'DUET%';
DELETE FROM public.experience WHERE company = 'Freelance';
DELETE FROM public.categories WHERE name IN ('AI/ML Applications', 'Web Development');
DELETE FROM public.hire_links WHERE platform IN ('Upwork', 'Fiverr', 'LinkedIn');
DELETE FROM public.about WHERE heading = 'Maheen Touqeer';

-- Insert sample skills
INSERT INTO public.skills (skill_name, category, proficiency) VALUES
  ('Python', 'Programming', 95),
  ('JavaScript/TypeScript', 'Programming', 90),
  ('React/Next.js', 'Frontend', 90),
  ('Machine Learning', 'AI/ML', 92),
  ('Deep Learning', 'AI/ML', 88),
  ('TensorFlow/PyTorch', 'AI/ML', 87);

-- Insert sample education  
INSERT INTO public.education (institution, degree, description, start_date, end_date) VALUES
  ('DUET (Dawood University of Engineering & Technology)', 'BS Artificial Intelligence', 'Comprehensive program covering machine learning, deep learning, computer vision, and NLP. Focus on practical applications and ethical AI development.', '2023-01-01', '2027-01-01');

-- Insert sample experience
INSERT INTO public.experience (company, role, description, start_date, end_date) VALUES
  ('Freelance', 'AI Engineer & Developer', 'Building custom AI solutions for clients including chatbots, recommendation systems, and data analysis tools. Completed 30+ AI projects with focus on practical business applications.', '2023-01-01', NULL);

-- Insert sample categories
INSERT INTO public.categories (name) VALUES
  ('AI/ML Applications'),
  ('Web Development'),
  ('Data Science');

-- Insert sample projects
INSERT INTO public.projects (title, description, media_url, link_url, published, category_id) VALUES
  ('AI Chatbot Platform', 'Intelligent conversational AI with advanced NLP techniques and custom knowledge base integration.', '/src/assets/demo-project-1.jpg', 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'AI/ML Applications' LIMIT 1)),
  ('Computer Vision Analytics', 'Real-time object detection system using YOLOv8 with 95% accuracy in product recognition.', '/src/assets/demo-project-2.jpg', 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'AI/ML Applications' LIMIT 1));

-- Insert sample hire links
INSERT INTO public.hire_links (platform, url, description, rate, rating, projects, available) VALUES
  ('Upwork', 'https://upwork.com/freelancers/maheen', 'Top-rated AI/ML specialist with 100% job success rate.', '$50-80/hr', '5.0★ (50+ reviews)', '50+ completed', true);

-- Insert about section
INSERT INTO public.about (heading, content, image_url) VALUES
  ('Maheen Touqeer', 'Passionate AI engineer and full-stack developer dedicated to building innovative solutions that make a real impact. Currently pursuing BS in Artificial Intelligence at DUET while working on cutting-edge projects.', '/src/assets/maheen-3d-avatar.jpg');