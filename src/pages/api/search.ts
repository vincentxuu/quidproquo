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
import { countKeywordPosts, searchKeywordPosts } from '../../lib/retrieval/tools/keyword-posts'
import { assessSearchDegradation, needsKeywordFallback } from '../../lib/retrieval/search-degradation'
import type { DegradationSourceRun } from '../../lib/retrieval/search-degradation'
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
  /** Answered inside budget but dropped its vector stage. */
  partial?: boolean
  /** Re-run of the keyword source after every user-facing source came back empty. */
  fallback?: boolean
}

const SOURCE_IDS = ['d1Keyword', 'vectorizeSemantic', 'cloudflareAiSearch'] as const
/** Budget for the rescue keyword run; FTS is ~100ms warm, this only guards a cold D1. */
const KEYWORD_FALLBACK_TIMEOUT_MS = 3000
/** Headroom between the vector-stage deadline and the source's outer timeout. */
const VECTOR_DEADLINE_MARGIN_MS = 150
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

    // Sources always fetch from 0; paging happens once on the fused list below.
    // (Passing `offset` down as well used to skip 2×offset rows on "load more".)
    const fetchLimit = Math.min(500, limit + offset)
    const [sourceRuns, keywordTotal] = await Promise.all([
      runSearchSources({ query, lang, mode: resolvedMode, fetchLimit, settings, offset: 0 }),
      countKeywordPosts(db, { query, lang }).catch(() => 0),
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
    const degradation = assessSearchDegradation(sourceRuns.map(toDegradationRun))

    return json({
      mode: resolvedMode,
      query,
      lang,
      results: paged.map(formatApiResult(query)),
      total,
      offset,
      limit,
      hasMore: offset + limit < total && offset + limit < 500,
      degraded: degradation.degraded,
      degradedSources: degradation.sources,
      metrics: summarizeRetrievalMetrics(sourceRuns),
    })
  }

  const [keywordResults, total] = await Promise.all([
    searchKeywordPosts(db, { query, lang, limit, offset }),
    countKeywordPosts(db, { query, lang }),
  ])

  return json({
    mode: 'keyword',
    query,
    lang,
    total,
    offset,
    limit,
    hasMore: offset + limit < total,
    degraded: false,
    degradedSources: [],
    results: keywordResults.map(formatApiResult(query)),
  })
}

function toDegradationRun(run: SourceRun): DegradationSourceRun {
  return {
    id: run.id,
    enabled: run.config.enabled,
    visible: run.config.visible,
    shadow: run.config.shadow,
    resultCount: run.results.length,
    timeout: run.timeout,
    error: run.error,
    partial: run.partial,
  }
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
  const rows = await getSettings(db, SEARCH_PAGE_SETTINGS_KEYS)
  return {
    enabled: parseBooleanSetting(rows.get('search_page_enabled'), true),
    defaultMode: parseSearchMode(rows.get('search_page_default_mode') ?? null, 'keyword'),
    dailyLimit: parseBoundedInteger(rows.get('search_page_daily_limit') ?? rows.get('rag_search_daily_limit') ?? null, 200, 1, 500),
    sources: parseSourceList(rows.get('search_page_sources')),
    aiSearchInstance: rows.get('rag_ai_search_instance') || (env as unknown as Env).AI_SEARCH_INSTANCE,
    aiSearchMetadataFiltersEnabled: parseBooleanSetting(rows.get('rag_ai_search_metadata_filters_enabled'), true),
    sourceConfig: {
      d1Keyword: parseSourceConfig(rows, 'search_page_source_d1_keyword', {
        enabled: true,
        visible: true,
        shadow: false,
        weight: 1.1,
        timeoutMs: 800,
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
  offset: number
}): Promise<SourceRun[]> {
  const orderedSources = args.settings.sources
    .map(id => ({ id, config: args.settings.sourceConfig[id] }))
    .filter(source => source.config.enabled)

  const runs = await Promise.all(orderedSources.map(source => runSearchSource(source.id, source.config, args)))
  if (!needsKeywordFallback(runs.map(toDegradationRun))) return runs

  // Every user-facing source came back empty and the keyword source itself
  // timed out, errored, or never ran: retry it with a generous budget rather
  // than returning nothing for a query that has hundreds of matches.
  const fallbackConfig: RetrievalSourceConfig = {
    ...args.settings.sourceConfig.d1Keyword,
    enabled: true,
    visible: true,
    shadow: false,
    timeoutMs: KEYWORD_FALLBACK_TIMEOUT_MS,
  }
  const fallbackRun = { ...(await runSearchSource('d1Keyword', fallbackConfig, args)), fallback: true }
  return [...runs.filter(run => run.id !== 'd1Keyword'), fallbackRun]
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
    offset: number
  }
): Promise<SourceRun> {
  try {
    const output = await withSourceTimeout(runRawSearchSource(id, config, args), config.timeoutMs)
    return {
      id,
      config,
      results: output.results,
      metrics: output.metrics,
      partial: output.metrics.some(metric => metric.vector_timed_out) || undefined,
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
  config: RetrievalSourceConfig,
  args: {
    query: string
    lang: SearchLang
    mode: SearchMode
    fetchLimit: number
    settings: SearchPageSettings
    offset: number
  }
): Promise<{ results: SearchResult[]; metrics: SearchMetrics[] }> {
  const db = (env as unknown as Env).DB
  if (id === 'd1Keyword') {
    return {
      results: await searchKeywordPosts(db, {
        query: args.query,
        lang: args.lang,
        limit: args.fetchLimit,
        offset: args.offset,
      }),
      metrics: [],
    }
  }
  if (id === 'vectorizeSemantic') {
    // Hand the post search a deadline just inside our outer timeout so a slow
    // embedding call degrades to BM25+metadata instead of losing the whole source.
    const deadlineAt = config.timeoutMs > 0
      ? Date.now() + Math.max(0, config.timeoutMs - VECTOR_DEADLINE_MARGIN_MS)
      : undefined
    const [posts, docs] = await Promise.all([
      searchBlogPosts({
        query: args.query,
        lang: args.lang,
        limit: args.fetchLimit,
        shortCircuit: args.mode === 'hybrid',
        deadlineAt,
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
      partial: run.partial,
      fallback: run.fallback,
    })),
    details: metrics,
  }
}
