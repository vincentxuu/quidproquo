export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../lib/auth/session'

interface Env {
  DB: D1Database
}

const MANAGED_KEYS = [
  'rag_pipeline_engine',
  'rag_default_provider',
  'rag_default_model',
  'rag_stage_overrides',
  'rag_fallback_provider',
  'rag_fallback_model',
  'rag_flag_hyde',
  'rag_flag_multi_query',
  'rag_flag_reranker',
  'rag_flag_critic',
  'rag_flag_pageindex',
  'rag_pageindex_max_steps',
  'rag_flag_bm25_short_circuit',
  'rag_shadow_mode',
  'semantic_cache_threshold',
  'rag_reranker_min_keep',
  'rag_mmr_lambda',
  'rag_checkpoint_threshold_ratio',
  'rag_search_tools_enabled',
  'rag_search_tool_providers',
  'rag_search_tool_max_results',
  'rag_search_tool_timeout_ms',
  'rag_trace_retention_prod_days',
  'rag_trace_retention_admin_days',
  'rag_trace_retention_prod_native_days',
  'rag_trace_retention_admin_native_days',
  'rag_trace_retention_native_sample_bps',
  'rag_trace_retention_error_grace_days',
  'rag_trace_retention_enabled',
]

const DEFAULT_SETTINGS: Record<string, string> = {
  rag_pipeline_engine: 'langgraph',
  rag_default_provider: 'groq',
  rag_default_model: 'llama-3.3-70b-versatile',
  rag_stage_overrides: '{}',
  rag_fallback_provider: '',
  rag_fallback_model: '',
  rag_flag_hyde: '0',
  rag_flag_multi_query: '0',
  rag_flag_reranker: '0',
  rag_flag_critic: '1',
  rag_flag_pageindex: '0',
  rag_pageindex_max_steps: '5',
  rag_flag_bm25_short_circuit: '1',
  rag_shadow_mode: '0',
  semantic_cache_threshold: '0.95',
  rag_reranker_min_keep: '3',
  rag_mmr_lambda: '0.7',
  rag_checkpoint_threshold_ratio: '0.7',
  rag_trace_retention_prod_days: '14',
  rag_trace_retention_admin_days: '30',
  rag_trace_retention_prod_native_days: '7',
  rag_trace_retention_admin_native_days: '30',
  rag_trace_retention_native_sample_bps: '100',
  rag_trace_retention_error_grace_days: '3',
  rag_trace_retention_enabled: '1',
  rag_search_tools_enabled: '0',
  rag_search_tool_providers: '["jina"]',
  rag_search_tool_max_results: '4',
  rag_search_tool_timeout_ms: '8000',
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const db = (env as unknown as Env).DB
  const settings = await db.prepare(
    `SELECT key, value, updated_at FROM settings WHERE key IN (${MANAGED_KEYS.map(() => '?').join(', ')}) ORDER BY key`
  ).bind(...MANAGED_KEYS).all<{ key: string; value: string; updated_at: string }>().catch(() => ({ results: [] }))
  const rowsByKey = new Map((settings.results ?? []).map(row => [row.key, row]))
  const mergedSettings = MANAGED_KEYS.map(key => {
    const row = rowsByKey.get(key)
    return {
      key,
      value: row?.value ?? DEFAULT_SETTINGS[key] ?? '',
      updated_at: row?.updated_at ?? null,
    }
  })
  const traces = await db.prepare(
    `SELECT trace_id, thread_id, stage, started_at, duration_ms, output_summary, metadata_json
     FROM rag_trace_steps
     ORDER BY started_at DESC
     LIMIT 300`
  ).all<{
    trace_id: string
    thread_id: string
    stage: string
    started_at: string
    duration_ms: number
    output_summary: string | null
    metadata_json: string | null
  }>().catch(() => ({ results: [] }))
  const dedupedRows = new Map<string, {
    trace_id: string
    thread_id: string
    stage: string
    started_at: string
    duration_ms: number
    output_summary: string | null
    pipeline_engine: unknown
    trace_scope: string | undefined
    metadata_json: string | null
    native_trace: unknown
    native_trace_summary: unknown
  }>()

  for (const row of traces.results ?? []) {
    const metadata = safeParseJson(row.metadata_json)
    const isNativeTraceStep = row.stage === 'native_trace'
    if (isNativeTraceStep) {
        if (!dedupedRows.has(row.trace_id)) {
          dedupedRows.set(row.trace_id, {
            trace_id: row.trace_id,
            thread_id: row.thread_id,
            stage: row.stage,
            started_at: row.started_at,
            duration_ms: row.duration_ms,
            output_summary: row.output_summary,
            pipeline_engine: metadata?.pipeline_engine ?? metadata?.pipelineEngine,
            trace_scope: metadata?.trace_scope as string | undefined,
            metadata_json: row.metadata_json,
            native_trace: metadata?.native_trace ?? metadata,
            native_trace_summary: null,
          })
        }
      continue
    }

    const existing = dedupedRows.get(row.trace_id)
    if (!existing || existing.stage === 'native_trace') {
      dedupedRows.set(row.trace_id, {
        trace_id: row.trace_id,
        thread_id: row.thread_id,
        stage: row.stage,
        started_at: row.started_at,
        duration_ms: row.duration_ms,
        output_summary: row.output_summary,
        pipeline_engine: metadata?.pipeline_engine ?? metadata?.pipelineEngine,
        trace_scope: metadata?.trace_scope as string | undefined,
        metadata_json: row.metadata_json,
        native_trace: metadata?.native_trace ?? metadata,
        native_trace_summary: metadata?.native_trace_summary,
      })
    }
  }

  const traceRows = Array.from(dedupedRows.values()).map((row) => {
    return {
      trace_id: row.trace_id,
      thread_id: row.thread_id,
      stage: row.stage,
      started_at: row.started_at,
      duration_ms: row.duration_ms,
      output_summary: row.output_summary,
      pipeline_engine: row.pipeline_engine,
      trace_scope: row.trace_scope ?? 'production',
      metadata_json: row.metadata_json,
      native_trace: row.native_trace,
      native_trace_summary: row.native_trace_summary,
    }
  })
    .sort((a, b) => (a.started_at < b.started_at ? 1 : a.started_at > b.started_at ? -1 : 0))

  const shadow = await db.prepare(
    `SELECT trace_id, query, primary_confidence, shadow_confidence, created_at
     FROM shadow_runs
     ORDER BY created_at DESC
     LIMIT 20`
  ).all().catch(() => ({ results: [] }))

  return json({ settings: mergedSettings, traces: traceRows, shadow_runs: shadow.results })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const body = await request.json() as { settings?: Record<string, string> }
  const updates = body.settings ?? {}
  const db = (env as unknown as Env).DB

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run()

  for (const [key, value] of Object.entries(updates)) {
    if (!MANAGED_KEYS.includes(key)) continue
    const before = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>()
    await db.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    ).bind(key, String(value)).run()
    await db.prepare(
      `INSERT INTO rag_admin_audit (id, actor, action, target, before_json, after_json)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      'owner',
      'update_setting',
      key,
      JSON.stringify({ value: before?.value ?? null }),
      JSON.stringify({ value })
    ).run().catch(() => undefined)
  }

  return json({ ok: true })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
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
