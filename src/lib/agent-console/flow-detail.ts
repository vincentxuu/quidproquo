import { getFlowDefinition } from '../agent-flow/store/definitions'
import { listFlowPresets } from '../agent-flow/store/presets'
import type { FlowDefinition, FlowPreset } from '../agent-flow/dsl/ast'
import { listAllFlowRuns, type RunListRow } from './runs-list'

export interface FlowVersionRow {
  version: number
  publishedAt: number
  publishedBy: string | null
  yaml: string
}

export interface FlowDetail {
  definition: FlowDefinition
  versions: FlowVersionRow[]
  presets: FlowPreset[]
  recentRuns: RunListRow[]
}

// Console-owned read aggregation for the flow detail page. Versions come from a
// direct flow_versions query (no list helper exists in agent-flow's store), the
// rest reuse stable read functions.
export async function loadFlowDetail(db: D1Database, flowId: string): Promise<FlowDetail | null> {
  const definition = await getFlowDefinition(db, flowId)
  if (!definition) return null

  const [versionsResult, presets, runsPage] = await Promise.all([
    db
      .prepare(
        `SELECT version, definition_yaml, published_at, published_by
         FROM flow_versions WHERE flow_id = ? ORDER BY version DESC`,
      )
      .bind(flowId)
      .all<{ version: number; definition_yaml: string; published_at: number; published_by: string | null }>(),
    listFlowPresets(db, flowId),
    listAllFlowRuns(db, { flowId, limit: 20 }),
  ])

  const versions: FlowVersionRow[] = (versionsResult.results ?? []).map((row) => ({
    version: Number(row.version),
    publishedAt: Number(row.published_at),
    publishedBy: row.published_by == null ? null : String(row.published_by),
    yaml: String(row.definition_yaml),
  }))

  return { definition, versions, presets, recentRuns: runsPage.runs }
}
