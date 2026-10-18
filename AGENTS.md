# Architecture rules

- Keep the Supabase activity check in a read-only GitHub Actions workflow using public anonymous access; this avoids UI changes, data writes, and privileged credentials.