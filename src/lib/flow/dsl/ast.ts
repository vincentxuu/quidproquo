// Core AST types for the agent-flow YAML DSL.

export interface FlowInput {
  name: string
  type: string
  required?: boolean
  default?: unknown
}

export interface FlowArtifact {
  id: string
  type: string
  description?: string
}

/** Artifact reference used in flow-level YAML declarations (kind + step). */
export interface FlowArtifactRef {
  kind: string
  step: string
}

/** Evidence quality policy mirror of agent-evidence QualityPolicy fields. */
export interface FlowEvidencePolicy {
  citation_required?: boolean
  min_sources?: number
  stale_source_max_days?: number
  conflict_check?: boolean
  min_confidence?: number
  enforcement?: 'warn' | 'block'
}

export interface FlowEvidenceConfig {
  enabled?: boolean
  policy?: FlowEvidencePolicy
}

export interface FlowArtifactBinding {
  stepId: string
  artifactId: string
  outputKey?: string
}

export interface FlowEdge {
  from: string
  to: string
  condition?: unknown
}

export interface FlowStep {
  id: string
  type: string
  [key: string]: unknown
}

export interface FlowRetry {
  maxAttempts: number
  backoffMs?: number
}

export interface FlowPresetOverrides {
  retry?: FlowRetry
  timeout?: number
  steps?: Record<string, Partial<FlowStep>>
}

export interface FlowPreset {
  id: string
  name: string
  overrides?: FlowPresetOverrides
}

export interface FlowDefinition {
  id: string
  name: string
  version: number
  description?: string
  policy_binding?: string
  evidence?: FlowEvidenceConfig
  inputs: FlowInput[]
  steps: FlowStep[]
  edges: FlowEdge[]
  artifacts?: FlowArtifact[] | FlowArtifactRef[]
  artifactBindings?: FlowArtifactBinding[]
  durable?: boolean
  retry?: FlowRetry
  timeout?: number
}
