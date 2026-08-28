export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentOsEnabled } from './_guard'
import type { Env } from '@/lib/config/env'
import { createKernel } from '@/lib/agent/kernel'
import { registerAgentDefinitions } from '@/lib/agent/registry'
import { scheduledAgentEntries } from '@/lib/agent/scheduler/cron-registry'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const kernel = createKernel(env as unknown as Env)
  await registerAgentDefinitions(kernel)
  return json({ agents: kernel.listAgents(), schedules: scheduledAgentEntries })
}
