import { supabaseBrowser } from './supabase'

export async function listIncidents(params?: { state?: string; year?: number; schoolOnly?: boolean }) {
  const sb = supabaseBrowser()
  let q = sb.from('v_incidents').select('*')
  if (params?.state) q = q.eq('state', params.state.toUpperCase())
  if (params?.year) q = q.gte('date', `${params.year}-01-01`).lte('date', `${params.year}-12-31`)
  if (params?.schoolOnly) q = q.eq('location_type', 'school')
  return q
}

export async function getIncident(id: string) {
  const sb = supabaseBrowser()
  // from public view using incident_code OR query base by uuid with rpc (optional)
  return sb.from('v_incidents').select('*').eq('id', id).single()
}

export async function listLegislation(jurisdiction: string) {
  const sb = supabaseBrowser()
  if (jurisdiction.toUpperCase() === 'FEDERAL')
    return sb.from('v_legislation').select('*').ilike('jurisdiction', 'FEDERAL')
  return sb.from('v_legislation').select('*').eq('jurisdiction', jurisdiction.toUpperCase())
}

export async function getStats() {
  const sb = supabaseBrowser()
  return {
    yearly: sb.from('mv_stats_yearly').select('*'),
    byState: sb.from('mv_stats_by_state').select('*'),
    deadliest: sb.from('mv_deadliest_incidents').select('*').limit(10),
    monthlyTrends: sb.from('mv_monthly_trends').select('*').limit(24)
  }
}
