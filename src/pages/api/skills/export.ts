export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createSkillsManager } from '@/lib/extensions'

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as { DB: D1Database }).DB
  const manager = createSkillsManager(db)

  const url = new URL(request.url)
  const name = url.searchParams.get('name')

  if (name) {
    const skill = await manager.exportSkill(name)
    if (!skill) {
      return json({ error: 'Skill not found' }, 404)
    }
    return json({ skill })
  }

  const skills = await manager.listUserSkills()
  const exports = []
  for (const s of skills) {
    const exported = await manager.exportSkill(s.name)
    if (exported) {
      exports.push(exported)
    }
  }

  return json({ skills: exports })
}
