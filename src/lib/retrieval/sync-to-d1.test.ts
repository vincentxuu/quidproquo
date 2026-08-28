import { describe, expect, it } from 'vitest'
import { buildPostChunkSyncStatements } from '../../../scripts/sync-to-d1'

describe('buildPostChunkSyncStatements', () => {
  it('removes stale post FTS rows before replacing chunks', () => {
    const statements = buildPostChunkSyncStatements('post-1', 'ai/example', [
      { chunk_index: 0, content: 'new content' },
    ])

    expect(statements[0]).toBe(
      "DELETE FROM chunks_fts WHERE source_type='post' AND chunk_id IN (SELECT id FROM post_chunks WHERE post_id='post-1');",
    )
    expect(statements[1]).toBe("DELETE FROM post_chunks WHERE post_id='post-1';")
  })

  it('writes one matching FTS row for every rebuilt post chunk', () => {
    const statements = buildPostChunkSyncStatements('post-1', 'ai/example', [
      { chunk_index: 0, content: "first chunk's content" },
      { chunk_index: 1, content: 'second chunk' },
    ])

    const chunkInserts = statements.filter(statement => statement.startsWith('INSERT INTO post_chunks'))
    const ftsInserts = statements.filter(statement => statement.startsWith('INSERT INTO chunks_fts'))

    expect(chunkInserts).toHaveLength(2)
    expect(ftsInserts).toHaveLength(2)
    expect(ftsInserts[0]).toContain("first chunk''s content")
    expect(ftsInserts[0]).toContain("'post'")

    const chunkIds = chunkInserts.map(statement => statement.match(/VALUES \('([^']+)'/)?.[1])
    const ftsChunkIds = ftsInserts.map(statement => statement.match(/, '([^']+)', 'post'\);/)?.[1])
    expect(ftsChunkIds).toEqual(chunkIds)
  })

  it('still clears stale FTS rows when an article rebuild produces no chunks', () => {
    expect(buildPostChunkSyncStatements('post-1', 'ai/example', [])).toEqual([
      "DELETE FROM chunks_fts WHERE source_type='post' AND chunk_id IN (SELECT id FROM post_chunks WHERE post_id='post-1');",
      "DELETE FROM post_chunks WHERE post_id='post-1';",
    ])
  })
})
