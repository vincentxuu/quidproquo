export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { runConsoleRollupDaily } from '@/lib/agent-console/cost/rollup'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'
import { requirePermission, auditLog, PermissionDenied } from '@/lib/agent-console/rbac/permissions'

const MAX_BACKFILL_DAYS = 366

function getWaitUntil(locals: unknown): ((promise: Promise<unknown>) => void) | undefined {
  const cfContext = (locals as { cfContext?: { waitUntil?: (promise: Promise<unknown>) => void } }).cfContext
  return cfContext?.waitUntil?.bind(cfContext)
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  if (!flags.agentConsole.enabled) {
    return new Response(JSON.stringify({ error: 'console disabled' }), { status: 503 })
  }

  // TODO: session does not store email; replace 'admin' with real email once sessions carry identity
  const adminEmail = 'admin'

  try {
    await requirePermission({ db: typedEnv.DB, email: adminEmail, kind: 'cost', action: 'export', flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  let fromDay: number | undefined
  let toDay: number | undefined
  try {
    const body = await request.json() as { fromDay?: number; toDay?: number }
    fromDay = body.fromDay
    toDay = body.toDay
  } catch {
    // body is optional
  }

  if (fromDay === undefined || toDay === undefined) {
    return json({ error: 'fromDay and toDay are required for manual backfill' }, 400)
  }

  if (!Number.isInteger(fromDay) || fromDay < 0) {
    return json({ error: 'fromDay must be a non-negative integer' }, 400)
  }

  if (!Number.isInteger(toDay) || toDay < 0) {
    return json({ error: 'toDay must be a non-negative integer' }, 400)
  }

  if (fromDay > toDay) {
    return json({ error: 'fromDay must be before or equal to toDay' }, 400)
  }

  const todayDay = Math.floor(Date.now() / 86_400_000)
  if (fromDay > todayDay) {
    return json({ error: 'fromDay cannot be in the future' }, 400)
  }

  if (toDay > todayDay) {
    return json({ error: 'toDay cannot be in the future' }, 400)
  }

  if (toDay - fromDay + 1 > MAX_BACKFILL_DAYS) {
    return json({ error: `backfill range cannot exceed ${MAX_BACKFILL_DAYS} days` }, 400)
  }

  try {
    const summary = await runConsoleRollupDaily(typedEnv, fromDay, toDay)

    auditLog({
      db: typedEnv.DB,
      email: adminEmail,
      action: 'cost.backfill',
      kind: 'cost',
      payload: summary,
      waitUntil: getWaitUntil(locals),
    }).catch(() => {})

    return json({ ok: true, summary })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
