-- RUN MANUALLY IN SUPABASE
-- Use Supabase Scheduler / Edge Functions to call data.refresh_materialized_views() nightly.

-- Example: Create a scheduled job in Supabase Dashboard
-- 1. Go to Database → Scheduled Jobs (if available)
-- 2. Create a new job with cron expression: 0 2 * * * (2 AM daily)
-- 3. SQL command: SELECT data.refresh_materialized_views();

-- Alternatively, create an Edge Function that calls this and schedule it via external cron service
-- Or use Supabase's pg_cron extension if available:

-- SELECT cron.schedule(
--   'refresh-materialized-views',
--   '0 2 * * *', -- Every day at 2 AM
--   'SELECT data.refresh_materialized_views();'
-- );

-- For now, this is a manual reminder to set up the scheduling
-- The materialized views can be refreshed manually by calling:
-- SELECT data.refresh_materialized_views();
