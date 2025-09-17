# MSArchive V2 - Technical Overview

## Overview

MSArchive V2 is a complete rewrite of the mass shooting archive system, designed as a static Next.js application deployed to GitHub Pages with a Supabase backend. This architecture separates public data access (static site) from admin operations (serverless functions) for maximum security and performance.

## Core Principles

1. **Static First**: The public site is completely static, enabling fast global distribution via CDN
2. **Security by Design**: Admin secrets never touch the static site; all write operations go through Edge Functions
3. **Data Integrity**: All data changes are audited and require proper authentication/authorization
4. **Source Verification**: Every incident requires multiple independent sources before publication
5. **Transparency**: Clear attribution, correction mechanisms, and open methodology

## Architecture Stack

### Frontend
- **Next.js 15** with TypeScript strict mode
- **Static Export** (`output: 'export'`) for GitHub Pages deployment
- **Tailwind CSS** for styling and responsive design
- **Zod** for runtime type validation and API schemas

### Backend
- **Supabase** for database, authentication, and Edge Functions
- **PostgreSQL** with Row Level Security (RLS) and audit triggers
- **Edge Functions** (Deno runtime) for admin operations
- **Magic Link Authentication** for secure admin access

### Deployment
- **GitHub Pages** for static site hosting
- **GitHub Actions** for automated CI/CD pipeline
- **Supabase CLI** for Edge Function deployment (manual)

## Data Model

### Core Tables

#### `data.incidents`
- **Primary Key**: `id` (UUID) - opaque identifier
- **Display Code**: `incident_code` (generated via trigger) - human-readable code
- **Classification**: Location type, casualties, context flags
- **Publishing**: `is_published` boolean with business rule validation
- **Audit**: Created/updated timestamps, verification dates

#### `data.legislation` 
- **Primary Key**: `id` (UUID) - opaque identifier  
- **Display Code**: `law_code` (generated via trigger) - human-readable code
- **Classification**: Category, jurisdiction, date
- **Publishing**: `is_published` boolean for public visibility

#### `data.suspects`
- **Primary Key**: `id` (UUID) - opaque identifier
- **Display Code**: `suspect_code` (generated via trigger) - human-readable code
- **Demographics**: Age, gender, race (with sensitivity considerations)
- **Status**: Apprehended, deceased, at large, etc.

### Supporting Tables
- `incident_sources` - Required source attribution (≥2 per incident)
- `incident_school_context` - Additional data for school incidents
- `suspect_weapons` - Weapon details and acquisition methods
- `suspect_prior_history` - Background information
- `legislation_sources` - Source attribution for laws
- `corrections` - Public correction submissions
- `audit_log` - Complete audit trail of all changes

### Enums
Strongly typed enums for:
- Location types (school, public_space, workplace, etc.)
- Suspect demographics (with careful handling of sensitive data)
- Legislation categories (background_checks, assault_weapon_ban, etc.)
- Correction types and statuses

## RLS Security Model

### Public Access (Anonymous Users)
- **Read Only**: Can only SELECT from published data
- **Views Only**: Access via `public.v_*` views that filter `is_published = true`
- **No Direct Table Access**: Base tables deny anonymous access

### Admin Access (Authenticated + Allowlist)
- **Full CRUD**: Complete access to all tables via RLS policies
- **Allowlist Check**: `auth_is_admin()` function validates against `public.admin_allowlist`
- **Audit Logging**: All changes automatically logged via triggers

### Edge Function Access
- **Service Role**: Edge Functions use service role key for admin operations
- **Validation**: Functions validate user permissions before operations
- **CAPTCHA**: Public corrections require Turnstile validation

## Views and Materialized Views

### Public Views (`public.v_*`)
Real-time views that expose only published data:
- `v_incidents` - Published incidents with basic details
- `v_legislation` - Published laws and regulations
- `v_suspects` - Suspect information for published incidents
- `v_incident_sources` - Source attribution
- `v_legislation_sources` - Legislative source attribution

### Materialized Views (`public.mv_*`)
Pre-computed analytics refreshed nightly:
- `mv_stats_yearly` - Annual incident and casualty statistics
- `mv_stats_by_state` - State-level aggregations
- `mv_legislation_by_category` - Legislative trends by category
- `mv_deadliest_incidents` - Most severe incidents for research
- `mv_monthly_trends` - Time series data for visualization

## Admin Operations via Edge Functions

All admin write operations go through Supabase Edge Functions to keep secrets off GitHub Pages:

### `/functions/v1/admin-incidents`
- **POST**: Create new incident (draft state)
- **PUT**: Update existing incident
- **DELETE**: Remove incident and related data
- **Validation**: Business rules enforced (≥4 victims + ≥2 sources for publishing)

### `/functions/v1/admin-legislation`
- **POST**: Create new legislation entry
- **PUT**: Update existing legislation
- **DELETE**: Remove legislation and sources

### `/functions/v1/admin-users`
- **POST**: Add email to admin allowlist
- **DELETE**: Remove admin access

### `/functions/v1/submit-correction`
- **POST**: Public correction submissions with CAPTCHA validation
- **Rate Limiting**: Prevents spam and abuse
- **Moderation**: All submissions reviewed before action

## Data Corrections Pipeline

### Public Submission
1. User fills correction form on static site
2. Turnstile CAPTCHA validation
3. Submission sent to Edge Function
4. Stored in `data.corrections` table with pending status

