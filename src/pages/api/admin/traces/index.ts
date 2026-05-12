import type { APIRoute } from 'astro'
import { verifySession } from '../../../../lib/auth/session'

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  interface Env {
    DB: D1Database
  }
  const env = (await import('cloudflare:workers')).env as unknown as Env
  const db = env.DB

  const traceId = url.searchParams.get('trace_id')
  const date = url.searchParams.get('date')
  const stage = url.searchParams.get('stage')

  try {
    let sql = `
      SELECT
        trace_id,
        GROUP_CONCAT(DISTINCT stage) as stages,
        MIN(started_at) as started_at,
        SUM(duration_ms) as duration_ms,
        MAX(CASE WHEN error_summary IS NOT NULL AND error_summary != '' THEN 1 ELSE 0 END) as has_error,
        MAX(output_summary) as output_summary,
        MAX(error_summary) as error_summary
      FROM rag_trace_steps
      WHERE 1=1
    `
    const params: (string | number)[] = []

    if (traceId) {
      sql += ' AND trace_id = ?'
      params.push(traceId)
    }

    if (date) {
      sql += ' AND DATE(started_at) = ?'
      params.push(date)
    }

    if (stage) {
      sql += ' AND stage = ?'
      params.push(stage)
    }

    sql += ' GROUP BY trace_id ORDER BY MIN(started_at) DESC LIMIT 50'

    const result = await db.prepare(sql).bind(...params).all<{
      trace_id: string
      stages: string | null
      started_at: string
      duration_ms: number | null
      has_error: number
      output_summary: string | null
      error_summary: string | null
    }>()

    const traces = (result.results || []).map((row) => ({
      trace_id: row.trace_id,
      stage: row.stages?.split(',')[0] || 'unknown',
      started_at: row.started_at,
      duration_ms: row.duration_ms || 0,
      status: row.has_error ? 'error' : 'success',
      output_summary: row.output_summary,
      error_summary: row.error_summary,
    }))

    return new Response(JSON.stringify({ traces }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to fetch traces:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch traces' }), {
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
