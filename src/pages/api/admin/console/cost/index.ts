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

const DIMENSIONS = ['flow_id', 'agent_id', 'policy_id', 'user_id', 'preset_id', 'provider_id'] as const
type Dimension = (typeof DIMENSIONS)[number]

const DIMENSION_SET = new Set<string>(DIMENSIONS)

function parseDimension(value: string | null): Dimension {
  return value != null && DIMENSION_SET.has(value) ? value as Dimension : 'flow_id'
}

function liveQueryForDimension(dimension: Dimension): string {
  const dimensionSql: Record<Dimension, string> = {
    flow_id: 'fr.flow_id',
    agent_id: 'ar.agent_id',
    policy_id: "COALESCE(pd.policy_key, CAST(pb.policy_id AS TEXT), '(unbound)')",
    user_id: "COALESCE(cu.email, CAST(al.user_id AS TEXT), '(unknown)')",
    preset_id: "COALESCE(fr.preset_id, '(none)')",
    provider_id: "COALESCE(tc.syscall_name, '(unknown)')",
  }

  const joins = dimension === 'policy_id'
    ? `
             LEFT JOIN policy_bindings pb ON CAST(pb.flow_run_id AS TEXT) = fr.flow_run_id
             LEFT JOIN policy_definitions pd ON pd.policy_id = pb.policy_id`
    : dimension === 'user_id'
      ? `
             LEFT JOIN console_audit_log al
               ON al.resource_kind = 'run'
              AND al.resource_id = fr.flow_run_id
              AND al.action IN ('flow.run.invoke', 'run.start', 'invoke')
             LEFT JOIN console_users cu ON cu.user_id = al.user_id`
      : ''

  const expr = dimensionSql[dimension]

  return `SELECT ${expr} AS dimension_value,
                 COALESCE(SUM(tc.cost_usd), 0) AS cost_usd,
                 COALESCE(SUM(tc.tokens_in + tc.tokens_out), 0) AS tokens_total,
                 COUNT(DISTINCT ${dimension === 'agent_id' || dimension === 'provider_id' ? 'ar.run_id' : 'fr.flow_run_id'}) AS run_count
          FROM flow_runs fr
          JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
          JOIN agent_tool_calls tc ON tc.run_id = ar.run_id${joins}
          WHERE fr.started_at >= ?
          GROUP BY ${expr}
          ORDER BY cost_usd DESC`
}

function isSchemaNotReadyError(err: unknown): boolean {
  const message = String(err)
  return message.includes('no such table') || message.includes('no such column')
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const typedEnv = env as unknown as Env
  const flags = readFlags(typedEnv)

  if (
    !flags.agentConsole.enabled
    || (flags.agentConsole.costDashboard !== undefined && !flags.agentConsole.costDashboard)
  ) {
    return new Response(JSON.stringify({ error: 'console disabled' }), { status: 503 })
  }

  const url = new URL(request.url)
  const dimension = parseDimension(url.searchParams.get('dimension'))
  const range = url.searchParams.get('range') ?? '30d'
  const live = url.searchParams.get('live') === 'true'

  const db = typedEnv.DB
  const nowMs = Date.now()

  try {
    // Live mode: aggregate directly from agent_runs / agent_tool_calls for the last 24h
    if (live || range === '24h') {
      const startMs = nowMs - 86_400_000

      const result = await db
        .prepare(liveQueryForDimension(dimension))
        .bind(startMs)
        .all<LiveRow>()
      const rows = result.results ?? []

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
    } else if (range === '12w') {
      fromDay = todayDay - 84
    } else if (range === '12m') {
      fromDay = todayDay - 365
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
    if (isSchemaNotReadyError(err)) {
      return json({ rows: [], schemaReady: false })
    }
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
}
