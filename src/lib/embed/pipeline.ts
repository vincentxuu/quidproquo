import { env } from 'cloudflare:workers'
import { generateChunkId } from './chunk-id'
import { buildContextualChunk } from './contextual'
import { EMBED_BATCH_SIZE, EMBED_MODEL } from '../rag/tools/hybrid-search'
import type { Env } from '@/lib/config/env'

interface EmbedResult {
  source: string
  vectors: number
  errors: string[]
  hasMore: boolean
  nextOffset: number
}

async function embedTexts(texts: string[]): Promise<number[][]> {
  const { AI } = env as unknown as Env
  const result = await AI.run(EMBED_MODEL, { text: texts }) as { data: number[][] }
  return result.data
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export async function embedPosts(offset = 0, limit = EMBED_BATCH_SIZE): Promise<EmbedResult> {
  const { DB, VECTORIZE_INDEX } = env as unknown as Env
  const errors: string[] = []

  const posts = await DB.prepare(
    'SELECT p.id, p.slug, p.title, p.category, p.lang, p.created_at, pc.id as chunk_id, pc.content, pc.chunk_index FROM post_chunks pc JOIN posts p ON p.id = pc.post_id LIMIT ? OFFSET ?'
  ).bind(limit, offset).all<{
    id: string; slug: string; title: string; category: string; lang: string;
    created_at: string; chunk_id: string; content: string; chunk_index: number
  }>()

  const vectors: VectorizeVector[] = []

  for (const batch of chunkArray(posts.results, EMBED_BATCH_SIZE)) {
    try {
      const contextualBatch = batch.map(row => buildContextualChunk(row.content, {
        type: 'post',
        title: row.title,
        category: row.category,
        date: row.created_at.slice(0, 10),
      }))

      const embeddedBatch = await embedTexts(contextualBatch)

      for (let index = 0; index < batch.length; index += 1) {
        const row = batch[index]
        const id = await generateChunkId('post', row.slug, row.chunk_index)

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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(...batch.map(row => `post chunk ${row.chunk_id}: ${message}`))
    }
  }

  for (const batch of chunkArray(vectors, 100)) {
    const ids = batch.map(v => v.id)
    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
    await VECTORIZE_INDEX.upsert(batch)
  }

  const hasMore = posts.results.length === limit
  return { source: 'posts', vectors: vectors.length, errors, hasMore, nextOffset: offset + limit }
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

      const embeddedBatch = await embedTexts(contextualBatch)

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

  return { source: 'docs', vectors: vectors.length, errors, hasMore: false, nextOffset: 0 }
}

export async function runEmbedPipeline(
  sources: ('posts' | 'docs')[] = ['posts', 'docs'],
  offset = 0,
  limit = EMBED_BATCH_SIZE
): Promise<EmbedResult[]> {
  const results: EmbedResult[] = []
  if (sources.includes('posts')) results.push(await embedPosts(offset, limit))
  if (sources.includes('docs')) results.push(await embedDocs())
  return results
}
