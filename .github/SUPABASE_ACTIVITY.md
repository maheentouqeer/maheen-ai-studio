# Supabase activity check

The `Supabase activity check` workflow makes a read-only request for at most one
public project's ID. It uses the website's public anonymous key and existing
access policies. It does not modify data, submit contacts, send emails, or change
the website. No private key or GitHub secret is required.

## Enable and check

1. Ensure Lovable's Git sync is connected to the intended repository in
   **Project settings → Git**. Adding files here does not independently connect
   or push to a repository.
2. After the workflow reaches the repository's default branch, open
   **GitHub → Actions → Supabase activity check**. Enable Actions if prompted.
3. Choose **Run workflow** and confirm the run is green.

The schedule runs at 08:17 UTC on days 1, 6, 11, 16, 21, 26, and 31 when present,
leaving no more than five days between scheduled checks. GitHub may delay or
skip scheduled jobs, and schedules run only from the repository's default branch.
Public repositories' schedules may be disabled after 60 days without repository
activity; re-enable the workflow if that happens. A paused Supabase project must
first be restored in Supabase.

This is a best-effort activity check, not a guarantee against pausing. Supabase
states that low-activity Free projects may pause within a seven-day period; only
upgrading to Pro guarantees against inactivity pausing.

Reference: https://supabase.com/docs/guides/platform/going-into-prod