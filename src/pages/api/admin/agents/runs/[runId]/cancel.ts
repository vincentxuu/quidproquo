export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createBackends } from '@/lib/agent-os/storage'
import { isTerminalStatus } from '@/lib/agent-os/state-machine'
import { ensureAgentOsEnabled } from '../../_guard'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const runId = params.runId
  if (!runId) return notFound('run not found')
  const backends = createBackends(env as unknown as Env)
  const run = await backends.runs.get(runId)
  if (!run) return notFound('run not found')
  if (isTerminalStatus(run.status)) return json({ error: 'run_terminal' }, 409)
  await backends.cancelSignals.signal(runId)
  await backends.runs.markCancelRequested(runId)
  return json({ ok: true })
}
