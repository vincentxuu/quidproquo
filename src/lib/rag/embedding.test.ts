import { describe, expect, it, vi } from 'vitest'
import {
  ACTIVE_EMBEDDING_PROVIDER,
  ACTIVE_EMBEDDING_PROVIDER_ID,
  EMBEDDING_PROVIDERS,
  QWEN3_QUERY_INSTRUCTION,
  qwen3EmbeddingProvider,
  type EmbeddingRuntime,
} from './embedding'
import {
  buildSemanticCacheId,
  SEMANTIC_CACHE_ID_PATTERN,
  SEMANTIC_CACHE_ID_PREFIX,
} from './cache'

function vector(): number[] {
  return Array.from({ length: qwen3EmbeddingProvider.dimensions }, () => 0.1)
}

function mockRuntime(data: number[][]): EmbeddingRuntime & { run: ReturnType<typeof vi.fn> } {
  return {
    run: vi.fn(async () => ({ data, shape: [data.length, qwen3EmbeddingProvider.dimensions] })),
  }
}

describe('embedding provider abstraction', () => {
  it('selects the active provider from one registry entry point', () => {
    expect(ACTIVE_EMBEDDING_PROVIDER).toBe(EMBEDDING_PROVIDERS[ACTIVE_EMBEDDING_PROVIDER_ID])
    expect(ACTIVE_EMBEDDING_PROVIDER.model).toBe('@cf/qwen/qwen3-embedding-0.6b')
  })

  it('keeps the Qwen query payload inside the provider adapter', async () => {
    const runtime = mockRuntime([vector()])

    await qwen3EmbeddingProvider.embedQueries(runtime, ['繁中 query with Vectorize'])

    expect(runtime.run).toHaveBeenCalledWith(qwen3EmbeddingProvider.model, {
      queries: ['繁中 query with Vectorize'],
      instruction: QWEN3_QUERY_INSTRUCTION,
    })
  })

  it('uses provider-specific document and symmetric payloads', async () => {
    const runtime = mockRuntime([vector()])

    await qwen3EmbeddingProvider.embedDocuments(runtime, ['knowledge chunk'])
    expect(runtime.run).toHaveBeenLastCalledWith(qwen3EmbeddingProvider.model, {
      documents: ['knowledge chunk'],
    })

    await qwen3EmbeddingProvider.embedTexts(runtime, ['memory item'])
    expect(runtime.run).toHaveBeenLastCalledWith(qwen3EmbeddingProvider.model, {
      text: ['memory item'],
    })
  })

  it('rejects missing or wrong-dimension vectors before Vectorize writes', async () => {
    await expect(qwen3EmbeddingProvider.embedDocuments(mockRuntime([]), ['chunk']))
      .rejects.toThrow('output count mismatch')
    await expect(qwen3EmbeddingProvider.embedDocuments(mockRuntime([[0.1, 0.2]]), ['chunk']))
      .rejects.toThrow('dimension mismatch')
  })
})

describe('semantic cache embedding isolation', () => {
  it('namespaces cache rows by the active embedding version', async () => {
    const id = await buildSemanticCacheId('什麼是 RAG？')

    expect(SEMANTIC_CACHE_ID_PREFIX).toBe(ACTIVE_EMBEDDING_PROVIDER.cacheNamespace)
    expect(SEMANTIC_CACHE_ID_PATTERN).toBe(`${ACTIVE_EMBEDDING_PROVIDER.cacheNamespace}:%`)
    expect(id).toMatch(new RegExp(`^${ACTIVE_EMBEDDING_PROVIDER.cacheNamespace}:[a-f0-9]{32}$`))
  })

  it('generates stable IDs without colliding with legacy unprefixed rows', async () => {
    const first = await buildSemanticCacheId('same query')
    const second = await buildSemanticCacheId('same query')

    expect(first).toBe(second)
    expect(first).not.toMatch(/^[a-f0-9]{32}$/)
  })
})
