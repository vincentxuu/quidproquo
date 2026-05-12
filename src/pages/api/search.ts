export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { searchBlogPosts } from '../../lib/rag/tools/search-posts'
import { searchDocs } from '../../lib/rag/tools/search-docs'
import { getSearchMetrics } from '../../lib/rag/tools/hybrid-search'
import type { SearchMetrics } from '../../lib/rag/tools/hybrid-search'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ request, clientAddress }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim() ?? ''
  const mode = url.searchParams.get('mode') ?? 'keyword'
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get('limit') ?? '10')))

  if (!query) {
    return json({ mode, query, results: [] })
  }

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

    const [posts, docs] = await Promise.all([
      searchBlogPosts({ query, limit }).catch(() => []),
      mode === 'rag' ? searchDocs({ query, limit: 5 }).catch(() => []) : Promise.resolve([]),
    ])
    const metrics = [getSearchMetrics(posts), getSearchMetrics(docs)]
      .filter((metric): metric is SearchMetrics => Boolean(metric))

    const results = [...posts, ...docs]
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit)
      .map(result => ({
        title: result.title ?? result.source_url,
        category: result.type,
        url: result.source_url,
        slug: result.slug,
        score: result.relevance_score,
        evidence: result.evidence_excerpt,
        reason: buildReason(query, result.evidence_excerpt),
      }))

    return json({ mode, query, results, metrics: summarizeRetrievalMetrics(metrics) })
  }

  const db = (env as unknown as Env).DB
  const like = `%${query}%`
  const rows = await db.prepare(
    `SELECT slug, title, category, description, tldr
     FROM posts
     WHERE title LIKE ? OR description LIKE ? OR tldr LIKE ? OR content LIKE ?
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(like, like, like, like, limit).all<{
    slug: string
    title: string
    category: string
    description: string | null
    tldr: string | null
  }>()

  return json({
    mode: 'keyword',
    query,
    results: rows.results.map(row => ({
      title: row.title,
      category: row.category,
      url: `https://quidproquo.cc/posts/${row.slug}`,
      slug: row.slug,
      evidence: row.tldr ?? row.description ?? '',
      reason: 'keyword match',
    })),
  })
}

async function getSearchDailyLimit(): Promise<number> {
  const db = (env as unknown as Env).DB
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('rag_search_daily_limit')
    .first<{ value: string }>()
  return parseInt(row?.value ?? '20', 10)
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

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}
