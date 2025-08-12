-- Migrate assistant_knowledge.embedding to 768-d vector to match Groq nomic-embed-text
BEGIN;

-- Add new column with correct dimension
ALTER TABLE public.assistant_knowledge
ADD COLUMN embedding_new vector(768);

-- Drop old column and replace with new one
ALTER TABLE public.assistant_knowledge
DROP COLUMN embedding;

ALTER TABLE public.assistant_knowledge
RENAME COLUMN embedding_new TO embedding;

COMMIT;