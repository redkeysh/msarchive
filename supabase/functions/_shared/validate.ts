export async function validateTurnstile(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) return true // fallback if not configured
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token })
    })
    const j = await r.json()
    return !!j.success
  } catch {
    return false
  }
}
