# MSArchive V2

Static Next.js site on GitHub Pages. Supabase DB is the source of truth.
Public reads use views; admin writes go through Supabase Edge Functions.

## Quickstart
1) Copy env.local.example → .env.local and fill keys.
2) In Supabase: Settings → API → add `data` to *Exposed Schemas*.
3) Run SQL in supabase/executions/*.sql in order (manually in Supabase SQL Editor).
4) Deploy Edge Functions (see Edge Functions section below).
5) pnpm install && pnpm export

## Edge Functions Deployment

### Option A: Install Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all functions
supabase functions deploy admin-incidents
supabase functions deploy admin-legislation
supabase functions deploy admin-users
supabase functions deploy submit-correction

# Set secrets
supabase secrets set TURNSTILE_SECRET_KEY=your_turnstile_secret
```

### Option B: Manual Deployment via Supabase Dashboard
1. Go to your Supabase project → Edge Functions
2. Create new function for each:
   - `admin-incidents`
   - `admin-legislation` 
   - `admin-users`
   - `submit-correction`
3. Copy/paste the TypeScript code from `supabase/functions/[function-name]/index.ts`
4. Also copy the shared utilities from `supabase/functions/_shared/`
5. Set environment variables in Settings → Edge Functions

### Option C: Simplified Version (Development Only)
For development/testing, you can temporarily skip Edge Functions and:
- Use Supabase client directly with service role key (NOT for production)
- Implement basic admin operations client-side
- Add Edge Functions later when ready for production deployment

**Note**: Edge Functions are required for production to keep admin secrets secure!