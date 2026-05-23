export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const runId = params.runId
  const stepRunId = params.stepRunId
  if (!runId) return json({ error: 'flow_run_id_required' }, 400)
  if (!stepRunId) return json({ error: 'step_run_id_required' }, 400)

  const workerEnv = env as unknown as Env
  const db = workerEnv.DB

  const stepRun = await db
    .prepare(
      `SELECT step_run_id, flow_run_id, step_id, step_order, step_type, iteration, status, parent_step_run_id, attempt
       FROM flow_step_runs
       WHERE step_run_id = ?`,
    )
    .bind(stepRunId)
    .first<{
      step_run_id: string
      flow_run_id: string
      step_id: string
      step_order: number
      step_type: string
      iteration: number
      status: string
      parent_step_run_id: string | null
      attempt: number
    }>()

  if (!stepRun || stepRun.flow_run_id !== runId) {
    return json({ error: 'step_run_not_found' }, 404)
  }

  if (stepRun.status !== 'failed' && stepRun.status !== 'cancelled') {
    return json({ error: 'step_not_retryable' }, 409)
  }

  const run = await db
    .prepare(`SELECT status FROM flow_runs WHERE flow_run_id = ? LIMIT 1`)
    .bind(runId)
    .first<{ status: string }>()

  if (!run) return json({ error: 'run_not_found' }, 404)
  if (run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') {
    return json({ error: 'run_terminal' }, 409)
  }

  const downstream = await db
    .prepare(
      `SELECT COUNT(*) AS cnt
       FROM flow_step_runs
       WHERE flow_run_id = ? AND step_order > ? AND status = 'done'`,
    )
    .bind(runId, stepRun.step_order)
    .first<{ cnt: number }>()

  if ((downstream?.cnt ?? 0) > 0) {
    return json({ error: 'downstream_steps_succeeded' }, 409)
  }

  const maxAttempt = await db
    .prepare(
      `SELECT MAX(attempt) AS max_attempt
       FROM flow_step_runs
       WHERE flow_run_id = ? AND step_id = ?`,
    )
    .bind(runId, stepRun.step_id)
    .first<{ max_attempt: number | null }>()

  const newAttempt = (maxAttempt?.max_attempt ?? stepRun.attempt) + 1
  const newStepRunId = crypto.randomUUID()
  const now = nowMs()

  await db
    .prepare(
      `INSERT INTO flow_step_runs (
        step_run_id, flow_run_id, parent_step_run_id, step_id, step_order, step_type,
        iteration, status, attempt, started_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
    )
    .bind(
      newStepRunId,
      runId,
      stepRun.parent_step_run_id,
      stepRun.step_id,
      stepRun.step_order,
      stepRun.step_type,
      stepRun.iteration,
      newAttempt,
      now,
      now,
      now,
    )
    .run()

  // Re-run is surfaced through polling in run timeline / SSE refresh loop.
  return json({
    ok: true,
    stepRunId: newStepRunId,
    attempt: newAttempt,
    runId,
  }, 202)
}
