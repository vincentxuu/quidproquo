import { env } from 'cloudflare:workers'
import { generateChunkId } from './chunk-id'
import { buildContextualChunk } from './contextual'

interface Env {
  DB: D1Database
  AI: Ai
  VECTORIZE_INDEX: VectorizeIndex
}

interface EmbedResult {
  source: string
  vectors: number
  errors: string[]
}

async function embedText(text: string): Promise<number[]> {
  const { AI } = env as unknown as Env
  const result = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [text] }) as { data: number[][] }
  return result.data[0]
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export async function embedPosts(): Promise<EmbedResult> {
  const { DB, VECTORIZE_INDEX } = env as unknown as Env
  const errors: string[] = []

  const posts = await DB.prepare(
    'SELECT p.id, p.slug, p.title, p.category, p.lang, p.created_at, pc.id as chunk_id, pc.content, pc.chunk_index FROM post_chunks pc JOIN posts p ON p.id = pc.post_id'
  ).all<{
    id: string; slug: string; title: string; category: string; lang: string;
    created_at: string; chunk_id: string; content: string; chunk_index: number
  }>()

  const vectors: VectorizeVector[] = []

  for (const row of posts.results) {
    try {
      const contextual = buildContextualChunk(row.content, {
        type: 'post',
        title: row.title,
        category: row.category,
        date: row.created_at.slice(0, 10),
      })

      const id = await generateChunkId('post', row.slug, row.chunk_index)
      const values = await embedText(contextual)

      vectors.push({
        id,
        values,
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
    } catch (err) {
      errors.push(`post chunk ${row.chunk_id}: ${err}`)
    }
  }

  for (const batch of chunkArray(vectors, 100)) {
    const ids = batch.map(v => v.id)
    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
    await VECTORIZE_INDEX.upsert(batch)
  }

  return { source: 'posts', vectors: vectors.length, errors }
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

  for (const row of docs.results) {
    try {
      const contextual = buildContextualChunk(row.content, {
        type: 'doc',
        sourceName: row.source_name,
        sourceUrl: row.source_url,
      })

      const id = await generateChunkId('doc', row.source_url, row.chunk_index)
      const values = await embedText(contextual)

      vectors.push({
        id,
        values,
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
    } catch (err) {
      errors.push(`doc chunk ${row.id}: ${err}`)
    }
  }

  for (const batch of chunkArray(vectors, 100)) {
    const ids = batch.map(v => v.id)
    await VECTORIZE_INDEX.deleteByIds(ids).catch(() => {})
    await VECTORIZE_INDEX.upsert(batch)
  }

  return { source: 'docs', vectors: vectors.length, errors }
}

export async function runEmbedPipeline(sources: ('posts' | 'docs')[] = ['posts', 'docs']): Promise<EmbedResult[]> {
  const results: EmbedResult[] = []
  if (sources.includes('posts')) results.push(await embedPosts())
  if (sources.includes('docs')) results.push(await embedDocs())
  return results
}
