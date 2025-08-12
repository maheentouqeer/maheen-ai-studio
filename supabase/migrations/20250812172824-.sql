-- Fix linter: move vector extension to extensions schema if needed
create schema if not exists extensions;
alter extension if exists vector set schema extensions;

-- Fix linter: ensure function has fixed search_path
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
security definer
set search_path = public
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