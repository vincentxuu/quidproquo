export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'
import { runPipeline } from '../../../../lib/pipelines/runner'

interface Env {
  DB: D1Database
}

interface RunRequest {
  pipelineId: string
  input: Record<string, unknown>
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const body = await request.json() as RunRequest
  if (!body.pipelineId) {
    return json({ error: 'pipelineId is required' }, 400)
  }

  const db = (env as unknown as Env).DB

  try {
    const result = await runPipeline(db, {
      pipelineId: body.pipelineId,
      input: body.input || {},
      requestedBy: 'admin',
    })
    return json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const status = (err as { status?: number })?.status || 500
    return json({ error: message }, status)
  }
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
