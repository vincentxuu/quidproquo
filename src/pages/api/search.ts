export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { searchBlogPosts } from '../../lib/retrieval/tools/search-posts'
import { searchDocs } from '../../lib/retrieval/tools/search-docs'
import { searchAiSearch } from '../../lib/retrieval/tools/ai-search'
import { getSearchMetrics, weightedReciprocalRankFuse } from '../../lib/retrieval/tools/hybrid-search'
import type { SearchMetrics } from '../../lib/retrieval/tools/hybrid-search'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'
import { dedupeSearchResultsByUrl, formatSearchExcerpt } from '../../lib/retrieval/search-result-format'
import type { SearchResult } from '../../lib/retrieval/state'
import type { Env } from '@/lib/config/env'
import { json } from '@/lib/api/response'
import { getSettings } from '@/lib/db/settings-store'

type SearchLang = 'zh-TW' | 'en'
type SearchMode = 'keyword' | 'hybrid' | 'rag'
type RetrievalSourceId = 'd1Keyword' | 'vectorizeSemantic' | 'cloudflareAiSearch'

interface RetrievalSourceConfig {
  enabled: boolean
  visible: boolean
  shadow: boolean
  weight: number
  timeoutMs: number
}

interface SearchPageSettings {
  enabled: boolean
  defaultMode: SearchMode
  dailyLimit: number
  sources: RetrievalSourceId[]
  aiSearchInstance?: string
  aiSearchMetadataFiltersEnabled: boolean
  sourceConfig: Record<RetrievalSourceId, RetrievalSourceConfig>
}

interface SourceRun {
  id: RetrievalSourceId
  config: RetrievalSourceConfig
  results: SearchResult[]
  metrics: SearchMetrics[]
  error?: string
  timeout?: boolean
}

const SOURCE_IDS = ['d1Keyword', 'vectorizeSemantic', 'cloudflareAiSearch'] as const
const SEARCH_PAGE_SETTINGS_KEYS = [
  'search_page_enabled',
  'search_page_default_mode',
  'search_page_sources',
  'search_page_source_d1_keyword_enabled',
  'search_page_source_d1_keyword_visible',
  'search_page_source_d1_keyword_shadow',
  'search_page_source_d1_keyword_weight',
  'search_page_source_d1_keyword_timeout_ms',
  'search_page_source_vectorize_enabled',
  'search_page_source_vectorize_visible',
  'search_page_source_vectorize_shadow',
  'search_page_source_vectorize_weight',
  'search_page_source_vectorize_timeout_ms',
  'search_page_source_ai_search_enabled',
  'search_page_source_ai_search_visible',
  'search_page_source_ai_search_shadow',
  'search_page_source_ai_search_weight',
  'search_page_source_ai_search_timeout_ms',
  'search_page_daily_limit',
  'rag_search_daily_limit',
  'rag_ai_search_instance',
  'rag_ai_search_metadata_filters_enabled',
] as const

const LEGACY_SETTINGS_TABLE = { tableName: 'settings' as const }

