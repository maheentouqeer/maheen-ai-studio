-- Update demo projects with generated images
UPDATE public.projects 
SET media_url = '/src/assets/demo-project-1.jpg'
WHERE title = 'AI Chat Assistant';

UPDATE public.projects 
SET media_url = '/src/assets/demo-project-2.jpg'
WHERE title = 'Streamlit AI Art Studio';

UPDATE public.projects 
SET media_url = '/src/assets/demo-project-3.jpg'
WHERE title = 'CrewAI Task Automation';