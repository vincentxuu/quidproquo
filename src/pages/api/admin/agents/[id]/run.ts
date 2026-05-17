export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createKernel } from '@/lib/agent-os/kernel'
import { registerAgentDefinitions } from '@/lib/agent-os/registry'
import { ConcurrencyExceededError } from '@/lib/agent-os/scheduler'
import { ensureAgentOsEnabled } from '../_guard'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const agentId = params.id
  if (!agentId) return notFound('agent not found')
  const body = await request.json().catch(() => ({})) as { input?: unknown }
  try {
    const kernel = createKernel(env as unknown as Env)
    await registerAgentDefinitions(kernel)
    const result = await kernel.scheduler.dispatchRun({ agentId, trigger: 'manual', input: body.input ?? {}, userId: 'admin' })
    return json(result)
  } catch (error) {
    if (error instanceof ConcurrencyExceededError) return json({ error: 'concurrency_exceeded' }, 429)
    if (error instanceof Error && error.message.startsWith('Unknown agent')) return notFound('agent not found')
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
