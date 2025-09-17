// POST create, PUT update, DELETE remove, GET list; requires admin
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const method = req.method.toUpperCase()
  const url = new URL(req.url)
  
  if (method === 'GET') {
    // Get weapons for a suspect
    const suspectId = url.searchParams.get('suspect_id')
    const weaponId = url.searchParams.get('weapon_id')
    
    if (weaponId) {
      // Get single weapon
      const res = await sb.schema('data')
        .from('suspect_weapons')
        .select('*')
        .eq('id', weaponId)
        .single()
      return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
    }
    
    if (suspectId) {
      // Get all weapons for a suspect
      const res = await sb.schema('data')
        .from('suspect_weapons')
        .select('*')
        .eq('suspect_id', suspectId)
        .order('id', { ascending: true })
      return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
    }
    
    return new Response(JSON.stringify({ error: 'suspect_id or weapon_id required' }), { status: 400 })
  }
  
  if (method === 'POST') {
    const body = await req.json().catch(() => ({}))
    
    // Validate required fields
    if (!body.suspect_id || !body.type) {
      return new Response(JSON.stringify({ error: 'suspect_id and type required' }), { status: 400 })
    }
    
    const res = await sb.schema('data')
      .from('suspect_weapons')
      .insert(body)
      .select('*')
      .single()
    
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'PUT') {
    const body = await req.json().catch(() => ({}))
    const { id, ...updateData } = body
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'weapon id required' }), { status: 400 })
    }
    
    const res = await sb.schema('data')
      .from('suspect_weapons')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()
    
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'DELETE') {
    const body = await req.json().catch(() => ({}))
    const { id } = body
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'weapon id required' }), { status: 400 })
    }
    
    const res = await sb.schema('data')
      .from('suspect_weapons')
      .delete()
      .eq('id', id)
    
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  return new Response('Method Not Allowed', { status: 405 })
})
