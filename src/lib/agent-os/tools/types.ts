import type { ToolDefinition as CentralToolDefinition } from '../../tools/types'
import type { CostModel as CentralCostModel } from '../../tools/cost'

export type JsonSchema = {
  [key: string]: unknown
}

export type MemoryType = 'working' | 'episodic' | 'semantic' | 'procedural'

export interface MemoryScope {
  orgId: string
  userId: string
  agentId: string
  sessionId: string
}

export interface MemoryItem {
  itemId: string
  scope: MemoryScope
  type: MemoryType
  body: string
  metadata?: Record<string, unknown>
  importance?: number
  writtenAt: number
}

export interface MemoryAPI {
  recall(input: { type: MemoryType; query?: string; entities?: string[]; k?: number; scope?: Partial<MemoryScope> }): Promise<MemoryItem[]>
  write(input: { type: MemoryType; body: string; metadata?: Record<string, unknown>; entities?: string[]; ttlSeconds?: number; scope?: Partial<MemoryScope> }): Promise<MemoryItem>
  distill(input: { scope?: Partial<MemoryScope> }): Promise<{ written: number }>
}

export interface SyscallContext {
  runId: string
  agentId: string
  scope: MemoryScope
  signal: AbortSignal
  memory: MemoryAPI
  emit: (kind: string, payload: unknown) => Promise<void>
}

export type SyscallHandler<TIn, TOut> = (
  ctx: SyscallContext,
  input: TIn
) => Promise<TOut>

export interface SyscallDefinition<TIn = unknown, TOut = unknown> {
  name: string
  description: string
  inputSchema: JsonSchema
  outputSchema: JsonSchema
  handler: SyscallHandler<TIn, TOut>
  costModel?: CentralCostModel
  requiresApproval?: boolean
  outboundDomains?: string[]
}

export type AnySyscallDefinition = SyscallDefinition<any, any>
export type ToolDefinition = CentralToolDefinition
export type CostModel = CentralCostModel
