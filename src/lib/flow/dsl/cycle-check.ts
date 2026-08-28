import type { FlowDefinition, FlowStep } from './ast'
import { FlowCycleError } from './errors'

export function detectSubFlowCycles(
  definition: FlowDefinition,
  registry: Map<string, FlowDefinition> = new Map(),
  visitPath: string[] = [],
): void {
  const currentId = definition.id
  if (visitPath.includes(currentId)) {
    throw new FlowCycleError([...visitPath, currentId])
  }
  const nextPath = [...visitPath, currentId]

  for (const step of definition.steps) {
    const s = step as FlowStep & { kind?: string; flowId?: string }
    if (s.type === 'sub_flow' && typeof s.flowId === 'string' && registry.has(s.flowId)) {
      detectSubFlowCycles(registry.get(s.flowId)!, registry, nextPath)
    }
  }
}
