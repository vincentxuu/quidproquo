import { loadFlow } from '../dsl/load'
import { validateFlowSchema } from '../dsl/validate'
import type { FlowDefinition } from '../dsl/ast'

interface FlowDefinitionRow {
  flow_id: string
  display_name: string
  current_version: number
  description: string | null
  definition_yaml: string | null
}

/**
 * Load a single FlowDefinition from the DB by flow_id.
 * Returns null if not found.
 */
export async function getFlowDefinition(db: D1Database, flowId: string): Promise<FlowDefinition | null> {
  const row = await db
    .prepare(
      `SELECT flow_id, display_name, current_version, description, definition_yaml
       FROM flow_definitions WHERE flow_id = ?`,
    )
    .bind(flowId)
    .first<FlowDefinitionRow>()

  if (!row) return null

  // If the row has definition_yaml, parse and validate it
  if (row.definition_yaml) {
    try {
      const raw = loadFlow(row.definition_yaml, 'yaml')
      return validateFlowSchema(raw)
    } catch {
      // Fall through to reconstructed definition
    }
  }

  // Reconstruct a minimal definition from the row metadata
  return {
    id: row.flow_id,
    name: row.display_name || row.flow_id,
    version: Number(row.current_version ?? 1),
    description: row.description ?? undefined,
    inputs: [],
    steps: [],
    edges: [],
    artifacts: [],
  }
}
