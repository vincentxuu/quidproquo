export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { PipelineRunError, runPipeline } from '../../../../lib/pipelines/runner'

interface Env {
  DB: D1Database
  CRAWL_SECRET?: string
}

interface ScheduledRequestBody {
  pipelineId?: string
  input?: Record<string, unknown>
  cron?: string
}

type PipelineRequestSource = 'admin' | 'cron'

export const POST: APIRoute = async ({ request, cookies }) => {
  const source = await getRequestSource(cookies, request)
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

async function getRequestSource(cookies: Parameters<APIRoute>[0]['cookies'], request: Request): Promise<PipelineRequestSource | undefined> {
  const token = cookies.get('session')?.value
  if (token && await verifySession(token)) {
    return 'admin'
  }

  const secret = (env as unknown as Env).CRAWL_SECRET
  if (!secret) return

  const provided = request.headers.get('X-Crawl-Secret')
  if (provided === secret) return 'cron'
}

function normalizeInput(input: unknown): Record<string, unknown> {
  if (!input) return {}
  if (typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, unknown>
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function badRequest(message: string): Response {
  return json({ ok: false, error: message }, 400)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
