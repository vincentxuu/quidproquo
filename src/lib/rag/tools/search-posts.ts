import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import {
  attachSearchMetrics,
  BM25_SHORT_CIRCUIT_THRESHOLD,
  buildFtsQuery,
  EMBED_MODEL,
  isPrecisionQuery,
  reciprocalRankFuse,
  shouldShortCircuitBm25,
} from './hybrid-search'

interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai; DB: D1Database }
interface PostSearchRow extends SearchResult {
  type: 'post'
  slug: string
  title: string
}

function parseJsonArray(s: string): unknown[] {
  try { return JSON.parse(s) } catch { return [] }
}

function rowToResult(row: {
  chunk_id: string
  content: string
  slug: string
  title: string
  category: string
  lang: string
  date: string
  images: string
  links: string
}): PostSearchRow {
  const content = String(row.content ?? '')
  return {
    claim: content.split(/[.。]/)[0] ?? content.slice(0, 100),
    evidence_excerpt: content,
    source_url: `https://quidproquo.cc/posts/${row.slug}`,
    chunk_id: row.chunk_id,
    date: row.date,
    relevance_score: 0,
    images: parseJsonArray(String(row.images ?? '[]')) as string[],
    links: parseJsonArray(String(row.links ?? '[]')) as { text: string; url: string }[],
    type: 'post',
    slug: row.slug,
    title: row.title,
  }
}

async function fetchPostRowsByChunkIds(
  chunkIds: string[],
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  if (chunkIds.length === 0) return []

  const { DB } = env as unknown as Env
  const placeholders = chunkIds.map(() => '?').join(', ')
  const rows = await DB.prepare(
    `SELECT
      pc.id AS chunk_id,
      COALESCE(pc.sentence_window, pc.content) AS content,
      p.slug,
      p.title,
      p.category,
      p.lang,
      substr(p.created_at, 1, 10) AS date,
      '[]' AS images,
      '[]' AS links
    FROM post_chunks pc
    JOIN posts p ON p.id = pc.post_id
    WHERE pc.id IN (${placeholders})
      ${category ? 'AND p.category = ?' : ''}
      ${lang ? 'AND p.lang = ?' : ''}`
  )
    .bind(...chunkIds, ...(category ? [category] : []), ...(lang ? [lang] : []))
    .all<{
      chunk_id: string
      content: string
      slug: string
      title: string
      category: string
      lang: string
      date: string
      images: string
      links: string
    }>()

  const byId = new Map(rows.results.map(row => [row.chunk_id, rowToResult(row)]))
  return chunkIds.map(id => byId.get(id)).filter((row): row is PostSearchRow => Boolean(row))
}

async function searchVectorPosts(
  query: string,
  limit: number,
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  const { VECTORIZE_INDEX, AI } = env as unknown as Env
  const embResult = await AI.run(EMBED_MODEL, { text: [query] }) as { data: number[][] }
  const queryVector = embResult.data[0]

  const results = await VECTORIZE_INDEX.query(queryVector, {
    topK: limit * 3,
    returnMetadata: 'all',
  })

  const chunkIds = results.matches
    .filter(match => {
      const meta = (match.metadata ?? {}) as Record<string, unknown>
      if (meta.type !== 'post') return false
      if (category && meta.category !== category) return false
      if (lang && meta.lang !== lang) return false
      return true
    })
    .map(match => String(((match.metadata ?? {}) as Record<string, unknown>).chunk_id ?? match.id))

  const rows = await fetchPostRowsByChunkIds(chunkIds, category, lang)
  if (rows.length === 0 && (category || lang)) {
    return fetchPostRowsByChunkIds(chunkIds)
  }
  return rows
}

async function searchBm25Posts(
  query: string,
  limit: number,
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  const ftsQuery = buildFtsQuery(query)
  if (!ftsQuery) return []

  const { DB } = env as unknown as Env
  const rows = await DB.prepare(
    `SELECT
      pc.id AS chunk_id,
      COALESCE(pc.sentence_window, pc.content) AS content,
      p.slug,
      p.title,
      p.category,
      p.lang,
      substr(p.created_at, 1, 10) AS date,
      '[]' AS images,
      '[]' AS links
    FROM chunks_fts
    JOIN post_chunks pc ON pc.id = chunks_fts.chunk_id
    JOIN posts p ON p.id = pc.post_id
    WHERE chunks_fts MATCH ?
      AND chunks_fts.source_type = 'post'
      ${category ? 'AND p.category = ?' : ''}
      ${lang ? 'AND p.lang = ?' : ''}
    ORDER BY bm25(chunks_fts), pc.chunk_index ASC
    LIMIT ?`
  )
    .bind(
      ftsQuery,
      ...(category ? [category] : []),
      ...(lang ? [lang] : []),
      Math.max(limit * 3, BM25_SHORT_CIRCUIT_THRESHOLD)
    )
    .all<{
      chunk_id: string
      content: string
      slug: string
      title: string
      category: string
      lang: string
      date: string
      images: string
      links: string
    }>()

  const mapped = rows.results.map(rowToResult)
  if (mapped.length === 0 && (category || lang)) {
    return searchBm25Posts(query, limit)
  }
  return mapped
}

export async function searchBlogPosts(args: {
  query: string
  category?: string
  lang?: string
  limit?: number
  shortCircuit?: boolean
}): Promise<SearchResult[]> {
  const { query, category, lang, limit = 8, shortCircuit = true } = args
  const started = Date.now()
  const bm25Started = Date.now()
  const bm25Results = await searchBm25Posts(query, limit, category, lang)
  const bm25Ms = Date.now() - bm25Started

  if (shouldShortCircuitBm25(bm25Results.length, shortCircuit)) {
    const results = reciprocalRankFuse([bm25Results], limit)
    return attachSearchMetrics(results, {
      source: 'posts',
      query_kind: isPrecisionQuery(query) ? 'precision' : 'general',
      bm25_results: bm25Results.length,
      vector_results: 0,
      result_count: results.length,
      bm25_ms: bm25Ms,
      vector_ms: null,
      total_ms: Date.now() - started,
      skipped_vector: true,
      short_circuit_threshold: BM25_SHORT_CIRCUIT_THRESHOLD,
      estimated_latency_saved_ms: null,
    })
  }

  const vectorStarted = Date.now()
  const vectorResults = await searchVectorPosts(query, limit, category, lang).catch(() => [] as PostSearchRow[])
  const vectorMs = Date.now() - vectorStarted

  const results = reciprocalRankFuse([vectorResults, bm25Results], limit)
  return attachSearchMetrics(results, {
    source: 'posts',
    query_kind: isPrecisionQuery(query) ? 'precision' : 'general',
    bm25_results: bm25Results.length,
    vector_results: vectorResults.length,
    result_count: results.length,
    bm25_ms: bm25Ms,
    vector_ms: vectorMs,
    total_ms: Date.now() - started,
    skipped_vector: false,
    short_circuit_threshold: BM25_SHORT_CIRCUIT_THRESHOLD,
    estimated_latency_saved_ms: 0,
  })
}
