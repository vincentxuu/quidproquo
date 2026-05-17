import type { AgentRunRecord, AgentRunStatus, RunStoreBackend } from '../types'
import { encodeJson, runFromRow } from './utils'

export class D1RunStoreBackend implements RunStoreBackend {
  constructor(private readonly db: D1Database) {}

  async create(run: AgentRunRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_runs (
        run_id, agent_id, agent_version, status, trigger, parent_run_id,
        input_json, output_json, error_json, cancel_signal, started_at, finished_at,
        total_tokens, total_cost_usd, total_tool_calls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      run.runId,
      run.agentId,
      run.agentVersion,
      run.status,
      run.trigger,
      run.parentRunId ?? null,
      encodeJson(run.input),
      run.output === undefined ? null : encodeJson(run.output),
      run.error === undefined ? null : encodeJson(run.error),
      run.cancelSignal ? 1 : 0,
      run.startedAt,
      run.finishedAt ?? null,
      run.totalTokens,
      run.totalCostUsd,
      run.totalToolCalls,
    ).run()
  }

  async get(runId: string): Promise<AgentRunRecord | null> {
    const row = await this.db.prepare('SELECT * FROM agent_runs WHERE run_id = ?').bind(runId).first<Record<string, unknown>>()
    return row ? runFromRow(row) : null
  }

  async list(filters: { status?: AgentRunStatus; agentId?: string; limit?: number; cursor?: string } = {}): Promise<{ runs: AgentRunRecord[]; cursor: string | null }> {
    const clauses: string[] = []
    const values: unknown[] = []
    if (filters.status) {
      clauses.push('status = ?')
      values.push(filters.status)
    }
    if (filters.agentId) {
      clauses.push('agent_id = ?')
      values.push(filters.agentId)
    }
    if (filters.cursor) {
      clauses.push('started_at < ?')
      values.push(Number(filters.cursor))
    }
    const limit = Math.min(filters.limit ?? 50, 200)
    values.push(limit + 1)
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    const result = await this.db.prepare(`SELECT * FROM agent_runs ${where} ORDER BY started_at DESC LIMIT ?`).bind(...values).all<Record<string, unknown>>()
    const rows = result.results ?? []
    const page = rows.slice(0, limit).map(runFromRow)
    const cursor = rows.length > limit ? String(Number(rows[limit].started_at)) : null
    return { runs: page, cursor }
  }

  async countActive(agentId: string): Promise<number> {
    const row = await this.db.prepare(`
      SELECT COUNT(*) AS count FROM agent_runs
      WHERE agent_id = ? AND status IN ('running', 'paused')
    `).bind(agentId).first<{ count: number }>()
    return Number(row?.count ?? 0)
  }

  async transition(runId: string, status: AgentRunStatus, patch: { output?: unknown; error?: unknown; finishedAt?: number } = {}): Promise<void> {
    await this.db.prepare(`
      UPDATE agent_runs
      SET status = ?,
          output_json = COALESCE(?, output_json),
          error_json = COALESCE(?, error_json),
          finished_at = COALESCE(?, finished_at)
      WHERE run_id = ?
    `).bind(
      status,
      patch.output === undefined ? null : encodeJson(patch.output),
      patch.error === undefined ? null : encodeJson(patch.error),
      patch.finishedAt ?? null,
      runId,
    ).run()
  }

  async incrementCounters(runId: string, counters: { tokens: number; costUsd: number; toolCalls: number }): Promise<void> {
    await this.db.prepare(`
      UPDATE agent_runs
      SET total_tokens = total_tokens + ?,
          total_cost_usd = total_cost_usd + ?,
          total_tool_calls = total_tool_calls + ?
      WHERE run_id = ?
    `).bind(counters.tokens, counters.costUsd, counters.toolCalls, runId).run()
  }

  async markCancelRequested(runId: string): Promise<void> {
    await this.db.prepare('UPDATE agent_runs SET cancel_signal = 1 WHERE run_id = ?').bind(runId).run()
  }
}
