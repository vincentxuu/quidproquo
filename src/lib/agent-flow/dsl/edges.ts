import type { FlowDefinition, FlowEdge } from './ast'
import { FlowEdgeValidationError } from './errors'

export interface ValidatedEdge {
  from: string
  to: string
  condition?: unknown
}

export function validateEdges(def: FlowDefinition): ValidatedEdge[] {
  const stepIds = new Set(def.steps.map((s) => s.id))
  const edges: FlowEdge[] = def.edges ?? []
  const validated: ValidatedEdge[] = []

  for (const edge of edges) {
    if (!stepIds.has(edge.from)) {
      throw new FlowEdgeValidationError(['edges', edge.from], `unknown step id '${edge.from}'`)
    }
    if (!stepIds.has(edge.to)) {
      throw new FlowEdgeValidationError(['edges', edge.to], `unknown step id '${edge.to}'`)
    }
    validated.push({ from: edge.from, to: edge.to, condition: edge.condition })
  }

  return validated
}
