export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { createHash } from '@/lib/marketplace/hash'

type Env = { DB: D1Database; R2_AGENT_ARTIFACT?: R2Bucket }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const url = new URL(request.url)
  const query = url.searchParams.get('q')

  if (query) {
    const rows = await e.DB.prepare(`
      SELECT s.slug, s.display_name, sv.description, sv.version, sv.status, s.source
      FROM skill s JOIN skill_version sv ON sv.id = s.latest_version_id
      WHERE (s.slug LIKE ? OR sv.description LIKE ?) AND sv.status = 'published'
      ORDER BY s.slug
    `).bind(`%${query}%`, `%${query}%`).all()
    return json({ skills: rows.results ?? [] })
  }

  // Try v2 schema first
  const rows = await e.DB.prepare(`
    SELECT s.slug, s.display_name, sv.description, sv.version, sv.status, s.source
    FROM skill s JOIN skill_version sv ON sv.id = s.latest_version_id
    ORDER BY s.slug
  `).all()

  if (rows.results?.length) {
    return json({ skills: rows.results })
  }

  // Fallback to legacy user_skills
  const legacy = await e.DB.prepare('SELECT name, description, source FROM user_skills ORDER BY name').all()
  return json({ skills: (legacy.results ?? []).map(r => ({ slug: r.name, description: r.description, source: r.source, status: 'published' })) })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const body = await request.json().catch(() => ({})) as {
    slug?: string
    display_name?: string
    description?: string
    content?: string
  }

  if (!body.slug || !body.description || !body.content) {
    return badRequest('slug, description, and content are required')
  }

  const now = Math.floor(Date.now() / 1000)
  const skillId = genId('skill')
  const versionId = genId('skillver')
  const contentHash = await createHash(body.content)

  let bodyR2Key: string | null = null
  if (e.R2_AGENT_ARTIFACT) {
    bodyR2Key = `skills/${contentHash}.md`
    await e.R2_AGENT_ARTIFACT.put(bodyR2Key, body.content)
  }

  await e.DB.prepare(`
    INSERT INTO skill (id, slug, display_name, scope, source, latest_version_id, created_at)
    VALUES (?, ?, ?, 'personal', 'custom', ?, ?)
  `).bind(skillId, body.slug, body.display_name ?? body.slug, versionId, now).run()

  await e.DB.prepare(`
    INSERT INTO skill_version (id, skill_id, version, name, description, body, body_r2_key, content_hash, status, published_at, created_at)
    VALUES (?, ?, 1, ?, ?, ?, ?, ?, 'published', ?, ?)
  `).bind(
    versionId, skillId,
    body.slug, body.description,
    bodyR2Key ? '' : body.content,
    bodyR2Key, contentHash,
    now, now,
  ).run()

  return json({
    skill: { id: skillId, slug: body.slug, display_name: body.display_name ?? body.slug, description: body.description, version: 1, status: 'published' },
  }, 201)
}
