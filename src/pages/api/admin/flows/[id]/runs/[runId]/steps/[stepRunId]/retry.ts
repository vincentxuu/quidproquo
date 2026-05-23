export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'
import { ensureAgentFlowEnabled } from '../../../../../_guard'
import { requirePermission, auditLog, PermissionDenied } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

export const POST: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const runId = params.runId
  const stepRunId = params.stepRunId
  if (!runId) return json({ error: 'flow_run_id_required' }, 400)
  if (!stepRunId) return json({ error: 'step_run_id_required' }, 400)

  const workerEnv = env as unknown as Env
  const db = workerEnv.DB
  const flags = readFlags(workerEnv)

  // TODO: session does not store email; replace 'admin' with real email once sessions carry identity
  const adminEmail = 'admin'

  try {
    await requirePermission({ db, email: adminEmail, kind: 'run', id: runId, action: 'invoke', flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  // Load the step run and verify it belongs to this run
  const stepRun = await db
    .prepare(
      `SELECT step_run_id, flow_run_id, step_id, step_order, step_type,
              iteration, attempt, status, parent_step_run_id
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
      attempt: number
      status: string
      parent_step_run_id: string | null
    }>()

  if (!stepRun) return json({ error: 'step_run_not_found' }, 404)
  if (stepRun.flow_run_id !== runId) return json({ error: 'step_run_not_found' }, 404)

  // Only failed or cancelled steps are retryable
  if (stepRun.status !== 'failed' && stepRun.status !== 'cancelled') {
    return json({ error: 'Step is not in a retryable state' }, 409)
  }

  // Reject if any downstream step (higher step_order, same run) has already succeeded
  const downstream = await db
    .prepare(
      `SELECT COUNT(*) AS cnt
       FROM flow_step_runs
       WHERE flow_run_id = ? AND step_order > ? AND status = 'done'`,
    )
    .bind(runId, stepRun.step_order)
    .first<{ cnt: number }>()

  if ((downstream?.cnt ?? 0) > 0) {
    return json({ error: 'Downstream steps have already succeeded' }, 409)
  }

  // Find the current max attempt for this step_id in this run
  const maxAttemptRow = await db
    .prepare(
      `SELECT MAX(attempt) AS max_attempt
       FROM flow_step_runs
       WHERE flow_run_id = ? AND step_id = ?`,
    )
    .bind(runId, stepRun.step_id)
    .first<{ max_attempt: number | null }>()

  const newAttempt = (maxAttemptRow?.max_attempt ?? stepRun.attempt) + 1
  const newStepRunId = crypto.randomUUID()
  const now = nowMs()

  await db
    .prepare(
      `INSERT INTO flow_step_runs (
        step_run_id, flow_run_id, parent_step_run_id, step_id, step_order, step_type,
        iteration, status, attempt, started_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
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

  const ctx = (locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } }).runtime?.ctx
  auditLog({ db, email: adminEmail, action: 'flow.step.retry', kind: 'run', id: stepRunId, waitUntil: ctx?.waitUntil?.bind(ctx) }).catch(() => {})

  return json({ stepRunId: newStepRunId, attempt: newAttempt }, 202)
}
