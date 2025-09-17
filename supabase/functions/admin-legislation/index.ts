// POST create, PUT update, DELETE remove; requires admin
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const method = req.method.toUpperCase()
  const body = await req.json().catch(() => ({}))
  
  if (method === 'POST') {
    const res = await sb.schema('data').from('legislation')
      .insert(body).select('id,law_code').single()
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'PUT') {
    const res = await sb.schema('data').from('legislation')
      .update(body).eq('id', body.id).select('id,law_code').single()
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'DELETE') {
    const id = body.id
    const res = await sb.schema('data').from('legislation').delete().eq('id', id)
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  return new Response('Method Not Allowed', { status: 405 })
})
