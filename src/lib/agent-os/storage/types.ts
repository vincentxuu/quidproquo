export type AgentRunStatus = 'pending' | 'running' | 'paused' | 'done' | 'failed' | 'cancelled'
export type AgentRunTrigger = 'manual' | 'cron' | 'queue' | 'sub-agent'
export type MemoryType = 'working' | 'episodic' | 'semantic' | 'procedural'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface AgentProcessRecord {
  agentId: string
  version: number
  displayName: string
  description?: string
  schedule?: string
  toolCallLimit: number
  timeoutSeconds: number
  maxConcurrent: number
  approvalTtlSeconds: number
  createdAt: number
  updatedAt: number
}

export interface AgentRunRecord {
  runId: string
  agentId: string
  agentVersion: number
  status: AgentRunStatus
  trigger: AgentRunTrigger
  parentRunId?: string
  input: unknown
  output?: unknown
  error?: unknown
  cancelSignal: boolean
  startedAt: number
  finishedAt?: number
  totalTokens: number
  totalCostUsd: number
  totalToolCalls: number
}

export interface AgentRunEventRecord {
  eventId?: number
  runId: string
  kind: string
  stepId?: string
  payload: unknown
  at: number
}

export interface ToolCallRecord {
  runId: string
  syscallName: string
  input: unknown
  output?: unknown
  error?: string
  tokensIn?: number
  tokensOut?: number
  costUsd?: number
  latencyMs: number
  startedAt: number
}

export interface PermissionRecord {
  agentId: string
  version: number
  grantsHash: string
  syscalls: string[]
  memoryScopes: string[]
  secrets: string[]
  outboundDomains: string[]
  irreversibleActionsRequireApproval: boolean
  updatedAt: number
}

export interface ApprovalRecord {
  approvalId: string
  runId: string
  reason: string
  context: unknown
  status: ApprovalStatus
  resolvedBy?: string
  resolvedAt?: number
  createdAt: number
}

export interface MemoryRecord {
  itemId: string
  scopeKey: string
  memoryType: MemoryType
  bodyText: string
  bodyJson?: unknown
  entities?: string[]
  vectorId?: string
  importance?: number
  writtenAt: number
  expiresAt?: number
  lastReadAt?: number
}

export interface MemorySearchOptions {
  scopeKey: string
  memoryType: MemoryType
  query?: string
  entities?: string[]
  limit: number
}

export interface VectorMatch {
  id: string
  score: number
  metadata?: Record<string, unknown>
}

export interface ProcessRegistryBackend {
  upsert(process: AgentProcessRecord): Promise<void>
  get(agentId: string): Promise<AgentProcessRecord | null>
  list(): Promise<AgentProcessRecord[]>
}

export interface RunStoreBackend {
  create(run: AgentRunRecord): Promise<void>
  get(runId: string): Promise<AgentRunRecord | null>
  list(filters?: { status?: AgentRunStatus; agentId?: string; limit?: number; cursor?: string }): Promise<{ runs: AgentRunRecord[]; cursor: string | null }>
  countActive(agentId: string): Promise<number>
  transition(runId: string, status: AgentRunStatus, patch?: { output?: unknown; error?: unknown; finishedAt?: number }): Promise<void>
  incrementCounters(runId: string, counters: { tokens: number; costUsd: number; toolCalls: number }): Promise<void>
  markCancelRequested(runId: string): Promise<void>
}

export interface EventLogBackend {
  record(event: AgentRunEventRecord): Promise<void>
  recordWithRunCounters(event: AgentRunEventRecord, call: ToolCallRecord, counters: { tokens: number; costUsd: number; toolCalls: number }): Promise<void>
  listForRun(runId: string, options?: { limit?: number; cursor?: string }): Promise<AgentRunEventRecord[]>
}

export interface ToolCallLogBackend {
  record(call: ToolCallRecord): Promise<void>
  listForRun(runId: string, options?: { limit?: number }): Promise<ToolCallRecord[]>
}

export interface PermissionsBackend {
  upsert(permission: PermissionRecord): Promise<void>
  get(agentId: string): Promise<PermissionRecord | null>
}

export interface ApprovalStoreBackend {
  create(approval: ApprovalRecord): Promise<void>
  get(approvalId: string): Promise<ApprovalRecord | null>
  listByStatus(status: ApprovalStatus): Promise<ApprovalRecord[]>
  resolve(approvalId: string, patch: { status: Exclude<ApprovalStatus, 'pending'>; resolvedBy?: string; resolvedAt: number }): Promise<ApprovalRecord>
  expireBefore(cutoffMs: number): Promise<ApprovalRecord[]>
}

export interface MemoryBackend {
  insert(item: MemoryRecord): Promise<void>
  get(itemId: string): Promise<MemoryRecord | null>
  searchKeyword(options: MemorySearchOptions): Promise<MemoryRecord[]>
  searchEntities(options: MemorySearchOptions): Promise<MemoryRecord[]>
  touch(itemIds: string[], at: number): Promise<void>
}

export interface CancelSignalBackend {
  signal(runId: string): Promise<void>
  isSignaled(runId: string): Promise<boolean>
  clear(runId: string): Promise<void>
}

export interface BlobBackend {
  put(scopeKey: string, itemId: string, body: string): Promise<{ key: string }>
  get(key: string): Promise<string | null>
}

export interface VectorBackend {
  upsert(items: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>
  query(values: number[], options: { topK: number; namespace?: string; filter?: Record<string, unknown> }): Promise<VectorMatch[]>
}

export interface EmbeddingBackend {
  embed(texts: string[]): Promise<number[][]>
}
