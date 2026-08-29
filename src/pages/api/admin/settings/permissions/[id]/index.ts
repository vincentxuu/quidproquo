export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const policyKey = params.id
  if (!policyKey) return json({ error: 'policy_key_required' }, 400)

  const db = (env as unknown as Env).DB
  const row = await db.prepare(
    `SELECT * FROM policy_definitions WHERE policy_key=? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
  ).bind(policyKey).first()

  if (!row) return json({ error: 'not_found' }, 404)
  return json({ policy: row })
}

export const PUT: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const policyKey = params.id
  if (!policyKey) return json({ error: 'policy_key_required' }, 400)

  let body: unknown
  try { body = await request.json() } catch { return json({ error: 'invalid_json' }, 400) }

  const { policy_body, label } = body as Record<string, unknown>
  if (!policy_body) return json({ error: 'policy_body_required' }, 400)

  const db = (env as unknown as Env).DB
  const current = await db.prepare(
    `SELECT version FROM policy_definitions WHERE policy_key=? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
  ).bind(policyKey).first<{ version: number }>()
  if (!current) return json({ error: 'not_found' }, 404)

  const newVersion = current.version + 1
  const now = nowMs()
  const result = await db.prepare(
    `INSERT INTO policy_definitions (policy_key, version, label, category_json, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(policyKey, newVersion, label ?? policyKey, JSON.stringify(policy_body), now, now).run()

  return json({ policyId: result.meta.last_row_id, version: newVersion })
}

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const policyKey = params.id
  if (!policyKey) return json({ error: 'policy_key_required' }, 400)

  const db = (env as unknown as Env).DB
  await db.prepare(`UPDATE policy_definitions SET archived_at=? WHERE policy_key=? AND archived_at IS NULL`)
    .bind(nowMs(), policyKey).run()

  return json({ archived: true })
}
