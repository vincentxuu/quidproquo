import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent/tools/define'
import {
  attachSearchMetrics,
  BM25_SHORT_CIRCUIT_THRESHOLD,
  buildFtsQuery,
  getSearchMetrics,
  isPrecisionQuery,
  reciprocalRankFuse,
  shouldUseBm25ShortCircuit,
} from './hybrid-search'
import { embedQueries } from '../embedding'

interface PostSearchRow extends SearchResult {
  type: 'post'
  slug: string
  title: string
}

function parseJsonArray(s: string): unknown[] {
  try { return JSON.parse(s) } catch { return [] }
}

function extractFtsTokens(query: string): string[] {
  const ftsQuery = buildFtsQuery(query)
  if (!ftsQuery) return []
  return ftsQuery
    .split(' OR ')
    .map(t => t.slice(1, -1).replace(/""/g, '"'))
    .filter(t => t.length >= 2)
}

function containsHan(text: string): boolean {
  return /\p{Script=Han}/u.test(text)
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

async function searchLikePosts(
  query: string,
  limit: number,
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  const { DB } = env as unknown as Env

  // Use buildFtsQuery tokens for OR-based LIKE (not whole query)
  const tokens = extractFtsTokens(query)

  if (tokens.length === 0) return []

  const likeClauses = tokens.map(() => 'pc.content LIKE ?').join(' OR ')
  const params = tokens.flatMap(t => [`%${t}%`])

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
    WHERE (${likeClauses})
      ${category ? 'AND p.category = ?' : ''}
      ${lang ? 'AND p.lang = ?' : ''}
    ORDER BY p.created_at DESC
    LIMIT ?`
  )
    .bind(
      ...params,
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
    return searchLikePosts(query, limit)
  }
  return mapped
}

async function fetchPostsByMetadata(
  matches: Array<{ id: string; score?: number; metadata?: unknown }>,
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  const { DB } = env as unknown as Env
  const results: PostSearchRow[] = []
  const seenSlugs = new Set<string>()

  for (const match of matches) {
    const meta = (match.metadata ?? {}) as Record<string, unknown>
    const slug = String(meta.slug ?? '')
    if (!slug || seenSlugs.has(slug)) continue
    if (category && meta.category !== category) continue
    if (lang && meta.lang !== lang) continue
    seenSlugs.add(slug)

    const post = await DB.prepare(
      'SELECT title, category, lang, substr(created_at, 1, 10) AS date, description, tldr, content FROM posts WHERE slug = ?'
    ).bind(slug).first<{
      title: string
      category: string
      lang: string
      date: string
      description: string | null
      tldr: string | null
      content: string
    }>().catch(() => null)

    if (post) {
      const excerpt = post.tldr || post.description || post.content.slice(0, 300)
      results.push({
        claim: post.title,
        evidence_excerpt: excerpt,
        source_url: `https://quidproquo.cc/posts/${slug}`,
        chunk_id: String(meta.chunk_id ?? match.id),
        date: post.date,
        relevance_score: match.score ?? 0,
        images: [],
        links: [],
        type: 'post',
        slug,
        title: post.title,
      })
    }
  }

  return results
}

