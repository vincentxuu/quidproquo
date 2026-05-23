export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createKernel } from '@/lib/agent-os/kernel'
import { ensureAgentOsEnabled } from '../../_guard'
import { requirePermission, auditLog, PermissionDenied } from '@/lib/agent-console/rbac/permissions'
import { readFlags } from '@/lib/config/flags'

export const POST: APIRoute = async ({ cookies, params, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const approvalId = params.approvalId
  const action = params.action
  if (!approvalId) return notFound('approval not found')
  if (action !== 'approve' && action !== 'reject') return notFound('approval action not found')

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  // TODO: session does not store email; replace 'admin' with real email once sessions carry identity
  const adminEmail = 'admin'

  try {
    await requirePermission({ db: typedEnv.DB, email: adminEmail, kind: 'approval', id: approvalId, action, flags })
  } catch (err) {
    if (err instanceof PermissionDenied) return json({ error: err.message }, 403)
    throw err
  }

  try {
    const kernel = createKernel(typedEnv)
    await kernel.access.resolveApproval({
      approvalId,
      decision: action === 'approve' ? 'approved' : 'rejected',
      resolvedBy: 'admin',
    })

    const ctx = (locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } }).runtime?.ctx
    const auditAction = action === 'approve' ? 'approval.approve' : 'approval.reject'
    auditLog({ db: typedEnv.DB, email: adminEmail, action: auditAction, kind: 'approval', id: approvalId, waitUntil: ctx?.waitUntil?.bind(ctx) }).catch(() => {})

    return json({ ok: true })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 409)
  }
}
