export type PipelineStageKind = 'module' | 'api' | 'llm' | 'human_review'
export type PipelineCategory = 'production' | 'maintenance' | 'knowledge' | 'interaction' | 'ops'
export type PipelineRisk = 'low' | 'medium' | 'high'
export type PipelineStatus = 'queued' | 'running' | 'waiting_review' | 'succeeded' | 'failed' | 'cancelled' | 'dead_letter'
export type ArtifactType = 'markdown_draft' | 'json_report' | 'diff_suggestion' | 'brief' | 'log'

export interface PipelineInput {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'json'
  required?: boolean
  defaultValue?: unknown
  options?: string[]
  placeholder?: string
}

export interface PipelineStage {
  id: string
  title: string
  kind: PipelineStageKind
  tool?: string
}

export interface PipelineArtifactDefinition {
  id: string
  type: ArtifactType
  title: string
}

export interface ToolDefinition {
  id: string
  title: string
  kind: 'cloud_read' | 'cloud_write' | 'module' | 'api' | 'artifact'
  runtime: 'worker' | 'node' | 'both'
  description: string
  writesMarkdown?: boolean
  overwritesExisting?: boolean
  requiresExternalAccess?: boolean
}

export interface BudgetPolicy {
  maxRetries: number
  maxRuntimeMs: number
  maxExternalCalls?: number
}

export interface PipelineDefinition {
  id: string
  title: string
  description: string
  category: PipelineCategory
  risk: PipelineRisk
  inputs: PipelineInput[]
  tools: string[]
  stages: PipelineStage[]
  artifacts: PipelineArtifactDefinition[]
  guards: string[]
  budget: BudgetPolicy
  requiresAdmin: boolean
  writesMarkdown: boolean
  usesExternalResearch: boolean
  runtime: 'worker'
}

export interface GuardResult {
  id: string
  status: 'pass' | 'fail' | 'warn'
  message?: string
}

export interface PipelineRunRequest {
  pipelineId: string
  input: Record<string, unknown>
  requestedBy: string
}
