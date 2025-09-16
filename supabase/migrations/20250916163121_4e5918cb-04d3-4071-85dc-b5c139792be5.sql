-- Safe seeding - only insert if tables are empty
DO $$
BEGIN
  -- Only seed if skills table is mostly empty
  IF (SELECT COUNT(*) FROM skills) < 3 THEN
    INSERT INTO public.skills (skill_name, category, proficiency) VALUES
      ('Python', 'Programming', 95),
      ('JavaScript/TypeScript', 'Programming', 90),
      ('React/Next.js', 'Frontend', 90),
      ('Machine Learning', 'AI/ML', 92),
      ('Deep Learning', 'AI/ML', 88);
  END IF;
  
  -- Only seed if education table is empty  
  IF (SELECT COUNT(*) FROM education) = 0 THEN
    INSERT INTO public.education (institution, degree, description, start_date, end_date) VALUES
      ('DUET (Dawood University)', 'BS Artificial Intelligence', 'Comprehensive AI program with focus on practical applications.', '2023-01-01', '2027-01-01');
  END IF;
  
  -- Only seed if about table is empty
  IF (SELECT COUNT(*) FROM about) = 0 THEN
    INSERT INTO public.about (heading, content, image_url) VALUES
      ('About Maheen', 'Passionate AI engineer building innovative solutions with cutting-edge technology.', '/src/assets/maheen-3d-avatar.jpg');
  END IF;
END $$;