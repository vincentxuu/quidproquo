import { describe, expect, it } from 'vitest'
import { createMemoryAPI } from './memory'
import {
  InMemoryApprovalStoreBackend,
  InMemoryBlobBackend,
  InMemoryCancelSignalBackend,
  InMemoryEmbeddingBackend,
  InMemoryEventLogBackend,
  InMemoryMemoryBackend,
  InMemoryPermissionsBackend,
  InMemoryProcessRegistryBackend,
  InMemoryRunStoreBackend,
  InMemoryToolCallLogBackend,
  InMemoryVectorBackend,
} from './storage/test/in-memory'
import type { AgentOsBackends } from './storage'

describe('Agent OS memory', () => {
  it('recalls large R2-backed memory bodies transparently', async () => {
    const backends = makeBackends()
    const scope = { orgId: '1', userId: 'system', agentId: 'research', sessionId: 's1' }
    const memory = createMemoryAPI({
      backends,
      currentScope: scope,
      agentId: 'research',
      inlineMaxBytes: 16,
    })
    const body = 'large body stored outside inline D1 text'

    const written = await memory.write({
      type: 'episodic',
      body,
      entities: ['alpha'],
    })
    const recalled = await memory.recall({
      type: 'episodic',
      entities: ['alpha'],
      k: 1,
    })

    expect(written.body).toBe(body)
    expect(recalled[0]?.body).toBe(body)
    expect(recalled[0]?.metadata?.r2Key).toMatch(/^memory\//)
  })
})

function makeBackends(): AgentOsBackends {
  return {
    processes: new InMemoryProcessRegistryBackend(),
    runs: new InMemoryRunStoreBackend(),
    events: new InMemoryEventLogBackend(),
    toolCalls: new InMemoryToolCallLogBackend(),
    permissions: new InMemoryPermissionsBackend(),
    approvals: new InMemoryApprovalStoreBackend(),
    memory: new InMemoryMemoryBackend(),
    cancelSignals: new InMemoryCancelSignalBackend(),
    blobs: new InMemoryBlobBackend(),
    vectors: new InMemoryVectorBackend(),
    embeddings: new InMemoryEmbeddingBackend(),
  }
}
