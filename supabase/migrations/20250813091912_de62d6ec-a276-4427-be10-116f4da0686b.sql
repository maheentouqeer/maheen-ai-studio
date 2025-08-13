-- SECURITY FIX: Lock down all sensitive tables with proper RLS policies
-- Remove any public access and ensure only proper roles can access sensitive data

-- 1. Fix rate_limits table - should be write-only for anon/authenticated, admin-only read
DROP POLICY IF EXISTS "Admins view rate_limits" ON public.rate_limits;
DROP POLICY IF EXISTS "Anyone can insert rate_limits" ON public.rate_limits;

CREATE POLICY "Rate limits write only" ON public.rate_limits
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins read rate_limits" ON public.rate_limits
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Ensure no public roles on admin_emails
-- The current policies are correct but let's double-check they're restrictive
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

-- 3. Add demo data for about section
INSERT INTO public.about (heading, content, image_url) VALUES 
('About Me', 'BS AI student at DUET focused on ethical, creative, and impactful AI. I build AI apps with Python, Streamlit & Hugging Face, develop AI agents (CrewAI, Agentic RAG), automate workflows (Make, no-code), design visuals, and implement RAG (LangChain, FAISS, vector DBs). Currently on a 30 AI apps in 30 days challenge.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face')
ON CONFLICT (id) DO UPDATE SET
heading = EXCLUDED.heading,
content = EXCLUDED.content,
image_url = EXCLUDED.image_url;

-- 4. Add demo skills data
INSERT INTO public.skills (skill_name, category, proficiency) VALUES 
('Python', 'Programming', 90),
('Streamlit', 'Frameworks', 85),
('Hugging Face', 'AI/ML', 80),
('LangChain', 'AI/ML', 85),
('CrewAI', 'AI/ML', 75),
('Gradio', 'Frameworks', 70),
('Java', 'Programming', 85),
('C/C++', 'Programming', 75),
('HTML/CSS', 'Web Development', 80),
('Google Colab', 'Tools', 90),
('Canva', 'Design', 85),
('Microsoft Office', 'Tools', 90)
ON CONFLICT (skill_name) DO UPDATE SET
category = EXCLUDED.category,
proficiency = EXCLUDED.proficiency;

-- 5. Add demo education data
INSERT INTO public.education (institution, degree, start_date, end_date, description) VALUES 
('Dawood University of Engineering and Technology', 'BS Artificial Intelligence', '2024-09-01', '2028-09-01', 'Comprehensive AI program covering machine learning, deep learning, and ethical AI development'),
('Icode Guru', 'AI Engineer Certification', '2025-06-01', '2025-06-30', 'Advanced certification in AI engineering and practical application development'),
('IBA GRADS', 'ECAT Preparation', '2023-09-01', '2024-06-01', 'Engineering College Admission Test preparation program'),
('Govt. Degree College Malir Cantt', 'Intermediate in Computer Science', '2022-01-01', '2024-06-01', 'Pre-university education with focus on computer science fundamentals'),
('The Educators', 'Matriculation in Computer Science', '2020-01-01', '2022-06-01', 'Secondary education with computer science specialization')
ON CONFLICT (institution, degree) DO UPDATE SET
start_date = EXCLUDED.start_date,
end_date = EXCLUDED.end_date,
description = EXCLUDED.description;

-- 6. Ensure categories exist for projects
INSERT INTO public.categories (name) VALUES 
('AI Apps'),
('Chatbots'),
('AI Art'),
('AI Agents'),
('Graphic Design')
ON CONFLICT (name) DO NOTHING;

-- 7. Add demo projects with working images
INSERT INTO public.projects (title, description, category_id, media_url, link_url, published) VALUES 
('Agentic RAG Knowledge Bot', 'A sophisticated RAG chatbot using LangChain + FAISS with agentic tools to answer domain-specific questions with high accuracy and context awareness.', 
 (SELECT id FROM public.categories WHERE name = 'Chatbots'), 
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', 
 'https://github.com/demo-project', true),

('Streamlit AI Art Studio', 'Interactive web application for generating and curating AI art using state-of-the-art Hugging Face models with custom styling and prompt engineering.', 
 (SELECT id FROM public.categories WHERE name = 'AI Art'), 
 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop', 
 'https://streamlit-demo.app', true),

('CrewAI Task Automator', 'Multi-agent automation system that orchestrates complex workflows for research, content creation, and data processing using CrewAI framework.', 
 (SELECT id FROM public.categories WHERE name = 'AI Agents'), 
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', 
 'https://github.com/crewai-automator', true),

('Brand Design Portfolio', 'Comprehensive collection of brand visuals, social media content, and marketing materials designed using Canva and Adobe Creative Suite.', 
 (SELECT id FROM public.categories WHERE name = 'Graphic Design'), 
 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', 
 'https://behance.net/portfolio', true),

('30 AI Apps Challenge', 'Highlights and documentation from the intensive "30 AI apps in 30 days" challenge, showcasing rapid prototyping and diverse AI applications.', 
 (SELECT id FROM public.categories WHERE name = 'AI Apps'), 
 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', 
 'https://30-ai-apps.demo.com', true),

('Computer Vision Pipeline', 'End-to-end computer vision solution for object detection and classification using PyTorch and OpenCV with real-time processing capabilities.', 
 (SELECT id FROM public.categories WHERE name = 'AI Apps'), 
 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&h=400&fit=crop', 
 'https://github.com/cv-pipeline', true)
ON CONFLICT (title) DO UPDATE SET
description = EXCLUDED.description,
media_url = EXCLUDED.media_url,
link_url = EXCLUDED.link_url,
published = EXCLUDED.published;