export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB

  let total = 0
  let drafts = 0
  let missingType = 0
  let missingDescription = 0
  let missingTldr = 0

  try {
    const totalRow = await db.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    total = totalRow?.c ?? 0

    // These would require parsing frontmatter from content_json or checking specific columns
    // For now, return placeholder values until we have proper metadata columns
    drafts = 0
    missingType = 0
    missingDescription = 0
    missingTldr = 0
  } catch {
    // Tables may not exist yet
  }

  return json({
    total,
    drafts,
    missingType,
    missingDescription,
    missingTldr,
  })
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
