# MSArchive V2 - Key Corrections & Improvements

This document outlines the major corrections and improvements made in MSArchive V2, addressing fundamental architectural and design issues from previous versions.

## 1. Primary Key Strategy: UUID vs Human-Readable Codes

### ❌ Previous Approach
```sql
-- Used human-readable strings as primary keys
CREATE TABLE incidents (
  id TEXT PRIMARY KEY,  -- e.g., "MS-2024-0123-CA-CITY"
  -- other fields...
);
```

**Problems:**
- Exposed internal structure and numbering schemes
- Difficult to change code format without breaking references
- Potential for conflicts and manual ID assignment errors
- Not suitable for distributed systems or concurrent inserts

### ✅ V2 Correction
```sql
-- UUID primary keys with generated display codes
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_code TEXT,  -- Generated via trigger
  -- other fields...
);

-- Trigger automatically generates human-readable codes
CREATE OR REPLACE FUNCTION data.fn_set_incident_code()
RETURNS TRIGGER AS $$
BEGIN
  new.incident_code := 
    CASE WHEN new.location_type = 'school' THEN 'SS' ELSE 'MS' END || '-' ||
    to_char(extract(epoch from coalesce(new.created_at, now()))::bigint % 10000, 'FM0000') || '-' ||
    to_char(coalesce(new.created_at, now()), 'YYYYMMDD') || '-' ||
    new.state || '-' || regexp_replace(new.city, '[^A-Z0-9]+', '', 'g');
  RETURN new;
END;
$$ LANGUAGE plpgsql;
```

**Benefits:**
- Stable UUIDs for all internal references and APIs
- Human-readable codes for display and communication
- Automatic code generation prevents conflicts
- Easy to change code format without breaking system
- Better for distributed systems and replication

**Files Changed:** `supabase/00_init.sql`, all table definitions, API endpoints

## 2. Deployment Architecture: API Routes vs Edge Functions

### ❌ Previous Approach
```typescript
// Next.js API routes for admin operations
// pages/api/admin/incidents.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Database operations with service role key
  // This key would be exposed in GitHub Pages deployment!
}
```

**Problems:**
- Next.js API routes don't work with static export (`output: 'export'`)
- Service role keys would be exposed in GitHub Pages build
- No way to keep admin secrets secure in static deployment
- Breaks the static-first architecture

### ✅ V2 Correction
```typescript
// Supabase Edge Functions for admin operations
// supabase/functions/admin-incidents/index.ts
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()  // Service key stays in Supabase
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  // Safe admin operations...
})
```

**Benefits:**
- Static site deployment works perfectly with GitHub Pages
- Service role keys never leave Supabase environment
- Edge Functions run in secure Deno runtime
- Admin operations completely separated from public site
- Better security through isolation

**Files Changed:** All admin functionality moved to `supabase/functions/`, removed API routes

## 3. Row Level Security: Blanket Denial vs Granular Policies

### ❌ Previous Approach
```sql
-- Overly restrictive: deny all anonymous access
CREATE POLICY "deny_all_anon" ON incidents FOR ALL TO anon USING (false);

-- Separate "public" tables that duplicate data
CREATE TABLE public_incidents AS SELECT * FROM incidents WHERE is_published = true;
```

**Problems:**
- Data duplication between internal and public tables
- Complex synchronization between tables
- Views couldn't filter properly due to blanket denial
- Maintenance nightmare with multiple data sources

### ✅ V2 Correction
```sql
-- Granular RLS: allow anonymous read of published data
CREATE POLICY "Public read published incidents" ON data.incidents
  FOR SELECT USING (is_published = true);

-- Views provide clean interface without data duplication
CREATE VIEW public.v_incidents AS
SELECT id, incident_code, date, city, state, location_type, fatalities, injuries, context, description
FROM data.incidents 
WHERE is_published = true;
```

