export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { runConsoleRollupDaily } from '@/lib/agent-console/cost/rollup'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'
import { requirePermission, auditLog, PermissionDenied } from '@/lib/agent-console/rbac/permissions'

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

  try {
    await runConsoleRollupDaily(typedEnv, fromDay, toDay)

    const ctx = (locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } }).runtime?.ctx
    auditLog({ db: typedEnv.DB, email: adminEmail, action: 'cost.backfill', kind: 'cost', waitUntil: ctx?.waitUntil?.bind(ctx) }).catch(() => {})

    return json({ ok: true })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
