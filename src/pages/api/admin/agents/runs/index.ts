export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { createBackends } from '@/lib/agent-os/storage'
import { ensureAgentOsEnabled } from '../_guard'
import type { AgentRunStatus } from '@/lib/agent-os/storage/types'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const backends = createBackends(env as unknown as Env)
  const result = await backends.runs.list({
    status: url.searchParams.get('status') as AgentRunStatus | undefined,
    agentId: url.searchParams.get('agentId') ?? undefined,
    limit: Number(url.searchParams.get('limit') ?? 50),
    cursor: url.searchParams.get('cursor') ?? undefined,
  })
  return json(result)
}
