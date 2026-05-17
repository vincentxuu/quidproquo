import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent-os/tools/define'

interface ChunkRow {
  chunk_id: string
  content: string
  source_url: string
  date: string
  type: 'post' | 'doc'
  slug?: string
  title?: string
}

function getTokens(text: string): string[] {
  return Array.from(new Set(
    (text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? [])
      .filter(token => token.length >= 2)
  ))
}

function lexicalScore(query: string, content: string): number {
  const queryTokens = getTokens(query)
  if (queryTokens.length === 0) return 0

  const contentLower = content.toLowerCase()
  const matches = queryTokens.filter(token => contentLower.includes(token)).length
  return matches / queryTokens.length
}

function rowToResult(row: ChunkRow, score: number): SearchResult {
  const content = row.content ?? ''
  return {
    claim: content.split(/[.。]/)[0] ?? content.slice(0, 100),
    evidence_excerpt: content,
    source_url: row.source_url,
    chunk_id: `pageindex:${row.chunk_id}`,
    date: row.date,
    relevance_score: score,
    images: [],
    links: [],
    type: row.type,
    slug: row.slug,
    title: row.title,
  }
}

async function fetchDocNeighborhood(seed: SearchResult, maxSteps: number): Promise<ChunkRow[]> {
  const { DB } = env as unknown as Env
  const seedId = seed.chunk_id.replace(/^pageindex:/, '')
  const seedRow = await DB.prepare(
    `SELECT source_url, chunk_index FROM doc_chunks WHERE id = ?`
  ).bind(seedId).first<{ source_url: string; chunk_index: number }>()

  if (!seedRow) return []

  const rows = await DB.prepare(
    `SELECT
      id AS chunk_id,
      COALESCE(sentence_window, content) AS content,
      source_url,
      '' AS date,
      'doc' AS type
    FROM doc_chunks
    WHERE source_url = ?
      AND chunk_index BETWEEN ? AND ?
    ORDER BY chunk_index ASC`
  )
    .bind(seedRow.source_url, Math.max(0, seedRow.chunk_index - maxSteps), seedRow.chunk_index + maxSteps)
    .all<ChunkRow>()

  return rows.results
}

async function fetchPostNeighborhood(seed: SearchResult, maxSteps: number): Promise<ChunkRow[]> {
  const slug = seed.slug ?? seed.source_url.split('/posts/')[1]
  if (!slug) return []

  const { DB } = env as unknown as Env
  const seedId = seed.chunk_id.replace(/^pageindex:/, '')
  const seedRow = await DB.prepare(
    `SELECT pc.chunk_index
     FROM post_chunks pc
     JOIN posts p ON p.id = pc.post_id
     WHERE pc.id = ? AND p.slug = ?`
  ).bind(seedId, slug).first<{ chunk_index: number }>()

  if (!seedRow) return []

  const rows = await DB.prepare(
    `SELECT
      pc.id AS chunk_id,
      COALESCE(pc.sentence_window, pc.content) AS content,
      'https://quidproquo.cc/posts/' || p.slug AS source_url,
      substr(p.created_at, 1, 10) AS date,
      'post' AS type,
      p.slug,
      p.title
    FROM post_chunks pc
    JOIN posts p ON p.id = pc.post_id
    WHERE p.slug = ?
      AND pc.chunk_index BETWEEN ? AND ?
    ORDER BY pc.chunk_index ASC`
  )
    .bind(slug, Math.max(0, seedRow.chunk_index - maxSteps), seedRow.chunk_index + maxSteps)
    .all<ChunkRow>()

  return rows.results
}

export async function pageIndexSearch(args: {
  query: string
  seed: SearchResult
  maxSteps?: number
  limit?: number
}): Promise<SearchResult[]> {
  const { query, seed, maxSteps = 5, limit = 3 } = args
  const rows = seed.type === 'doc'
    ? await fetchDocNeighborhood(seed, maxSteps)
    : seed.type === 'post'
      ? await fetchPostNeighborhood(seed, maxSteps)
      : []

  return rows
    .map(row => ({ row, score: lexicalScore(query, row.content) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, score }) => rowToResult(row, score))
}

export const searchPageIndexSyscall = defineSyscall<Parameters<typeof pageIndexSearch>[0], { results: SearchResult[] }>({
  name: 'search.pageindex',
  description: 'Search neighboring post/doc chunks around a seed search result.',
  inputSchema: {
    type: 'object',
    required: ['query', 'seed'],
    properties: {
      query: { type: 'string' },
      seed: {
        type: 'object',
        required: ['chunk_id', 'type', 'source_url'],
        additionalProperties: true,
        properties: {
          chunk_id: { type: 'string' },
          type: { type: 'string', enum: ['post', 'doc', 'abstract', 'custom'] },
          source_url: { type: 'string' },
        },
      },
      maxSteps: { type: 'number', default: 5 },
      limit: { type: 'number', default: 3 },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['results'],
    properties: {
      results: { type: 'array', items: { type: 'object', additionalProperties: true } },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  async handler(_ctx, input) {
    return { results: await pageIndexSearch(input) }
  },
})
