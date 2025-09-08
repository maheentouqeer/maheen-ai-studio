-- Populate demo data for portfolio

-- Insert demo about data
INSERT INTO public.about (heading, content, image_url) VALUES 
('About Me', 'BS AI student at DUET focused on ethical, creative, and impactful AI. I build AI apps with Python, Streamlit & Hugging Face, develop AI agents (CrewAI, Agentic RAG), automate workflows (Make, no-code), design visuals, and implement RAG (LangChain, FAISS, vector DBs). Currently on a 30 AI apps in 30 days challenge.', null)
ON CONFLICT DO NOTHING;

-- Insert demo skills data
INSERT INTO public.skills (skill_name, category, proficiency) VALUES 
('Python', 'Programming', 90),
('Streamlit', 'Frameworks', 85),
('Hugging Face', 'AI/ML', 80),
('LangChain', 'AI/ML', 85),
('CrewAI', 'AI/ML', 75),
('Gradio', 'Frameworks', 70),
('Java', 'Programming', 80),
('C/C++', 'Programming', 75),
('HTML/CSS', 'Web Development', 85),
('Google Colab', 'Tools', 90),
('Canva', 'Design', 85),
('MS Office', 'Productivity', 90),
('Object-Oriented Programming', 'Programming', 90),
('Microsoft Excel', 'Productivity', 95)
ON CONFLICT DO NOTHING;

-- Insert demo education data
INSERT INTO public.education (institution, degree, start_date, end_date, description) VALUES 
('Dawood University of Engineering and Technology', 'BS Artificial Intelligence', '2024-09-01', '2028-09-01', 'Pursuing Bachelor of Science in Artificial Intelligence with focus on ethical AI development and practical applications.'),
('Icode Guru', 'AI Engineer Certification', '2025-06-01', '2025-06-30', 'Intensive AI engineering program covering machine learning, deep learning, and AI application development.'),
('IBA GRADS', 'ECAT Preparation', '2023-09-01', '2024-06-01', 'Engineering College Admission Test preparation with focus on mathematics and computer science fundamentals.'),
('Govt. Degree College Malir Cantt', 'Intermediate, Computer Science', '2022-01-01', '2024-01-01', 'Completed Higher Secondary Education with specialization in Computer Science and Mathematics.'),
('The Educators', 'Matriculation, Computer Science', '2020-01-01', '2022-01-01', 'Secondary School Certificate with Computer Science major and strong academic performance.')
ON CONFLICT DO NOTHING;

-- Insert demo experience data  
INSERT INTO public.experience (company, role, start_date, end_date, description) VALUES 
('Freelance', 'AI App Developer', '2024-01-01', null, 'Developing AI applications using Python, Streamlit, and Hugging Face. Currently working on a 30 AI apps in 30 days challenge to showcase versatility in AI development.'),
('Various Clients', 'Graphic Designer', '2023-06-01', null, 'Creating visual content and brand materials using Canva and other design tools. Specializing in modern, clean designs for tech companies and startups.'),
('Personal Projects', 'AI Research & Development', '2023-01-01', null, 'Researching and implementing AI agents using CrewAI, building RAG systems with LangChain and FAISS, and exploring generative AI applications.')
ON CONFLICT DO NOTHING;

-- Insert demo categories
INSERT INTO public.categories (name) VALUES 
('AI Apps'),
('Chatbots'), 
('AI Art'),
('Graphic Design'),
('AI Agents'),
('Web Development')
ON CONFLICT DO NOTHING;

-- Insert demo projects (we'll get category IDs first)
DO $$
DECLARE 
    ai_apps_id uuid;
    chatbots_id uuid;
    ai_art_id uuid;
    design_id uuid;
    agents_id uuid;
    web_id uuid;
BEGIN
    SELECT id INTO ai_apps_id FROM public.categories WHERE name = 'AI Apps' LIMIT 1;
    SELECT id INTO chatbots_id FROM public.categories WHERE name = 'Chatbots' LIMIT 1;
    SELECT id INTO ai_art_id FROM public.categories WHERE name = 'AI Art' LIMIT 1;
    SELECT id INTO design_id FROM public.categories WHERE name = 'Graphic Design' LIMIT 1;
    SELECT id INTO agents_id FROM public.categories WHERE name = 'AI Agents' LIMIT 1;
    SELECT id INTO web_id FROM public.categories WHERE name = 'Web Development' LIMIT 1;

    INSERT INTO public.projects (title, description, category_id, published, link_url) VALUES 
    ('AI Chat Assistant', 'An intelligent chatbot built with Python and Streamlit that can answer questions, provide recommendations, and help with various tasks using advanced NLP models.', chatbots_id, true, 'https://github.com/maheen'),
    ('Streamlit AI Art Studio', 'Interactive web application for generating and editing AI art using Hugging Face Diffusers. Features multiple art styles and customization options.', ai_art_id, true, 'https://github.com/maheen'),
    ('CrewAI Task Automation', 'Multi-agent system built with CrewAI for automating research tasks, content creation, and data analysis workflows.', agents_id, true, 'https://github.com/maheen'),
    ('RAG Knowledge Base', 'Retrieval-Augmented Generation system using LangChain and FAISS for creating intelligent knowledge bases that can answer domain-specific questions.', ai_apps_id, true, 'https://github.com/maheen'),
    ('Brand Identity Suite', 'Complete brand identity design including logos, color schemes, and marketing materials created for various tech startups and AI companies.', design_id, true, 'https://behance.net/maheen'),
    ('AI Apps Challenge', 'Collection of 30 different AI applications built in 30 days, showcasing versatility in AI development across various domains and use cases.', ai_apps_id, true, 'https://github.com/maheen'),
    ('Portfolio Website', 'Modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS featuring advanced animations and 3D elements.', web_id, true, 'https://maheen-portfolio.com')
    ON CONFLICT DO NOTHING;
END $$;