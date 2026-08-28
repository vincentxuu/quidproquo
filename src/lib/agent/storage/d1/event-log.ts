import type { AgentRunEventRecord, EventLogBackend, ToolCallRecord } from '../types'
import { decodeJson, encodeJson } from './utils'

export class D1EventLogBackend implements EventLogBackend {
  constructor(private readonly db: D1Database) {}

  async record(event: AgentRunEventRecord): Promise<void> {
    await this.db.prepare(`
      INSERT INTO agent_run_events (run_id, kind, step_id, payload_json, at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(event.runId, event.kind, event.stepId ?? null, encodeJson(event.payload), event.at).run()
  }

  async recordWithRunCounters(event: AgentRunEventRecord, call: ToolCallRecord, counters: { tokens: number; costUsd: number; toolCalls: number }): Promise<void> {
    await this.db.batch([
      this.db.prepare(`
        INSERT INTO agent_run_events (run_id, kind, step_id, payload_json, at)
        VALUES (?, ?, ?, ?, ?)
      `).bind(event.runId, event.kind, event.stepId ?? null, encodeJson(event.payload), event.at),
      this.db.prepare(`
        INSERT INTO agent_tool_calls (
          run_id, syscall_name, input_json, output_json, error,
          tokens_in, tokens_out, cost_usd, latency_ms, started_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        call.runId,
        call.syscallName,
        encodeJson(call.input),
        call.output === undefined ? null : encodeJson(call.output),
        call.error ?? null,
        call.tokensIn ?? 0,
        call.tokensOut ?? 0,
        call.costUsd ?? 0,
        call.latencyMs,
        call.startedAt,
      ),
      this.db.prepare(`
        UPDATE agent_runs
        SET total_tokens = total_tokens + ?,
            total_cost_usd = total_cost_usd + ?,
            total_tool_calls = total_tool_calls + ?
        WHERE run_id = ?
      `).bind(counters.tokens, counters.costUsd, counters.toolCalls, call.runId),
    ])
  }

  async listForRun(runId: string, options: { limit?: number; cursor?: string } = {}): Promise<AgentRunEventRecord[]> {
    const limit = Math.min(options.limit ?? 200, 500)
    const result = await this.db.prepare(`
      SELECT * FROM agent_run_events
      WHERE run_id = ? AND event_id > ?
      ORDER BY event_id ASC
      LIMIT ?
    `).bind(runId, Number(options.cursor ?? 0), limit).all<Record<string, unknown>>()
    return (result.results ?? []).map((row) => ({
      eventId: Number(row.event_id),
      runId: String(row.run_id),
      kind: String(row.kind),
      stepId: row.step_id ? String(row.step_id) : undefined,
      payload: decodeJson(row.payload_json as string, null),
      at: Number(row.at),
    }))
  }
}
