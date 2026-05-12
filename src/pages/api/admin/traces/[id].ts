import type { APIRoute } from 'astro'
import { verifySession } from '../../../../lib/auth/session'

export const GET: APIRoute = async ({ cookies, params }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  interface Env {
    DB: D1Database
  }
  const env = (await import('cloudflare:workers')).env as unknown as Env
  const db = env.DB
  const traceId = params.id

  if (!traceId) {
    return new Response(JSON.stringify({ error: 'Trace ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const result = await db
      .prepare(
        `SELECT
          id,
          trace_id,
          stage,
          started_at,
          finished_at,
          duration_ms,
          input_summary,
          output_summary,
          error_summary,
          metadata_json
        FROM rag_trace_steps
        WHERE trace_id = ?
        ORDER BY started_at ASC`
      )
      .bind(traceId)
      .all<{
        id: number
        trace_id: string
        stage: string | null
        started_at: string | null
        finished_at: string | null
        duration_ms: number | null
        input_summary: string | null
        output_summary: string | null
        error_summary: string | null
        metadata_json: string | null
      }>()

    const steps = (result.results || []).map((row) => ({
      id: row.id,
      stage: row.stage || 'unknown',
      started_at: row.started_at,
      finished_at: row.finished_at,
      duration_ms: row.duration_ms || 0,
      input_summary: row.input_summary,
      output_summary: row.output_summary,
      error_summary: row.error_summary,
      metadata_json: row.metadata_json,
    }))

    return new Response(JSON.stringify({ traceId, steps }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to fetch trace details:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch trace details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}
