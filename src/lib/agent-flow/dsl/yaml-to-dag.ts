import type { FlowDefinition, FlowStep } from './ast'
import { loadFlow } from './load'
import { validateFlowSchema } from './validate'

export interface DagNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    stepId: string
    stepType: string
    label: string
    config: FlowStep
  }
}

export interface DagEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface DagGraph {
  nodes: DagNode[]
  edges: DagEdge[]
}

function layoutNodes(nodes: DagNode[], edges: DagEdge[]): DagNode[] {
  const successors = new Map<string, string[]>()
  for (const n of nodes) successors.set(n.id, [])
  for (const e of edges) {
    successors.get(e.source)?.push(e.target)
  }

  const predecessorCount = new Map<string, number>()
  for (const n of nodes) predecessorCount.set(n.id, 0)
  for (const e of edges) {
    predecessorCount.set(e.target, (predecessorCount.get(e.target) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, count] of predecessorCount) {
    if (count === 0) queue.push(id)
  }

  const layerOf = new Map<string, number>()
  let head = 0
  while (head < queue.length) {
    const id = queue[head++]
    const layer = layerOf.get(id) ?? 0
    for (const succ of successors.get(id) ?? []) {
      const newLayer = Math.max(layerOf.get(succ) ?? 0, layer + 1)
      layerOf.set(succ, newLayer)
      predecessorCount.set(succ, (predecessorCount.get(succ) ?? 1) - 1)
      if ((predecessorCount.get(succ) ?? 0) <= 0) queue.push(succ)
    }
  }

  // Nodes not reached by BFS (isolated or in cycles) get layer 0
  for (const n of nodes) {
    if (!layerOf.has(n.id)) layerOf.set(n.id, 0)
  }

  const byLayer = new Map<number, string[]>()
  for (const [id, layer] of layerOf) {
    if (!byLayer.has(layer)) byLayer.set(layer, [])
    byLayer.get(layer)!.push(id)
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  for (const [layer, ids] of byLayer) {
    ids.forEach((id, i) => {
      const node = nodeMap.get(id)!
      node.position = {
        x: (i - (ids.length - 1) / 2) * 200,
        y: layer * 120,
      }
    })
  }

  return nodes
}

export function flowDefinitionToDag(definition: FlowDefinition): DagGraph {
  const nodes: DagNode[] = definition.steps.map(step => ({
    id: step.id,
    type: step.type,
    position: { x: 0, y: 0 },
    data: {
      stepId: step.id,
      stepType: step.type,
      label: step.id,
      config: step,
    },
  }))

  const edges: DagEdge[] = definition.edges.map(edge => ({
    id: `${edge.from}->${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.condition ? JSON.stringify(edge.condition) : undefined,
  }))

  return { nodes: layoutNodes(nodes, edges), edges }
}

export function yamlToDag(yaml: string): DagGraph {
  const raw = loadFlow(yaml, 'yaml')
  const definition = validateFlowSchema(raw)
  return flowDefinitionToDag(definition)
}
