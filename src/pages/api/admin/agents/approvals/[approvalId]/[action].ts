export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createKernel } from '@/lib/agent-os/kernel'
import { ensureAgentOsEnabled } from '../../_guard'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const approvalId = params.approvalId
  const action = params.action
  if (!approvalId) return notFound('approval not found')
  if (action !== 'approve' && action !== 'reject') return notFound('approval action not found')
  try {
    const kernel = createKernel(env as unknown as Env)
    await kernel.access.resolveApproval({
      approvalId,
      decision: action === 'approve' ? 'approved' : 'rejected',
      resolvedBy: 'admin',
    })
    return json({ ok: true })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 409)
  }
}
