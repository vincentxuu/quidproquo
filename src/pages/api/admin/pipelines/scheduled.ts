export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { PipelineRunError, runPipeline } from '../../../../lib/pipelines/runner'
import { translatePipelineToFlowInput } from '../../../../lib/pipelines/redirector'
import type { Env } from '@/lib/config/env'
import { json, unauthorized, badRequest } from '@/lib/api/response'
import { getRequestSource } from '@/lib/auth/scheduled-auth'
import { readFlags } from '@/lib/config/flags'

interface ScheduledRequestBody {
  pipelineId?: string
  input?: Record<string, unknown>
  cron?: string
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const source = await getRequestSource(cookies, request, env as unknown as Env)
  if (!source) return unauthorized()

  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as ScheduledRequestBody
  if (!body.pipelineId) {
    return badRequest('pipelineId is required')
  }
  const input = normalizeInput(body.input)
  const pipelineId = body.pipelineId

  const flags = readFlags(env as unknown as Env)

  // Check if this pipeline should redirect to flow runtime
  if (flags.pipelinesUnify?.adminRedirect && flags.pipelinesUnify?.useFlow(pipelineId)) {
    const redirected = translatePipelineToFlowInput(pipelineId, { inputs: input })
    if (redirected) {
      // TODO: wire actual runFlow call when agent-flow runtime is fully connected
      // For now, return the redirect metadata so callers can see the routing decision
      return json({ ok: true, jobId: `flow-redirect-${Date.now()}`, flowRunId: null, redirected: true, flowId: redirected.flowId })
    }
  }

  try {
    const result = await runPipeline(db, {
      pipelineId,
      input,
      requestedBy: source === 'cron' ? `cron:${body.cron ?? 'scheduled'}` : 'admin',
    })
    return json({ ok: true, ...result })
  } catch (error) {
    const status = error instanceof PipelineRunError ? error.status : 500
    const message = error instanceof Error ? error.message : String(error)
    return json({ ok: false, error: message }, status)
  }
}

function normalizeInput(input: unknown): Record<string, unknown> {
  if (!input) return {}
  if (typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, unknown>
}

