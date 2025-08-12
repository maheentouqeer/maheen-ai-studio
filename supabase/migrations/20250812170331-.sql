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

-- Optional helpful index
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
create policy if not exists "Anyone can insert rate_limits"
  on public.rate_limits for insert
  to anon, authenticated
  with check (true);

-- Storage bucket for media uploads
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: public read, admin manage
create policy if not exists "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

create policy if not exists "Admins manage media"
  on storage.objects for all
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
