export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../../_guard'

interface FlowRunRow {
  flow_run_id: string
  flow_id: string
  preset_id: string | null
  status: string
  started_at: number
  finished_at: number | null
  latency_ms: number | null
  created_at: number
}

export const GET: APIRoute = async ({ cookies, params, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id_required' }, 400)

  const db = (env as unknown as Env).DB

  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 100)
  const cursor = url.searchParams.get('cursor')
  const statusFilter = url.searchParams.get('status')

  let query = `SELECT flow_run_id, flow_id, preset_id, status, started_at, finished_at, latency_ms, created_at
               FROM flow_runs
               WHERE flow_id = ?`
  const bindings: unknown[] = [flowId]

  if (statusFilter) {
    query += ` AND status = ?`
    bindings.push(statusFilter)
  }

  if (cursor) {
    query += ` AND started_at < ?`
    bindings.push(Number(cursor))
  }

  query += ` ORDER BY started_at DESC LIMIT ?`
  bindings.push(limit + 1)

  try {
    const result = await db
      .prepare(query)
      .bind(...bindings)
      .all<FlowRunRow>()

    const rows = result.results ?? []
    const hasMore = rows.length > limit
    const runs = hasMore ? rows.slice(0, limit) : rows
    const nextCursor = hasMore ? String(runs[runs.length - 1].started_at) : null

    return json({ runs, cursor: nextCursor })
  } catch {
    return json({ runs: [], cursor: null })
  }
}
