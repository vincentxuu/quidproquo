export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createBackends } from '@/lib/agent-os/storage'
import { isTerminalStatus } from '@/lib/agent-os/state-machine'
import { ensureAgentOsEnabled } from '../../_guard'
import { requirePermission, auditLog, PermissionDenied } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

export const POST: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const runId = params.runId
  if (!runId) return notFound('run not found')

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  // TODO: session does not store email; replace 'admin' with real email once sessions carry identity
  const adminEmail = 'admin'

  try {
    await requirePermission({ db: typedEnv.DB, email: adminEmail, kind: 'run', id: runId, action: 'cancel', flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  const backends = createBackends(typedEnv)
  const run = await backends.runs.get(runId)
  if (!run) return notFound('run not found')
  if (isTerminalStatus(run.status)) return json({ error: 'run_terminal' }, 409)
  await backends.cancelSignals.signal(runId)
  await backends.runs.markCancelRequested(runId)

  const ctx = (locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } }).runtime?.ctx
  auditLog({ db: typedEnv.DB, email: adminEmail, action: 'flow.run.cancel', kind: 'run', id: runId, waitUntil: ctx?.waitUntil?.bind(ctx) }).catch(() => {})

  return json({ ok: true })
}
