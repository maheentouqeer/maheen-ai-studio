-- Recreate function with correct search_path including extensions
create or replace function public.match_assistant_knowledge(
  query_embedding extensions.vector(1536),
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
set search_path = public, extensions
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