export const GET: APIRoute = async ({ request, clientAddress }) => {
  const url = new URL(request.url)
  const query = url.searchParams.get('q')?.trim() ?? ''
  const rawMode = url.searchParams.get('mode')
  const mode = parseSearchMode(rawMode, 'keyword')
  const lang = parseSearchLang(url.searchParams.get('lang'))
  const limit = parseBoundedInteger(url.searchParams.get('limit'), 10, 1, 50)
  const offset = parseBoundedInteger(url.searchParams.get('offset'), 0, 0, 500)

  if (!query) {
    return json({ mode, query, lang, results: [], total: 0, offset, limit, hasMore: false })
  }

  const settings = await loadSearchPageSettings()
  const resolvedMode = parseSearchMode(rawMode, settings.defaultMode)
  const db = (env as unknown as Env).DB

  if (settings.enabled && (resolvedMode === 'hybrid' || resolvedMode === 'rag')) {
    const rateResult = await checkAndIncrementRateLimit(
      `rag-search:${clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'}`,
      settings.dailyLimit
    )
    if (!rateResult.allowed) {
      return json(
        { error: 'rate_limit', message: `Daily RAG search limit reached. Resets at ${rateResult.resetAt}` },
        429
      )
    }

    const fetchLimit = Math.min(500, limit + offset)
    const [sourceRuns, keywordTotal] = await Promise.all([
      runSearchSources({ query, lang, mode: resolvedMode, fetchLimit, settings }),
      countKeywordPosts(db, query, lang).catch(() => 0),
    ])
    const visibleRuns = sourceRuns.filter(run => run.config.visible && !run.config.shadow)
    const fused = weightedReciprocalRankFuse(
      visibleRuns.map(run => ({ results: run.results, weight: run.config.weight })),
      fetchLimit * 2
    )
    const merged = dedupeSearchResultsByUrl(fused)
      .sort((a, b) => b.relevance_score - a.relevance_score)
    const total = Math.max(merged.length, keywordTotal)
    const paged = merged.slice(offset, offset + limit)

    return json({
      mode: resolvedMode,
      query,
      lang,
      results: paged.map(formatApiResult(query)),
      total,
      offset,
      limit,
      hasMore: offset + limit < total && offset + limit < 500,
      metrics: summarizeRetrievalMetrics(sourceRuns),
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

function parseSearchMode(raw: string | null, fallback: SearchMode): SearchMode {
  if (raw === 'keyword' || raw === 'hybrid' || raw === 'rag') return raw
  return fallback
}

function parseBoundedInteger(raw: string | null, fallback: number, min: number, max: number): number {
  const value = Number(raw ?? fallback)
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.floor(value)))
}

async function loadSearchPageSettings(): Promise<SearchPageSettings> {
  const db = (env as unknown as Env).DB
  const rows = await getSettings(db, SEARCH_PAGE_SETTINGS_KEYS, LEGACY_SETTINGS_TABLE)
  return {
    enabled: parseBooleanSetting(rows.get('search_page_enabled'), true),
    defaultMode: parseSearchMode(rows.get('search_page_default_mode') ?? null, 'keyword'),
    dailyLimit: parseBoundedInteger(rows.get('search_page_daily_limit') ?? rows.get('rag_search_daily_limit') ?? null, 20, 1, 500),
    sources: parseSourceList(rows.get('search_page_sources')),
    aiSearchInstance: rows.get('rag_ai_search_instance') || (env as unknown as Env).AI_SEARCH_INSTANCE,
    aiSearchMetadataFiltersEnabled: parseBooleanSetting(rows.get('rag_ai_search_metadata_filters_enabled'), true),
    sourceConfig: {
      d1Keyword: parseSourceConfig(rows, 'search_page_source_d1_keyword', {
        enabled: true,
        visible: true,
        shadow: false,
        weight: 1.1,
        timeoutMs: 500,
      }),
      vectorizeSemantic: parseSourceConfig(rows, 'search_page_source_vectorize', {
        enabled: true,
        visible: true,
        shadow: false,
        weight: 1,
        timeoutMs: 2500,
      }),
      cloudflareAiSearch: parseSourceConfig(rows, 'search_page_source_ai_search', {
        enabled: false,
        visible: false,
        shadow: true,
        weight: 1,
        timeoutMs: 1500,
      }),
    },
  }
}

function parseBooleanSetting(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value === '') return fallback
  return value === '1' || value.toLowerCase() === 'true'
}

function parseNumberSetting(value: string | undefined, fallback: number, min: number, max: number): number {
  return parseBoundedInteger(value ?? null, fallback, min, max)
}

function parseSourceList(value: string | undefined): RetrievalSourceId[] {
  if (!value) return ['d1Keyword', 'vectorizeSemantic', 'cloudflareAiSearch']
  return value
    .split(',')
    .map(source => source.trim())
    .filter((source): source is RetrievalSourceId => (SOURCE_IDS as readonly string[]).includes(source))
}

function parseSourceConfig(
  rows: Map<string, string>,
  prefix: string,
  defaults: RetrievalSourceConfig
): RetrievalSourceConfig {
  return {
    enabled: parseBooleanSetting(rows.get(`${prefix}_enabled`), defaults.enabled),
    visible: parseBooleanSetting(rows.get(`${prefix}_visible`), defaults.visible),
    shadow: parseBooleanSetting(rows.get(`${prefix}_shadow`), defaults.shadow),
    weight: parseFloatSetting(rows.get(`${prefix}_weight`), defaults.weight, 0, 10),
    timeoutMs: parseNumberSetting(rows.get(`${prefix}_timeout_ms`), defaults.timeoutMs, 100, 10000),
  }
}

function parseFloatSetting(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value ?? fallback)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

async function runSearchSources(args: {
  query: string
  lang: SearchLang
  mode: SearchMode
  fetchLimit: number
  settings: SearchPageSettings
}): Promise<SourceRun[]> {
  const orderedSources = args.settings.sources
    .map(id => ({ id, config: args.settings.sourceConfig[id] }))
    .filter(source => source.config.enabled)

  const runs = await Promise.all(orderedSources.map(source => runSearchSource(source.id, source.config, args)))
  if (runs.some(run => run.config.visible && !run.config.shadow && run.results.length > 0)) return runs

  const keywordConfig = args.settings.sourceConfig.d1Keyword
  if (!runs.some(run => run.id === 'd1Keyword')) {
    const fallbackConfig = { ...keywordConfig, enabled: true, visible: true, shadow: false }
    return [...runs, await runSearchSource('d1Keyword', fallbackConfig, args)]
  }

  return runs
}

async function runSearchSource(
  id: RetrievalSourceId,
  config: RetrievalSourceConfig,
  args: {
    query: string
    lang: SearchLang
    mode: SearchMode
    fetchLimit: number
    settings: SearchPageSettings
  }
): Promise<SourceRun> {
  try {
    const output = await withSourceTimeout(runRawSearchSource(id, args), config.timeoutMs)
    return {
      id,
      config,
      results: output.results,
      metrics: output.metrics,
    }
  } catch (error) {
    return {
      id,
      config,
      results: [],
      metrics: [],
      error: error instanceof Error ? error.message : 'search source failed',
      timeout: error instanceof Error && error.name === 'SearchSourceTimeoutError',
    }
  }
}

async function runRawSearchSource(
  id: RetrievalSourceId,
  args: {
    query: string
    lang: SearchLang
    mode: SearchMode
    fetchLimit: number
    settings: SearchPageSettings
  }
): Promise<{ results: SearchResult[]; metrics: SearchMetrics[] }> {
  const db = (env as unknown as Env).DB
  if (id === 'd1Keyword') {
    return {
      results: await searchKeywordPosts(db, args.query, args.lang, args.fetchLimit, 0),
      metrics: [],
    }
  }
  if (id === 'vectorizeSemantic') {
    const [posts, docs] = await Promise.all([
      searchBlogPosts({
        query: args.query,
        lang: args.lang,
        limit: args.fetchLimit,
        shortCircuit: args.mode === 'hybrid',
      }),
      args.mode === 'rag'
        ? searchDocs({ query: args.query, limit: 5, shortCircuit: false })
        : Promise.resolve([]),
    ])
    return {
      results: dedupeSearchResultsByUrl([...posts, ...docs]),
      metrics: [getSearchMetrics(posts), getSearchMetrics(docs)]
        .filter((metric): metric is SearchMetrics => Boolean(metric)),
    }
  }
  const results = await searchAiSearch({
    query: args.query,
    lang: args.lang,
    limit: args.fetchLimit,
    timeoutMs: args.settings.sourceConfig.cloudflareAiSearch.timeoutMs,
    instanceName: args.settings.aiSearchInstance,
    metadataFiltersEnabled: args.settings.aiSearchMetadataFiltersEnabled,
  })
  return {
    results,
    metrics: [getSearchMetrics(results)].filter((metric): metric is SearchMetrics => Boolean(metric)),
  }
}

function withSourceTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) return promise
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const error = new Error('search source timed out')
      error.name = 'SearchSourceTimeoutError'
      reject(error)
    }, timeoutMs)
  })
  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle)
  })
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

