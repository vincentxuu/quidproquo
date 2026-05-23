import type { FlowPreset } from '../dsl/ast'

interface FlowPresetRow {
  preset_id: string
  flow_id: string
  display_name: string
  overrides_json: string | null
}

/**
 * List all presets for a given flow.
 */
export async function listFlowPresets(db: D1Database, flowId: string): Promise<FlowPreset[]> {
  let result: { results: FlowPresetRow[] }
  try {
    result = await db
      .prepare(
        `SELECT preset_id, flow_id, display_name, overrides_json
         FROM flow_presets WHERE flow_id = ? ORDER BY display_name ASC`,
      )
      .bind(flowId)
      .all<FlowPresetRow>()
  } catch {
    // Table may not exist yet
    return []
  }

  return (result.results ?? []).map((row) => {
    let overrides: FlowPreset['overrides']
    if (row.overrides_json) {
      try {
        overrides = JSON.parse(row.overrides_json)
      } catch {
        overrides = undefined
      }
    }
    return {
      id: row.preset_id,
      name: row.display_name || row.preset_id,
      overrides,
    }
  })
}
