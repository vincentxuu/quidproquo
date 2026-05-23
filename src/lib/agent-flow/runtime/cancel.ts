export interface FlowCancelStore {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}

export function flowCancelKey(flowRunId: string): string {
  return `flow:cancel:${flowRunId}`
}

export async function isCancelled(flowRunId: string, kv: FlowCancelStore): Promise<boolean> {
  const val = await kv.get(flowCancelKey(flowRunId))
  return val !== null
}

export async function cancelFlow(
  flowRunId: string,
  kv: FlowCancelStore,
  ttlSeconds = 600,
  env?: Record<string, unknown>,
): Promise<void> {
  await kv.put(flowCancelKey(flowRunId), '1', { expirationTtl: ttlSeconds })

  // Also terminate durable Workflow if binding available
  const workflows = env?.AGENT_FLOW_WORKFLOWS as {
    get(id: string): { terminate(): Promise<void> }
  } | undefined
  if (workflows) {
    try { await workflows.get(flowRunId).terminate() } catch { /* not a durable run */ }
  }

  // Propagate cancellation to any in-flight kernel sub-runs
  if (env?.DB && env?.SESSION) {
    const db = env.DB as { prepare(sql: string): { bind(...args: unknown[]): { all(): Promise<{ results?: unknown[] }> } } }
    const sessionKv = env.SESSION as { put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> }

    const inFlightAgentRuns = await db
      .prepare(`SELECT run_id FROM agent_runs WHERE flow_run_id=? AND status='running'`)
      .bind(flowRunId)
      .all()

    if (inFlightAgentRuns?.results) {
      for (const row of inFlightAgentRuns.results as { run_id: string }[]) {
        await sessionKv.put(`agent:cancel:${row.run_id}`, '1', { expirationTtl: 300 })
      }
    }
  }
}
