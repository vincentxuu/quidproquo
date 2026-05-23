export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { listJobs } from '../../../lib/pipelines/job-store'
import { listPipelines } from '../../../lib/pipelines/registry'
import { listTools } from '../../../lib/pipelines/tool-registry'
import { PipelineRunError, runPipeline } from '../../../lib/pipelines/runner'
import { translatePipelineToFlowInput } from '../../../lib/pipelines/redirector'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { readFlags } from '@/lib/config/flags'

type ScheduledPipelineEntry = {
  pipelineId: string
  cron: string
  label?: string
  input?: Record<string, unknown>
  timezone?: string
}

const scheduledPipelineEntries: ScheduledPipelineEntry[] = [
  {
    pipelineId: 'series-suggestions',
    cron: '0 4 * * SUN',
    label: 'Series planning batch',
    timezone: 'UTC',
  },
  {
    pipelineId: 'knowledge-graph-prototype',
    cron: '0 5 * * SUN',
    label: 'Knowledge graph prototype snapshot',
    timezone: 'UTC',
  },
]

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const db = (env as unknown as Env).DB
  const jobs = await listJobs(db, 10).catch(() => [])
  return json({
    pipelines: listPipelines(),
    tools: listTools(),
    schedules: scheduledPipelineEntries,
    jobs,
  })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as { pipelineId?: string; input?: Record<string, unknown>; inputs?: Record<string, unknown>; options?: Record<string, unknown> }

  try {
    if (!body.pipelineId) throw new PipelineRunError('pipelineId is required', 400)

    const flags = readFlags(env as unknown as Env)
    const pipelineId = body.pipelineId

    // Check if this pipeline should redirect to flow runtime
    if (flags.pipelinesUnify?.adminRedirect && flags.pipelinesUnify?.useFlow(pipelineId)) {
      const redirected = translatePipelineToFlowInput(pipelineId, { inputs: body.inputs ?? body.input, options: body.options })
      if (redirected) {
        // TODO: wire actual runFlow call when agent-flow runtime is fully connected
        // For now, return the redirect metadata so callers can see the routing decision
        return json({ jobId: `flow-redirect-${Date.now()}`, flowRunId: null, redirected: true, flowId: redirected.flowId })
      }
    }

    const result = await runPipeline(db, {
      pipelineId,
      input: body.input ?? body.inputs ?? {},
      requestedBy: 'admin',
    })
    return json({ ok: true, ...result })
  } catch (error) {
    const status = error instanceof PipelineRunError ? error.status : 500
    const message = error instanceof Error ? error.message : String(error)
    return json({ ok: false, error: message }, status)
  }
}



