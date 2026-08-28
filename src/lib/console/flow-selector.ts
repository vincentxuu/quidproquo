export interface FlowCardData {
  id: string
  name: string
  description?: string | null
  lastStatus?: string | null
  lastRunAt?: number | null
  category?: string | null
  status?: string | null
  currentVersion?: number | null
  estimatedCostUsd?: number | null
  costBand?: string | null
}

export interface FlowSelectorFilters {
  category?: string
  status?: string
  cost?: string
}

export async function loadFlowCards(
  db: D1Database,
  filters: FlowSelectorFilters = {},
): Promise<FlowCardData[]> {
  const conditions: string[] = []
  const bindings: Array<string | number> = []

  const normalizedCategory = (filters.category ?? '').trim().toLowerCase()
  const normalizedStatus = (filters.status ?? '').trim().toLowerCase()
  const normalizedCost = (filters.cost ?? '').trim().toLowerCase()

  if (normalizedCategory) {
    conditions.push('category = ?')
    bindings.push(normalizedCategory)
  }

  if (normalizedStatus === 'published') {
    conditions.push('fd.is_enabled = 1')
  } else if (normalizedStatus === 'archived' || normalizedStatus === 'draft') {
    conditions.push('fd.is_enabled = 0')
  }

  if (normalizedCost === 'lt_0_10' || normalizedCost === '0_10' || normalizedCost === '0_10_1' || normalizedCost === 'gt_1') {
    if (normalizedCost === 'lt_0_10') {
      conditions.push('CASE WHEN fc.avg_cost_usd IS NOT NULL THEN (fc.avg_cost_usd < 0.10) ELSE 0 END = 1')
    } else if (normalizedCost === '0_10' || normalizedCost === '0_10_1') {
      conditions.push('CASE WHEN fc.avg_cost_usd IS NOT NULL THEN (fc.avg_cost_usd >= 0.10 AND fc.avg_cost_usd <= 1.00) ELSE 0 END = 1')
    } else if (normalizedCost === 'gt_1') {
      conditions.push('CASE WHEN fc.avg_cost_usd IS NOT NULL THEN (fc.avg_cost_usd > 1.00) ELSE 0 END = 1')
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await db
    .prepare(
      `WITH run_agg AS (
         SELECT flow_id, AVG(cost_usd) AS avg_cost_usd
         FROM flow_runs
         GROUP BY flow_id
       )
       SELECT
         fd.flow_id AS id,
         COALESCE(fd.display_name, fd.flow_id) AS name,
         fd.description,
         fr.status AS lastStatus,
         fr.finished_at AS lastRunAt,
         fd.current_version AS currentVersion,
         CASE
           WHEN INSTR(fd.flow_id, '-') > 0 THEN SUBSTR(fd.flow_id, 1, INSTR(fd.flow_id, '-') - 1)
           WHEN INSTR(fd.flow_id, '_') > 0 THEN SUBSTR(fd.flow_id, 1, INSTR(fd.flow_id, '_') - 1)
           ELSE 'general'
         END AS category,
         CASE
           WHEN fd.is_enabled = 1 THEN 'published'
           ELSE 'archived'
         END AS status,
         run_agg.avg_cost_usd AS estimatedCostUsd,
         CASE
           WHEN run_agg.avg_cost_usd IS NULL THEN NULL
           WHEN run_agg.avg_cost_usd < 0.10 THEN 'lt_0_10'
           WHEN run_agg.avg_cost_usd <= 1.00 THEN '0_10_1'
           ELSE 'gt_1'
         END AS costBand
       FROM flow_definitions fd
      LEFT JOIN flow_runs fr ON fd.flow_id = fr.flow_id
        AND fr.flow_run_id = (
          SELECT flow_run_id FROM flow_runs
          WHERE flow_id = fd.flow_id
          ORDER BY created_at DESC
          LIMIT 1
        )
      LEFT JOIN run_agg ON run_agg.flow_id = fd.flow_id
       ${whereClause}
       ORDER BY name ASC`,
    )
    .bind(...bindings)
    .all<FlowCardData>()
  return result.results
}
