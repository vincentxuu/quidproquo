export interface FlowState {
  flowRunId: string
  data: Record<string, unknown>
}

export function createFlowState(flowRunId: string): FlowState {
  return { flowRunId, data: {} }
}

export function setState(state: FlowState, key: string, value: unknown): void {
  state.data[key] = value
}

export function getState(state: FlowState, key: string): unknown {
  return state.data[key]
}

export async function writeBatch(
  db: import('@cloudflare/workers-types').D1Database,
  flowRunId: string,
  entries: Array<[key: string, value: unknown]>,
): Promise<void> {
  if (entries.length === 0) return
  // Merge all entries into state_json atomically using a single upsert per entry.
  // D1 batch executes all statements in one round-trip.
  const now = Date.now()
  const stmts = entries.map(([key, value]) =>
    db
      .prepare(
        `INSERT INTO flow_run_state (flow_run_id, state_json, updated_at)
         VALUES (?, json_set('{}', ?, json(?)), ?)
         ON CONFLICT(flow_run_id) DO UPDATE SET
           state_json = json_set(state_json, ?, json(?)),
           updated_at = excluded.updated_at`,
      )
      .bind(flowRunId, `$.${key}`, JSON.stringify(value), now, `$.${key}`, JSON.stringify(value)),
  )
  await db.batch(stmts)
}
