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
  'rag_shadow_mode',
  'semantic_cache_threshold',
  'rag_reranker_min_keep',
  'rag_mmr_lambda',
  'rag_checkpoint_threshold_ratio',
]

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const db = (env as unknown as Env).DB
  const settings = await db.prepare(
    `SELECT key, value, updated_at FROM settings WHERE key IN (${MANAGED_KEYS.map(() => '?').join(', ')}) ORDER BY key`
  ).bind(...MANAGED_KEYS).all<{ key: string; value: string; updated_at: string }>()
  const traces = await db.prepare(
    `SELECT trace_id, thread_id, stage, started_at, duration_ms, output_summary, metadata_json
     FROM rag_trace_steps
     ORDER BY started_at DESC
     LIMIT 80`
  ).all()
  const shadow = await db.prepare(
    `SELECT trace_id, query, primary_confidence, shadow_confidence, created_at
     FROM shadow_runs
     ORDER BY created_at DESC
     LIMIT 20`
  ).all()

  return json({ settings: settings.results, traces: traces.results, shadow_runs: shadow.results })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()
  const body = await request.json() as { settings?: Record<string, string> }
  const updates = body.settings ?? {}
  const db = (env as unknown as Env).DB

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
    ).run()
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
