import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import type { Env } from '@/lib/config/env'
import {
  attachSearchMetrics,
  BM25_SHORT_CIRCUIT_THRESHOLD,
} from './hybrid-search'

interface AiSearchOptions {
  query: string
  limit: number
  lang: 'zh-TW' | 'en'
  timeoutMs: number
  instanceName?: string
  metadataFiltersEnabled: boolean
}

interface TimeoutError extends Error {
  name: 'SearchTimeoutError'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function clampNumber(value: number, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.round(value)))
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  if (timeoutMs <= 0) return promise
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  return Promise.race([
    promise.finally(() => {
      if (timeoutHandle) clearTimeout(timeoutHandle)
    }),
    new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => {
        const err = new Error('AI Search request timed out') as TimeoutError
        err.name = 'SearchTimeoutError'
        reject(err)
      }, timeoutMs)
    }),
  ]) as Promise<T>
}

function toUrl(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('/')) return `https://quidproquo.cc${trimmed}`
  return `https://quidproquo.cc/${trimmed}`
}

function claimFromText(text: string): string {
  const trimmed = text.trim()
  const [sentence] = trimmed.split(/[.。!?！？]\s*/)
  return (sentence || trimmed || '').slice(0, 120)
}

function toSearchResult(row: {
  chunk_id: string
  text: string
  item: { key: string; metadata?: Record<string, unknown> }
  score: number
}): SearchResult {
  const metadata = row.item?.metadata
  const rawType = typeof metadata?.type === 'string' ? metadata.type.toLowerCase() : ''
  const safeType = rawType === 'post' || rawType === 'doc' || rawType === 'abstract' ? rawType : 'custom'
  const sourceUrl = toUrl(
    metadata?.url ?? metadata?.canonical_url ?? row.item?.key
  )
  const title = typeof metadata?.title === 'string'
    ? metadata.title
    : sourceUrl || row.chunk_id
  const dateValue = typeof metadata?.created_at === 'string'
    ? metadata.created_at
    : (typeof metadata?.date === 'string' ? metadata.date : '')

  return {
    claim: claimFromText(row.text),
    evidence_excerpt: row.text,
    source_url: sourceUrl || `https://quidproquo.cc/${row.chunk_id}`,
    chunk_id: row.chunk_id,
    date: dateValue ? dateValue.slice(0, 10) : '',
    relevance_score: clampScore(row.score),
    images: [],
    links: [],
    type: safeType as SearchResult['type'],
    slug: typeof metadata?.slug === 'string' ? metadata.slug : undefined,
    title,
  }
}

function resolveAiSearchBinding(): { instance: unknown; bindingType: 'instance' | 'namespace' } | null {
  const typed = env as unknown as Env
  const namespace = typed.AI_SEARCH_NAMESPACE ?? typed.AI_SEARCH
  if (!namespace) return null

  if (isRecord(namespace) && 'get' in namespace && typeof namespace.get === 'function') {
    return { instance: namespace, bindingType: 'namespace' }
  }

  return { instance: namespace, bindingType: 'instance' }
}

function resolveAiSearchInstance(options: AiSearchOptions) {
  const resolved = resolveAiSearchBinding()
  if (!resolved) return null

  if (resolved.bindingType === 'namespace') {
    const namespace = resolved.instance as { get: (name: string) => unknown }
    const instanceName = options.instanceName ?? (env as unknown as Env).AI_SEARCH_INSTANCE
    if (!instanceName) return null
    return namespace.get(instanceName)
  }

  return resolved.instance
}

export async function searchAiSearch({
  query,
  limit,
  lang,
  timeoutMs,
  instanceName,
  metadataFiltersEnabled,
}: AiSearchOptions): Promise<SearchResult[]> {
  const started = Date.now()
  const normalizedLimit = clampNumber(limit, 5, 1, 50)

  const searchInstance = resolveAiSearchInstance({ query, limit, lang, timeoutMs, instanceName, metadataFiltersEnabled })
  if (!searchInstance || typeof (searchInstance as { search: unknown }).search !== 'function') return []

  const requestFilters = metadataFiltersEnabled
    ? { filters: { lang: { $eq: lang } } }
    : undefined

  const request = {
    query,
    ai_search_options: {
      retrieval: {
        max_num_results: normalizedLimit,
        retrieval_type: 'hybrid',
        return_on_failure: true,
        ...(requestFilters ? requestFilters : {}),
      },
    },
  } as const

  const response = await withTimeout(
    (searchInstance as { search: (req: unknown) => Promise<{
      chunks: Array<{
        id: string
        text: string
        score: number
        item: { key: string; metadata?: Record<string, unknown> }
      }>
    }> })
      .search(request)
      .then((result) => result.chunks || []),
    timeoutMs
  )

  const results = response
    .map((chunk) => toSearchResult({ ...chunk, chunk_id: chunk.id, item: chunk.item ?? { key: chunk.id } }))
    .slice(0, normalizedLimit)

  const elapsed = Date.now() - started
  return attachSearchMetrics(results, {
    source: 'ai_search',
    query_kind: 'general',
    bm25_results: 0,
    vector_results: results.length,
    result_count: results.length,
    bm25_ms: 0,
    vector_ms: elapsed,
    total_ms: elapsed,
    skipped_vector: false,
    short_circuit_threshold: BM25_SHORT_CIRCUIT_THRESHOLD,
    estimated_latency_saved_ms: 0,
  })
}
