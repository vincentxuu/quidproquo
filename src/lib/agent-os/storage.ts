import type { Env } from '../config/env'
import { readFlags } from '../config/flags'
import { WorkersAiEmbeddingBackend } from './storage/ai/embedding'
import { D1ApprovalStoreBackend } from './storage/d1/approval-store'
import { D1EventLogBackend } from './storage/d1/event-log'
import { D1MemoryBackend } from './storage/d1/memory'
import { D1PermissionsBackend } from './storage/d1/permissions'
import { D1ProcessRegistryBackend } from './storage/d1/process-registry'
import { D1RunStoreBackend } from './storage/d1/run-store'
import { D1ToolCallLogBackend } from './storage/d1/tool-call-log'
import { KvCancelSignalBackend } from './storage/kv/cancel'
import { R2BlobBackend } from './storage/r2/blob'
import { VectorizeBackend } from './storage/vectorize'
import type {
  ApprovalStoreBackend,
  BlobBackend,
  CancelSignalBackend,
  EmbeddingBackend,
  EventLogBackend,
  MemoryBackend,
  PermissionsBackend,
  ProcessRegistryBackend,
  RunStoreBackend,
  ToolCallLogBackend,
  VectorBackend,
} from './storage/types'

export type * from './storage/types'

export function createBackends(env: Env) {
  const flags = readFlags(env)
  return {
    processes: new D1ProcessRegistryBackend(env.DB),
    runs: new D1RunStoreBackend(env.DB),
    events: new D1EventLogBackend(env.DB),
    toolCalls: new D1ToolCallLogBackend(env.DB),
    permissions: new D1PermissionsBackend(env.DB),
    approvals: new D1ApprovalStoreBackend(env.DB),
    memory: new D1MemoryBackend(env.DB),
    cancelSignals: new KvCancelSignalBackend(env.RATE),
    blobs: new R2BlobBackend(env.R2_AGENT_MEMORY, { enabled: flags.agentOs.memory.r2 }),
    vectors: new VectorizeBackend(env.VECTORIZE_INDEX),
    embeddings: new WorkersAiEmbeddingBackend(env.AI),
  }
}

export interface AgentOsBackends {
  processes: ProcessRegistryBackend
  runs: RunStoreBackend
  events: EventLogBackend
  toolCalls: ToolCallLogBackend
  permissions: PermissionsBackend
  approvals: ApprovalStoreBackend
  memory: MemoryBackend
  cancelSignals: CancelSignalBackend
  blobs: BlobBackend
  vectors: VectorBackend
  embeddings: EmbeddingBackend
}
