-- Move vector extension to extensions schema
create schema if not exists extensions;
ALTER EXTENSION vector SET SCHEMA extensions;