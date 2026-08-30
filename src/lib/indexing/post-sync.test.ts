import { describe, expect, it, vi } from 'vitest'
import {
  applyPostSyncOperation,
  applyPostSyncOperations,
  parsePostSyncOperations,
  type PostSyncOperation,
} from './post-sync'

interface BoundStatement {
  sql: string
  params: unknown[]
}

function fakeDb() {
  const batch = vi.fn(async (statements: BoundStatement[]) => statements)
  const db = {
    prepare(sql: string) {
      return {
        bind(...params: unknown[]) {
          return { sql, params }
        },
      }
    },
    batch,
  } as unknown as D1Database
  return { db, batch }
}

function upsertOperation(): Extract<PostSyncOperation, { type: 'upsert' }> {
  return {
    type: 'upsert',
    post: {
      id: 'post-1',
      slug: 'tech/example',
      title: 'Example',
      category: 'tech',
      lang: 'en',
      description: null,
      tldr: null,
      content: 'Body',
      tags: '[]',
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T01:00:00.000Z',
      sourceHash: 'source-hash',
    },
    chunks: [{
      id: 'chunk-1',
      chunkIndex: 0,
      content: 'Body',
      desiredEmbeddingHash: 'embedding-hash',
    }],
  }
}

describe('post index D1 sync', () => {
  it('queues old vectors and clears surviving IDs in the same D1 batch', async () => {
    const { db, batch } = fakeDb()
    await applyPostSyncOperation(db, upsertOperation())

    const statements = batch.mock.calls[0][0] as BoundStatement[]
    expect(statements.map(statement => statement.sql)).toEqual(expect.arrayContaining([
      expect.stringContaining('INSERT OR IGNORE INTO vector_delete_queue'),
      expect.stringContaining('desired_embedding_hash, embedded_hash'),
      expect.stringContaining('DELETE FROM vector_delete_queue WHERE chunk_id = ?'),
      expect.stringContaining('INSERT INTO chunks_fts'),
    ]))
    expect(statements.find(statement => statement.sql.includes('desired_embedding_hash'))?.params)
      .toContain('embedding-hash')
  })

  it('queues vectors before deleting a stale post', async () => {
    const { db, batch } = fakeDb()
    await applyPostSyncOperation(db, { type: 'delete', slug: 'tech/stale' })

    const statements = batch.mock.calls[0][0] as BoundStatement[]
    expect(statements).toHaveLength(4)
    expect(statements[0].sql).toContain('INSERT OR IGNORE INTO vector_delete_queue')
    expect(statements.at(-1)?.sql).toContain('DELETE FROM posts')
    expect(statements.every(statement => statement.params[0] === 'tech/stale')).toBe(true)
  })

  it('applies multiple operations in one D1 batch', async () => {
    const { db, batch } = fakeDb()
    await applyPostSyncOperations(db, [
      upsertOperation(),
      { type: 'delete', slug: 'tech/stale' },
    ])

    expect(batch).toHaveBeenCalledTimes(1)
    const statements = batch.mock.calls[0][0] as BoundStatement[]
    expect(statements).toHaveLength(11)
    expect(statements.at(-1)?.sql).toContain('DELETE FROM posts')
  })

  it('rejects oversized or malformed API payloads', () => {
    expect(() => parsePostSyncOperations({ operations: [] })).toThrow('operations must contain')
    expect(() => parsePostSyncOperations({
      operations: Array.from({ length: 51 }, () => ({ type: 'delete', slug: 'x' })),
    })).toThrow('operations must contain')
    expect(() => parsePostSyncOperations({ operations: [{ type: 'delete' }] }))
      .toThrow('operations[0].slug must be a string')
  })
})
