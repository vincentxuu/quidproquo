import type { APIRoute } from 'astro'
import { buildLangfuseTraceUrl } from '../../../../lib/langfuse'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

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

    const rows = result.results || []
    const nativeTrace = rows.find((row) => row.stage === 'native_trace')
    const nativeTracePayload = safeParseJson(nativeTrace?.metadata_json ?? null)
    const steps = rows
      .filter((row) => row.stage !== 'native_trace')
      .map((row) => ({
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
    const traceScope = rows
      .filter((row) => row.stage !== 'native_trace')
      .map((row) => safeParseJson(row.metadata_json ?? null)?.trace_scope)
      .find((value) => typeof value === 'string' && value.length > 0) ??
      (typeof nativeTracePayload?.trace_scope === 'string' ? nativeTracePayload.trace_scope : undefined) ??
      'production'

    return new Response(JSON.stringify({
      traceId,
      langfuse_trace_id: traceId,
      langfuse_trace_url: buildLangfuseTraceUrl(traceId),
      trace_scope: traceScope,
      steps,
      native_trace: nativeTracePayload,
    }), {
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

function safeParseJson(value: string | null): Record<string, unknown> | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}


