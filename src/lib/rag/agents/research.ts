import { searchBlogPosts } from '../tools/search-posts'
import { searchAbstractIndex } from '../tools/search-abstract-index'
import { searchDocs } from '../tools/search-docs'
import { pageIndexSearch } from '../tools/pageindex'
import { searchExternalTools } from '../tools/external-search'
import type { GraphState, SearchResult } from '../state'
import { collectSearchMetrics } from '../tools/hybrid-search'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { invokeModel, resolveModelRoute, type ProviderApiKeys } from '../model'

async function generateQueryAlternatives(
  state: GraphState,
  query: string,
  maxQueries: number,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<string[]> {
  const maxTokens = options?.maxTokens ?? 256
  const { response } = await invokeModel(state.config, 'research', [
    new SystemMessage(`Generate up to ${maxQueries} diverse search rewrites for a blog/documentation RAG system.
Return JSON only: {"queries":["..."]}`),
    new HumanMessage(query),
  ], maxTokens, options?.apiKeys)

  try {
    const parsed = JSON.parse(String(response.content))
    return Array.isArray(parsed.queries)
      ? parsed.queries.filter((item: unknown) => typeof item === 'string' && item.trim().length > 0).slice(0, maxQueries)
      : []
  } catch {
    return []
  }
}

async function generateHydeQuery(
  state: GraphState,
  query: string,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<string | null> {
  const maxTokens = options?.maxTokens ?? 256
  const { response } = await invokeModel(state.config, 'research', [
    new SystemMessage('Write a short hypothetical answer paragraph that would help retrieve the right supporting documents. Return plain text only.'),
    new HumanMessage(query),
  ], maxTokens, options?.apiKeys)

  const content = String(response.content ?? '').trim()
  return content.length > 0 ? content : null
}

function mergeUniqueResults(results: SearchResult[]): SearchResult[] {
  const merged = new Map<string, SearchResult>()

  for (const result of results) {
    const existing = merged.get(result.chunk_id)
    if (!existing || result.relevance_score > existing.relevance_score) {
      merged.set(result.chunk_id, result)
    }
  }

  return [...merged.values()]
}

export async function researchNode(
  state: GraphState,
  options?: {
    apiKeys?: ProviderApiKeys
    maxTokens?: number
  }
): Promise<Partial<GraphState>> {
  const maxTokens = options?.maxTokens ?? 2048
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const baseQuery = state.plan.subtasks.length > 0
    ? `${query} ${state.plan.subtasks.join(' ')}`
    : query

  const searchQueries = [baseQuery]

  if (state.config.hydeEnabled && state.plan.complexity !== 'simple') {
    const hydeQuery = await generateHydeQuery(state, baseQuery, options).catch(() => null)
    if (hydeQuery) searchQueries.push(hydeQuery)
  }

  if (state.config.multiQueryEnabled && state.plan.complexity === 'complex') {
    const alternates = await generateQueryAlternatives(state, baseQuery, 2, options).catch(() => [])
    searchQueries.push(...alternates)
  }

  const queryVariants = Array.from(new Set(searchQueries.map(item => item.trim()).filter(Boolean)))

  const webSearchResults = state.config.searchToolsEnabled
    ? await searchExternalTools({
      query: baseQuery,
      limit: state.config.searchToolMaxResults,
      timeoutMs: state.config.searchToolTimeoutMs,
      providers: state.config.searchToolProviders,
      apiKeys: options?.apiKeys,
    }).catch(() => [] as SearchResult[])
    : ([] as SearchResult[])

  const perQueryResults = await Promise.all(queryVariants.map(async searchQuery => {
    const [abstractResults, postResults, docResults] = await Promise.all([
      state.plan.complexity === 'simple'
        ? Promise.resolve([] as SearchResult[])
        : searchAbstractIndex({ query: searchQuery, limit: 4 }).catch(() => [] as SearchResult[]),
      searchBlogPosts({
        query: searchQuery,
        limit: 8,
        shortCircuit: state.config.bm25ShortCircuitEnabled,
      }).catch(() => [] as SearchResult[]),
      searchDocs({
        query: searchQuery,
        limit: 5,
        shortCircuit: state.config.bm25ShortCircuitEnabled,
      }).catch(() => [] as SearchResult[]),
    ])

    return {
      results: [
        ...(abstractResults as SearchResult[]),
        ...(postResults as SearchResult[]),
        ...(docResults as SearchResult[]),
      ],
      metrics: collectSearchMetrics([postResults as SearchResult[], docResults as SearchResult[]]),
    }
  }))

  const broadResults = mergeUniqueResults([
    ...perQueryResults.flatMap(item => item.results),
    ...webSearchResults,
  ])
  const pageIndexResults = state.config.pageIndexEnabled && state.plan.complexity === 'complex'
    ? (await Promise.all(
      broadResults
        .filter(result => result.type === 'doc' || result.type === 'post')
        .slice(0, 3)
        .map(result => pageIndexSearch({
          query: baseQuery,
          seed: result,
          maxSteps: state.config.pageIndexMaxSteps,
          limit: 2,
        }).catch(() => [] as SearchResult[]))
    )).flat()
    : []

  const allResults = mergeUniqueResults([...broadResults, ...pageIndexResults])

  return {
    search_results: allResults,
    retrieval_metrics: perQueryResults.flatMap(item => item.metrics),
    model_usage: state.config.hydeEnabled || state.config.multiQueryEnabled
      ? [...state.model_usage, { stage: 'research', ...resolveModelRoute(state.config, 'research') }]
      : state.model_usage,
  }
}
