export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { ensureAgentOsEnabled } from '../_guard'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled
  const agentId = params.id
  if (!agentId) return notFound('agent not found')

  const queue = (env as unknown as Env).AGENT_QUEUE
  if (!queue) return json({ error: 'agent_queue_missing' }, 503)

  const body = await request.json().catch(() => ({})) as { input?: Record<string, unknown>; parentRunId?: string }
  await queue.send({
    agentId,
    input: normalizeInput(body.input),
    parentRunId: body.parentRunId,
  })
  return json({ ok: true, enqueued: true, agentId })
}

function normalizeInput(input: unknown): Record<string, unknown> {
  if (!input) return {}
  if (typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, unknown>
}