async function searchMetadataPosts(
  query: string,
  limit: number,
  category?: string,
  lang?: string
): Promise<PostSearchRow[]> {
  const tokens = extractFtsTokens(query)
    .filter(token => !['文章', '找文', '搜尋', '推薦', '關於'].includes(token))
    .slice(0, 12)
  if (tokens.length === 0) return []

  const { DB } = env as unknown as Env
  const likeClauses = tokens
    .map(() => '(p.title LIKE ? OR p.description LIKE ? OR p.tldr LIKE ? OR p.tags LIKE ?)')
    .join(' OR ')
  const params = tokens.flatMap(t => [`%${t}%`, `%${t}%`, `%${t}%`, `%${t}%`])

  const rows = await DB.prepare(
    `SELECT
      COALESCE(pc.id, 'post:' || p.id) AS chunk_id,
      COALESCE(pc.sentence_window, pc.content, p.tldr, p.description, substr(p.content, 1, 600)) AS content,
      p.slug,
      p.title,
      p.category,
      p.lang,
      substr(p.created_at, 1, 10) AS date,
      '[]' AS images,
      '[]' AS links
    FROM posts p
    LEFT JOIN post_chunks pc
      ON pc.post_id = p.id
      AND pc.chunk_index = (
        SELECT MIN(pc2.chunk_index)
        FROM post_chunks pc2
        WHERE pc2.post_id = p.id
      )
    WHERE (${likeClauses})
      ${category ? 'AND p.category = ?' : ''}
      ${lang ? 'AND p.lang = ?' : ''}
    ORDER BY p.created_at DESC
    LIMIT ?`
  )
    .bind(
      ...params,
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

  return rows.results.map(rowToResult)
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
  const [queryVector] = await embedQueries(AI, [query])

  const results = await VECTORIZE_INDEX.query(queryVector, {
    topK: limit * 3,
    filter: { type: { $eq: 'post' } },
    returnMetadata: 'all',
  })

  const matches = results.matches.filter(match => {
    const meta = (match.metadata ?? {}) as Record<string, unknown>
    if (meta.type !== 'post') return false
    if (category && meta.category !== category) return false
    if (lang && meta.lang !== lang) return false
    return true
  })

  const chunkIds = matches.map(match => String(((match.metadata ?? {}) as Record<string, unknown>).chunk_id ?? match.id))

  let rows = await fetchPostRowsByChunkIds(chunkIds, category, lang)
  if (rows.length === 0 && (category || lang)) {
    rows = await fetchPostRowsByChunkIds(chunkIds)
  }
  if (rows.length === 0 && matches.length > 0) {
    rows = await fetchPostsByMetadata(matches, category, lang)
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
  if (!ftsQuery) {
    if (containsHan(query) && query.trim().length >= 2) {
      return searchLikePosts(query, limit, category, lang)
    }
    return []
  }

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
  if (mapped.length === 0) {
    if (containsHan(query) && query.trim().length >= 2) {
      return searchLikePosts(query, limit, category, lang)
    }
    if (category || lang) {
      return searchBm25Posts(query, limit)
    }
  }
  return mapped
}

function dedupeBySlug(results: PostSearchRow[], limit: number): PostSearchRow[] {
  const seen = new Set<string>()
  const deduped: PostSearchRow[] = []
  for (const row of results) {
    if (seen.has(row.slug)) continue
    seen.add(row.slug)
    deduped.push(row)
    if (deduped.length >= limit) break
  }
  return deduped
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
  const metadataResults = await searchMetadataPosts(query, limit, category, lang)
  const bm25Started = Date.now()
  const bm25Results = await searchBm25Posts(query, limit, category, lang)
  const bm25Ms = Date.now() - bm25Started

  if (shouldUseBm25ShortCircuit(query, bm25Results.length, shortCircuit)) {
    const results = dedupeBySlug(reciprocalRankFuse([metadataResults, bm25Results], limit * 3), limit)
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

  const results = dedupeBySlug(reciprocalRankFuse([metadataResults, vectorResults, bm25Results], limit * 3), limit)
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

export const searchPostsSyscall = defineSyscall<Parameters<typeof searchBlogPosts>[0], { results: SearchResult[]; metrics?: ReturnType<typeof getSearchMetrics> }>({
  name: 'search.posts',
  description: 'Search blog posts with BM25 and optional Vectorize hybrid retrieval.',
  inputSchema: {
    type: 'object',
    required: ['query'],
    properties: {
      query: { type: 'string' },
      category: { type: 'string' },
      lang: { type: 'string', enum: ['zh-TW', 'en'] },
      limit: { type: 'number', default: 8 },
      shortCircuit: { type: 'boolean', default: true },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['results'],
    properties: {
      results: { type: 'array', items: { type: 'object', additionalProperties: true } },
      metrics: { type: 'object', additionalProperties: true },
    },
  },
  costModel: { kind: 'token', inputPerKToken: 0, outputPerKToken: 0 },
  async handler(_ctx, input) {
    const results = await searchBlogPosts(input)
    return { results, metrics: getSearchMetrics(results) }
  },
})
