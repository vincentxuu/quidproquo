export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { searchBlogPosts } from '../../lib/retrieval/tools/search-posts'
import { searchDocs } from '../../lib/retrieval/tools/search-docs'
import { getSearchMetrics, reciprocalRankFuse } from '../../lib/retrieval/tools/hybrid-search'
import type { SearchMetrics } from '../../lib/retrieval/tools/hybrid-search'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'
import { dedupeSearchResultsByUrl, formatSearchExcerpt } from '../../lib/retrieval/search-result-format'
import type { SearchResult } from '../../lib/retrieval/state'
import type { Env } from '@/lib/config/env'
import { json } from '@/lib/api/response'

type SearchLang = 'zh-TW' | 'en'

export const GET: APIRoute = async ({ request, clientAddress }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim() ?? ''
  const mode = url.searchParams.get('mode') ?? 'keyword'
  const lang = parseSearchLang(url.searchParams.get('lang'))
  const limit = parseBoundedInteger(url.searchParams.get('limit'), 10, 1, 50)
  const offset = parseBoundedInteger(url.searchParams.get('offset'), 0, 0, 500)

  if (!query) {
    return json({ mode, query, lang, results: [], total: 0, offset, limit, hasMore: false })
  }

  const db = (env as unknown as Env).DB

  if (mode === 'hybrid' || mode === 'rag') {
    const rateResult = await checkAndIncrementRateLimit(
      `rag-search:${clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'}`,
      await getSearchDailyLimit()
    )
    if (!rateResult.allowed) {
      return json(
        { error: 'rate_limit', message: `Daily RAG search limit reached. Resets at ${rateResult.resetAt}` },
        429
      )
    }

    const fetchLimit = Math.min(500, limit + offset)
    const [posts, docs, keywordResults, keywordTotal] = await Promise.all([
      searchBlogPosts({ query, lang, limit: fetchLimit, shortCircuit: mode === 'hybrid' }).catch(() => []),
      mode === 'rag' ? searchDocs({ query, limit: 5, shortCircuit: false }).catch(() => []) : Promise.resolve([]),
      searchKeywordPosts(db, query, lang, fetchLimit, 0).catch(() => []),
      countKeywordPosts(db, query, lang).catch(() => 0),
    ])
    const metrics = [getSearchMetrics(posts), getSearchMetrics(docs)]
      .filter((metric): metric is SearchMetrics => Boolean(metric))

    const fusedPosts = reciprocalRankFuse([posts, keywordResults], fetchLimit * 2)
    const merged = dedupeSearchResultsByUrl([...keywordResults, ...fusedPosts, ...docs])
      .sort((a, b) => b.relevance_score - a.relevance_score)
    const total = Math.max(merged.length, keywordTotal)
    const paged = merged.slice(offset, offset + limit)

    return json({
      mode,
      query,
      lang,
      results: paged.map(formatApiResult(query)),
      total,
      offset,
      limit,
      hasMore: offset + limit < total && offset + limit < 500,
      metrics: summarizeRetrievalMetrics(metrics),
    })
  }

  const [keywordResults, total] = await Promise.all([
    searchKeywordPosts(db, query, lang, limit, offset),
    countKeywordPosts(db, query, lang),
  ])

  return json({
    mode: 'keyword',
    query,
    lang,
    total,
    offset,
    limit,
    hasMore: offset + limit < total,
    results: keywordResults.map(formatApiResult(query)),
  })
}

function parseSearchLang(raw: string | null): SearchLang {
  return raw === 'en' ? 'en' : 'zh-TW'
}

function parseBoundedInteger(raw: string | null, fallback: number, min: number, max: number): number {
  const value = Number(raw ?? fallback)
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.floor(value)))
}

async function getSearchDailyLimit(): Promise<number> {
  const db = (env as unknown as Env).DB
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('rag_search_daily_limit')
    .first<{ value: string }>()
  return parseInt(row?.value ?? '20', 10)
}

async function countKeywordPosts(db: D1Database, query: string, lang: SearchLang): Promise<number> {
  const likes = buildKeywordLikes(query)
  const where = buildKeywordWhere(likes)
  const row = await db.prepare(
    `SELECT count(*) as total FROM posts
     WHERE lang = ? AND ${where.sql}`
  ).bind(lang, ...where.params).first<{ total: number }>()
  return row?.total ?? 0
}

