import type {
  AgentProcessRecord,
  AgentRunEventRecord,
  AgentRunRecord,
  AgentRunStatus,
  ApprovalRecord,
  ApprovalStatus,
  ApprovalStoreBackend,
  BlobBackend,
  CancelSignalBackend,
  EmbeddingBackend,
  EventLogBackend,
  MemoryBackend,
  MemoryRecord,
  MemorySearchOptions,
  PermissionRecord,
  PermissionsBackend,
  ProcessRegistryBackend,
  RunStoreBackend,
  ToolCallLogBackend,
  ToolCallRecord,
  VectorBackend,
  VectorMatch,
} from '../types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class InMemoryProcessRegistryBackend implements ProcessRegistryBackend {
  readonly processes = new Map<string, AgentProcessRecord>()

  async upsert(process: AgentProcessRecord): Promise<void> {
    this.processes.set(process.agentId, clone(process))
  }

  async get(agentId: string): Promise<AgentProcessRecord | null> {
    const process = this.processes.get(agentId)
    return process ? clone(process) : null
  }

  async list(): Promise<AgentProcessRecord[]> {
    return [...this.processes.values()].map(clone).sort((a, b) => a.agentId.localeCompare(b.agentId))
  }
}

export class InMemoryRunStoreBackend implements RunStoreBackend {
  readonly runs = new Map<string, AgentRunRecord>()

  async create(run: AgentRunRecord): Promise<void> {
    this.runs.set(run.runId, clone(run))
  }

  async get(runId: string): Promise<AgentRunRecord | null> {
    const run = this.runs.get(runId)
    return run ? clone(run) : null
  }

  async list(filters: { status?: AgentRunStatus; agentId?: string; limit?: number; cursor?: string } = {}): Promise<{ runs: AgentRunRecord[]; cursor: string | null }> {
    const limit = filters.limit ?? 50
    const runs = [...this.runs.values()]
      .filter((run) => !filters.status || run.status === filters.status)
      .filter((run) => !filters.agentId || run.agentId === filters.agentId)
      .filter((run) => !filters.cursor || run.startedAt < Number(filters.cursor))
      .sort((a, b) => b.startedAt - a.startedAt)
    const page = runs.slice(0, limit)
    return {
      runs: page.map(clone),
      cursor: runs.length > limit ? String(runs[limit].startedAt) : null,
    }
  }

  async countActive(agentId: string): Promise<number> {
    return [...this.runs.values()].filter((run) => run.agentId === agentId && (run.status === 'running' || run.status === 'paused')).length
  }

  async transition(runId: string, status: AgentRunStatus, patch: { output?: unknown; error?: unknown; finishedAt?: number } = {}): Promise<void> {
    const run = this.runs.get(runId)
    if (!run) return
    this.runs.set(runId, {
      ...run,
      status,
      output: patch.output ?? run.output,
      error: patch.error ?? run.error,
      finishedAt: patch.finishedAt ?? run.finishedAt,
    })
  }

  async incrementCounters(runId: string, counters: { tokens: number; costUsd: number; toolCalls: number }): Promise<void> {
    const run = this.runs.get(runId)
    if (!run) return
    this.runs.set(runId, {
      ...run,
      totalTokens: run.totalTokens + counters.tokens,
      totalCostUsd: run.totalCostUsd + counters.costUsd,
      totalToolCalls: run.totalToolCalls + counters.toolCalls,
    })
  }

  async markCancelRequested(runId: string): Promise<void> {
    const run = this.runs.get(runId)
    if (run) this.runs.set(runId, { ...run, cancelSignal: true })
  }
}

export class InMemoryEventLogBackend implements EventLogBackend {
  readonly events: AgentRunEventRecord[] = []
  readonly toolCalls: ToolCallRecord[] = []

  async record(event: AgentRunEventRecord): Promise<void> {
    this.events.push({ ...clone(event), eventId: this.events.length + 1 })
  }

  async recordWithRunCounters(event: AgentRunEventRecord, call: ToolCallRecord): Promise<void> {
    this.toolCalls.push(clone(call))
    await this.record(event)
  }

  async listForRun(runId: string, options: { limit?: number; cursor?: string } = {}): Promise<AgentRunEventRecord[]> {
    const after = Number(options.cursor ?? 0)
    return this.events
      .filter((event) => event.runId === runId && (event.eventId ?? 0) > after)
      .slice(0, options.limit ?? 200)
      .map(clone)
  }
}

export class InMemoryToolCallLogBackend implements ToolCallLogBackend {
  readonly calls: ToolCallRecord[] = []

  async record(call: ToolCallRecord): Promise<void> {
    this.calls.push(clone(call))
  }

  async listForRun(runId: string, options: { limit?: number } = {}): Promise<ToolCallRecord[]> {
    return this.calls.filter((call) => call.runId === runId).slice(0, options.limit ?? 200).map(clone)
  }
}

export class InMemoryPermissionsBackend implements PermissionsBackend {
  readonly permissions = new Map<string, PermissionRecord>()

  async upsert(permission: PermissionRecord): Promise<void> {
    this.permissions.set(permission.agentId, clone(permission))
  }

  async get(agentId: string): Promise<PermissionRecord | null> {
    const permission = this.permissions.get(agentId)
    return permission ? clone(permission) : null
  }
}

