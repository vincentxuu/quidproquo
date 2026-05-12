export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../lib/auth/session'
import { listJobs } from '../../../lib/pipelines/job-store'
import { listPipelines } from '../../../lib/pipelines/registry'
import { listTools } from '../../../lib/pipelines/tool-registry'
import { PipelineRunError, runPipeline } from '../../../lib/pipelines/runner'

interface Env {
  DB: D1Database
  CRAWL_SECRET?: string
}

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
  if (!await isAdmin(cookies)) return unauthorized()
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
  if (!await isAdmin(cookies)) return unauthorized()
  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as { pipelineId?: string; input?: Record<string, unknown> }

  try {
    if (!body.pipelineId) throw new PipelineRunError('pipelineId is required', 400)
    const result = await runPipeline(db, {
      pipelineId: body.pipelineId,
      input: body.input ?? {},
      requestedBy: 'admin',
    })
    return json({ ok: true, ...result })
  } catch (error) {
    const status = error instanceof PipelineRunError ? error.status : 500
    const message = error instanceof Error ? error.message : String(error)
    return json({ ok: false, error: message }, status)
  }
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
