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
import { getTableColumns } from '@/lib/admin-console/schema'

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

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
  const stepRunColumns = await getTableColumns(db, 'flow_step_runs')
  const stepTypeSelect = stepRunColumns.has('step_type') ? 'step_type' : 'kind AS step_type'
  const iterationSelect = stepRunColumns.has('iteration') ? 'iteration' : '0 AS iteration'
  const attemptSelect = stepRunColumns.has('attempt') ? 'attempt' : '1 AS attempt'
  const parentStepSelect = stepRunColumns.has('parent_step_run_id') ? 'parent_step_run_id' : 'NULL AS parent_step_run_id'

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
      `SELECT step_run_id, flow_run_id, step_id, step_order, ${stepTypeSelect},
              ${iterationSelect}, ${attemptSelect}, status, ${parentStepSelect}
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
  const maxAttemptRow = stepRunColumns.has('attempt')
    ? await db
      .prepare(
        `SELECT MAX(attempt) AS max_attempt
         FROM flow_step_runs
         WHERE flow_run_id = ? AND step_id = ?`,
      )
      .bind(runId, stepRun.step_id)
      .first<{ max_attempt: number | null }>()
    : null

  const newAttempt = (maxAttemptRow?.max_attempt ?? stepRun.attempt) + 1
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

  auditLog({ db, email: adminEmail, action: 'flow.step.retry', kind: 'run', id: stepRunId, waitUntil: getWaitUntil(locals) }).catch(() => {})

  return json({ stepRunId: newStepRunId, attempt: newAttempt }, 202)
}
