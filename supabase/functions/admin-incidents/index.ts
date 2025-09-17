// GET list, POST create, PUT update, DELETE remove; requires admin
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const method = req.method.toUpperCase()
  const body = method !== 'GET' ? await req.json().catch(() => ({})) : {}
  
  if (method === 'GET') {
    const res = await sb.schema('data').from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'POST') {
    const res = await sb.schema('data').from('incidents')
      .insert(body).select('id,incident_code').single()
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'PUT') {
    const res = await sb.schema('data').from('incidents')
      .update(body).eq('id', body.id).select('id,incident_code').single()
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'DELETE') {
    const id = body.id
    const res = await sb.schema('data').from('incidents').delete().eq('id', id)
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  return new Response('Method Not Allowed', { status: 405 })
})
