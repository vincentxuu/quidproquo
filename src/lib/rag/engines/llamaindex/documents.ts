import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'

export interface LlamaDocument {
  id: string
  text: string
  metadata: {
    slug?: string
    title?: string
    lang?: string
    type: 'post' | 'doc' | 'custom'
    source: string
    sourceUrl?: string
    sourceName?: string
    updatedAt: string
  }
}

interface PostRow {
  id: string
  slug: string
  title: string
  lang: string
  category: string
  created_at: string
  chunk_id: string
  chunk_content: string
}

interface DocRow {
  id: string
  source_url: string
  source_name: string
  chunk_index: number
  updated_at: string
  chunk_content: string
}

function normalizeUpdatedAt(value: string | null | undefined): string {
  if (!value) return new Date().toISOString()
  const normalized = new Date(value)
  return Number.isNaN(normalized.getTime()) ? new Date().toISOString() : normalized.toISOString().slice(0, 10)
}

export async function loadPostDocuments(offset = 0, limit = 200): Promise<LlamaDocument[]> {
  const { DB } = env as unknown as Env
  const rows = await DB.prepare(
    `SELECT
      p.slug,
      p.title,
      p.lang,
      p.created_at,
      pc.id AS chunk_id,
      COALESCE(pc.sentence_window, pc.content) AS chunk_content
    FROM post_chunks pc
    JOIN posts p ON p.id = pc.post_id
    ORDER BY p.created_at DESC, pc.chunk_index ASC
    LIMIT ? OFFSET ?`
  )
    .bind(limit, offset)
    .all<PostRow>()

  return rows.results.map((row) => ({
    id: row.chunk_id,
    text: row.chunk_content,
    metadata: {
      slug: row.slug,
      title: row.title,
      lang: row.lang,
      type: 'post',
      source: `posts/${row.slug}`,
      updatedAt: normalizeUpdatedAt(row.created_at),
    },
  }))
}

export async function loadDocDocuments(offset = 0, limit = 200): Promise<LlamaDocument[]> {
  const { DB } = env as unknown as Env
  const rows = await DB.prepare(
    `SELECT
      id,
      source_url,
      source_name,
      chunk_index,
      source_name AS source,
      updated_at,
      COALESCE(sentence_window, content) AS chunk_content
    FROM doc_chunks
    ORDER BY updated_at DESC, chunk_index ASC
    LIMIT ? OFFSET ?`
  )
    .bind(limit, offset)
    .all<DocRow>()

  return rows.results.map((row) => ({
    id: row.id,
    text: row.chunk_content,
    metadata: {
      type: 'doc',
      source: row.source_name,
      sourceUrl: row.source_url,
      sourceName: row.source_name,
      updatedAt: normalizeUpdatedAt(row.updated_at),
    },
  }))
}

export async function loadDocuments(
  options: { sources?: Array<'posts' | 'docs' | 'custom'>; offset?: number; limit?: number } = {}
): Promise<LlamaDocument[]> {
  const sources = options.sources ?? ['posts', 'docs']
  const offset = Math.max(options.offset ?? 0, 0)
  const limit = Math.max(options.limit ?? 400, 1)
  const half = Math.max(Math.floor(limit / Math.max(sources.length, 1)), 1)

  const tasks: Promise<LlamaDocument[]>[] = []
  if (sources.includes('posts')) tasks.push(loadPostDocuments(offset, half))
  if (sources.includes('docs')) tasks.push(loadDocDocuments(offset, half))
  if (sources.includes('custom')) tasks.push(Promise.resolve([]))

  const settled = await Promise.all(tasks)
  return settled.flat().slice(0, limit)
}
