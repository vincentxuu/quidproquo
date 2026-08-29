export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const rows = await db.prepare(
    `SELECT policy_id, policy_key, version, label, category_json, created_by, created_at, updated_at
     FROM policy_definitions WHERE archived_at IS NULL ORDER BY updated_at DESC`
  ).all()

  return json({ policies: rows.results ?? [] })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  let body: unknown
  try { body = await request.json() } catch { return json({ error: 'invalid_json' }, 400) }

  const { policy_key, label, policy_body } = body as Record<string, unknown>
  if (!policy_key || !label || !policy_body) return json({ error: 'policy_key_label_body_required' }, 400)

  const db = (env as unknown as Env).DB
  const now = nowMs()
  const result = await db.prepare(
    `INSERT INTO policy_definitions (policy_key, version, label, category_json, created_at, updated_at)
     VALUES (?, 1, ?, ?, ?, ?)`
  ).bind(policy_key, label, JSON.stringify(policy_body), now, now).run()

  return json({ policyId: result.meta.last_row_id, version: 1 }, 201)
}
