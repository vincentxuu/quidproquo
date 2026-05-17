export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { badRequest, json, unauthorized } from '@/lib/api/response'
import { getRequestSource } from '@/lib/auth/scheduled-auth'
import { createKernel } from '@/lib/agent-os/kernel'
import { registerAgentDefinitions } from '@/lib/agent-os/registry'
import { ConcurrencyExceededError } from '@/lib/agent-os/scheduler'
import { scheduledAgentEntries, type ScheduledAgentEntry } from '@/lib/agent-os/scheduler/cron-registry'
import { ensureAgentOsEnabled } from './_guard'

interface ScheduledAgentRequestBody {
  agentId?: string
  cronExpression?: string
  input?: Record<string, unknown>
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const source = await getRequestSource(cookies, request, env as unknown as Env)
  if (!source) return unauthorized()
  const disabled = ensureAgentOsEnabled()
  if (disabled) return disabled

  const body = await request.json().catch(() => ({})) as ScheduledAgentRequestBody
  const entries = resolveEntries(body)
  if (entries.length === 0) return badRequest('agentId or cronExpression is required')

  const kernel = createKernel(env as unknown as Env)
  await registerAgentDefinitions(kernel)
  const sessionId = `cron-${new Date().toISOString()}`
  const results = []

  for (const entry of entries) {
    try {
      const input = normalizeInput(body.input ?? entry.input)
      const { runId } = await kernel.scheduler.dispatchRun({
        agentId: entry.agentId,
        trigger: 'cron',
        input,
        userId: 'system',
        sessionId,
      })
      const run = await kernel.storage.runs.get(runId)
      results.push({ agentId: entry.agentId, runId, status: run?.status ?? 'running' })
    } catch (error) {
      if (error instanceof ConcurrencyExceededError) {
        results.push({ agentId: entry.agentId, status: 'rejected', error: 'concurrency_exceeded' })
      } else {
        results.push({ agentId: entry.agentId, status: 'failed', error: error instanceof Error ? error.message : String(error) })
      }
    }
  }

  return json({ ok: true, source, runs: results })
}

function resolveEntries(body: ScheduledAgentRequestBody): ScheduledAgentEntry[] {
  if (body.agentId) {
    const configured = scheduledAgentEntries.find(entry => entry.agentId === body.agentId)
    return [configured ?? {
      agentId: body.agentId,
      cron: body.cronExpression ?? 'manual-scheduled',
      input: body.input,
    }]
  }
  if (body.cronExpression) {
    return scheduledAgentEntries.filter(entry => entry.cron === body.cronExpression)
  }
  return []
}

function normalizeInput(input: unknown): Record<string, unknown> {
  if (!input) return {}
  if (typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, unknown>
}