export class InMemoryApprovalStoreBackend implements ApprovalStoreBackend {
  readonly approvals = new Map<string, ApprovalRecord>()

  async create(approval: ApprovalRecord): Promise<void> {
    this.approvals.set(approval.approvalId, clone(approval))
  }

  async get(approvalId: string): Promise<ApprovalRecord | null> {
    const approval = this.approvals.get(approvalId)
    return approval ? clone(approval) : null
  }

  async listByStatus(status: ApprovalStatus): Promise<ApprovalRecord[]> {
    return [...this.approvals.values()].filter((approval) => approval.status === status).map(clone)
  }

  async resolve(approvalId: string, patch: { status: Exclude<ApprovalStatus, 'pending'>; resolvedBy?: string; resolvedAt: number }): Promise<ApprovalRecord> {
    const approval = this.approvals.get(approvalId)
    if (!approval) throw new Error(`Approval not found: ${approvalId}`)
    const updated = { ...approval, ...patch }
    this.approvals.set(approvalId, updated)
    return clone(updated)
  }

  async expireBefore(cutoffMs: number): Promise<ApprovalRecord[]> {
    const expired: ApprovalRecord[] = []
    for (const approval of this.approvals.values()) {
      if (approval.status === 'pending' && approval.createdAt < cutoffMs) {
        const updated: ApprovalRecord = { ...approval, status: 'expired' }
        this.approvals.set(approval.approvalId, updated)
        expired.push(updated)
      }
    }
    return expired.map(clone)
  }
}

export class InMemoryMemoryBackend implements MemoryBackend {
  readonly items = new Map<string, MemoryRecord>()

  async insert(item: MemoryRecord): Promise<void> {
    this.items.set(item.itemId, clone(item))
  }

  async get(itemId: string): Promise<MemoryRecord | null> {
    const item = this.items.get(itemId)
    return item ? clone(item) : null
  }

  async searchKeyword(options: MemorySearchOptions): Promise<MemoryRecord[]> {
    const query = (options.query ?? '').toLowerCase()
    return [...this.items.values()]
      .filter((item) => item.scopeKey.startsWith(options.scopeKey.replace('%', '')))
      .filter((item) => item.memoryType === options.memoryType)
      .filter((item) => item.bodyText.toLowerCase().includes(query))
      .slice(0, options.limit)
      .map(clone)
  }

  async searchEntities(options: MemorySearchOptions): Promise<MemoryRecord[]> {
    const entities = new Set((options.entities ?? []).map((entity) => entity.toLowerCase()))
    if (entities.size === 0) return []
    return [...this.items.values()]
      .filter((item) => item.scopeKey.startsWith(options.scopeKey.replace('%', '')))
      .filter((item) => item.memoryType === options.memoryType)
      .filter((item) => (item.entities ?? []).some((entity) => entities.has(entity.toLowerCase())))
      .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0) || b.writtenAt - a.writtenAt)
      .slice(0, options.limit)
      .map(clone)
  }

  async touch(itemIds: string[], at: number): Promise<void> {
    for (const itemId of itemIds) {
      const item = this.items.get(itemId)
      if (item) this.items.set(itemId, { ...item, lastReadAt: at })
    }
  }
}

export class InMemoryCancelSignalBackend implements CancelSignalBackend {
  readonly signaled = new Set<string>()

  async signal(runId: string): Promise<void> {
    this.signaled.add(runId)
  }

  async isSignaled(runId: string): Promise<boolean> {
    return this.signaled.has(runId)
  }

  async clear(runId: string): Promise<void> {
    this.signaled.delete(runId)
  }
}

export class InMemoryBlobBackend implements BlobBackend {
  readonly blobs = new Map<string, string>()

  async put(scopeKey: string, itemId: string, body: string): Promise<{ key: string }> {
    const key = `memory/${scopeKey}/${itemId}`
    this.blobs.set(key, body)
    return { key }
  }

  async get(key: string): Promise<string | null> {
    return this.blobs.get(key) ?? null
  }
}

export class InMemoryVectorBackend implements VectorBackend {
  readonly vectors = new Map<string, { values: number[]; metadata?: Record<string, unknown> }>()

  async upsert(items: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void> {
    for (const item of items) {
      this.vectors.set(item.id, { values: [...item.values], metadata: item.metadata ? clone(item.metadata) : undefined })
    }
  }

  async query(values: number[], options: { topK: number }): Promise<VectorMatch[]> {
    return [...this.vectors.entries()]
      .map(([id, item]) => ({ id, score: cosine(values, item.values), metadata: item.metadata }))
      .sort((a, b) => b.score - a.score)
      .slice(0, options.topK)
  }
}

export class InMemoryEmbeddingBackend implements EmbeddingBackend {
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => deterministicVector(text))
  }
}

function cosine(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length)
  let dot = 0
  let aNorm = 0
  let bNorm = 0
  for (let index = 0; index < length; index += 1) {
    dot += a[index] * b[index]
    aNorm += a[index] * a[index]
    bNorm += b[index] * b[index]
  }
  return aNorm && bNorm ? dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm)) : 0
}

function deterministicVector(text: string): number[] {
  const vector = [0, 0, 0, 0, 0, 0, 0, 0]
  for (let index = 0; index < text.length; index += 1) {
    vector[index % vector.length] += text.charCodeAt(index) / 255
  }
  return vector
}
