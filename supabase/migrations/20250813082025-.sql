-- 1) Secure policies and published gating, wrapped in safe DO blocks

-- Ensure RLS is enabled where applicable
alter table if exists public.rate_limits enable row level security;
alter table if exists public.projects enable row level security;

-- Add published flag to projects
alter table public.projects
  add column if not exists published boolean not null default true;

-- Replace overly permissive public select on projects with published gating
do $$
begin
  begin
    drop policy "Public can view projects" on public.projects;
  exception when undefined_object then
    null;
  end;

  -- Public can only view published projects
  begin
    create policy "Public can view published projects"
    on public.projects
    for select
    using (published = true);
  exception when duplicate_object then
    null;
  end;

  -- Admins can view all projects
  begin
    create policy "Admins can view all projects"
    on public.projects
    for select
    using (has_role(auth.uid(), 'admin'::app_role));
  exception when duplicate_object then
    null;
  end;
end $$;

-- Rate limits: allow only admins to read; anon can insert is already present
do $$
begin
  begin
    create policy "Admins view rate_limits"
    on public.rate_limits
    for select
    using (has_role(auth.uid(), 'admin'::app_role));
  exception when duplicate_object then
    null;
  end;
end $$;

-- Storage policies for media bucket: public read, admins write
do $$
begin
  -- Public read for media bucket (safe since bucket is public)
  begin
    create policy "Public can view media files"
    on storage.objects
    for select
    using (bucket_id = 'media');
  exception when duplicate_object then
    null;
  end;

  -- Admin-only insert/update/delete for media bucket
  begin
    create policy "Admins can upload media"
    on storage.objects
    for insert
    with check (bucket_id = 'media' and has_role(auth.uid(), 'admin'::app_role));
  exception when duplicate_object then
    null;
  end;

  begin
    create policy "Admins can update media"
    on storage.objects
    for update
    using (bucket_id = 'media' and has_role(auth.uid(), 'admin'::app_role))
    with check (bucket_id = 'media' and has_role(auth.uid(), 'admin'::app_role));
  exception when duplicate_object then
    null;
  end;

  begin
    create policy "Admins can delete media"
    on storage.objects
    for delete
    using (bucket_id = 'media' and has_role(auth.uid(), 'admin'::app_role));
  exception when duplicate_object then
    null;
  end;
end $$;

-- Seed demo categories
do $$
begin
  if not exists (select 1 from public.categories where name = 'AI') then
    insert into public.categories(name) values ('AI');
  end if;
  if not exists (select 1 from public.categories where name = 'Web') then
    insert into public.categories(name) values ('Web');
  end if;
  if not exists (select 1 from public.categories where name = 'Mobile') then
    insert into public.categories(name) values ('Mobile');
  end if;
end $$;

-- Seed demo projects (published) with external images for preview
insert into public.projects (title, description, media_url, link_url, category_id, published)
select
  'AI Chatbot',
  'Conversational assistant with RAG and Groq.',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1600&auto=format&fit=crop',
  'https://example.com/ai-chatbot',
  (select id from public.categories where name = 'AI'),
  true
where not exists (select 1 from public.projects where title = 'AI Chatbot');

insert into public.projects (title, description, media_url, link_url, category_id, published)
select
  'Portfolio Website',
  'High-performance portfolio with premium design and animations.',
  'https://images.unsplash.com/photo-1502882705085-b7fbff3b3e66?q=80&w=1600&auto=format&fit=crop',
  'https://example.com/portfolio',
  (select id from public.categories where name = 'Web'),
  true
where not exists (select 1 from public.projects where title = 'Portfolio Website');

insert into public.projects (title, description, media_url, link_url, category_id, published)
select
  'Mobile AR Demo',
  'Augmented reality prototype showcasing interactive 3D overlays.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
  'https://example.com/ar-demo',
  (select id from public.categories where name = 'Mobile'),
  true
where not exists (select 1 from public.projects where title = 'Mobile AR Demo');