export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createSkillsManager } from '@/lib/extensions'

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const body = await request.json().catch(() => ({})) as {
    skills?: Array<{
      name: string
      description: string
      content: string
    }>
    overwrite?: boolean
  }

  if (!body.skills || !Array.isArray(body.skills)) {
    return json({ error: 'skills array is required' }, 400)
  }

  const results = []
  for (const skill of body.skills) {
    const result = await manager.importSkill(skill, { overwrite: body.overwrite })
    results.push(result)
  }

  return json({
    imported: results.length,
    created: results.filter((r) => r.action === 'created').length,
    updated: results.filter((r) => r.action === 'updated').length,
    results,
  })
}
