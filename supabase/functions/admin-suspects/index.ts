// POST create, PUT update, DELETE remove, GET list; requires admin
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const method = req.method.toUpperCase()
  const url = new URL(req.url)
  
  if (method === 'GET') {
    // Get suspects for an incident
    const incidentId = url.searchParams.get('incident_id')
    const suspectId = url.searchParams.get('suspect_id')
    
    if (suspectId) {
      // Get single suspect with weapons and history
      const res = await sb.schema('data')
        .from('suspects')
        .select(`
          *,
          weapons:suspect_weapons(*),
          history:suspect_prior_history(*)
        `)
        .eq('id', suspectId)
        .single()
      return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
    }
    
    if (incidentId) {
      // Get all suspects for an incident
      const res = await sb.schema('data')
        .from('suspects')
        .select(`
          *,
          weapons:suspect_weapons(*),
          history:suspect_prior_history(*)
        `)
        .eq('incident_id', incidentId)
        .order('created_at', { ascending: true })
      return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
    }
    
    return new Response(JSON.stringify({ error: 'incident_id or suspect_id required' }), { status: 400 })
  }
  
  if (method === 'POST') {
    const body = await req.json().catch(() => ({}))
    const { weapons = [], history, ...suspectData } = body
    
    // Validate required fields
    if (!suspectData.incident_id) {
      return new Response(JSON.stringify({ error: 'incident_id required' }), { status: 400 })
    }
    
    try {
      // Insert suspect
      const { data: suspect, error: suspectError } = await sb.schema('data')
        .from('suspects')
        .insert(suspectData)
        .select('*')
        .single()
      
      if (suspectError) {
        return new Response(JSON.stringify({ error: suspectError }), { status: 400 })
      }
      
      // Insert weapons if provided
      if (weapons.length > 0) {
        const weaponsData = weapons.map((weapon: any) => ({
          ...weapon,
          suspect_id: suspect.id
        }))
        
        const { error: weaponsError } = await sb.schema('data')
          .from('suspect_weapons')
          .insert(weaponsData)
        
        if (weaponsError) {
          console.error('Weapons insert error:', weaponsError)
        }
      }
      
      // Insert history if provided
      if (history) {
        const { error: historyError } = await sb.schema('data')
          .from('suspect_prior_history')
          .insert({
            ...history,
            suspect_id: suspect.id
          })
        
        if (historyError) {
          console.error('History insert error:', historyError)
        }
      }
      
      // Return complete suspect data
      const { data: fullSuspect } = await sb.schema('data')
        .from('suspects')
        .select(`
          *,
          weapons:suspect_weapons(*),
          history:suspect_prior_history(*)
        `)
        .eq('id', suspect.id)
        .single()
      
      return new Response(JSON.stringify({ data: fullSuspect }), { status: 200 })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
  }
  
  if (method === 'PUT') {
    const body = await req.json().catch(() => ({}))
    const { id, weapons = [], history, ...suspectData } = body
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'suspect id required' }), { status: 400 })
    }
    
    try {
      // Update suspect
      const { data: suspect, error: suspectError } = await sb.schema('data')
        .from('suspects')
        .update(suspectData)
        .eq('id', id)
        .select('*')
        .single()
      
      if (suspectError) {
        return new Response(JSON.stringify({ error: suspectError }), { status: 400 })
      }
      
      // Update weapons (delete all and re-insert)
      await sb.schema('data').from('suspect_weapons').delete().eq('suspect_id', id)
      
      if (weapons.length > 0) {
        const weaponsData = weapons.map((weapon: any) => ({
          ...weapon,
          suspect_id: id
        }))
        
        await sb.schema('data').from('suspect_weapons').insert(weaponsData)
      }
      
      // Update history (upsert)
      if (history) {
        await sb.schema('data')
          .from('suspect_prior_history')
          .upsert({
            ...history,
            suspect_id: id
          })
      }
      
      // Return complete suspect data
      const { data: fullSuspect } = await sb.schema('data')
        .from('suspects')
        .select(`
          *,
          weapons:suspect_weapons(*),
          history:suspect_prior_history(*)
        `)
        .eq('id', id)
        .single()
      
      return new Response(JSON.stringify({ data: fullSuspect }), { status: 200 })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
  }
  
  if (method === 'DELETE') {
    const body = await req.json().catch(() => ({}))
    const { id } = body
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'suspect id required' }), { status: 400 })
    }
    
    // Delete suspect (cascade will handle weapons and history)
    const res = await sb.schema('data').from('suspects').delete().eq('id', id)
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  return new Response('Method Not Allowed', { status: 405 })
})
