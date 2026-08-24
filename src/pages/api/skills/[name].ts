export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createSkillsManager } from '@/lib/agent-skills'

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Skill name is required' }, 400)
  }

  const skill = await manager.getSkillByName(name)
  if (!skill) {
    return json({ error: 'Skill not found' }, 404)
  }

  return json({ skill })
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Skill name is required' }, 400)
  }

  const body = await request.json().catch(() => ({})) as {
    description?: string
    content?: string
  }

  const skill = await manager.updateSkill(name, body)
  if (!skill) {
    return json({ error: 'Skill not found' }, 404)
  }

  return json({ skill })
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const name = params.name
  if (!name) {
    return json({ error: 'Skill name is required' }, 400)
  }

  const deleted = await manager.deleteSkill(name)
  if (!deleted) {
    return json({ error: 'Skill not found' }, 404)
  }

  return json({ deleted: true })
}
