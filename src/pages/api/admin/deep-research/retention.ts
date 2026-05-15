export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

interface RequestBody {
  provider?: unknown
  model?: unknown
  status?: unknown
  olderThanDays?: unknown
  dryRun?: unknown
}

interface RetentionResponse {
  ok: boolean
  dryRun: boolean
  matched: number
  deleted: number
  requested: {
    provider: string | null
    model: string | null
    status: string | null
    olderThanDays: number
  }
}

const ALLOWED_STATUS = new Set(['pending', 'running', 'completed', 'failed', 'cancelled'])
const MAX_DAYS = 3650

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  await ensureDeepResearchTable(db)

  const body = await request.json().catch(() => ({})) as RequestBody
  const provider = normalizeText(body.provider)
  const model = normalizeText(body.model)
  const status = normalizeStatus(body.status)
  const olderThanDays = normalizePositiveInt(body.olderThanDays, 30, 1, MAX_DAYS)
  const dryRun = body.dryRun === true

  if (olderThanDays <= 0) {
    return json({ error: 'olderThanDays is required and should be > 0' }, 400)
  }

  const conditions = buildWhereClause({ provider, model, status, olderThanDays })
  if (!conditions.bindings.length) {
    return json({ error: 'provider/model/status or olderThanDays required' }, 400)
  }

  let matched = 0
  let deleted = 0

  try {
    const countResult = await db.prepare(`SELECT COUNT(*) AS c FROM deep_research_reports ${conditions.clause}`)
      .bind(...conditions.bindings)
      .first<{ c: number | string }>()

    matched = toNumber(countResult?.c)

    if (!dryRun) {
      if (matched > 0) {
        const deletedResult = await db.prepare(`DELETE FROM deep_research_reports ${conditions.clause}`)
          .bind(...conditions.bindings)
          .run()
        deleted = toNumber((deletedResult as { meta?: { changes?: number } }).meta?.changes)
      }
    }
  } catch (error) {
    console.error('Deep research retention failed:', error)
    return json({ error: 'Unable to run deep research retention' }, 500)
  }

  const response: RetentionResponse = {
    ok: true,
    dryRun,
    matched,
    deleted: dryRun ? 0 : deleted,
    requested: {
      provider: provider || null,
      model: model || null,
      status: status || null,
      olderThanDays,
    },
  }

  return json(response)
}

function buildWhereClause(params: {
  provider: string
  model: string
  status: string
  olderThanDays: number
}) {
  const conditions: string[] = []
  const bindings: (string | number)[] = []

  if (params.provider) {
    conditions.push('provider = ?')
    bindings.push(params.provider)
  }
  if (params.model) {
    conditions.push('model = ?')
    bindings.push(params.model)
  }
  if (params.status) {
    conditions.push('status = ?')
    bindings.push(params.status)
  }

  const cutoff = new Date(Date.now() - params.olderThanDays * 24 * 60 * 60 * 1000).toISOString()
  conditions.push('created_at < ?')
  bindings.push(cutoff)

  return {
    clause: `WHERE ${conditions.join(' AND ')}`,
    bindings,
  }
}

function normalizeText(raw: unknown) {
  if (typeof raw !== 'string') return ''
  return raw.trim().slice(0, 128)
}

function normalizeStatus(raw: unknown) {
  const normalized = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return normalized && ALLOWED_STATUS.has(normalized) ? normalized : ''
}

function normalizePositiveInt(raw: unknown, fallback: number, min: number, max: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return clamp(Math.round(raw), min, max)
  }
  const parsed = Number.parseInt(String(raw), 10)
  if (!Number.isFinite(parsed)) return fallback
  return clamp(parsed, min, max)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function toNumber(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number.parseInt(raw, 10)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

async function ensureDeepResearchTable(db: D1Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS deep_research_reports (
      report_id TEXT PRIMARY KEY,
      brief TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'completed',
      final_report TEXT NOT NULL,
      summary TEXT,
      max_queries INTEGER,
      max_tokens INTEGER,
      max_search_calls INTEGER,
      enable_flags TEXT,
      token_profile TEXT,
      search_profile TEXT,
      source_profile TEXT,
      result_profile TEXT,
      search_tool_profile TEXT,
      search_tool_profiles TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `).run()
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
