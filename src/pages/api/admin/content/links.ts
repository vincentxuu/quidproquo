export const prerender = false

import type { APIRoute } from 'astro'
import { verifySession } from '../../../../lib/auth/session'

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  // Placeholder - would need content-ops report data
  return json({ opportunities: [] })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
