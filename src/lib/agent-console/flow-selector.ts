export interface FlowCardData {
  id: string
  name: string
  description?: string | null
  lastStatus?: string | null
  lastRunAt?: number | null
}

export async function loadFlowCards(db: D1Database): Promise<FlowCardData[]> {
  const result = await db
    .prepare(
      `SELECT fd.flow_id AS id, fd.name, fd.description,
              fr.status AS lastStatus, fr.finished_at AS lastRunAt
       FROM flow_definitions fd
       LEFT JOIN flow_runs fr ON fd.flow_id = fr.flow_id
         AND fr.flow_run_id = (
           SELECT flow_run_id FROM flow_runs
           WHERE flow_id = fd.flow_id
           ORDER BY created_at DESC
           LIMIT 1
         )
       ORDER BY fd.name ASC`,
    )
    .all<FlowCardData>()
  return result.results
}
