import { describe, expect, it } from 'vitest'
import {
  buildPostChunkSyncStatements,
  buildPostSyncPlan,
  buildStalePostPruneStatements,
  computeDesiredEmbeddingHash,
  computePostSourceHash,
  type PreparedPost,
} from '../../../scripts/sync-to-d1'
import { isSearchIndexEligiblePostData } from '../../utils/publishing'

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

describe('buildStalePostPruneStatements', () => {
  it('uses an eligible slug manifest to remove stale post rows and indexes', () => {
    const statements = buildStalePostPruneStatements(['ai/current', "tech/editor's-note"])
    const sql = statements.join('\n')

    expect(sql).toContain('CREATE TEMP TABLE _sync_eligible_post_slugs')
    expect(sql).toContain('INSERT OR IGNORE INTO _sync_eligible_post_slugs')
    expect(sql).toContain("'ai/current'")
    expect(sql).toContain("'tech/editor''s-note'")
    expect(sql).not.toContain('NOT IN')
    expect(sql).toContain('DELETE FROM chunks_fts')
    expect(sql).toContain("WHERE source_type='post'")
    expect(sql).toContain('DELETE FROM post_chunks')
    expect(sql).toContain('DELETE FROM posts')
    expect(statements.at(-1)).toBe('DROP TABLE IF EXISTS _sync_eligible_post_slugs;')
  })

  it('batches the eligible slug manifest inserts to avoid oversized D1 statements', () => {
    const slugs = Array.from({ length: 401 }, (_, index) => `ai/post-${index}`)
    const statements = buildStalePostPruneStatements(slugs)
    const inserts = statements.filter(statement =>
      statement.startsWith('INSERT OR IGNORE INTO _sync_eligible_post_slugs'),
    )

    expect(inserts).toHaveLength(3)
    expect(inserts[0].match(/\('/g)).toHaveLength(200)
    expect(inserts[1].match(/\('/g)).toHaveLength(200)
    expect(inserts[2].match(/\('/g)).toHaveLength(1)
  })

  it('refuses to prune when the manifest is empty', () => {
    expect(() => buildStalePostPruneStatements([])).toThrow(
      'Refusing to prune posts with an empty eligible slug manifest',
    )
  })
})

describe('incremental production sync', () => {
  const makePost = (slug: string, sourceHash: string): PreparedPost => ({
    post: {
      id: `id-${slug}`,
      slug,
      title: slug,
      category: 'tech',
      lang: 'zh-TW',
      description: null,
      tldr: null,
      content: 'content',
      tags: '[]',
      createdAt: '2026-08-30T00:00:00.000Z',
      updatedAt: '2026-08-30T01:00:00.000Z',
      sourceHash,
    },
    chunks: [],
  })

  it('only upserts changed posts and deletes stale slugs', () => {
    const operations = buildPostSyncPlan(
      [makePost('tech/unchanged', 'same'), makePost('tech/changed', 'new')],
      [
        { slug: 'tech/unchanged', sourceHash: 'same' },
        { slug: 'tech/changed', sourceHash: 'old' },
        { slug: 'tech/deleted', sourceHash: 'old' },
      ],
    )

    expect(operations.map(operation => [operation.type, operation.type === 'delete'
      ? operation.slug
      : operation.post.slug])).toEqual([
      ['upsert', 'tech/changed'],
      ['delete', 'tech/deleted'],
    ])
  })

  it('forces all eligible posts into a full rebuild', () => {
    const post = makePost('tech/unchanged', 'same')
    expect(buildPostSyncPlan([post], [
      { slug: 'tech/unchanged', sourceHash: 'same' },
    ], true)).toHaveLength(1)
  })

  it('refuses an empty local manifest before planning deletions', () => {
    expect(() => buildPostSyncPlan([], [{ slug: 'tech/current', sourceHash: 'hash' }]))
      .toThrow('Refusing to sync with an empty eligible post manifest')
  })

  it('uses canonical content and embedding versions in stable hashes', () => {
    const post = {
      slug: 'tech/example',
      title: 'Example',
      category: 'tech',
      lang: 'en',
      description: null,
      tldr: null,
      content: 'Body',
      tags: '[]',
      createdAt: '2026-08-30T00:00:00.000Z',
    }
    expect(computePostSourceHash(post)).toBe(computePostSourceHash({ ...post }))
    expect(computePostSourceHash({ ...post, content: 'Changed' })).not.toBe(computePostSourceHash(post))
    expect(computeDesiredEmbeddingHash('context')).toBe(computeDesiredEmbeddingHash('context'))
    expect(computeDesiredEmbeddingHash('different')).not.toBe(computeDesiredEmbeddingHash('context'))
  })
})

describe('isSearchIndexEligiblePostData', () => {
  const now = new Date('2026-08-29T12:00:00+08:00')

  it('allows published posts by default', () => {
    expect(isSearchIndexEligiblePostData({
      date: new Date('2026-08-29T00:00:00+08:00'),
    }, now)).toBe(true)
  })

  it('rejects drafts, future posts, and search opt-outs', () => {
    expect(isSearchIndexEligiblePostData({
      date: new Date('2026-08-29T00:00:00+08:00'),
      draft: true,
    }, now)).toBe(false)
    expect(isSearchIndexEligiblePostData({
      date: new Date('2026-08-31T00:00:00+08:00'),
    }, now)).toBe(false)
    expect(isSearchIndexEligiblePostData({
      date: new Date('2026-08-29T00:00:00+08:00'),
      search: false,
    }, now)).toBe(false)
  })
})
