// manage public.admin_allowlist
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const { action, email } = await req.json()
  
  if (action === 'add') {
    const r = await sb.from('admin_allowlist').insert({ email })
    return new Response(JSON.stringify(r), { status: r.error ? 400 : 200 })
  }
  
  if (action === 'remove') {
    const r = await sb.from('admin_allowlist').delete().eq('email', email)
    return new Response(JSON.stringify(r), { status: r.error ? 400 : 200 })
  }
  
  return new Response('Bad Request', { status: 400 })
})
