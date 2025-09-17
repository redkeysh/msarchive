// Deno / Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

export const supabaseAdmin = () => {
  const url = Deno.env.get('SUPABASE_URL')!
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  return createClient(url, key)
}
