export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { PipelineRunError, runPipeline } from '../../../../lib/pipelines/runner'
import type { Env } from '@/lib/config/env'
import { json, unauthorized, badRequest } from '@/lib/api/response'
import { getRequestSource } from '@/lib/auth/scheduled-auth'

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

  try {
    const result = await runPipeline(db, {
      pipelineId: body.pipelineId,
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

