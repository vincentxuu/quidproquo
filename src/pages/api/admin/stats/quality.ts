export const prerender = false

import type { APIRoute } from 'astro'
import { verifySession } from '../../../../lib/auth/session'

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  // Placeholder - would need proper frontmatter tracking
  const missingTldr = 0
  const missingType = 0
  const missingDescription = 0
  const brokenLinks = 0

  return json({ missingTldr, missingType, missingDescription, brokenLinks })
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
