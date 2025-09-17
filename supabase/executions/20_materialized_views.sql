-- RUN MANUALLY IN SUPABASE
-- Materialized views for analytics and performance
-- These are refreshed periodically via a scheduled function

-- Yearly stats
create materialized view if not exists public.mv_stats_yearly as
select 
  extract(year from date) as year,
  count(*) as total_incidents,
  sum(fatalities) as total_fatalities,
  sum(injuries) as total_injuries,
  sum(fatalities + injuries) as total_victims,
  count(*) filter (where location_type = 'school') as school_incidents,
  count(*) filter (where hate_crime = true) as hate_crimes,
  count(*) filter (where involves_children = true) as incidents_involving_children
from data.incidents
where is_published = true
group by extract(year from date)
order by year desc;

-- State stats
create materialized view if not exists public.mv_stats_by_state as
select 
  state,
  count(*) as total_incidents,
  sum(fatalities) as total_fatalities,
  sum(injuries) as total_injuries,
  sum(fatalities + injuries) as total_victims,
  count(*) filter (where location_type = 'school') as school_incidents,
  count(*) filter (where hate_crime = true) as hate_crimes,
  avg(fatalities + injuries) as avg_victims_per_incident
from data.incidents
where is_published = true
group by state
order by total_incidents desc;

-- Category stats for legislation
create materialized view if not exists public.mv_legislation_by_category as
select 
  category,
  count(*) as total_laws,
  count(*) filter (where jurisdiction = 'FEDERAL') as federal_laws,
  count(*) filter (where jurisdiction != 'FEDERAL') as state_laws,
  min(date) as earliest_date,
  max(date) as latest_date
from data.legislation
where is_published = true
group by category
order by total_laws desc;

-- Deadliest incidents
create materialized view if not exists public.mv_deadliest_incidents as
select 
  i.id,
  i.incident_code,
  i.date,
  i.city,
  i.state,
  i.location_type,
  i.fatalities,
  i.injuries,
  (i.fatalities + i.injuries) as total_victims,
  i.context,
  i.description
from data.incidents i
where i.is_published = true
  and (i.fatalities + i.injuries) >= 4
order by (i.fatalities + i.injuries) desc, i.fatalities desc, i.date desc
limit 100;

-- Monthly trends (last 5 years)
create materialized view if not exists public.mv_monthly_trends as
select 
  date_trunc('month', date) as month,
  count(*) as incidents,
  sum(fatalities) as fatalities,
  sum(injuries) as injuries,
  sum(fatalities + injuries) as total_victims
from data.incidents
where is_published = true
  and date >= current_date - interval '5 years'
group by date_trunc('month', date)
order by month desc;

-- Function to refresh all materialized views
create or replace function data.refresh_materialized_views()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view public.mv_stats_yearly;
  refresh materialized view public.mv_stats_by_state;
  refresh materialized view public.mv_legislation_by_category;
  refresh materialized view public.mv_deadliest_incidents;
  refresh materialized view public.mv_monthly_trends;
end;
$$;

-- Grant SELECT on materialized views
grant select on public.mv_stats_yearly to anon, authenticated;
grant select on public.mv_stats_by_state to anon, authenticated;
grant select on public.mv_legislation_by_category to anon, authenticated;
grant select on public.mv_deadliest_incidents to anon, authenticated;
grant select on public.mv_monthly_trends to anon, authenticated;

-- Grant execute on refresh function to authenticated users (admins will call this)
grant execute on function data.refresh_materialized_views() to authenticated;
