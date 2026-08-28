import { stringify } from 'yaml'
import type { FlowDefinition, FlowEdge } from './ast'
import type { DagNode, DagEdge } from './yaml-to-dag'

export interface FlowMeta {
  id: string
  name: string
  version: number
  description?: string
  inputs?: FlowDefinition['inputs']
  artifacts?: FlowDefinition['artifacts']
  artifactBindings?: FlowDefinition['artifactBindings']
  durable?: boolean
  retry?: FlowDefinition['retry']
  timeout?: number
}

function stepToYamlObject(node: DagNode): Record<string, unknown> {
  const { stepId, stepType, config } = node.data
  const obj: Record<string, unknown> = { id: stepId, type: stepType }
  for (const [k, v] of Object.entries(config)) {
    if (k !== 'id' && k !== 'type') obj[k] = v
  }
  return obj
}

export function dagToYaml(nodes: DagNode[], edges: DagEdge[], meta: FlowMeta): string {
  const steps = nodes.map(n => stepToYamlObject(n))
  const flowEdges: FlowEdge[] = edges.map(e => ({
    from: e.source,
    to: e.target,
    ...(e.label !== undefined ? { condition: JSON.parse(e.label) } : {}),
  }))

  const definition: Record<string, unknown> = {
    id: meta.id,
    name: meta.name,
    version: meta.version,
    ...(meta.description !== undefined ? { description: meta.description } : {}),
    inputs: meta.inputs ?? [],
    ...(meta.artifacts !== undefined ? { artifacts: meta.artifacts } : { artifacts: [] }),
    ...(meta.artifactBindings !== undefined ? { artifactBindings: meta.artifactBindings } : {}),
    ...(meta.durable !== undefined ? { durable: meta.durable } : {}),
    ...(meta.retry !== undefined ? { retry: meta.retry } : {}),
    ...(meta.timeout !== undefined ? { timeout: meta.timeout } : {}),
    steps,
    edges: flowEdges,
  }

  return stringify(definition, { sortMapEntries: true, lineWidth: 0 })
}
