export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../../../_guard'
import { cancelFlow } from '@/lib/agent-flow/runtime/cancel'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  const runId = params.runId
  if (!flowId || !runId) return notFound('not found')

  const workerEnv = env as unknown as Env
  const db = workerEnv.DB

  const run = await db
    .prepare('SELECT status FROM flow_runs WHERE flow_run_id = ? AND flow_id = ? LIMIT 1')
    .bind(runId, flowId)
    .first<{ status: string }>()

  if (!run) return notFound('not found')
  if (run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') {
    return json({ error: 'run_terminal' }, 409)
  }

  const now = Date.now()
  await db
    .prepare('UPDATE flow_runs SET status = ?, finished_at = ?, updated_at = ? WHERE flow_run_id = ?')
    .bind('cancelled', now, now, runId)
    .run()

  await cancelFlow(
    runId,
    {
      get: async (key: string) => (workerEnv.SESSION ? workerEnv.SESSION.get(key) : null),
      put: async (key: string, value: string) => {
        await workerEnv.SESSION?.put(key, value, { expirationTtl: 300 })
      },
    },
    600,
    workerEnv as unknown as Record<string, unknown>,
  )

  return json({ ok: true, status: 'cancelled' })
}
