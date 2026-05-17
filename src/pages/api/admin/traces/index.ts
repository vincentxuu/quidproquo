import type { APIRoute } from 'astro'
import { buildLangfuseTraceUrl } from '../../../../lib/langfuse'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const env = (await import('cloudflare:workers')).env as unknown as Env
  const db = env.DB

  const traceId = url.searchParams.get('trace_id')
  const date = url.searchParams.get('date')
  const stage = url.searchParams.get('stage')
  const status = url.searchParams.get('status')

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
      langfuse_trace_id: row.trace_id,
      langfuse_trace_url: buildLangfuseTraceUrl(row.trace_id),
      has_langfuse_trace: Boolean(buildLangfuseTraceUrl(row.trace_id)),
      // metadata hydrated below
    }))

    const filteredByStatus = status
      ? traces.filter((row) => row.status === status)
      : traces

    const traceIds = filteredByStatus.map((row) => row.trace_id)
    if (traceIds.length === 0) {
      return new Response(JSON.stringify({ traces: [] }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const placeholders = traceIds.map(() => '?').join(',')
    const stepMetadataResult = await db.prepare(
      `
        SELECT trace_id, metadata_json
        FROM rag_trace_steps
        WHERE trace_id IN (${placeholders}) AND stage != 'native_trace'
        ORDER BY started_at DESC
      `
    ).bind(...traceIds).all<{ trace_id: string; metadata_json: string | null }>()

    const nativeTraceRows = await db.prepare(
      `
        SELECT trace_id, metadata_json
        FROM rag_trace_steps
        WHERE trace_id IN (${placeholders}) AND stage = 'native_trace'
        ORDER BY started_at DESC
      `
    ).bind(...traceIds).all<{ trace_id: string; metadata_json: string | null }>()

    const latestMetadataByTrace = new Map<string, string | null>()
    for (const step of stepMetadataResult.results ?? []) {
      if (!latestMetadataByTrace.has(step.trace_id)) {
        latestMetadataByTrace.set(step.trace_id, step.metadata_json)
      }
    }

    const nativeTraceByTrace = new Map<string, string | null>()
    for (const step of nativeTraceRows.results ?? []) {
      if (!nativeTraceByTrace.has(step.trace_id)) {
        nativeTraceByTrace.set(step.trace_id, step.metadata_json)
      }
    }

    const hydratedTraces = filteredByStatus.map((row) => {
      const metadata = safeParseJson(latestMetadataByTrace.get(row.trace_id) ?? null)
      const nativeTrace = safeParseJson(nativeTraceByTrace.get(row.trace_id) ?? null)
      return {
        ...row,
        pipeline_engine: metadata?.pipeline_engine ?? metadata?.pipelineEngine,
        trace_scope: metadata?.trace_scope || 'production',
        native_trace: metadata?.native_trace ?? nativeTrace,
        native_trace_summary: metadata?.native_trace_summary ?? null,
      }
    })

    return new Response(JSON.stringify({ traces: hydratedTraces }), {
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



function safeParseJson(value: string | null): Record<string, unknown> | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}
