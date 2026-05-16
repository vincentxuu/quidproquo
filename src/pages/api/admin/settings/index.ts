export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
  SESSION: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
}

interface SettingRow {
  key: string
  value: string
  updated_at: string | null
}

interface SettingsUpdateBody {
  rate_limit?: {
    per_minute?: unknown
    per_hour?: unknown
  }
  rag?: {
    cache_ttl_seconds?: unknown
    max_context_chunks?: unknown
  }
  pipeline?: {
    max_retries?: unknown
    max_runtime_ms?: unknown
  }
  deep_research?: {
    storage_mode?: unknown
  }
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const e = env as unknown as Env

  // Get all settings from DB
  let settings: Record<string, string> = {}
  try {
    const result = await e.DB.prepare('SELECT key, value FROM admin_settings').all<SettingRow>()
    for (const row of result.results || []) {
      settings[row.key] = row.value
    }
  } catch {
    // Table may not exist yet
  }

  // Check secrets status (read-only, presence check only)
  const secrets = {
    ADMIN_PASSWORD: { configured: true, note: 'Required for admin access' },
    CRAWL_SECRET: { configured: Boolean((env as unknown as { CRAWL_SECRET?: string }).CRAWL_SECRET), note: 'Required for crawl sync' },
    WORKERS_AI: { configured: Boolean((env as unknown as { AI?: unknown }).AI), note: 'Required for embeddings and RAG' },
  }

  // Default values
  const defaults = {
    rate_limit_per_minute: '60',
    rate_limit_per_hour: '1000',
    rag_cache_ttl_seconds: '3600',
    rag_max_context_chunks: '10',
    pipeline_max_retries: '2',
    pipeline_max_runtime_ms: '600000',
    deep_research_storage_mode: 'auto',
  }

  // Merge with defaults
  const config = {
    rate_limit: {
      per_minute: parseInt(settings.rate_limit_per_minute || defaults.rate_limit_per_minute),
      per_hour: parseInt(settings.rate_limit_per_hour || defaults.rate_limit_per_hour),
    },
    rag: {
      cache_ttl_seconds: parseInt(settings.rag_cache_ttl_seconds || defaults.rag_cache_ttl_seconds),
      max_context_chunks: parseInt(settings.rag_max_context_chunks || defaults.rag_max_context_chunks),
    },
    pipeline: {
      max_retries: parseInt(settings.pipeline_max_retries || defaults.pipeline_max_retries),
      max_runtime_ms: parseInt(settings.pipeline_max_runtime_ms || defaults.pipeline_max_runtime_ms),
    },
    deep_research: {
      storage_mode: normalizeStorageMode(settings.deep_research_storage_mode || defaults.deep_research_storage_mode),
      bindings: {
        d1: Boolean(e.DB),
        deep_research_kv: Boolean((env as unknown as Env).DEEP_RESEARCH_KV),
        session: Boolean(e.SESSION),
      },
    },
  }

  secrets.DEEP_RESEARCH_KV = {
    configured: Boolean((env as unknown as Env).DEEP_RESEARCH_KV),
    note: 'Optional dedicated KV binding for Deep Research reports',
  }
  secrets.DB = {
    configured: Boolean(e.DB),
    note: 'D1 fallback and report metadata storage',
  }

  return json({ secrets, config, defaults })
}

export const PUT: APIRoute = async ({ cookies, request }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const e = env as unknown as Env
  const body = await request.json().catch(() => ({})) as SettingsUpdateBody

  // Validate input
  const updates: Record<string, string> = {}

  if (typeof body.rate_limit?.per_minute === 'number' && body.rate_limit.per_minute > 0) {
    updates.rate_limit_per_minute = String(body.rate_limit.per_minute)
  }
  if (typeof body.rate_limit?.per_hour === 'number' && body.rate_limit.per_hour > 0) {
    updates.rate_limit_per_hour = String(body.rate_limit.per_hour)
  }
  if (typeof body.rag?.cache_ttl_seconds === 'number' && body.rag.cache_ttl_seconds > 0) {
    updates.rag_cache_ttl_seconds = String(body.rag.cache_ttl_seconds)
  }
  if (typeof body.rag?.max_context_chunks === 'number' && body.rag.max_context_chunks > 0) {
    updates.rag_max_context_chunks = String(body.rag.max_context_chunks)
  }
  if (typeof body.pipeline?.max_retries === 'number' && body.pipeline.max_retries >= 0) {
    updates.pipeline_max_retries = String(body.pipeline.max_retries)
  }
  if (typeof body.pipeline?.max_runtime_ms === 'number' && body.pipeline.max_runtime_ms > 0) {
    updates.pipeline_max_runtime_ms = String(body.pipeline.max_runtime_ms)
  }
  if (typeof body.deep_research?.storage_mode === 'string') {
    updates.deep_research_storage_mode = normalizeStorageMode(body.deep_research.storage_mode)
  }

  if (Object.keys(updates).length === 0) {
    return new Response(JSON.stringify({ error: 'No valid settings provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Ensure table exists
    await e.DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `).run()

    // Upsert each setting
    for (const [key, value] of Object.entries(updates)) {
      await e.DB.prepare(`
        INSERT INTO admin_settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(key, value).run()
    }

    return json({ success: true, updated: Object.keys(updates) })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return new Response(JSON.stringify({ error: 'Failed to save settings' }), {
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

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}

function normalizeStorageMode(raw: string): string {
  return ['auto', 'd1', 'deep_research_kv', 'session'].includes(raw) ? raw : 'auto'
}
