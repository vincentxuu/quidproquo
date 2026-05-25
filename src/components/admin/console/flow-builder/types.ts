import type { Node, Edge } from '@xyflow/react'
import type { FlowStep } from '@/lib/agent-flow/dsl/ast'

export interface BuilderNodeData extends Record<string, unknown> {
  stepId: string
  stepType: string
  label: string
  config: FlowStep
}

// ReactFlow Node with typed data
export type BuilderNode = Node<BuilderNodeData>

// ReactFlow Edge (label holds serialised condition JSON when set)
export type BuilderEdge = Edge
