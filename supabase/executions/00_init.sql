-- RUN MANUALLY IN SUPABASE
-- Base schema, enums, tables, triggers, audit, RLS core

create extension if not exists pgcrypto; -- for gen_random_uuid on some stacks
create schema if not exists data;

-- Enums
create type data.incident_location_type as enum ('school','public_space','private_residence','workplace','other');
create type data.school_type as enum ('K-12','College/University','Other');
create type data.suspect_gender as enum ('male','female','nonbinary','unknown');
create type data.suspect_race as enum ('White','Black','Latino','Asian','Native','Other','Unknown');
create type data.suspect_status as enum ('apprehended','killed_by_self','killed_by_police','at_large','deceased_other','unknown');
create type data.legislation_category as enum ('regulation','rights_expansion','background_checks','assault_weapon_ban','concealed_carry','red_flag','other');

-- Allowlist + admin helper
create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.auth_is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare jwt_email text := auth.jwt() ->> 'email';
begin
  if current_user = 'service_role' then return true; end if;
  if jwt_email is null then return false; end if;
  return exists (select 1 from public.admin_allowlist where lower(email)=lower(jwt_email));
end$$;
grant execute on function public.auth_is_admin() to authenticated, anon;

-- Audit log
create table if not exists data.audit_log (
  id bigserial primary key,
  table_name text not null,
  row_id uuid,
  action text not null, -- insert/update/delete
  actor_email text,
  at timestamptz not null default now(),
  diff jsonb
);

create or replace function data.audit_row()
returns trigger language plpgsql as $$
declare email text := auth.jwt() ->> 'email';
begin
  insert into data.audit_log(table_name,row_id,action,actor_email,diff)
  values (tg_table_name, coalesce((new).id,(old).id)::uuid, tg_op, email,
    case tg_op when 'INSERT' then to_jsonb(new)
               when 'UPDATE' then jsonb_build_object('old',to_jsonb(old),'new',to_jsonb(new))
               when 'DELETE' then to_jsonb(old) end);
  return coalesce(new,old);
end$$;

-- Incidents (opaque PK + human code)
create table if not exists data.incidents (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  city text not null,
  state char(2) not null,
  location_type data.incident_location_type not null,
  fatalities int not null default 0,
  injuries int not null default 0,
  involves_children boolean not null default false,
  involves_women_and_children boolean not null default false,
  hate_crime boolean not null default false,
  hate_crime_target text,
  context text not null,
  description text not null,
  notes text,
  is_published boolean not null default false,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  incident_code text
);

-- Derived code + updated_at
create or replace function data.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end$$;

create or replace function data.fn_set_incident_code()
returns trigger
language plpgsql
security definer
set search_path = data, public
as $$
declare type_code text; city_clean text;
begin
  new.state := upper(new.state);
  new.city  := upper(new.city);
  type_code := case when new.location_type = 'school' then 'SS' else 'MS' end;
  city_clean := regexp_replace(new.city, '[^A-Z0-9]+', '', 'g');
  new.incident_code :=
    type_code || '-' ||
    to_char(extract(epoch from coalesce(new.created_at, now()))::bigint % 10000, 'FM0000') || '-' ||
    to_char(coalesce(new.created_at, now()), 'YYYYMMDD') || '-' ||
    new.state || '-' || city_clean;
  return new;
end$$;

drop trigger if exists trg_incidents_updated_at on data.incidents;
create trigger trg_incidents_updated_at before update on data.incidents
for each row execute function data.set_updated_at();

drop trigger if exists trg_incidents_code_ins on data.incidents;
create trigger trg_incidents_code_ins before insert on data.incidents
for each row execute function data.fn_set_incident_code();

drop trigger if exists trg_incidents_code_upd on data.incidents;
create trigger trg_incidents_code_upd before update of state, city, location_type, created_at on data.incidents
for each row execute function data.fn_set_incident_code();

-- Enforce publish-time business rules:
-- at least 4 total victims and >= 2 sources when publishing
create or replace function data.fn_incident_publish_check()
returns trigger language plpgsql as $$
declare src_count int;
begin
  if new.is_published and not old.is_published then
    if (coalesce(new.fatalities,0) + coalesce(new.injuries,0)) < 4 then
      raise exception 'Cannot publish: total victims must be >= 4';
    end if;
    select count(*) into src_count from data.incident_sources s where s.incident_id = new.id;
    if src_count < 2 then
      raise exception 'Cannot publish: at least 2 sources required';
    end if;
  end if;
  return new;
end$$;

