import type { CostModel } from './cost'

export type JsonSchema = {
  [key: string]: unknown
}

export interface ToolContext {
  env?: unknown
  signal?: AbortSignal
}

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: JsonSchema
  outputSchema?: JsonSchema
  cost: CostModel
  outboundDomains?: string[]
  requiresApproval?: boolean
}

export type { CostModel }
