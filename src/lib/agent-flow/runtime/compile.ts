import type { FlowDefinition } from '../dsl/ast'
import type { ValidatedEdge } from '../dsl/edges'
import { FlowCompileError } from '../dsl/errors'

export interface ExecutionNode {
  stepId: string
  step: FlowDefinition['steps'][number]
  predecessors: string[]
  successors: string[]
}

export interface ExecutionGraph {
  nodes: Map<string, ExecutionNode>
  entryStepId: string
  terminalStepIds: string[]
  adjacency: Map<string, ValidatedEdge[]>
}

export function compile(def: FlowDefinition, edges: ValidatedEdge[]): ExecutionGraph {
  const steps = def.steps ?? []
  if (steps.length === 0) throw new FlowCompileError('flow has no steps')

  const stepIds = steps.map((s) => s.id)

  const predecessorMap = new Map<string, string[]>()
  const successorMap = new Map<string, string[]>()
  for (const id of stepIds) {
    predecessorMap.set(id, [])
    successorMap.set(id, [])
  }

  const adjacency = new Map<string, ValidatedEdge[]>()
  for (const edge of edges) {
    successorMap.get(edge.from)!.push(edge.to)
    predecessorMap.get(edge.to)!.push(edge.from)
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, [])
    adjacency.get(edge.from)!.push(edge)
  }

  const entries = stepIds.filter((id) => predecessorMap.get(id)!.length === 0)
  const terminals = stepIds.filter((id) => successorMap.get(id)!.length === 0)

  if (entries.length !== 1) {
    throw new FlowCompileError(
      `expected exactly 1 entry step, got ${entries.length}: ${entries.join(', ')}`,
    )
  }
  if (terminals.length === 0) {
    throw new FlowCompileError('flow has no terminal step')
  }

  const nodes = new Map<string, ExecutionNode>()
  for (const step of steps) {
    nodes.set(step.id, {
      stepId: step.id,
      step,
      predecessors: predecessorMap.get(step.id)!,
      successors: successorMap.get(step.id)!,
    })
  }

  return {
    nodes,
    entryStepId: entries[0],
    terminalStepIds: terminals,
    adjacency,
  }
}