**Benefits:**
- Single source of truth - no data duplication
- Views automatically stay in sync with base tables
- Granular access control based on publish status
- Anonymous users can read published data safely
- Admins get full access through same tables

**Files Changed:** `supabase/30_policies.sql`, `supabase/10_views.sql`

## 4. Data Synchronization: YAML/ORM vs Database Source of Truth

### ❌ Previous Approach
```yaml
# incidents.yaml - manual data entry
- id: MS-2024-0001
  date: "2024-01-15"
  location: "City, ST"
  # ... more fields

# Complex sync scripts to push YAML -> Database
# Risk of data inconsistency and merge conflicts
```

**Problems:**
- Manual YAML editing prone to syntax errors
- Git merge conflicts in data files
- No real-time validation of business rules
- Difficult to maintain data integrity
- No audit trail for changes

### ✅ V2 Correction
```typescript
// Database as single source of truth
// Admin interface directly updates database via Edge Functions
const createIncident = async (data: IncidentSchema) => {
  const result = await fetch('/functions/v1/admin-incidents', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return result.json()
}
```

**Benefits:**
- Database enforces all business rules and validation
- Real-time data consistency
- Complete audit trail via triggers
- No merge conflicts or sync issues
- Proper relational integrity

**Files Changed:** Removed all YAML data files, created admin interfaces

## 5. Business Rule Enforcement: Insert-Time vs Publish-Time

### ❌ Previous Approach
```sql
-- Enforced minimum sources at insert time
CREATE OR REPLACE FUNCTION validate_incident_sources()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM incident_sources WHERE incident_id = NEW.id) < 2 THEN
    RAISE EXCEPTION 'Must have at least 2 sources';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_sources_on_insert 
  BEFORE INSERT ON incidents
  FOR EACH ROW EXECUTE FUNCTION validate_incident_sources();
```

**Problems:**
- Impossible to create draft incidents for research
- Forced to add placeholder sources just to save work
- Prevented incremental data entry workflow
- Made bulk imports difficult

### ✅ V2 Correction
```sql
-- Enforce business rules only when publishing
CREATE OR REPLACE FUNCTION data.fn_incident_publish_check()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check when transitioning from unpublished to published
  IF NEW.is_published AND NOT OLD.is_published THEN
    -- Check minimum victims (≥4)
    IF (COALESCE(NEW.fatalities,0) + COALESCE(NEW.injuries,0)) < 4 THEN
      RAISE EXCEPTION 'Cannot publish: total victims must be >= 4';
    END IF;
    
    -- Check minimum sources (≥2)
    SELECT COUNT(*) INTO src_count FROM data.incident_sources s WHERE s.incident_id = NEW.id;
    IF src_count < 2 THEN
      RAISE EXCEPTION 'Cannot publish: at least 2 sources required';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incidents_publish_check 
  BEFORE UPDATE OF is_published ON data.incidents
  FOR EACH ROW EXECUTE FUNCTION data.fn_incident_publish_check();
```

**Benefits:**
- Allows draft incidents for research and data entry
- Incremental workflow: research → draft → review → publish
- Business rules enforced at the right time (publication)
- Bulk imports can create drafts then publish individually
- Better separation of data entry and publication workflows

**Files Changed:** `supabase/00_init.sql` - updated trigger logic

## 6. Schema Organization: Mixed Schemas vs Clean Separation

### ❌ Previous Approach
```sql
-- Tables scattered across public and custom schemas
CREATE TABLE public.incidents (...);
CREATE TABLE auth.admin_users (...);
CREATE TABLE data.some_table (...);
-- Inconsistent schema usage
```

**Problems:**
- Unclear data organization
- Mixed public/private data in same schema
- Difficult to set consistent permissions
- Confusing for developers and admins

