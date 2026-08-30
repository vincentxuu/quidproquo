import { env } from 'cloudflare:workers'
import { generateChunkId } from './chunk-id'
import { buildContextualChunk } from './contextual'
import { EMBED_BATCH_SIZE, embedDocuments } from '../retrieval/embedding'
import type { Env } from '@/lib/config/env'

interface EmbedResult {
  source: string
  vectors: number
  deleted: number
  errors: string[]
  hasMore: boolean
}

interface PendingPostChunk {
  id: string
  slug: string
  title: string
  category: string
  lang: string
  created_at: string
  chunk_id: string
  content: string
  chunk_index: number
  desired_embedding_hash: string
}

async function embedKnowledgeDocuments(texts: string[]): Promise<number[][]> {
  const { AI } = env as unknown as Env
  return embedDocuments(AI, texts)
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

async function hasQueuedVectorDeletes(db: D1Database): Promise<boolean> {
  const row = await db.prepare('SELECT 1 AS pending FROM vector_delete_queue LIMIT 1').first<{ pending: number }>()
  return Boolean(row)
}

async function hasPendingPostEmbeddings(db: D1Database): Promise<boolean> {
  const row = await db.prepare(
    `SELECT 1 AS pending
     FROM post_chunks
     WHERE desired_embedding_hash IS NOT NULL
       AND (embedded_hash IS NULL OR embedded_hash != desired_embedding_hash)
     LIMIT 1`
  ).first<{ pending: number }>()
  return Boolean(row)
}

async function drainVectorDeleteQueue(
  db: D1Database,
  vectorize: VectorizeIndex,
  limit: number,
): Promise<number> {
  const queued = await db.prepare(
    'SELECT chunk_id FROM vector_delete_queue ORDER BY chunk_id LIMIT ?'
  ).bind(limit).all<{ chunk_id: string }>()

  let deleted = 0
  for (const batch of chunkArray(queued.results, 100)) {
    const ids = batch.map(row => row.chunk_id)
    await vectorize.deleteByIds(ids)

    const placeholders = ids.map(() => '?').join(', ')
    await db.prepare(
      `DELETE FROM vector_delete_queue WHERE chunk_id IN (${placeholders})`
    ).bind(...ids).run()
    deleted += ids.length
  }

  return deleted
}

async function resetPostEmbeddingCheckpoints(db: D1Database): Promise<void> {
  await db.prepare(
    'UPDATE post_chunks SET embedded_hash = NULL WHERE desired_embedding_hash IS NOT NULL'
  ).run()
}

export async function embedPosts(limit = EMBED_BATCH_SIZE, full = false): Promise<EmbedResult> {
  const { DB, VECTORIZE_INDEX } = env as unknown as Env
  const errors: string[] = []

  if (full) await resetPostEmbeddingCheckpoints(DB)

  const deleted = await drainVectorDeleteQueue(DB, VECTORIZE_INDEX, limit)
  if (await hasQueuedVectorDeletes(DB)) {
    return { source: 'posts', vectors: 0, deleted, errors, hasMore: true }
  }

  const posts = await DB.prepare(
    `SELECT p.id, p.slug, p.title, p.category, p.lang, p.created_at,
            pc.id as chunk_id, pc.content, pc.chunk_index, pc.desired_embedding_hash
     FROM post_chunks pc
     JOIN posts p ON p.id = pc.post_id
     WHERE pc.desired_embedding_hash IS NOT NULL
       AND (pc.embedded_hash IS NULL OR pc.embedded_hash != pc.desired_embedding_hash)
     ORDER BY pc.id
     LIMIT ?`
  ).bind(limit).all<PendingPostChunk>()

  let vectorCount = 0

  for (const batch of chunkArray(posts.results, EMBED_BATCH_SIZE)) {
    try {
      const contextualBatch = batch.map(row => buildContextualChunk(row.content, {
        type: 'post',
        title: row.title,
        category: row.category,
        date: row.created_at.slice(0, 10),
      }))

      const embeddedBatch = await embedKnowledgeDocuments(contextualBatch)

      const vectors: VectorizeVector[] = []
      for (let index = 0; index < batch.length; index += 1) {
        const row = batch[index]
        const id = row.chunk_id

        vectors.push({
          id,
          values: embeddedBatch[index],
          metadata: {
            type: 'post',
            chunk_id: id,
            chunk_index: row.chunk_index,
            slug: row.slug,
            title: row.title,
            category: row.category,
            lang: row.lang,
            date: row.created_at.slice(0, 10),
            images: '[]',
            links: '[]',
          },
        })
      }

      await VECTORIZE_INDEX.upsert(vectors)

      await DB.batch(batch.map(row => DB.prepare(
        `UPDATE post_chunks
         SET embedded_hash = ?
         WHERE id = ? AND desired_embedding_hash = ?`
      ).bind(row.desired_embedding_hash, row.chunk_id, row.desired_embedding_hash)))
      vectorCount += vectors.length
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(...batch.map(row => `post chunk ${row.chunk_id}: ${message}`))
    }
  }

  const hasMore = await hasPendingPostEmbeddings(DB)
  return { source: 'posts', vectors: vectorCount, deleted, errors, hasMore }
}

export async function embedDocs(): Promise<EmbedResult> {
  const { DB, VECTORIZE_INDEX } = env as unknown as Env
  const errors: string[] = []

  const docs = await DB.prepare(
    'SELECT id, source_url, source_name, chunk_index, content FROM doc_chunks'
  ).all<{
    id: string; source_url: string; source_name: string; chunk_index: number; content: string
  }>()

  const vectors: VectorizeVector[] = []

  for (const batch of chunkArray(docs.results, EMBED_BATCH_SIZE)) {
    try {
      const contextualBatch = batch.map(row => buildContextualChunk(row.content, {
        type: 'doc',
        sourceName: row.source_name,
        sourceUrl: row.source_url,
      }))

      const embeddedBatch = await embedKnowledgeDocuments(contextualBatch)

      for (let index = 0; index < batch.length; index += 1) {
        const row = batch[index]
        const id = await generateChunkId('doc', row.source_url, row.chunk_index)

        vectors.push({
          id,
          values: embeddedBatch[index],
          metadata: {
            type: 'doc',
            chunk_id: id,
            chunk_index: row.chunk_index,
            source_url: row.source_url,
            source_name: row.source_name,
            images: '[]',
            links: '[]',
          },
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(...batch.map(row => `doc chunk ${row.id}: ${message}`))
    }
  }

  for (const batch of chunkArray(vectors, 100)) {
    const ids = batch.map(v => v.id)
    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
    await VECTORIZE_INDEX.upsert(batch)
  }

  return { source: 'docs', vectors: vectors.length, deleted: 0, errors, hasMore: false }
}

export async function runEmbedPipeline(
  sources: ('posts' | 'docs')[] = ['posts', 'docs'],
  _legacyOffset = 0,
  limit = EMBED_BATCH_SIZE,
  full = false,
): Promise<EmbedResult[]> {
  const results: EmbedResult[] = []
  if (sources.includes('posts')) results.push(await embedPosts(limit, full))
  if (sources.includes('docs')) results.push(await embedDocs())
  return results
}
