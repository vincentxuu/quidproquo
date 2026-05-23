export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../_guard'
import { nowMs } from '@/lib/utils/dates'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id_required' }, 400)

  const db = (env as unknown as Env).DB

  // Verify flow exists
  const flow = await db
    .prepare(`SELECT flow_id FROM flow_definitions WHERE flow_id=? LIMIT 1`)
    .bind(flowId)
    .first<{ flow_id: string }>()
  if (!flow) return json({ error: 'not_found' }, 404)

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    /* ok — empty body is fine */
  }

  const input = (body.input ?? {}) as Record<string, unknown>
  const presetId = typeof body.presetId === 'string' ? body.presetId : null
  const flowRunId = crypto.randomUUID()
  const now = nowMs()

  await db
    .prepare(
      `INSERT INTO flow_runs (flow_run_id, flow_id, preset_id, status, input_json, created_at, started_at, updated_at)
       VALUES (?, ?, ?, 'queued', ?, ?, ?, ?)`,
    )
    .bind(flowRunId, flowId, presetId, JSON.stringify(input), now, now, now)
    .run()

  return json({ flowRunId, status: 'queued' }, 201)
}
