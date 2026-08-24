export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createSkillsManager } from '@/lib/agent-skills'

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const url = new URL(request.url)
  const query = url.searchParams.get('q')

  if (query) {
    const skills = await manager.searchSkills(query)
    return json({ skills })
  }

  const skills = await manager.listUserSkills()
  return json({ skills })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const body = await request.json().catch(() => ({})) as {
    name?: string
    description?: string
    content?: string
  }

  if (!body.name || !body.description || !body.content) {
    return json({ error: 'name, description, and content are required' }, 400)
  }

  const existing = await manager.getSkillByName(body.name)
  if (existing) {
    return json({ error: 'Skill with this name already exists' }, 409)
  }

  const skill = await manager.createSkill({
    name: body.name,
    description: body.description,
    content: body.content,
    source: 'user',
  })

  return json({ skill }, 201)
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
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

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return json({ error: 'name query parameter is required' }, 400)
  }

  const deleted = await manager.deleteSkill(name)
  if (!deleted) {
    return json({ error: 'Skill not found' }, 404)
  }

  return json({ deleted: true })
}
