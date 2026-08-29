export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { json, unauthorized } from '@/lib/api/response'
import { nowIso as currentIso, toIsoDate } from '@/lib/utils/dates'
import { requireScheduledAuth } from '@/lib/auth/scheduled-auth'
import { RETENTION_KEYS } from '@/lib/config/settings-keys'

interface RetentionSettings {
  enabled: boolean
  prodDays: number
  adminDays: number
  prodNativeDays: number
  adminNativeDays: number
  sampleBps: number
  errorGraceDays: number
}

type RetentionScope = 'production' | 'admin' | 'all'
type TraceScope = 'production' | 'admin' | 'eval'

interface TraceRow {
  trace_id: string
  started_at: string
  trace_scope: TraceScope | null
  has_native_trace: number | string
}

const DAY_MS = 24 * 60 * 60 * 1000
const BPS_MAX = 10_000
const DEFAULT_RETENTION_SETTINGS: RetentionSettings = {
  enabled: true,
  prodDays: 14,
  adminDays: 30,
  prodNativeDays: 7,
  adminNativeDays: 30,
  sampleBps: 100,
  errorGraceDays: 3,
}

interface RequestBody {
  scope?: RetentionScope
  dryRun?: boolean
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    await requireScheduledAuth(cookies, request, env as unknown as Env)
  } catch {
    return unauthorized()
  }
  const db = (env as unknown as Env).DB
  const body = await request.json().catch(() => ({})) as RequestBody
  const scope = normalizeScope(body.scope)
  const dryRun = body.dryRun === true
  const settings = await loadSettings(db)

  if (!settings.enabled) {
    return json({
      ok: true,
      dryRun,
      scope,
      settings,
      message: 'Retention is disabled',
      delete: {
        nonNativeSteps: 0,
        nativeTraceRows: 0,
      },
    })
  }

  const now = Date.now()
  const nowIso = toIsoDate(now)
  const maxWindowMs = Math.max(
    settings.prodDays,
    settings.adminDays,
    settings.prodNativeDays,
    settings.adminNativeDays,
    settings.errorGraceDays
  ) * DAY_MS
  const cursorIso = toIsoDate(now - maxWindowMs)

  const result = await db.prepare(`
    SELECT
      trace_id,
      MIN(started_at) as started_at,
      COALESCE(MAX(json_extract(metadata_json, '$.trace_scope')), 'production') as trace_scope,
      MAX(CASE WHEN stage = 'native_trace' THEN 1 ELSE 0 END) as has_native_trace
    FROM rag_trace_steps
    WHERE started_at < ?
    GROUP BY trace_id
  `).bind(cursorIso).all<TraceRow>()

  const rows = result.results ?? []
  const deletionPlan = buildDeletionPlan(rows, {
    now,
    scope,
    settings,
  })

  const nonNativeStepCount = deletionPlan.nonNativeTraceIds.length
    ? await countTraceStepRows(db, deletionPlan.nonNativeTraceIds, false)
    : 0
  const nativeStepCount = deletionPlan.nativeTraceIds.length
    ? await countTraceStepRows(db, deletionPlan.nativeTraceIds, true)
    : 0

  const response = {
    ok: true,
    dryRun,
    scope,
    at: nowIso,
    settings,
    planned: {
      candidateTraceCount: rows.length,
      deleteNativeTraceCount: deletionPlan.nativeTraceIds.length,
      deleteNonNativeTraceCount: deletionPlan.nonNativeTraceIds.length,
      scoped: deletionPlan.scopeTotals,
    },
    delete: {
      nonNativeSteps: nonNativeStepCount,
      nativeTraceRows: nativeStepCount,
    },
  }

  if (dryRun) return json(response)

  const deletedNonNative = deletionPlan.nonNativeTraceIds.length
    ? await deleteTraceRows(db, deletionPlan.nonNativeTraceIds, false)
    : 0
  const deletedNative = deletionPlan.nativeTraceIds.length
    ? await deleteTraceRows(db, deletionPlan.nativeTraceIds, true)
    : 0

  return json({
    ...response,
    delete: {
      ...response.delete,
      nonNativeSteps: deletedNonNative,
      nativeTraceRows: deletedNative,
    },
    completedAt: currentIso(),
  })
}

