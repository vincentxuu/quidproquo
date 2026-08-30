import { beforeEach, describe, expect, it, vi } from 'vitest'
import { env } from 'cloudflare:workers'
import { embedPosts } from './pipeline'
import { embedDocuments } from '../retrieval/embedding'

vi.mock('../retrieval/embedding', () => ({
  EMBED_BATCH_SIZE: 80,
  embedDocuments: vi.fn(async (_ai: unknown, texts: string[]) => texts.map(() => [0.1, 0.2])),
}))

interface PendingRow {
  chunk_id: string
  desired_embedding_hash: string
  embedded_hash: string | null
  slug?: string
  title?: string
  category?: string
  lang?: string
  created_at?: string
  content?: string
  chunk_index?: number
}

function makeDatabase(options: {
  queue?: string[]
  pending?: PendingRow[]
  upsertError?: Error
  deleteError?: Error
} = {}) {
  const queue = [...(options.queue ?? [])]
  const pending = (options.pending ?? []).map(row => ({
    slug: 'tech/example',
    title: 'Example',
    category: 'tech',
    lang: 'en',
    created_at: '2026-08-30T00:00:00.000Z',
    content: 'Example content',
    chunk_index: 0,
    ...row,
  }))
  const calls: string[] = []

  function prepare(sql: string) {
    let bindings: unknown[] = []
    const statement = {
      bind: (...values: unknown[]) => {
        bindings = values
        return statement
      },
      all: async () => {
        calls.push(sql)
        if (sql.includes('FROM vector_delete_queue')) {
          return { results: queue.slice(0, Number(bindings[0])) .map(chunk_id => ({ chunk_id })) }
        }
        if (sql.includes('FROM post_chunks pc')) {
          const rows = pending
            .filter(row => row.desired_embedding_hash && row.embedded_hash !== row.desired_embedding_hash)
            .sort((a, b) => a.chunk_id.localeCompare(b.chunk_id))
            .slice(0, Number(bindings[0]))
          return { results: rows }
        }
        throw new Error(`Unexpected all query: ${sql}`)
      },
      first: async () => {
        calls.push(sql)
        if (sql.includes('vector_delete_queue')) return queue.length > 0 ? { pending: 1 } : null
        if (sql.includes('post_chunks')) {
          return pending.some(row => row.desired_embedding_hash && row.embedded_hash !== row.desired_embedding_hash)
            ? { pending: 1 }
            : null
        }
        throw new Error(`Unexpected first query: ${sql}`)
      },
      run: async () => {
        calls.push(sql)
        if (sql.includes('DELETE FROM vector_delete_queue')) {
          for (const id of bindings as string[]) {
            const index = queue.indexOf(id)
            if (index >= 0) queue.splice(index, 1)
          }
        } else if (sql.includes('SET embedded_hash = NULL')) {
          pending.forEach(row => { row.embedded_hash = null })
        } else if (sql.includes('SET embedded_hash = ?')) {
          const [hash, id, expected] = bindings as string[]
          const row = pending.find(candidate => candidate.chunk_id === id)
          if (row?.desired_embedding_hash === expected) row.embedded_hash = hash
        }
        return { success: true }
      },
    }
    return statement
  }

  const DB = {
    prepare,
    batch: async (statements: Array<{ run(): Promise<unknown> }>) => Promise.all(statements.map(statement => statement.run())),
  }
  const VECTORIZE_INDEX = {
    deleteByIds: options.deleteError
      ? vi.fn(async () => { throw options.deleteError })
      : vi.fn(async () => undefined),
    upsert: options.upsertError
      ? vi.fn(async () => { throw options.upsertError })
      : vi.fn(async () => undefined),
  }

  return { DB, VECTORIZE_INDEX, queue, pending, calls }
}

const workerEnv = env as Record<string, unknown>

describe('embedPosts', () => {
  beforeEach(() => {
    for (const key of Object.keys(workerEnv)) delete workerEnv[key]
    vi.mocked(embedDocuments).mockClear()
  })

  it('drains queued deletes before selecting pending embeddings', async () => {
    const state = makeDatabase({
      queue: ['old-1', 'old-2'],
      pending: [{ chunk_id: 'new-1', desired_embedding_hash: 'hash-1', embedded_hash: null }],
    })
    Object.assign(workerEnv, state, { AI: {} })

    const result = await embedPosts(1)

    expect(result).toMatchObject({ vectors: 0, deleted: 1, hasMore: true })
    expect(state.VECTORIZE_INDEX.deleteByIds).toHaveBeenCalledWith(['old-1'])
    expect(state.VECTORIZE_INDEX.upsert).not.toHaveBeenCalled()
    expect(state.queue).toEqual(['old-2'])
    expect(state.calls.some(sql => sql.includes('FROM post_chunks pc'))).toBe(false)
  })

  it('acknowledges a chunk only after Vectorize upsert succeeds', async () => {
    const state = makeDatabase({
      pending: [{ chunk_id: 'new-1', desired_embedding_hash: 'hash-1', embedded_hash: null }],
    })
    Object.assign(workerEnv, state, { AI: {} })

    const result = await embedPosts(10)

    expect(result).toMatchObject({ vectors: 1, deleted: 0, errors: [], hasMore: false })
    expect(state.VECTORIZE_INDEX.upsert).toHaveBeenCalledTimes(1)
    expect(state.pending[0].embedded_hash).toBe('hash-1')
    expect(state.calls.find(sql => sql.includes('FROM post_chunks pc'))).not.toContain('OFFSET')
  })

  it('keeps a queued delete when Vectorize deletion fails', async () => {
    const state = makeDatabase({ queue: ['old-1'], deleteError: new Error('Vectorize unavailable') })
    Object.assign(workerEnv, state, { AI: {} })

    await expect(embedPosts(10)).rejects.toThrow('Vectorize unavailable')

    expect(state.queue).toEqual(['old-1'])
  })

  it('leaves the checkpoint pending when Vectorize upsert fails', async () => {
    const state = makeDatabase({
      pending: [{ chunk_id: 'new-1', desired_embedding_hash: 'hash-1', embedded_hash: null }],
      upsertError: new Error('Vectorize unavailable'),
    })
    Object.assign(workerEnv, state, { AI: {} })

    const result = await embedPosts(10)

    expect(result.vectors).toBe(0)
    expect(result.errors[0]).toContain('Vectorize unavailable')
    expect(result.hasMore).toBe(true)
    expect(state.pending[0].embedded_hash).toBeNull()
  })

  it('resets existing checkpoints for an explicit full rebuild', async () => {
    const state = makeDatabase({
      pending: [{ chunk_id: 'new-1', desired_embedding_hash: 'hash-1', embedded_hash: 'hash-1' }],
    })
    Object.assign(workerEnv, state, { AI: {} })

    const result = await embedPosts(10, true)

    expect(result.vectors).toBe(1)
    expect(state.calls.some(sql => sql.includes('SET embedded_hash = NULL'))).toBe(true)
  })
})
