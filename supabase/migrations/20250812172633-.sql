-- Enable pgvector for semantic search
create extension if not exists vector;

-- Assistant knowledge: add embeddings and timestamps
alter table public.assistant_knowledge
  add column if not exists embedding vector(1536),
  add column if not exists created_at timestamptz not null default now();

-- Index for vector similarity (cosine)
create index if not exists assistant_knowledge_embedding_idx 
  on public.assistant_knowledge using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- RPC to perform semantic matches
create or replace function public.match_assistant_knowledge(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  question text,
  answer text,
  similarity float
)
language sql
stable
as $$
  select
    ak.id,
    ak.question,
    ak.answer,
    1 - (ak.embedding <=> query_embedding) as similarity
  from public.assistant_knowledge ak
  where ak.embedding is not null
  order by ak.embedding <=> query_embedding asc
  limit match_count;
$$;

-- Contacts: mark-as-done flag
alter table public.contacts
  add column if not exists handled boolean not null default false;

-- Helpful index
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- Create a simple rate limits table for edge function throttling
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

-- Allow inserts from anyone (edge functions will typically use service role)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rate_limits' AND policyname = 'Anyone can insert rate_limits'
  ) THEN
    CREATE POLICY "Anyone can insert rate_limits"
      ON public.rate_limits FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Storage bucket for media uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: public read, admin manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read media'
  ) THEN
    CREATE POLICY "Public read media"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'media');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins manage media'
  ) THEN
    CREATE POLICY "Admins manage media"
      ON storage.objects FOR ALL
      USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'))
      WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
