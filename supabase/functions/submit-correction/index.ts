import { supabaseAdmin } from '../_shared/client.ts'
import { validateTurnstile } from '../_shared/validate.ts'

Deno.serve(async (req) => {
  const token = req.headers.get('x-turnstile-token') ?? undefined
  if (!(await validateTurnstile(token))) {
    return new Response(JSON.stringify({ error: 'captcha_failed' }), { status: 400 })
  }

  const sb = supabaseAdmin()
  const body = await req.json()
  const res = await sb.schema('data').from('corrections').insert(body).select('id').single()
  return new Response(JSON.stringify(res), { status: res.error ? 400 : 200 })
})
