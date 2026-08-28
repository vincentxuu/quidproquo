import { nowMs } from '../utils/dates'
import { AgentAccessDenied, InvalidMemoryType, MemoryBodyTooLarge } from './errors'
import { fuseRRF } from './memory-fusion'
import type { AgentOsBackends } from './storage'
import type { MemoryRecord, MemoryType } from './storage/types'
import type { MemoryAPI, MemoryItem, MemoryScope } from './tools/types'

const validMemoryTypes = new Set<MemoryType>(['working', 'episodic', 'semantic', 'procedural'])

export function scopeKey(scope: MemoryScope): string {
  return `org:${scope.orgId}|user:${scope.userId}|agent:${scope.agentId}|session:${scope.sessionId}`
}

export function createMemoryAPI(options: {
  backends: AgentOsBackends
  currentScope: MemoryScope
  agentId: string
  inlineMaxBytes?: number
  emit?: (kind: string, payload: unknown) => Promise<void>
}): MemoryAPI {
  const inlineMaxBytes = options.inlineMaxBytes ?? 256 * 1024

  return {
    async recall(input) {
      assertMemoryType(input.type)
      const targetScope = { ...options.currentScope, ...input.scope }
      if (targetScope.agentId !== options.agentId) {
        await options.emit?.('denied', { reason: 'cross_agent_memory_scope', requested: scopeKey(targetScope) })
        throw new AgentAccessDenied('cross_agent_memory_scope')
      }
      const key = scopeKey(targetScope)
      const limit = input.k ?? 5
      const semantic = async () => {
        if (!input.query) return []
        const [vector] = await options.backends.embeddings.embed([input.query])
        if (!vector) return []
        const matches = await options.backends.vectors.query(vector, {
          topK: 20,
          filter: { scope_key: key, memory_type: input.type },
        })
        const records = await Promise.all(matches.map((match) => options.backends.memory.get(match.id)))
        return records.filter((record): record is MemoryRecord => record !== null)
      }
      const results = await Promise.allSettled([
        semantic(),
        options.backends.memory.searchKeyword({ scopeKey: key, memoryType: input.type, query: input.query, limit: 20 }),
        options.backends.memory.searchEntities({ scopeKey: key, memoryType: input.type, entities: input.entities, limit: 20 }),
      ])
      const failures = results.filter((result) => result.status === 'rejected')
      if (failures.length > 0) {
        await options.emit?.('memory_partial', { failures: failures.length })
      }
      const lists = results
        .filter((result): result is PromiseFulfilledResult<MemoryRecord[]> => result.status === 'fulfilled')
        .map((result) => result.value.map((item) => ({ id: item.itemId, item, importance: item.importance, writtenAt: item.writtenAt })))
      const fusedRecords = fuseRRF(lists, { limit })
      const fused = await Promise.all(fusedRecords.map((item) => toMemoryItem(item, targetScope, options.backends)))
      void options.backends.memory.touch(fused.map((item) => item.itemId), nowMs())
      return fused
    },
    async write(input) {
      assertMemoryType(input.type)
      const targetScope = { ...options.currentScope, ...input.scope }
      if (targetScope.agentId !== options.agentId) {
        await options.emit?.('denied', { reason: 'cross_agent_memory_scope', requested: scopeKey(targetScope) })
        throw new AgentAccessDenied('cross_agent_memory_scope')
      }
      const itemId = crypto.randomUUID()
      const key = scopeKey(targetScope)
      let bodyText = input.body
      let bodyJson = input.metadata
      if (Buffer.byteLength(input.body, 'utf8') > inlineMaxBytes) {
        try {
          const blob = await options.backends.blobs.put(key, itemId, input.body)
          bodyText = ''
          bodyJson = { ...input.metadata, r2Key: blob.key }
        } catch (error) {
          if (error instanceof MemoryBodyTooLarge) throw error
          throw error
        }
      }
      const now = nowMs()
      const record: MemoryRecord = {
        itemId,
        scopeKey: key,
        memoryType: input.type,
        bodyText,
        bodyJson,
        entities: input.entities,
        writtenAt: now,
        expiresAt: input.ttlSeconds ? now + input.ttlSeconds * 1000 : undefined,
      }
      await options.backends.memory.insert(record)
      void indexMemoryItem(options.backends, record)
      return toMemoryItem(record, targetScope, options.backends, input.body)
    },
    async distill() {
      return { written: 0 }
    },
  }
}

async function indexMemoryItem(backends: AgentOsBackends, record: MemoryRecord): Promise<void> {
  if (!record.bodyText) return
  const [vector] = await backends.embeddings.embed([record.bodyText])
  if (!vector) return
  await backends.vectors.upsert([{
    id: record.itemId,
    values: vector,
    metadata: {
      scope_key: record.scopeKey,
      memory_type: record.memoryType,
      importance: record.importance ?? 0,
      written_at: record.writtenAt,
    },
  }])
}

function assertMemoryType(type: string): asserts type is MemoryType {
  if (!validMemoryTypes.has(type as MemoryType)) {
    throw new InvalidMemoryType(type)
  }
}

async function toMemoryItem(
  record: MemoryRecord,
  scope: MemoryScope,
  backends: AgentOsBackends,
  fallbackBody?: string
): Promise<MemoryItem> {
  const metadata = record.bodyJson as Record<string, unknown> | undefined
  const r2Key = typeof metadata?.r2Key === 'string' ? metadata.r2Key : undefined
  const body = record.bodyText || fallbackBody || (r2Key ? await backends.blobs.get(r2Key) ?? '' : '')
  return {
    itemId: record.itemId,
    scope,
    type: record.memoryType,
    body,
    metadata,
    importance: record.importance,
    writtenAt: record.writtenAt,
  }
}
