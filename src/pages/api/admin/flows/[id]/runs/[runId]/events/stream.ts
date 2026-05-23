export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

interface StepRunRow {
  step_run_id: string
  step_id: string
  kind: string
  status: string
  started_at: number | null
  finished_at: number | null
  latency_ms: number | null
}

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const flowId = params.id
  const runId = params.runId
  if (!flowId || !runId) return json({ error: 'params_required' }, 400)

  const db = (env as unknown as Env).DB

  let steps: StepRunRow[] = []
  try {
    const result = await db
      .prepare(
        `SELECT step_run_id, step_id, kind, status, started_at, finished_at, latency_ms
         FROM flow_step_runs
         WHERE flow_run_id = ?
         ORDER BY started_at ASC`,
      )
      .bind(runId)
      .all<StepRunRow>()
    steps = result.results ?? []
  } catch {
    steps = []
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      for (const step of steps) {
        const event = `data: ${JSON.stringify({ kind: 'step_update', step })}\n\n`
        controller.enqueue(encoder.encode(event))
      }
      controller.enqueue(encoder.encode('data: {"kind":"stream_end"}\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  })
}