async function searchKeywordPosts(
  db: D1Database,
  query: string,
  lang: SearchLang,
  limit: number,
  offset: number
): Promise<SearchResult[]> {
  const likes = buildKeywordLikes(query)
  const where = buildKeywordWhere(likes)
  const rank = buildKeywordRank(likes)
  const rows = await db.prepare(
    `SELECT slug, title, category, description, tldr, content, substr(created_at, 1, 10) AS date,
       (${rank.sql}) AS keyword_score
     FROM posts
     WHERE lang = ? AND ${where.sql}
     ORDER BY keyword_score ASC, created_at DESC
     LIMIT ? OFFSET ?`
  ).bind(...rank.params, lang, ...where.params, limit, offset).all<{
    slug: string
    title: string
    category: string
    description: string | null
    tldr: string | null
    content: string
    date: string
    keyword_score: number
  }>()

  return rows.results.map(row => ({
    claim: row.title,
    evidence_excerpt: row.tldr ?? row.description ?? row.content.slice(0, 300),
    source_url: `https://quidproquo.cc/posts/${row.slug}`,
    chunk_id: `keyword:${row.slug}`,
    date: row.date,
    relevance_score: keywordScore(row.keyword_score),
    images: [],
    links: [],
    type: 'post',
    slug: row.slug,
    title: row.title,
  }))
}

function buildKeywordLikes(query: string): string[] {
  const exact = query.trim()
  if (exact.length < 2) return []
  return [exact, ...buildKeywordTerms(exact)].map(term => `%${term}%`)
}

function buildKeywordWhere(likes: string[]): { sql: string; params: string[] } {
  if (likes.length === 0) return { sql: '0', params: [] }

  const fields = ['title', 'description', 'tldr', 'content']
  const exactClauses = fields.map(field => `${field} LIKE ?`).join(' OR ')
  const exactParams = fields.map(() => likes[0])
  const termLikes = likes.slice(1)
  if (termLikes.length === 0) {
    return { sql: `(${exactClauses})`, params: exactParams }
  }

  const text = keywordTextExpression()
  return {
    sql: `((${exactClauses}) OR (${termLikes.map(() => `${text} LIKE ?`).join(' AND ')}))`,
    params: [...exactParams, ...termLikes],
  }
}

function buildKeywordRank(likes: string[]): { sql: string; params: string[] } {
  const exact = likes[0]
  if (!exact) return { sql: '4', params: [] }

  return {
    sql: `CASE
         WHEN title LIKE ? THEN 0
         WHEN tldr LIKE ? THEN 1
         WHEN description LIKE ? THEN 2
         WHEN content LIKE ? THEN 3
         ELSE 4
       END`,
    params: [exact, exact, exact, exact],
  }
}

function buildKeywordTerms(query: string): string[] {
  const rawTokens = query.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const terms = new Set<string>()

  for (const token of rawTokens) {
    const parts = token.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu) ?? [token]
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.length < 2) continue
      if (/^[\p{Script=Han}]+$/u.test(trimmed) && trimmed.length >= 4) {
        for (let i = 0; i < trimmed.length - 1; i += 2) {
          terms.add(trimmed.slice(i, i + 2))
        }
      } else if (trimmed !== query) {
        terms.add(trimmed)
      }
    }
  }

  return [...terms].slice(0, 6)
}

function keywordTextExpression(): string {
  return "(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(tldr, '') || ' ' || content)"
}

function keywordScore(rank: number): number {
  return Math.max(0.4, Math.min(1, 1 - rank * 0.12))
}

function formatApiResult(query: string) {
  return (result: SearchResult) => ({
    title: result.title ?? result.source_url,
    category: result.type,
    url: result.source_url,
    slug: result.slug,
    score: result.relevance_score,
    evidence: formatSearchExcerpt(result.evidence_excerpt),
    reason: buildReason(query, `${result.title ?? ''} ${result.evidence_excerpt}`),
  })
}

function buildReason(query: string, evidence: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const matched = terms.filter(term => evidence.toLowerCase().includes(term)).slice(0, 3)
  return matched.length > 0 ? `matched: ${matched.join(', ')}` : 'semantic/hybrid retrieval match'
}

function summarizeRetrievalMetrics(metrics: SearchMetrics[]) {
  if (metrics.length === 0) return undefined
  const shortCircuits = metrics.filter(metric => metric.skipped_vector)
  const vectorRuns = metrics.filter(metric => metric.vector_ms != null)
  const averageVectorMs = vectorRuns.length > 0
    ? Math.round(vectorRuns.reduce((sum, metric) => sum + (metric.vector_ms ?? 0), 0) / vectorRuns.length)
    : null

  return {
    searches: metrics.length,
    bm25_short_circuits: shortCircuits.length,
    bm25_short_circuit_hit_rate: shortCircuits.length / metrics.length,
    average_bm25_ms: Math.round(metrics.reduce((sum, metric) => sum + metric.bm25_ms, 0) / metrics.length),
    average_vector_ms: averageVectorMs,
    estimated_latency_saved_ms: averageVectorMs == null ? null : shortCircuits.length * averageVectorMs,
    details: metrics,
  }
}
