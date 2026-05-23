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
  const def = await db.prepare(
    `SELECT policy_id FROM policy_definitions WHERE policy_key=? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
  ).bind(policyKey).first<{ policy_id: number }>()
  if (!def) return json({ error: 'not_found' }, 404)

  const bindings = await db.prepare(
    `SELECT * FROM policy_bindings WHERE policy_id=? ORDER BY binding_id DESC`
  ).bind(def.policy_id).all()

  return json({ bindings: bindings.results ?? [] })
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const policyKey = params.id
  if (!policyKey) return json({ error: 'policy_key_required' }, 400)

  let body: unknown
  try { body = await request.json() } catch { return json({ error: 'invalid_json' }, 400) }

  const { scope, flow_run_id, flow_definition_id, agent_id } = body as Record<string, unknown>
  if (!scope) return json({ error: 'scope_required' }, 400)

  const db = (env as unknown as Env).DB
  const def = await db.prepare(
    `SELECT policy_id FROM policy_definitions WHERE policy_key=? AND archived_at IS NULL ORDER BY version DESC LIMIT 1`
  ).bind(policyKey).first<{ policy_id: number }>()
  if (!def) return json({ error: 'not_found' }, 404)

  const result = await db.prepare(
    `INSERT INTO policy_bindings (policy_id, scope, flow_run_id, flow_definition_id, agent_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(def.policy_id, scope, flow_run_id ?? null, flow_definition_id ?? null, agent_id ?? null, nowMs()).run()

  return json({ bindingId: result.meta.last_row_id }, 201)
}