function summarizeRetrievalMetrics(sourceRuns: SourceRun[]) {
  const metrics = sourceRuns
    .flatMap(run => run.metrics)
  if (sourceRuns.length === 0) return undefined
  const shortCircuits = metrics.filter(metric => metric.skipped_vector)
  const vectorRuns = metrics.filter(metric => metric.vector_ms != null)
  const averageVectorMs = vectorRuns.length > 0
    ? Math.round(vectorRuns.reduce((sum, metric) => sum + (metric.vector_ms ?? 0), 0) / vectorRuns.length)
    : null

  return {
    searches: metrics.length,
    bm25_short_circuits: shortCircuits.length,
    bm25_short_circuit_hit_rate: metrics.length > 0 ? shortCircuits.length / metrics.length : 0,
    average_bm25_ms: metrics.length > 0
      ? Math.round(metrics.reduce((sum, metric) => sum + metric.bm25_ms, 0) / metrics.length)
      : null,
    average_vector_ms: averageVectorMs,
    estimated_latency_saved_ms: averageVectorMs == null ? null : shortCircuits.length * averageVectorMs,
    sources: sourceRuns.map(run => ({
      id: run.id,
      enabled: run.config.enabled,
      visible: run.config.visible,
      shadow: run.config.shadow,
      weight: run.config.weight,
      timeout_ms: run.config.timeoutMs,
      result_count: run.results.length,
      error: run.error,
      timeout: run.timeout,
    })),
    details: metrics,
  }
}
