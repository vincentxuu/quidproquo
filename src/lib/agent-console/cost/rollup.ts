import type { Env } from '../../config/env'

function epochDayOf(ms: number): number {
  return Math.floor(ms / 86_400_000)
}

function yesterdayDay(): number {
  return epochDayOf(Date.now()) - 1
}

const DIMENSIONS = ['flow_id', 'agent_id', 'policy_id', 'user_id', 'preset_id', 'provider_id'] as const
type Dimension = (typeof DIMENSIONS)[number]

interface DimensionRow {
  dimension_value: string
  tokens_in: number
  tokens_out: number
  cost_usd: number
  run_count: number
}

export interface ConsoleRollupSummary {
  fromDay: number
  toDay: number
  daysProcessed: number
  rowsWritten: number
  tokensIn: number
  tokensOut: number
  costUsd: number
  runCount: number
}

async function buildDayForDimension(
  db: D1Database,
  day: number,
  dimension: Dimension,
): Promise<DimensionRow[]> {
  const dayStartMs = day * 86_400_000
  const dayEndMs = dayStartMs + 86_400_000

  if (dimension === 'flow_id') {
    const result = await db.prepare(`
      SELECT fr.flow_id AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT fr.flow_run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY fr.flow_id
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  if (dimension === 'agent_id') {
    const result = await db.prepare(`
      SELECT ar.agent_id AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT ar.run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY ar.agent_id
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  if (dimension === 'preset_id') {
    const result = await db.prepare(`
      SELECT COALESCE(fr.preset_id, '(none)') AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT fr.flow_run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY COALESCE(fr.preset_id, '(none)')
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  if (dimension === 'policy_id') {
    const result = await db.prepare(`
      SELECT COALESCE(pd.policy_key, CAST(pb.policy_id AS TEXT), '(unbound)') AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT fr.flow_run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      LEFT JOIN policy_bindings pb ON CAST(pb.flow_run_id AS TEXT) = fr.flow_run_id
      LEFT JOIN policy_definitions pd ON pd.policy_id = pb.policy_id
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY COALESCE(pd.policy_key, CAST(pb.policy_id AS TEXT), '(unbound)')
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  if (dimension === 'user_id') {
    const result = await db.prepare(`
      SELECT COALESCE(CAST(al.user_id AS TEXT), '(unknown)') AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT fr.flow_run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      LEFT JOIN console_audit_log al
        ON al.resource_kind = 'run'
       AND al.resource_id = fr.flow_run_id
       AND al.action IN ('flow.run.invoke', 'run.start', 'invoke')
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY COALESCE(CAST(al.user_id AS TEXT), '(unknown)')
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  if (dimension === 'provider_id') {
    const result = await db.prepare(`
      SELECT COALESCE(tc.syscall_name, '(unknown)') AS dimension_value,
             COALESCE(SUM(tc.tokens_in), 0) AS tokens_in,
             COALESCE(SUM(tc.tokens_out), 0) AS tokens_out,
             COALESCE(SUM(tc.cost_usd), 0.0) AS cost_usd,
             COUNT(DISTINCT ar.run_id) AS run_count
      FROM flow_runs fr
      JOIN agent_runs ar ON ar.flow_run_id = fr.flow_run_id
      JOIN agent_tool_calls tc ON tc.run_id = ar.run_id
      WHERE fr.started_at >= ? AND fr.started_at < ?
      GROUP BY COALESCE(tc.syscall_name, '(unknown)')
    `).bind(dayStartMs, dayEndMs).all<DimensionRow>()
    return result.results
  }

  return []
}

async function upsertDailyRows(
  db: D1Database,
  day: number,
  dimension: Dimension,
  rows: DimensionRow[],
): Promise<void> {
  if (rows.length === 0) return
  const stmts = rows.map(r =>
    db.prepare(`
      INSERT OR REPLACE INTO cost_rollup_daily
        (day, dimension, dimension_value, tokens_in, tokens_out, cost_usd, run_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(day, dimension, r.dimension_value, r.tokens_in, r.tokens_out, r.cost_usd, r.run_count),
  )
  await db.batch(stmts)
}

export async function runConsoleRollupDaily(env: Env, fromDayOverride?: number, toDayOverride?: number): Promise<ConsoleRollupSummary> {
  const db = env.DB
  const meta = await db.prepare('SELECT last_built_day FROM cost_rollup_meta').first<{ last_built_day: number }>()
  const fromDay = fromDayOverride ?? (meta?.last_built_day ?? 0) + 1
  const toDay = toDayOverride ?? yesterdayDay()
  const summary: ConsoleRollupSummary = {
    fromDay,
    toDay,
    daysProcessed: 0,
    rowsWritten: 0,
    tokensIn: 0,
    tokensOut: 0,
    costUsd: 0,
    runCount: 0,
  }

  if (fromDay > toDay) return summary

  for (let day = fromDay; day <= toDay; day++) {
    summary.daysProcessed += 1
    for (const dimension of DIMENSIONS) {
      const rows = await buildDayForDimension(db, day, dimension)
      await upsertDailyRows(db, day, dimension, rows)
      summary.rowsWritten += rows.length
      if (dimension === 'flow_id') {
        for (const row of rows) {
          summary.tokensIn += row.tokens_in
          summary.tokensOut += row.tokens_out
          summary.costUsd += row.cost_usd
          summary.runCount += row.run_count
        }
      }
    }
    await db.prepare('UPDATE cost_rollup_meta SET last_built_day = ?').bind(Math.max(meta?.last_built_day ?? 0, day)).run()
  }

  return summary
}
