-- RUN MANUALLY IN SUPABASE
-- Public views that expose only published data
-- These views will be accessible via RLS to anonymous users

-- Published incidents with basic info
create or replace view public.v_incidents as
select 
  i.id,
  i.incident_code,
  i.date,
  i.city,
  i.state,
  i.location_type,
  i.fatalities,
  i.injuries,
  i.involves_children,
  i.involves_women_and_children,
  i.hate_crime,
  i.hate_crime_target,
  i.context,
  i.description,
  i.notes,
  i.last_verified_at,
  i.created_at,
  i.updated_at
from data.incidents i
where i.is_published = true;

-- Published legislation
create or replace view public.v_legislation as
select 
  l.id,
  l.law_code,
  l.date,
  l.jurisdiction,
  l.title,
  l.summary,
  l.category,
  l.notes,
  l.last_verified_at,
  l.created_at
from data.legislation l
where l.is_published = true;

-- Suspects for published incidents
create or replace view public.v_suspects as
select 
  s.id,
  s.incident_id,
  s.suspect_code,
  s.name,
  s.age,
  s.gender,
  s.race,
  s.nationality,
  s.status,
  s.motive,
  s.notes
from data.suspects s
join data.incidents i on s.incident_id = i.id
where i.is_published = true;

-- Suspect weapons for published incidents
create or replace view public.v_suspect_weapons as
select 
  sw.id,
  sw.suspect_id,
  sw.type,
  sw.legally_purchased,
  sw.source
from data.suspect_weapons sw
join data.suspects s on sw.suspect_id = s.id
join data.incidents i on s.incident_id = i.id
where i.is_published = true;

-- Incident sources for published incidents
create or replace view public.v_incident_sources as
select 
  isrc.id,
  isrc.incident_id,
  isrc.url,
  isrc.title,
  isrc.publisher,
  isrc.accessed_at
from data.incident_sources isrc
join data.incidents i on isrc.incident_id = i.id
where i.is_published = true;

-- Legislation sources for published legislation
create or replace view public.v_legislation_sources as
select 
  lsrc.id,
  lsrc.legislation_id,
  lsrc.url,
  lsrc.title,
  lsrc.publisher,
  lsrc.accessed_at
from data.legislation_sources lsrc
join data.legislation l on lsrc.legislation_id = l.id
where l.is_published = true;

-- School context for published school incidents
create or replace view public.v_incident_school_context as
select 
  isc.incident_id,
  isc.school_type,
  isc.is_on_campus,
  isc.school_name
from data.incident_school_context isc
join data.incidents i on isc.incident_id = i.id
where i.is_published = true;

-- Grant SELECT on views to anon and authenticated users
grant select on public.v_incidents to anon, authenticated;
grant select on public.v_legislation to anon, authenticated;
grant select on public.v_suspects to anon, authenticated;
grant select on public.v_suspect_weapons to anon, authenticated;
grant select on public.v_incident_sources to anon, authenticated;
grant select on public.v_legislation_sources to anon, authenticated;
grant select on public.v_incident_school_context to anon, authenticated;
