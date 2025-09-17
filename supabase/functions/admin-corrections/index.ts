// GET list, PUT update status, DELETE archive; requires admin
import { supabaseAdmin } from '../_shared/client.ts'

Deno.serve(async (req) => {
  const sb = supabaseAdmin()
  const { data: isAdmin } = await sb.rpc('auth_is_admin')
  if (!isAdmin) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
  
  const method = req.method.toUpperCase()
  const url = new URL(req.url)
  
  if (method === 'GET') {
    // Get all corrections with optional filtering
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    
    let query = sb.schema('data').from('corrections')
      .select(`
        *,
        incidents:incident_id(incident_code, date, city, state),
        legislation:legislation_id(law_code, title, jurisdiction)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (type && type !== 'all') {
      query = query.eq('correction_type', type)
    }
    
    const res = await query
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'PUT') {
    // Update correction status
    const body = await req.json().catch(() => ({}))
    const { id, status, notes, reviewed_by } = body
    
    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'missing_required_fields' }), { status: 400 })
    }
    
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected']
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'invalid_status' }), { status: 400 })
    }
    
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString()
    }
    
    if (notes) updateData.notes = notes
    if (reviewed_by) updateData.reviewed_by = reviewed_by
    
    const res = await sb.schema('data').from('corrections')
      .update(updateData)
      .eq('id', id)
      .select('id,status,reviewed_at')
      .single()
      
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  if (method === 'DELETE') {
    // Archive/delete correction
    const body = await req.json().catch(() => ({}))
    const { id } = body
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'missing_id' }), { status: 400 })
    }
    
    const res = await sb.schema('data').from('corrections')
      .delete()
      .eq('id', id)
      
    return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
  }
  
  return new Response('Method Not Allowed', { status: 405 })
})
