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
  SEMANTIC_CACHE_GENERATION,
  SEMANTIC_CACHE_ID_PATTERN,
  SEMANTIC_CACHE_ID_PREFIX,
} from '../conversation/cache'

function vector(value = 0.1): number[] {
  return Array.from({ length: qwen3EmbeddingProvider.dimensions }, () => value)
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

  it('adaptively splits oversized document batches while preserving vector order', async () => {
    const calls: Record<string, unknown>[] = []
    const runtime: EmbeddingRuntime = {
      async run(_model, input) {
        calls.push(input)
        const documents = input.documents as string[]
        if (documents.length > 2) throw new Error('3030: input too big')
        return { data: documents.map(document => vector(document.charCodeAt(0))) }
      },
    }

    const result = await qwen3EmbeddingProvider.embedDocuments(runtime, ['a', 'b', 'c', 'd'])

    expect(calls.map(call => (call.documents as string[]).length)).toEqual([4, 2, 2])
    expect(result.map(item => item[0])).toEqual([97, 98, 99, 100])
  })

  it('treats the Workers AI per-item char limit message as an input-too-big error', async () => {
    const calls: Record<string, unknown>[] = []
    const runtime: EmbeddingRuntime = {
      async run(_model, input) {
        calls.push(input)
        const documents = input.documents as string[]
        if (documents.length > 1) {
          throw new Error('contextual input exceeds 24000 characters; re-chunk before retrying')
        }
        return { data: documents.map(document => vector(document.length)) }
      },
    }

    const result = await qwen3EmbeddingProvider.embedDocuments(runtime, ['甲', '乙', '丙', '丁'])

    expect(calls.map(call => (call.documents as string[]).length)).toEqual([4, 2, 1, 1, 2, 1, 1])
    expect(result.map(item => item[0])).toEqual([1, 1, 1, 1])
  })

  it('truncates single inputs beyond MAX_EMBED_INPUT_CHARS instead of failing forever', async () => {
    const { MAX_EMBED_INPUT_CHARS } = await import('./embedding')
    const calls: Record<string, unknown>[] = []
    const runtime: EmbeddingRuntime = {
      async run(_model, input) {
        calls.push(input)
        return { data: (input.documents as string[]).map(() => vector()) }
      },
    }

    const oversized = 'y'.repeat(MAX_EMBED_INPUT_CHARS + 500)
    const [embedded] = await qwen3EmbeddingProvider.embedDocuments(runtime, [oversized])

    expect(embedded.length).toBe(qwen3EmbeddingProvider.dimensions)
    const sent = (calls[0].documents as string[])[0]
    expect(sent.length).toBe(MAX_EMBED_INPUT_CHARS)
    expect(calls.length).toBe(1)
  })
})

describe('semantic cache embedding isolation', () => {
  it('namespaces cache rows by embedding and retrieval generation', async () => {
    const id = await buildSemanticCacheId('什麼是 RAG？')

    const expectedPrefix = `${ACTIVE_EMBEDDING_PROVIDER.cacheNamespace}:${SEMANTIC_CACHE_GENERATION}`
    expect(SEMANTIC_CACHE_ID_PREFIX).toBe(expectedPrefix)
    expect(SEMANTIC_CACHE_ID_PATTERN).toBe(`${expectedPrefix}:%`)
    expect(id).toMatch(new RegExp(`^${expectedPrefix}:[a-f0-9]{32}$`))
  })

  it('generates stable IDs without colliding with legacy unprefixed rows', async () => {
    const first = await buildSemanticCacheId('same query')
    const second = await buildSemanticCacheId('same query')

    expect(first).toBe(second)
    expect(first).not.toMatch(/^[a-f0-9]{32}$/)
  })
})
