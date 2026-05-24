export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'
import { auditLog, PermissionDenied, requirePermission } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'
import { getTableColumns } from '@/lib/admin-console/schema'

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const runId = params.runId
  const stepRunId = params.stepRunId
  if (!runId) return json({ error: 'flow_run_id_required' }, 400)
  if (!stepRunId) return json({ error: 'step_run_id_required' }, 400)

  const workerEnv = env as unknown as Env
  const db = workerEnv.DB
  const flags = readFlags(workerEnv)
  const actor = 'admin'
  const stepRunColumns = await getTableColumns(db, 'flow_step_runs')
  const stepTypeSelect = stepRunColumns.has('step_type') ? 'step_type' : 'kind AS step_type'
  const iterationSelect = stepRunColumns.has('iteration') ? 'iteration' : '0 AS iteration'
  const parentStepSelect = stepRunColumns.has('parent_step_run_id') ? 'parent_step_run_id' : 'NULL AS parent_step_run_id'
  const attemptSelect = stepRunColumns.has('attempt') ? 'attempt' : '1 AS attempt'

  const stepRun = await db
    .prepare(
      `SELECT step_run_id, flow_run_id, step_id, step_order, ${stepTypeSelect}, ${iterationSelect}, status, ${parentStepSelect}, ${attemptSelect}
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

  try {
    await requirePermission({ db, email: actor, kind: 'run', id: runId, action: 'invoke', flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  const maxAttempt = stepRunColumns.has('attempt')
    ? await db
      .prepare(
        `SELECT MAX(attempt) AS max_attempt
         FROM flow_step_runs
         WHERE flow_run_id = ? AND step_id = ?`,
      )
      .bind(runId, stepRun.step_id)
      .first<{ max_attempt: number | null }>()
    : null

  const latestAttempt = maxAttempt?.max_attempt ?? stepRun.attempt
  if (stepRunColumns.has('attempt') && latestAttempt > stepRun.attempt) {
    return json({ error: 'step_retry_superseded', latestAttempt }, 409)
  }

  const newAttempt = latestAttempt + 1
  const newStepRunId = crypto.randomUUID()
  const now = nowMs()
  const insertColumns: string[] = ['step_run_id', 'flow_run_id', 'step_id', 'step_order', 'status', 'started_at', 'created_at']
  const insertValues: unknown[] = [newStepRunId, runId, stepRun.step_id, stepRun.step_order, 'pending', now, now]
  if (stepRunColumns.has('parent_step_run_id')) {
    insertColumns.push('parent_step_run_id')
    insertValues.push(stepRun.parent_step_run_id)
  }
  if (stepRunColumns.has('step_type')) {
    insertColumns.push('step_type')
    insertValues.push(stepRun.step_type)
  } else if (stepRunColumns.has('kind')) {
    insertColumns.push('kind')
    insertValues.push(stepRun.step_type)
  }
  if (stepRunColumns.has('iteration')) {
    insertColumns.push('iteration')
    insertValues.push(stepRun.iteration)
  }
  if (stepRunColumns.has('attempt')) {
    insertColumns.push('attempt')
    insertValues.push(newAttempt)
  }
  if (stepRunColumns.has('updated_at')) {
    insertColumns.push('updated_at')
    insertValues.push(now)
  }

  await db
    .prepare(`INSERT INTO flow_step_runs (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})`)
    .bind(...insertValues)
    .run()

  auditLog({
    db,
    email: actor,
    action: 'flow.step.retry',
    kind: 'run',
    id: runId,
    payload: {
      stepRunId,
      newStepRunId,
      stepId: stepRun.step_id,
      previousAttempt: stepRun.attempt,
      attempt: newAttempt,
      previousStatus: stepRun.status,
    },
    waitUntil: getWaitUntil(locals),
  }).catch(() => {})

  // Re-run is surfaced through polling in run timeline / SSE refresh loop.
  return json({
    ok: true,
    stepRunId: newStepRunId,
    attempt: newAttempt,
    runId,
  }, 202)
}
