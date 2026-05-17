import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent-os/tools/define'
import {
  attachSearchMetrics,
  BM25_SHORT_CIRCUIT_THRESHOLD,
  buildFtsQuery,
  EMBED_MODEL,
  getSearchMetrics,
  isPrecisionQuery,
  reciprocalRankFuse,
  shouldShortCircuitBm25,
} from './hybrid-search'

interface DocSearchRow extends SearchResult {
  type: 'doc' | 'custom'
}

function parseJsonArray(s: string): unknown[] {
  try { return JSON.parse(s) } catch { return [] }
}

function rowToResult(row: {
  chunk_id: string
  content: string
  source_url: string
  source_name: string
  type: 'doc' | 'custom'
  images: string
  links: string
}): DocSearchRow {
  const content = String(row.content ?? '')
  return {
    claim: content.split(/[.。]/)[0] ?? content.slice(0, 100),
    evidence_excerpt: content,
    source_url: row.source_url,
    chunk_id: row.chunk_id,
    date: '',
    relevance_score: 0,
    images: parseJsonArray(String(row.images ?? '[]')) as string[],
    links: parseJsonArray(String(row.links ?? '[]')) as { text: string; url: string }[],
    type: row.type,
  }
}

async function fetchDocRowsByChunkIds(chunkIds: string[], sourceName?: string): Promise<DocSearchRow[]> {
  if (chunkIds.length === 0) return []

  const { DB } = env as unknown as Env
  const placeholders = chunkIds.map(() => '?').join(', ')
  const rows = await DB.prepare(
    `SELECT
      dc.id AS chunk_id,
      COALESCE(dc.sentence_window, dc.content) AS content,
      dc.source_url,
      dc.source_name,
      'doc' AS type,
      '[]' AS images,
      '[]' AS links
    FROM doc_chunks dc
    WHERE dc.id IN (${placeholders})
      ${sourceName ? 'AND dc.source_name = ?' : ''}`
  )
    .bind(...chunkIds, ...(sourceName ? [sourceName] : []))
    .all<{
      chunk_id: string
      content: string
      source_url: string
      source_name: string
      type: 'doc'
      images: string
      links: string
    }>()

  const byId = new Map(rows.results.map(row => [row.chunk_id, rowToResult(row)]))
  return chunkIds.map(id => byId.get(id)).filter((row): row is DocSearchRow => Boolean(row))
}

async function searchVectorDocs(query: string, limit: number, sourceName?: string): Promise<DocSearchRow[]> {
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
      if (meta.type !== 'doc' && meta.type !== 'custom') return false
      if (sourceName && meta.source_name !== sourceName) return false
      return true
    })
    .map(match => String(((match.metadata ?? {}) as Record<string, unknown>).chunk_id ?? match.id))

  const rows = await fetchDocRowsByChunkIds(chunkIds, sourceName)
  if (rows.length === 0 && sourceName) {
    return fetchDocRowsByChunkIds(chunkIds)
  }
  return rows
}

async function searchBm25Docs(query: string, limit: number, sourceName?: string): Promise<DocSearchRow[]> {
  const ftsQuery = buildFtsQuery(query)
  if (!ftsQuery) return []

  const { DB } = env as unknown as Env
  const rows = await DB.prepare(
    `SELECT
      dc.id AS chunk_id,
      COALESCE(dc.sentence_window, dc.content) AS content,
      dc.source_url,
      dc.source_name,
      'doc' AS type,
      '[]' AS images,
      '[]' AS links
    FROM chunks_fts
    JOIN doc_chunks dc ON dc.id = chunks_fts.chunk_id
    WHERE chunks_fts MATCH ?
      AND chunks_fts.source_type = 'doc'
      ${sourceName ? 'AND dc.source_name = ?' : ''}
    ORDER BY bm25(chunks_fts), dc.chunk_index ASC
    LIMIT ?`
  )
    .bind(ftsQuery, ...(sourceName ? [sourceName] : []), Math.max(limit * 3, BM25_SHORT_CIRCUIT_THRESHOLD))
    .all<{
      chunk_id: string
      content: string
      source_url: string
      source_name: string
      type: 'doc'
      images: string
      links: string
    }>()

  const mapped = rows.results.map(rowToResult)
  if (mapped.length === 0 && sourceName) {
    return searchBm25Docs(query, limit)
  }
  return mapped
}

export async function searchDocs(args: {
  query: string
  source_name?: string
  limit?: number
  shortCircuit?: boolean
}): Promise<SearchResult[]> {
  const { query, source_name, limit = 8, shortCircuit = true } = args
  const started = Date.now()
  const bm25Started = Date.now()
  const bm25Results = await searchBm25Docs(query, limit, source_name)
  const bm25Ms = Date.now() - bm25Started

  if (shouldShortCircuitBm25(bm25Results.length, shortCircuit)) {
    const results = reciprocalRankFuse([bm25Results], limit)
    return attachSearchMetrics(results, {
      source: 'docs',
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
  const vectorResults = await searchVectorDocs(query, limit, source_name).catch(() => [] as DocSearchRow[])
  const vectorMs = Date.now() - vectorStarted

  const results = reciprocalRankFuse([vectorResults, bm25Results], limit)
  return attachSearchMetrics(results, {
    source: 'docs',
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

export const searchDocsSyscall = defineSyscall<Parameters<typeof searchDocs>[0], { results: SearchResult[]; metrics?: ReturnType<typeof getSearchMetrics> }>({
  name: 'search.docs',
  description: 'Search crawled docs with BM25 and optional Vectorize hybrid retrieval.',
  inputSchema: {
    type: 'object',
    required: ['query'],
    properties: {
      query: { type: 'string' },
      source_name: { type: 'string' },
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
    const results = await searchDocs(input)
    return { results, metrics: getSearchMetrics(results) }
  },
})