function buildDeletionPlan(
  rows: TraceRow[],
  options: {
    now: number
    scope: RetentionScope
    settings: RetentionSettings
  }
): {
  nonNativeTraceIds: string[]
  nativeTraceIds: string[]
  scopeTotals: {
    nonNativeProduction: number
    nonNativeAdmin: number
    nativeProduction: number
    nativeAdmin: number
  }
} {
  const includeProduction = options.scope === 'production' || options.scope === 'all'
  const includeAdmin = options.scope === 'admin' || options.scope === 'all'
  const now = options.now

  const nonNativeSet = new Set<string>()
  const nativeSet = new Set<string>()
  const scopeTotals = {
    nonNativeProduction: 0,
    nonNativeAdmin: 0,
    nativeProduction: 0,
    nativeAdmin: 0,
  }

  const prodNonNativeCutoff = now - options.settings.prodDays * DAY_MS
  const adminNonNativeCutoff = now - options.settings.adminDays * DAY_MS
  const prodNativeCutoff = now - options.settings.prodNativeDays * DAY_MS
  const adminNativeCutoff = now - options.settings.adminNativeDays * DAY_MS
  const graceCutoff = now - options.settings.errorGraceDays * DAY_MS

  for (const row of rows) {
    const traceScope = normalizeTraceScope(row.trace_scope)
    const isAdminScope = traceScope === 'admin' || traceScope === 'eval'
    const startedAt = Date.parse(row.started_at)
    if (!Number.isFinite(startedAt)) continue
    if (startedAt >= graceCutoff) continue
    const hasNative = row.has_native_trace === 1 || row.has_native_trace === '1'

    if (!isAdminScope && includeProduction && startedAt < prodNonNativeCutoff) {
      nonNativeSet.add(row.trace_id)
      scopeTotals.nonNativeProduction += 1
      if (hasNative && startedAt < prodNativeCutoff && !shouldKeepNativeSample(row.trace_id, options.settings.sampleBps)) {
        nativeSet.add(row.trace_id)
        scopeTotals.nativeProduction += 1
      }
    }

    if (isAdminScope && includeAdmin && startedAt < adminNonNativeCutoff) {
      nonNativeSet.add(row.trace_id)
      scopeTotals.nonNativeAdmin += 1
      if (hasNative && startedAt < adminNativeCutoff) {
        nativeSet.add(row.trace_id)
        scopeTotals.nativeAdmin += 1
      }
    }
  }

  return {
    nonNativeTraceIds: Array.from(nonNativeSet),
    nativeTraceIds: Array.from(nativeSet),
    scopeTotals,
  }
}

function normalizeScope(scope: string | undefined): RetentionScope {
  if (scope === 'production' || scope === 'admin' || scope === 'all') return scope
  return 'all'
}

function normalizeTraceScope(scope: string | null): TraceScope {
  if (scope === 'admin' || scope === 'eval' || scope === 'production') return scope
  return 'production'
}

function shouldKeepNativeSample(traceId: string, sampleBps: number): boolean {
  if (sampleBps <= 0) return false
  if (sampleBps >= BPS_MAX) return true
  return hashTraceId(traceId) % BPS_MAX < sampleBps
}

function hashTraceId(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function chunkArray<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return []
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function countTraceStepRows(db: D1Database, traceIds: string[], includeNative: boolean): Promise<number> {
  let total = 0
  const stageCondition = includeNative ? "stage = 'native_trace'" : "stage != 'native_trace'"
  for (const chunk of chunkArray(traceIds, 250)) {
    const placeholders = chunk.map(() => '?').join(',')
    const row = await db.prepare(`
      SELECT COUNT(*) as c
      FROM rag_trace_steps
      WHERE ${stageCondition} AND trace_id IN (${placeholders})
    `).bind(...chunk).first<{ c: number }>()
    total += Number(row?.c ?? 0)
  }
  return total
}

async function deleteTraceRows(db: D1Database, traceIds: string[], includeNative: boolean): Promise<number> {
  let total = 0
  const stageCondition = includeNative ? "stage = 'native_trace'" : "stage != 'native_trace'"
  for (const chunk of chunkArray(traceIds, 250)) {
    const placeholders = chunk.map(() => '?').join(',')
    const row = await db.prepare(`
      SELECT COUNT(*) as c
      FROM rag_trace_steps
      WHERE ${stageCondition} AND trace_id IN (${placeholders})
    `).bind(...chunk).first<{ c: number }>()
    const expectedDeleted = Number(row?.c ?? 0)

    const result = await db.prepare(`
      DELETE FROM rag_trace_steps
      WHERE ${stageCondition} AND trace_id IN (${placeholders})
    `).bind(...chunk).run()

    const actualDeleted = Number((result as { meta?: { changes?: number } })?.meta?.changes ?? expectedDeleted)
    total += Number.isFinite(actualDeleted) ? actualDeleted : expectedDeleted
  }
  return total
}

async function loadSettings(db: D1Database): Promise<RetentionSettings> {
  const rows = await db.prepare(`
    SELECT key, value
    FROM settings
    WHERE key IN (${RETENTION_KEYS.map(() => '?').join(', ')})
  `).bind(...RETENTION_KEYS).all<{ key: string; value: string }>()

  const values = new Map(rows.results?.map(row => [row.key, row.value]) ?? [])
  const getNumber = (key: string, fallback: number): number => {
    const parsed = Number(values.get(key))
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
  }

  return {
    enabled: values.get('rag_trace_retention_enabled') !== '0',
    prodDays: getNumber('rag_trace_retention_prod_days', DEFAULT_RETENTION_SETTINGS.prodDays),
    adminDays: getNumber('rag_trace_retention_admin_days', DEFAULT_RETENTION_SETTINGS.adminDays),
    prodNativeDays: getNumber('rag_trace_retention_prod_native_days', DEFAULT_RETENTION_SETTINGS.prodNativeDays),
    adminNativeDays: getNumber('rag_trace_retention_admin_native_days', DEFAULT_RETENTION_SETTINGS.adminNativeDays),
    sampleBps: Math.max(0, Math.min(BPS_MAX, getNumber('rag_trace_retention_native_sample_bps', DEFAULT_RETENTION_SETTINGS.sampleBps))),
    errorGraceDays: getNumber('rag_trace_retention_error_grace_days', DEFAULT_RETENTION_SETTINGS.errorGraceDays),
  }
}
