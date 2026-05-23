export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { readFlags } from '@/lib/config/flags'
import { json } from '@/lib/api/response'

interface RollupRow {
  day: number
  dimension_value: string
  cost_usd: number
  tokens_total: number
  run_count: number
}

interface LiveRow {
  dimension_value: string
  cost_usd: number
  tokens_total: number
  run_count: number
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  if (!flags.agentConsole.enabled || !flags.agentConsole.costDashboard) {
    return new Response(JSON.stringify({ error: 'console disabled' }), { status: 503 })
  }

  const url = new URL(request.url)
  const dimension = url.searchParams.get('dimension') === 'agent_id' ? 'agent_id' : 'flow_id'
  const range = url.searchParams.get('range') ?? '30d'
  const live = url.searchParams.get('live') === 'true'

  const db = typedEnv.DB
  const nowMs = Date.now()

  try {
    // Live mode: aggregate directly from agent_runs / agent_tool_calls for the last 24h
    if (live || range === '24h') {
      const startMs = nowMs - 86_400_000

      let rows: LiveRow[]

      if (dimension === 'flow_id') {
        const result = await db
          .prepare(
            `SELECT fr.flow_id AS dimension_value,
                    COALESCE(SUM(tc.cost_usd), 0) AS cost_usd,
                    COALESCE(SUM(tc.tokens_in + tc.tokens_out), 0) AS tokens_total,
                    COUNT(DISTINCT fr.flow_run_id) AS run_count
             FROM flow_runs fr
             JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
             JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
             WHERE fr.started_at >= ?
             GROUP BY fr.flow_id
             ORDER BY cost_usd DESC`,
          )
          .bind(startMs)
          .all<LiveRow>()
        rows = result.results ?? []
      } else {
        const result = await db
          .prepare(
            `SELECT ar.agent_id AS dimension_value,
                    COALESCE(SUM(tc.cost_usd), 0) AS cost_usd,
                    COALESCE(SUM(tc.tokens_in + tc.tokens_out), 0) AS tokens_total,
                    COUNT(DISTINCT ar.run_id) AS run_count
             FROM agent_runs ar
             JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
             WHERE ar.started_at >= ?
             GROUP BY ar.agent_id
             ORDER BY cost_usd DESC`,
          )
          .bind(startMs)
          .all<LiveRow>()
        rows = result.results ?? []
      }

      // Return with day = 0 sentinel to indicate live data
      const todayDay = Math.floor(nowMs / 86_400_000)
      return json({
        rows: rows.map((r) => ({
          day: todayDay,
          dimension_value: r.dimension_value,
          cost_usd: r.cost_usd,
          tokens_total: r.tokens_total,
          run_count: r.run_count,
        })),
      })
    }

    // Rollup mode: query cost_rollup_daily
    const todayDay = Math.floor(nowMs / 86_400_000)
    let fromDay: number
    if (range === '7d') {
      fromDay = todayDay - 7
    } else {
      // default 30d
      fromDay = todayDay - 30
    }

    const result = await db
      .prepare(
        `SELECT day, dimension_value,
                cost_usd,
                COALESCE(tokens_in + tokens_out, 0) AS tokens_total,
                run_count
         FROM cost_rollup_daily
         WHERE dimension = ? AND day >= ?
         ORDER BY day DESC, cost_usd DESC`,
      )
      .bind(dimension, fromDay)
      .all<RollupRow>()

    return json({ rows: result.results ?? [] })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
