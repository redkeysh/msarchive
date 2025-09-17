-- RUN MANUALLY IN SUPABASE
-- Row Level Security policies
-- Base tables have RLS enabled; views provide filtered access

-- Incidents policies
drop policy if exists "Public read published incidents" on data.incidents;
create policy "Public read published incidents" on data.incidents
  for select using (is_published = true);

drop policy if exists "Admins full access incidents" on data.incidents;
create policy "Admins full access incidents" on data.incidents
  for all using (auth_is_admin());

-- Incident sources policies
drop policy if exists "Public read sources for published incidents" on data.incident_sources;
create policy "Public read sources for published incidents" on data.incident_sources
  for select using (
    exists (
      select 1 from data.incidents i 
      where i.id = incident_id and i.is_published = true
    )
  );

drop policy if exists "Admins full access incident sources" on data.incident_sources;
create policy "Admins full access incident sources" on data.incident_sources
  for all using (auth_is_admin());

-- School context policies
drop policy if exists "Public read school context for published incidents" on data.incident_school_context;
create policy "Public read school context for published incidents" on data.incident_school_context
  for select using (
    exists (
      select 1 from data.incidents i 
      where i.id = incident_id and i.is_published = true
    )
  );

drop policy if exists "Admins full access school context" on data.incident_school_context;
create policy "Admins full access school context" on data.incident_school_context
  for all using (auth_is_admin());

-- Suspects policies
drop policy if exists "Public read suspects for published incidents" on data.suspects;
create policy "Public read suspects for published incidents" on data.suspects
  for select using (
    exists (
      select 1 from data.incidents i 
      where i.id = incident_id and i.is_published = true
    )
  );

drop policy if exists "Admins full access suspects" on data.suspects;
create policy "Admins full access suspects" on data.suspects
  for all using (auth_is_admin());

-- Suspect weapons policies
drop policy if exists "Public read weapons for published incidents" on data.suspect_weapons;
create policy "Public read weapons for published incidents" on data.suspect_weapons
  for select using (
    exists (
      select 1 from data.suspects s
      join data.incidents i on s.incident_id = i.id
      where s.id = suspect_id and i.is_published = true
    )
  );

drop policy if exists "Admins full access suspect weapons" on data.suspect_weapons;
create policy "Admins full access suspect weapons" on data.suspect_weapons
  for all using (auth_is_admin());

-- Suspect prior history policies
drop policy if exists "Public read prior history for published incidents" on data.suspect_prior_history;
create policy "Public read prior history for published incidents" on data.suspect_prior_history
  for select using (
    exists (
      select 1 from data.suspects s
      join data.incidents i on s.incident_id = i.id
      where s.id = suspect_id and i.is_published = true
    )
  );

drop policy if exists "Admins full access prior history" on data.suspect_prior_history;
create policy "Admins full access prior history" on data.suspect_prior_history
  for all using (auth_is_admin());

-- Legislation policies
drop policy if exists "Public read published legislation" on data.legislation;
create policy "Public read published legislation" on data.legislation
  for select using (is_published = true);

drop policy if exists "Admins full access legislation" on data.legislation;
create policy "Admins full access legislation" on data.legislation
  for all using (auth_is_admin());

-- Legislation sources policies
drop policy if exists "Public read sources for published legislation" on data.legislation_sources;
create policy "Public read sources for published legislation" on data.legislation_sources
  for select using (
    exists (
      select 1 from data.legislation l 
      where l.id = legislation_id and l.is_published = true
    )
  );

drop policy if exists "Admins full access legislation sources" on data.legislation_sources;
create policy "Admins full access legislation sources" on data.legislation_sources
  for all using (auth_is_admin());

-- Corrections policies (allow anonymous submissions via Edge Functions)
drop policy if exists "Anonymous can submit corrections" on data.corrections;
create policy "Anonymous can submit corrections" on data.corrections
  for insert with check (true); -- Edge Function will validate captcha

drop policy if exists "Admins can read and manage corrections" on data.corrections;
create policy "Admins can read and manage corrections" on data.corrections
  for all using (auth_is_admin());

-- Audit log policies (admin read-only)
drop policy if exists "Admins can read audit log" on data.audit_log;
create policy "Admins can read audit log" on data.audit_log
  for select using (auth_is_admin());