### ✅ V2 Correction
```sql
-- Clean schema separation
CREATE SCHEMA IF NOT EXISTS data;  -- All core data tables

-- Core data in data schema
CREATE TABLE data.incidents (...);
CREATE TABLE data.legislation (...);
CREATE TABLE data.suspects (...);

-- Public views in public schema
CREATE VIEW public.v_incidents AS SELECT ... FROM data.incidents WHERE is_published = true;

-- Admin functions in public schema (for RLS compatibility)
CREATE FUNCTION public.auth_is_admin() RETURNS boolean ...;
CREATE TABLE public.admin_allowlist (...);
```

**Benefits:**
- Clear separation: `data.*` for core tables, `public.*` for views/functions
- Consistent permission model across all tables
- Easy to understand data organization
- Proper schema exposure via Supabase settings

**Files Changed:** All SQL files updated with consistent schema usage

## 7. Code Quality: Lint Guardrails vs Manual Checking

### ❌ Previous Approach
```typescript
// No automated checking for schema usage
const { data } = await supabase.from('incidents').select('*')  // Wrong!
// Could accidentally query wrong schema or table
```

**Problems:**
- Easy to forget schema prefixes in queries
- Runtime errors instead of build-time catching
- Inconsistent database access patterns
- Hard to enforce coding standards

### ✅ V2 Correction
```json
// package.json - automated schema validation
{
  "scripts": {
    "lint:schema": "rg -n \"\\.from\\(['\"]incidents['\"]\\)\" --glob '!**/node_modules/**' --glob '!**/.next/**' | (! rg -v \"schema\\('data'\\)\\.from\\(['\"]incidents['\"]\\)\" ) && echo \"ERROR: found .from('incidents') without schema('data')\" && exit 1 || echo OK",
    "prebuild": "pnpm run lint:schema"
  }
}
```

```typescript
// Enforced correct usage
const { data } = await supabase.schema('data').from('incidents').select('*')  // Correct!
```

**Benefits:**
- Build fails if schema usage is incorrect
- Consistent database access patterns
- Catches errors at build time, not runtime
- Enforces best practices automatically

**Files Changed:** `package.json`, all database access code

## Implementation Impact

### Database Schema
- **Breaking Change**: All primary keys changed from strings to UUIDs
- **Migration Required**: Existing data needs UUID assignment and code generation
- **Relationship Updates**: All foreign keys updated to reference UUIDs

### API Changes
- **Endpoint Changes**: All admin operations moved from `/api/*` to `/functions/v1/*`
- **Authentication**: Switched from session-based to magic link authentication
- **Response Format**: Standardized error handling and response structure

### Frontend Updates
- **Static Export**: All pages now work with `output: 'export'`
- **Client-Side Auth**: Admin authentication handled client-side
- **Query Parameters**: Incident detail pages use query params for static compatibility

### Security Improvements
- **Secret Management**: All sensitive keys moved to Supabase environment
- **Access Control**: Granular RLS policies replace blanket restrictions
- **Audit Trail**: Complete logging of all administrative actions

### Development Workflow
- **Build Validation**: Automated checks prevent common mistakes
- **Type Safety**: Zod schemas provide runtime validation
- **Documentation**: Comprehensive technical documentation

## Migration Checklist

For teams upgrading from previous versions:

- [ ] **Database**: Run SQL files in correct order (00 → 30 → 10 → 20 → 40)
- [ ] **Schema**: Add `data` to Supabase exposed schemas setting
- [ ] **Admin Access**: Add admin emails to `public.admin_allowlist` table
- [ ] **Edge Functions**: Deploy all functions with `supabase functions deploy`
- [ ] **Environment**: Set Turnstile keys in Supabase secrets
- [ ] **GitHub**: Configure Pages deployment and repository settings
- [ ] **Domain**: Update CNAME file if using custom domain
- [ ] **Testing**: Verify both public site and admin functionality
- [ ] **Data**: Migrate existing data to new UUID-based schema
- [ ] **Training**: Update team on new admin interface and workflows

These corrections address fundamental architectural issues and provide a solid foundation for long-term maintenance and scaling of the MSArchive system.
