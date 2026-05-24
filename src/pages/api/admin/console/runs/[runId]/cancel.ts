export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'
import { cancelFlow } from '@/lib/agent-flow/runtime/cancel'
import { auditLog, PermissionDenied, requirePermission } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const runId = params.runId
  if (!runId) return json({ error: 'flow_run_id_required' }, 400)

  const workerEnv = env as unknown as Env
  const db = workerEnv.DB
  const flags = readFlags(workerEnv)
  const actor = 'admin'

  const run = await db
    .prepare(
      `SELECT status, flow_id
       FROM flow_runs
       WHERE flow_run_id = ?
       LIMIT 1`,
    )
    .bind(runId)
    .first<{ status: string; flow_id: string }>()

  if (!run) {
    return notFound('run not found')
  }

  if (run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') {
    return json({ error: 'run_terminal' }, 409)
  }

  try {
    await requirePermission({ db, email: actor, kind: 'run', id: runId, action: 'cancel', flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  const now = nowMs()
  await db
    .prepare(
      `UPDATE flow_runs
       SET status = ?, finished_at = ?, updated_at = ?
       WHERE flow_run_id = ?`,
    )
    .bind('cancelled', now, now, runId)
    .run()

  await cancelFlow(
    runId,
    {
      get: async (key: string) => (workerEnv.SESSION ? workerEnv.SESSION.get(key) : null),
      put: async (key: string, value: string) => {
        if (!workerEnv.SESSION) return
        await workerEnv.SESSION.put(key, value, { expirationTtl: 300 })
      },
    },
    600,
    workerEnv as unknown as Record<string, unknown>,
  )

  auditLog({
    db,
    email: actor,
    action: 'flow.run.cancel',
    kind: 'run',
    id: runId,
    payload: {
      flowId: run.flow_id,
      previousStatus: run.status,
      nextStatus: 'cancelled',
    },
    waitUntil: getWaitUntil(locals),
  }).catch(() => {})

  return json({ ok: true, status: 'cancelled', runId, flowId: run.flow_id })
}
