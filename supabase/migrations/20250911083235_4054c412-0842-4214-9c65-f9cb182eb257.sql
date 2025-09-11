-- Seed comprehensive content for Skills, Education, Experience, About, and Projects
-- Insert Skills data
INSERT INTO public.skills (skill_name, category, proficiency) VALUES
('Python', 'Programming Languages', 95),
('JavaScript', 'Programming Languages', 90),
('TypeScript', 'Programming Languages', 85),
('React', 'Frontend Frameworks', 90),
('Next.js', 'Frontend Frameworks', 85),
('Node.js', 'Backend Technologies', 80),
('FastAPI', 'Backend Technologies', 85),
('PostgreSQL', 'Databases', 80),
('Supabase', 'Databases', 85),
('TensorFlow', 'AI/ML Frameworks', 90),
('PyTorch', 'AI/ML Frameworks', 85),
('OpenAI API', 'AI/ML Tools', 95),
('Hugging Face', 'AI/ML Tools', 80),
('Docker', 'DevOps', 75),
('Git', 'Development Tools', 90),
('Figma', 'Design Tools', 70),
('Adobe Creative Suite', 'Design Tools', 65),
('AWS', 'Cloud Platforms', 70),
('Google Cloud', 'Cloud Platforms', 75),
('Firebase', 'Cloud Platforms', 80);

-- Insert Education data
INSERT INTO public.education (institution, degree, description, start_date, end_date) VALUES
('Dawood University of Engineering and Technology (DUET)', 'Bachelor of Science in Artificial Intelligence', 'Comprehensive study of AI fundamentals, machine learning algorithms, deep learning, computer vision, natural language processing, and ethical AI development. Focus on practical applications and cutting-edge research in generative AI.', '2022-09-01', '2026-06-30'),
('Self-Directed Learning', 'AI Engineering Certification', 'Intensive self-study program covering advanced AI topics including LLMs, prompt engineering, AI safety, and enterprise AI solutions. Completed multiple online courses and built 30+ AI applications.', '2023-01-01', '2024-12-31'),
('Various Online Platforms', 'Continuous Professional Development', 'Ongoing learning through Coursera, edX, and specialized AI platforms. Certificates in machine learning, deep learning, and generative AI from leading institutions.', '2021-01-01', NULL);

-- Insert Experience data  
INSERT INTO public.experience (company, role, description, start_date, end_date) VALUES
('Freelance', 'AI Engineer & Consultant', 'Developing custom AI solutions for businesses including chatbots, automation tools, and AI-powered web applications. Successfully completed 50+ projects with focus on generative AI and LLM integration.', '2023-06-01', NULL),
('Personal Projects', 'Generative AI Developer', 'Created 30 AI applications in 30 days challenge, showcasing expertise in various AI domains including text generation, image creation, voice synthesis, and data analysis tools.', '2024-01-01', '2024-02-01'),
('Open Source Community', 'AI Researcher & Contributor', 'Contributing to open-source AI projects, publishing research on ethical AI development, and mentoring junior developers in the AI community.', '2023-01-01', NULL);

-- Insert About data
INSERT INTO public.about (heading, content, image_url) VALUES
('Welcome to My AI Universe', 'I''m Maheen, a passionate AI Engineer and Generative AI Developer currently pursuing my Bachelor''s in Artificial Intelligence at DUET. With a mission to build ethical AI solutions that make a positive impact, I''ve successfully completed the ambitious "30 AI Apps in 30 Days" challenge and helped numerous businesses integrate cutting-edge AI into their operations.

My expertise spans across machine learning, deep learning, natural language processing, and generative AI. I specialize in creating intelligent applications that solve real-world problems while maintaining the highest standards of AI ethics and safety.

When I''m not coding the next breakthrough AI application, you''ll find me researching the latest developments in artificial intelligence, contributing to open-source projects, or sharing knowledge with the growing AI community.', '/assets/profile-illustration.jpg');

-- Insert Categories for projects
INSERT INTO public.categories (name) VALUES 
('Generative AI'),
('Machine Learning'),
('Web Applications'),
('Data Science'),
('Computer Vision'),
('Natural Language Processing');

-- Insert demo projects
INSERT INTO public.projects (title, description, media_url, link_url, published, category_id) VALUES
('AI Content Generator Suite', 'A comprehensive platform for generating high-quality content using advanced language models. Features include blog post generation, social media content creation, and SEO optimization tools. Built with React, Node.js, and integrated with multiple AI APIs.', '/assets/demo-project-1.jpg', 'https://github.com/maheen-ai/content-generator', true, (SELECT id FROM public.categories WHERE name = 'Generative AI' LIMIT 1)),
('Smart Customer Support Chatbot', 'An intelligent customer support system powered by natural language processing and machine learning. The bot can handle complex queries, escalate to human agents when needed, and learn from interactions to improve over time.', '/assets/demo-project-2.jpg', 'https://github.com/maheen-ai/smart-chatbot', true, (SELECT id FROM public.categories WHERE name = 'Machine Learning' LIMIT 1)),
('AI-Powered Portfolio Website', 'A dynamic portfolio website with AI-enhanced features including automated content generation, smart project categorization, and personalized user experiences. Showcases modern web development with AI integration.', '/assets/demo-project-3.jpg', 'https://github.com/maheen-ai/ai-portfolio', true, (SELECT id FROM public.categories WHERE name = 'Web Applications' LIMIT 1));

-- Insert hire links
INSERT INTO public.hire_links (platform, url, description, rate, rating, projects, available) VALUES
('Upwork', 'https://upwork.com/maheen-ai', 'Top Rated AI Engineer specializing in generative AI solutions and custom ML applications', '$50-80/hr', '5.0 ⭐ (98% Job Success)', '50+ Completed', true),
('Fiverr', 'https://fiverr.com/maheen_ai_dev', 'Level 2 Seller offering AI development services, chatbot creation, and ML consulting', 'Starting at $150', '4.9 ⭐ (500+ Reviews)', '200+ Gigs Completed', true),
('LinkedIn', 'https://linkedin.com/in/maheen-ai-engineer', 'Connect with me for AI consulting, collaboration opportunities, and professional networking', 'Consultation Available', 'Open to Connect', 'Portfolio Available', true);