drop trigger if exists trg_incidents_publish_check on data.incidents;
create trigger trg_incidents_publish_check before update of is_published on data.incidents
for each row execute function data.fn_incident_publish_check();

-- Sources
create table if not exists data.incident_sources (
  id bigserial primary key,
  incident_id uuid not null references data.incidents(id) on delete cascade,
  url text not null,
  title text not null,
  publisher text not null,
  accessed_at date not null
);

-- School context
create table if not exists data.incident_school_context (
  incident_id uuid primary key references data.incidents(id) on delete cascade,
  school_type data.school_type,
  is_on_campus boolean not null default false,
  school_name text
);

-- Suspects
create table if not exists data.suspects (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references data.incidents(id) on delete cascade,
  name text,
  age int,
  gender data.suspect_gender default 'unknown',
  race data.suspect_race default 'Unknown',
  nationality text,
  status data.suspect_status default 'unknown',
  motive text,
  notes text,
  suspect_code text
);

create or replace function data.fn_set_suspect_code()
returns trigger language plpgsql as $$
begin
  new.suspect_code := 'SUS-' || to_char(extract(epoch from now())::bigint % 1000000, 'FM000000');
  return new;
end$$;

drop trigger if exists trg_suspects_code_ins on data.suspects;
create trigger trg_suspects_code_ins before insert on data.suspects
for each row execute function data.fn_set_suspect_code();

-- Suspect weapons
create table if not exists data.suspect_weapons (
  id bigserial primary key,
  suspect_id uuid not null references data.suspects(id) on delete cascade,
  type text not null,
  legally_purchased boolean,
  source text
);

-- Prior history
create table if not exists data.suspect_prior_history (
  suspect_id uuid primary key references data.suspects(id) on delete cascade,
  criminal_record boolean,
  prior_mental_health_issues boolean,
  prior_domestic_violence boolean
);

-- Legislation
create table if not exists data.legislation (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  jurisdiction text not null, -- 'FEDERAL' or state code
  title text not null,
  summary text not null,
  category data.legislation_category not null,
  notes text,
  is_published boolean not null default false,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  law_code text
);

create or replace function data.fn_set_law_code()
returns trigger language plpgsql as $$
begin
  new.law_code := 'LAW-' || to_char(coalesce(new.date, now()), 'YYYYMMDD') || '-' ||
                  regexp_replace(upper(new.jurisdiction), '[^A-Z0-9]+', '', 'g') || '-' ||
                  substring(regexp_replace(upper(new.title), '[^A-Z0-9]+', '', 'g') for 12);
  return new;
end$$;

drop trigger if exists trg_law_code_ins on data.legislation;
create trigger trg_law_code_ins before insert on data.legislation
for each row execute function data.fn_set_law_code();

-- Legislation sources
create table if not exists data.legislation_sources (
  id bigserial primary key,
  legislation_id uuid not null references data.legislation(id) on delete cascade,
  url text not null,
  title text not null,
  publisher text not null,
  accessed_at date not null
);

-- Corrections
create table if not exists data.corrections (
  id bigserial primary key,
  incident_id uuid references data.incidents(id) on delete set null,
  legislation_id uuid references data.legislation(id) on delete set null,
  correction_type text not null check (correction_type in ('factual_error','missing_info','suggestion')),
  description text not null,
  suggested_correction text,
  status text not null default 'pending' check (status in ('pending','reviewed','accepted','rejected')),
  submitted_by text,
  reviewed_by text,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Audit triggers (write ops)
create trigger audit_incidents
after insert or update or delete on data.incidents
for each row execute function data.audit_row();

create trigger audit_legislation
after insert or update or delete on data.legislation
for each row execute function data.audit_row();

-- Indexes for common filters (date, state, category, published)
create index if not exists idx_incidents_date on data.incidents(date);
create index if not exists idx_incidents_state on data.incidents(state);
create index if not exists idx_incidents_published on data.incidents(is_published);

create index if not exists idx_legislation_date on data.legislation(date);
create index if not exists idx_legislation_category on data.legislation(category);
create index if not exists idx_legislation_published on data.legislation(is_published);

-- RLS baseline
alter table data.incidents enable row level security;
alter table data.incident_sources enable row level security;
alter table data.incident_school_context enable row level security;
alter table data.suspects enable row level security;
alter table data.suspect_weapons enable row level security;
alter table data.suspect_prior_history enable row level security;
alter table data.legislation enable row level security;
alter table data.legislation_sources enable row level security;
alter table data.corrections enable row level security;