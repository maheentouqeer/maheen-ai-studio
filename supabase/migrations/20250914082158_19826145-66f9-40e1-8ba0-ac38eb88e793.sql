-- Seed sample content for the portfolio
-- This migration adds demo content to showcase the portfolio

-- Insert sample skills
INSERT INTO public.skills (skill_name, category, proficiency) VALUES
  ('Python', 'Programming', 95),
  ('JavaScript/TypeScript', 'Programming', 90),
  ('React/Next.js', 'Frontend', 90),
  ('Node.js', 'Backend', 85),
  ('Machine Learning', 'AI/ML', 92),
  ('Deep Learning', 'AI/ML', 88),
  ('Natural Language Processing', 'AI/ML', 85),
  ('Computer Vision', 'AI/ML', 80),
  ('TensorFlow/PyTorch', 'AI/ML', 87),
  ('SQL/PostgreSQL', 'Database', 85),
  ('Docker', 'DevOps', 80),
  ('Git/GitHub', 'Tools', 95),
  ('AWS/Azure', 'Cloud', 75)
ON CONFLICT (skill_name) DO NOTHING;

-- Insert sample education
INSERT INTO public.education (institution, degree, description, start_date, end_date) VALUES
  ('DUET (Dawood University of Engineering & Technology)', 'BS Artificial Intelligence', 'Comprehensive program covering machine learning, deep learning, computer vision, natural language processing, and ethical AI development. Focus on practical applications and real-world problem solving.', '2023-01-01', '2027-01-01'),
  ('Coursera', 'Machine Learning Specialization', 'Completed Andrew Ng''s comprehensive ML course series covering supervised and unsupervised learning, neural networks, and practical ML applications.', '2022-06-01', '2022-12-01'),
  ('edX', 'Introduction to Computer Science', 'Harvard CS50 - Foundational computer science concepts including algorithms, data structures, and software engineering principles.', '2022-01-01', '2022-05-01')
ON CONFLICT (institution, degree) DO NOTHING;

-- Insert sample experience
INSERT INTO public.experience (company, role, description, start_date, end_date) VALUES
  ('Freelance', 'AI Engineer & Developer', 'Building custom AI solutions for clients including chatbots, recommendation systems, and data analysis tools. Completed 30+ AI projects with focus on practical business applications.', '2023-01-01', NULL),
  ('Tech Startup', 'Junior ML Engineer', 'Developed machine learning models for customer behavior prediction and implemented automated data pipelines. Improved model accuracy by 25% through feature engineering and hyperparameter tuning.', '2022-08-01', '2022-12-01'),
  ('Open Source Projects', 'Contributor', 'Active contributor to various AI/ML open source projects. Specialized in creating educational content and tutorials for beginner developers entering the AI field.', '2022-01-01', NULL)
ON CONFLICT (company, role) DO NOTHING;

-- Insert sample categories
INSERT INTO public.categories (name) VALUES
  ('AI/ML Applications'),
  ('Web Development'),
  ('Data Science'),
  ('Computer Vision'),
  ('NLP Projects'),
  ('Full-Stack Apps')
ON CONFLICT (name) DO NOTHING;

-- Insert sample projects (using category names for simplicity)
INSERT INTO public.projects (title, description, media_url, link_url, published, category_id) VALUES
  ('AI Chatbot Platform', 'Intelligent conversational AI built with advanced NLP techniques. Features context awareness, multi-language support, and custom knowledge base integration. Serves 1000+ daily users.', '/src/assets/demo-project-1.jpg', 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'AI/ML Applications' LIMIT 1)),
  ('Computer Vision Analytics', 'Real-time object detection and tracking system using YOLOv8 and OpenCV. Deployed for retail analytics with 95% accuracy in product recognition and customer behavior analysis.', '/src/assets/demo-project-2.jpg', 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'Computer Vision' LIMIT 1)),
  ('Full-Stack E-commerce', 'Modern e-commerce platform with React frontend, Node.js backend, and PostgreSQL database. Features include real-time inventory, payment integration, and admin dashboard.', '/src/assets/demo-project-3.jpg', 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'Web Development' LIMIT 1)),
  ('Sentiment Analysis API', 'RESTful API for sentiment analysis of text data using transformer models. Processes 10k+ requests daily with sub-second response times. Includes batch processing capabilities.', NULL, 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'NLP Projects' LIMIT 1)),
  ('Data Visualization Dashboard', 'Interactive dashboard for business intelligence using D3.js and React. Features real-time data updates, custom chart types, and export capabilities for stakeholder reporting.', NULL, 'https://github.com/maheen', true, (SELECT id FROM categories WHERE name = 'Data Science' LIMIT 1))
ON CONFLICT (title) DO NOTHING;

-- Insert sample hire links
INSERT INTO public.hire_links (platform, url, description, rate, rating, projects, available) VALUES
  ('Upwork', 'https://upwork.com/freelancers/maheen', 'Top-rated AI/ML specialist with 100% job success rate. Expertise in custom AI solutions, data science, and full-stack development.', '$50-80/hr', '5.0★ (50+ reviews)', '50+ completed', true),
  ('Fiverr', 'https://fiverr.com/maheen_ai', 'Level 2 seller specializing in AI applications and machine learning models. Fast delivery and exceptional quality guaranteed.', 'Starting at $100', '4.9★ (100+ reviews)', '100+ delivered', true),
  ('LinkedIn', 'https://linkedin.com/in/maheen-touqeer', 'Connect for AI consulting, project collaboration, and professional opportunities. Open to both freelance and full-time positions.', 'Negotiable', 'Professional Network', 'Portfolio Available', true)
ON CONFLICT (platform, url) DO NOTHING;

-- Insert about section
INSERT INTO public.about (heading, content, image_url) VALUES
  ('Maheen Touqeer', 'Passionate AI engineer and full-stack developer dedicated to building innovative solutions that make a real impact. Currently pursuing BS in Artificial Intelligence at DUET while working on cutting-edge projects that bridge the gap between academic research and practical applications.

I specialize in creating AI-powered applications, from intelligent chatbots to computer vision systems. My approach combines technical expertise with creative problem-solving to deliver solutions that are not only functional but also user-friendly and scalable.

When I''m not coding, you''ll find me contributing to open-source projects, writing technical blogs, or exploring the latest developments in AI and machine learning. I believe in the power of technology to solve real-world problems and am committed to developing ethical AI solutions.', '/src/assets/maheen-3d-avatar.jpg')
ON CONFLICT (heading) DO NOTHING;