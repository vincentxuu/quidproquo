export interface RunListRow {
  runId: string
  flowId: string
  status: string
  startedAt: number
  finishedAt: number | null
  costUsd: number
  tokensIn: number
  tokensOut: number
}

export interface RunListResult {
  runs: RunListRow[]
}

export async function listAllFlowRuns(
  db: D1Database,
  opts: { flowId?: string; limit?: number },
): Promise<RunListResult> {
  const limit = opts.limit ?? 50
  const query = opts.flowId
    ? `SELECT flow_run_id, flow_id, status, started_at, finished_at, cost_usd, tokens_in, tokens_out
       FROM flow_runs WHERE flow_id = ? ORDER BY started_at DESC LIMIT ?`
    : `SELECT flow_run_id, flow_id, status, started_at, finished_at, cost_usd, tokens_in, tokens_out
       FROM flow_runs ORDER BY started_at DESC LIMIT ?`

  const stmt = opts.flowId
    ? db.prepare(query).bind(opts.flowId, limit)
    : db.prepare(query).bind(limit)

  const result = await stmt.all<{
    flow_run_id: string
    flow_id: string
    status: string
    started_at: number
    finished_at: number | null
    cost_usd: number
    tokens_in: number
    tokens_out: number
  }>()

  const runs: RunListRow[] = (result.results ?? []).map((row) => ({
    runId: row.flow_run_id,
    flowId: row.flow_id,
    status: row.status,
    startedAt: Number(row.started_at),
    finishedAt: row.finished_at != null ? Number(row.finished_at) : null,
    costUsd: Number(row.cost_usd ?? 0),
    tokensIn: Number(row.tokens_in ?? 0),
    tokensOut: Number(row.tokens_out ?? 0),
  }))

  return { runs }
}
