import type { ToolCallLogBackend, ToolCallRecord } from '../types'
import { decodeJson, encodeJson } from './utils'

export class D1ToolCallLogBackend implements ToolCallLogBackend {
  constructor(private readonly db: D1Database) {}

  async record(call: ToolCallRecord): Promise<void> {
    await this.db.prepare(`
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
    ).run()
  }

  async listForRun(runId: string, options: { limit?: number } = {}): Promise<ToolCallRecord[]> {
    const result = await this.db.prepare(`
      SELECT * FROM agent_tool_calls
      WHERE run_id = ?
      ORDER BY call_id ASC
      LIMIT ?
    `).bind(runId, Math.min(options.limit ?? 200, 500)).all<Record<string, unknown>>()
    return (result.results ?? []).map((row) => ({
      runId: String(row.run_id),
      syscallName: String(row.syscall_name),
      input: decodeJson(row.input_json as string, null),
      output: decodeJson(row.output_json as string | null, undefined),
      error: row.error ? String(row.error) : undefined,
      tokensIn: Number(row.tokens_in ?? 0),
      tokensOut: Number(row.tokens_out ?? 0),
      costUsd: Number(row.cost_usd ?? 0),
      latencyMs: Number(row.latency_ms),
      startedAt: Number(row.started_at),
    }))
  }
}
