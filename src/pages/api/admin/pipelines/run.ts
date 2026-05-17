export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { runPipeline } from '../../../../lib/pipelines/runner'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

interface RunRequest {
  pipelineId: string
  input: Record<string, unknown>
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

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



