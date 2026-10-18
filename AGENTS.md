# Architecture rules

- Keep the Supabase activity check in a read-only GitHub Actions workflow using public anonymous access; this avoids UI changes, data writes, and privileged credentials.
- Route visitor contact writes through contact-submit and keep internal rate-limit writes server-only; direct public write policies bypass the submission service.
- Serve portfolio files through public URLs without visitor storage-listing policies; the site does not need bucket enumeration.
- Keep assistant knowledge admin-only and run knowledge matching as SECURITY INVOKER; searches must respect the same row-level access rules as direct reads.