### Admin Review
1. Admin views corrections in dashboard
2. Research team validates submission
3. Status updated (accepted/rejected) with notes
4. If accepted, data updated with audit trail

### Quality Assurance
- All corrections tracked with submitter info (optional)
- Response SLA: 5-7 business days
- Appeals process for rejected corrections
- Regular review of correction patterns for systemic issues

## Pages & Routing Strategy

### Static Generation
All routes pre-generated at build time for optimal performance:

- **`/`** - Homepage with overview and statistics
- **`/schools/`** - School incidents filter page
- **`/incident/?id=UUID`** - Individual incident detail (query param for export compatibility)
- **`/legislation/[jurisdiction]/`** - Pre-built for all 50 states + DC + federal
- **`/states/[state]/`** - Pre-built for all 50 states + DC
- **`/privacy/`** - Privacy policy and data handling
- **`/resources/`** - Research tools and API documentation

### Admin Routes (Client-Side Only)
- **`/admin/`** - Dashboard (auth-gated)
- **`/admin/incidents/`** - Incident management interface
- **`/admin/legislation/`** - Legislation management
- **`/admin/users/`** - Admin allowlist management
- **`/admin/audit/`** - Audit log viewer
- **`/account/login/`** - Magic link authentication

## Security Considerations

### Secrets Management
- **Static Site**: Contains only public Supabase anon key
- **Edge Functions**: Service role key stored in Supabase environment
- **GitHub**: No secrets in repository or Actions
- **CAPTCHA**: Turnstile keys managed separately

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Access Control**: RLS enforced at database level
- **Audit Trail**: Complete log of all data changes
- **Backup**: Regular automated backups with point-in-time recovery

### Privacy Compliance
- **GDPR**: Right to access, correct, and delete personal data
- **CCPA**: California privacy rights respected
- **Data Minimization**: Only collect necessary information
- **Retention**: Clear policies on data retention periods

## Deployment Process

### 1. Database Setup
```sql
-- Run in Supabase SQL Editor in order:
1. supabase/00_init.sql      -- Schema, tables, triggers, RLS enable
2. supabase/30_policies.sql  -- RLS policies for access control  
3. supabase/10_views.sql     -- Public views for published data
4. supabase/20_materialized_views.sql -- Analytics views + refresh function
5. supabase/40_refresh_jobs.sql -- Schedule nightly refresh jobs
```

### 2. Edge Functions
```bash
# Deploy via Supabase CLI (manual process)
supabase functions deploy admin-incidents
supabase functions deploy admin-legislation  
supabase functions deploy admin-users
supabase functions deploy submit-correction

# Set environment variables
supabase secrets set TURNSTILE_SECRET_KEY=your_key
```

### 3. Static Site
```bash
# Automated via GitHub Actions on push to main
pnpm install
pnpm run lint:schema  # Validates proper schema usage
pnpm run typecheck   # TypeScript validation
pnpm run build       # Next.js build + export
# Deploy to GitHub Pages
```

### 4. Configuration
- Add `data` schema to Supabase exposed schemas
- Configure GitHub Pages settings
- Add admin emails to `public.admin_allowlist`
- Set up domain (optional) via CNAME file

## SQL Execution Order

Critical to run SQL files in correct order due to dependencies:

1. **00_init.sql** - Base schema, must run first
2. **30_policies.sql** - RLS policies, depends on tables
3. **10_views.sql** - Views, depends on tables and policies  
4. **20_materialized_views.sql** - Materialized views, depends on tables
5. **40_refresh_jobs.sql** - Scheduling notes, run last

## Future Enhancements

### Search & Discovery
- Full-text search across incidents and legislation
- Advanced filtering and faceted search
- Saved searches and alerts for researchers

### Geographic Analysis  
- PostGIS integration for spatial analysis
- Heat maps and geographic clustering
- Demographic overlay analysis

### Real-Time Features
- Live data updates via Supabase Realtime
- Push notifications for new incidents
- Collaborative research features

### API Enhancements
- GraphQL endpoint for complex queries
- Rate limiting and API keys for heavy usage
- Webhook support for data syndication

### Data Visualization
- Interactive charts and timelines
- Comparative analysis tools
- Embeddable widgets for news sites

## Performance Considerations

### Static Site Benefits
- **Global CDN**: Fast loading worldwide via GitHub Pages CDN
- **Zero Server Costs**: No ongoing hosting expenses
- **Infinite Scale**: Handles traffic spikes automatically
- **Offline Capable**: Core functionality works offline

### Database Optimization
- **Materialized Views**: Pre-computed analytics for fast queries
- **Proper Indexing**: Optimized for common query patterns
- **Connection Pooling**: Supabase handles connection management
- **Query Optimization**: Regular EXPLAIN analysis

### Monitoring & Observability
- **Supabase Dashboard**: Built-in monitoring and logs
- **GitHub Actions**: Build and deployment monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Core Web Vitals tracking

## Maintenance & Operations

### Regular Tasks
- **Weekly**: Review correction submissions
- **Monthly**: Data quality audits and source verification
- **Quarterly**: Security review and dependency updates
- **Annually**: Complete data export and backup verification

### Monitoring
- **Uptime**: GitHub Pages and Supabase availability
- **Performance**: Page load times and API response times
- **Security**: Failed login attempts and suspicious activity
- **Data Quality**: Source verification and accuracy metrics

This architecture provides a robust, secure, and scalable platform for maintaining and distributing mass shooting incident data while ensuring proper access control and data integrity.
