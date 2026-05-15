export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

interface QueryParams {
  provider?: string
  model?: string
  status?: string
  q?: string
  limit: number
  offset: number
}

interface ReportRow {
  report_id: string
  brief: string
  provider: string
  model: string
  status: string
  summary: string | null
  max_queries: number | null
  max_tokens: number | null
  max_search_calls: number | null
  created_at: string
  updated_at: string
}

interface ReportDeleteBody {
  reportId?: unknown
  provider?: unknown
  model?: unknown
  status?: unknown
  olderThanDays?: unknown
}

const ALLOWED_STATUS = new Set(['pending', 'running', 'completed', 'failed', 'cancelled'])
const MAX_LIMIT = 100

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  try {
    await ensureDeepResearchTable(db)
    const query = normalizeQuery({
      provider: url.searchParams.get('provider'),
      model: url.searchParams.get('model'),
      status: url.searchParams.get('status'),
      q: url.searchParams.get('q'),
      limit: parseInt(url.searchParams.get('limit') || '20', 10),
      offset: parseInt(url.searchParams.get('offset') || '0', 10),
    })

    const where = buildWhereClause(query)
    const listQuery = `
      SELECT
        report_id,
        brief,
        provider,
        model,
        status,
        summary,
        max_queries,
        max_tokens,
        max_search_calls,
        created_at,
        updated_at
      FROM deep_research_reports
      ${where.clause}
      ORDER BY created_at DESC
      LIMIT ?
      OFFSET ?
    `
    const countQuery = `
      SELECT COUNT(*) AS c
      FROM deep_research_reports
      ${where.clause}
    `

    const [listResult, countResult] = await Promise.all([
      db.prepare(listQuery).bind(...where.bindings, query.limit, query.offset).all<ReportRow>(),
      db.prepare(countQuery).bind(...where.bindings).first<{ c: number }>(),
    ])

    return json({
      ok: true,
      limit: query.limit,
      offset: query.offset,
      total: toNumber(countResult?.c),
      reports: listResult.results ?? [],
    })
  } catch (error) {
    console.error('Deep research admin list failed:', error)
    return new Response(JSON.stringify({
      ok: false,
      error: 'Unable to load deep research reports',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export const DELETE: APIRoute = async ({ cookies, request }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as ReportDeleteBody

  const reportId = typeof body.reportId === 'string' && body.reportId.trim() ? body.reportId.trim() : ''
  const provider = normalizeText(body.provider)
  const model = normalizeText(body.model)
  const status = normalizeStatus(body.status)
  const olderThanDays = parseInteger(body.olderThanDays, 0)

  if (!reportId && !provider && !model && !status && olderThanDays <= 0) {
    return new Response(JSON.stringify({ error: 'reportId, provider/model/status, or olderThanDays required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    await ensureDeepResearchTable(db)
    const conditions: string[] = []
    const bindings: (string | number)[] = []

    if (reportId) {
      conditions.push('report_id = ?')
      bindings.push(reportId)
    }
    if (provider) {
      conditions.push('provider = ?')
      bindings.push(provider)
    }
    if (model) {
      conditions.push('model = ?')
      bindings.push(model)
    }
    if (status) {
      conditions.push('status = ?')
      bindings.push(status)
    }
    if (olderThanDays > 0) {
      const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString()
      conditions.push('created_at < ?')
      bindings.push(cutoff)
    }

    const clause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const countQuery = `SELECT COUNT(*) AS c FROM deep_research_reports ${clause}`
    const countResult = await db.prepare(countQuery).bind(...bindings).first<{ c: number | string }>()
    const total = toNumber(countResult?.c)
    if (!total) {
      return json({ ok: true, deleted: 0, dryRun: false, requested: buildDeleteRequestSummary({ reportId, provider, model, status, olderThanDays }) })
    }

    await db.prepare(`DELETE FROM deep_research_reports ${clause}`).bind(...bindings).run()
    return json({
      ok: true,
      deleted: total,
      dryRun: false,
      requested: buildDeleteRequestSummary({ reportId, provider, model, status, olderThanDays }),
    })
  } catch (error) {
    console.error('Deep research admin delete failed:', error)
    return new Response(JSON.stringify({ error: 'Unable to delete deep research reports' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

interface QueryBuilderResult {
  clause: string
  bindings: (string | number)[]
}

function buildWhereClause(query: QueryParams): QueryBuilderResult {
  const conditions: string[] = []
  const bindings: (string | number)[] = []

  if (query.provider) {
    conditions.push('provider = ?')
    bindings.push(query.provider)
  }
  if (query.model) {
    conditions.push('model = ?')
    bindings.push(query.model)
  }
  if (query.status) {
    conditions.push('status = ?')
    bindings.push(query.status)
  }
  if (query.q) {
    const keyword = `%${query.q}%`
    conditions.push('(brief LIKE ? OR report_id LIKE ? OR model LIKE ? OR summary LIKE ?)')
    bindings.push(keyword, keyword, keyword, keyword)
  }

  return {
    clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    bindings,
  }
}

function normalizeQuery(input: {
  provider: string | null
  model: string | null
  status: string | null
  q: string | null
  limit: number
  offset: number
}) {
  return {
    provider: normalizeText(input.provider),
    model: normalizeText(input.model),
    status: normalizeStatus(input.status),
    q: normalizeText(input.q),
    limit: clamp(input.limit, 1, MAX_LIMIT),
    offset: Math.max(0, input.offset || 0),
  }
}

function normalizeText(value: string | null | undefined) {
  if (!value) return ''
  return String(value).trim().slice(0, 128)
}

function normalizeStatus(status: string | null | undefined): string {
  const normalized = status?.trim().toLowerCase()
  if (normalized && ALLOWED_STATUS.has(normalized)) return normalized
  return ''
}

function parseInteger(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? parseInt(value, 10) : NaN
  if (!Number.isFinite(parsed)) return fallback
  return parsed
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.round(value)))
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

function buildDeleteRequestSummary(params: {
  reportId: string
  provider: string
  model: string
  status: string
  olderThanDays: number
}) {
  return {
    reportId: params.reportId,
    provider: params.provider || null,
    model: params.model || null,
    status: params.status || null,
    olderThanDays: params.olderThanDays > 0 ? params.olderThanDays : null,
  }
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
