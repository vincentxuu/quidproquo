export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../../_guard'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const { id: flowId, runId } = params
  if (!flowId || !runId) return json({ error: 'flow_id and run_id required' }, 400)

  const db = (env as unknown as Env).DB

  const run = await db
    .prepare(`SELECT * FROM flow_runs WHERE flow_run_id=? AND flow_id=? LIMIT 1`)
    .bind(runId, flowId)
    .first()
  if (!run) return json({ error: 'not_found' }, 404)

  const stepsResult = await db
    .prepare(`SELECT * FROM flow_step_runs WHERE flow_run_id=? ORDER BY started_at ASC`)
    .bind(runId)
    .all()

  return json({ run, steps: stepsResult.results ?? [], artifacts: [] })
}
