export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { createHash } from '@/lib/marketplace/hash'

type Env = { DB: D1Database; R2_AGENT_ARTIFACT?: R2Bucket }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const GET: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const slug = params.name
  if (!slug) return badRequest('Skill slug is required')

  const e = env as unknown as Env

  // v2 schema
  const row = await e.DB.prepare(`
    SELECT s.id, s.slug, s.display_name, s.scope, s.source, sv.version, sv.description, sv.body, sv.body_r2_key, sv.status, sv.content_hash
    FROM skill s JOIN skill_version sv ON sv.id = s.latest_version_id
    WHERE s.slug = ?
  `).bind(slug).first<Record<string, unknown>>()

  if (row) {
    let content = (row.body as string) ?? ''
    const r2Key = row.body_r2_key as string | null
    if (r2Key && e.R2_AGENT_ARTIFACT) {
      const obj = await e.R2_AGENT_ARTIFACT.get(r2Key)
      if (obj) content = await obj.text()
    }

    const files = await e.DB.prepare(`
      SELECT sf.path, sf.size_bytes FROM skill_file sf
      JOIN skill_version sv ON sv.id = sf.version_id
      JOIN skill s ON s.latest_version_id = sv.id
      WHERE s.slug = ?
    `).bind(slug).all<{ path: string; size_bytes: number | null }>()

    return json({
      skill: {
        id: row.id,
        slug: row.slug,
        display_name: row.display_name,
        scope: row.scope,
        source: row.source,
        version: row.version,
        description: row.description,
        content,
        status: row.status,
        content_hash: row.content_hash,
        files: (files.results ?? []).map(f => ({ path: f.path, size: f.size_bytes })),
      },
    })
  }

  // Fallback: legacy user_skills
  const legacy = await e.DB.prepare('SELECT * FROM user_skills WHERE name = ?').bind(slug).first()
  if (!legacy) return notFound('Skill not found')
  return json({ skill: legacy })
}

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const slug = params.name
  if (!slug) return badRequest('Skill slug is required')

  const e = env as unknown as Env
  const body = await request.json().catch(() => ({})) as {
    description?: string
    content?: string
    display_name?: string
  }

  // Find existing skill
  const skill = await e.DB.prepare('SELECT id, latest_version_id FROM skill WHERE slug = ?').bind(slug).first<{ id: string; latest_version_id: string }>()
  if (!skill) return notFound('Skill not found')

  // Get current version number
  const currentVersion = await e.DB.prepare('SELECT version FROM skill_version WHERE id = ?').bind(skill.latest_version_id).first<{ version: number }>()
  const nextVersion = (currentVersion?.version ?? 0) + 1
  const now = Math.floor(Date.now() / 1000)

  // Get current values for unchanged fields
  const current = await e.DB.prepare('SELECT name, description, body, body_r2_key FROM skill_version WHERE id = ?')
    .bind(skill.latest_version_id).first<{ name: string; description: string; body: string; body_r2_key: string | null }>()

  const newDescription = body.description ?? current?.description ?? ''
  const newContent = body.content ?? current?.body ?? ''
  const contentHash = await createHash(newContent)

  let bodyR2Key: string | null = null
  if (e.R2_AGENT_ARTIFACT) {
    bodyR2Key = `skills/${contentHash}.md`
    await e.R2_AGENT_ARTIFACT.put(bodyR2Key, newContent)
  }

  const versionId = genId('skillver')
  await e.DB.prepare(`
    INSERT INTO skill_version (id, skill_id, version, name, description, body, body_r2_key, content_hash, status, published_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?)
  `).bind(versionId, skill.id, nextVersion, slug, newDescription, bodyR2Key ? '' : newContent, bodyR2Key, contentHash, now, now).run()

  await e.DB.prepare('UPDATE skill SET latest_version_id = ? WHERE id = ?').bind(versionId, skill.id).run()

  if (body.display_name) {
    await e.DB.prepare('UPDATE skill SET display_name = ? WHERE id = ?').bind(body.display_name, skill.id).run()
  }

  return json({ skill: { slug, version: nextVersion, description: newDescription, status: 'published' } })
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const slug = params.name
  if (!slug) return badRequest('Skill slug is required')

  const e = env as unknown as Env

  const skill = await e.DB.prepare('SELECT latest_version_id FROM skill WHERE slug = ?').bind(slug).first<{ latest_version_id: string }>()
  if (!skill) return notFound('Skill not found')

  await e.DB.prepare("UPDATE skill_version SET status = 'deprecated' WHERE id = ?").bind(skill.latest_version_id).run()

  return json({ deleted: true, slug })
}
