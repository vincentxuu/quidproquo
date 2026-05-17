export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createBackends } from '@/lib/agent-os/storage'
import { ensureAgentOsEnabled } from '../_guard'
import type { ApprovalStatus } from '@/lib/agent-os/storage/types'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const backends = createBackends(env as unknown as Env)
  const status = (url.searchParams.get('status') ?? 'pending') as ApprovalStatus
  return json({ approvals: await backends.approvals.listByStatus(status) })
}
