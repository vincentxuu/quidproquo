import { searchBlogPosts } from '../tools/search-posts'
import { searchAbstractIndex } from '../tools/search-abstract-index'
import { searchDocs } from '../tools/search-docs'
import { pageIndexSearch } from '../tools/pageindex'
import { searchExternalTools } from '../tools/external-search'
import type { GraphState, SearchResult } from '../state'
import { collectSearchMetrics, type SearchMetrics } from '../tools/hybrid-search'
import { HumanMessage, SystemMessage, type BaseMessageLike } from '@langchain/core/messages'
import { invokeModel, resolveModelRoute, type ProviderApiKeys } from '../model'
import { defineAgent } from '../../agent-os/access'

type SearchProfile = {
  maxAbstractResults?: number
  maxPostResults?: number
  maxDocResults?: number
  maxWebSearchResults?: number
  maxPageIndexSeeds?: number
}

type ResearchModelResult = Awaited<ReturnType<typeof invokeModel>>

type SearchResultWithMetrics = {
  results: SearchResult[]
  metrics?: SearchMetrics | null
}

type ResearchRuntime = {
  modelInvoke: (messages: BaseMessageLike[], maxTokens: number) => Promise<ResearchModelResult>
  searchExternal: (input: Parameters<typeof searchExternalTools>[0]) => Promise<SearchResult[]>
  searchAbstract: (input: Parameters<typeof searchAbstractIndex>[0]) => Promise<SearchResult[]>
  searchPosts: (input: Parameters<typeof searchBlogPosts>[0]) => Promise<SearchResultWithMetrics>
  searchDocs: (input: Parameters<typeof searchDocs>[0]) => Promise<SearchResultWithMetrics>
  searchPageIndex: (input: Parameters<typeof pageIndexSearch>[0]) => Promise<SearchResult[]>
}

type ResearchRunOptions = {
  apiKeys?: ProviderApiKeys
  maxTokens?: number
  maxSearchCalls?: number
  searchProfile?: SearchProfile
  skillInstructions?: string
}

interface AgentRuntimeOptions {
  providerApiKeys?: ProviderApiKeys
}

interface AgentRuntime {
  syscallContext: Parameters<import('../../agent-os/kernel').AgentOsKernel['syscall']>[0]
  syscall: import('../../agent-os/kernel').AgentOsKernel['syscall']
  runtimeOptions?: AgentRuntimeOptions
}

function clampProfileInt(raw: unknown, fallback: number, min: number, max: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(min, Math.min(max, Math.round(raw)))
  }
  return fallback
}

async function generateQueryAlternatives(
  query: string,
  maxQueries: number,
  runtime: Pick<ResearchRuntime, 'modelInvoke'>,
  options?: Pick<ResearchRunOptions, 'maxTokens' | 'skillInstructions'>
): Promise<string[]> {
  const maxTokens = options?.maxTokens ?? 256
  const { response } = await runtime.modelInvoke([
    new SystemMessage(`Generate up to ${maxQueries} diverse search rewrites for a blog/documentation RAG system.
${options?.skillInstructions ? `\nAgent skill instructions:\n${options.skillInstructions}\n` : ''}
Return JSON only: {"queries":["..."]}`),
    new HumanMessage(query),
  ], maxTokens)

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
  query: string,
  runtime: Pick<ResearchRuntime, 'modelInvoke'>,
  options?: Pick<ResearchRunOptions, 'maxTokens' | 'skillInstructions'>
): Promise<string | null> {
  const maxTokens = options?.maxTokens ?? 256
  const { response } = await runtime.modelInvoke([
    new SystemMessage(`Write a short hypothetical answer paragraph that would help retrieve the right supporting documents.
${options?.skillInstructions ? `\nAgent skill instructions:\n${options.skillInstructions}\n` : ''}
Return plain text only.`),
    new HumanMessage(query),
  ], maxTokens)

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
  options?: ResearchRunOptions
): Promise<Partial<GraphState>> {
  return runResearch(state, options, createLegacyResearchRuntime(state, options))
}

export const researchAgent = defineAgent<GraphState, Partial<GraphState>>({
  id: 'research',
  version: 1,
  displayName: 'Research',
  description: 'Retrieves local and external evidence for RAG answers.',
  syscalls: ['model.invoke', 'memory.read', 'memory.write', 'search.external', 'search.posts', 'search.abstract-index', 'search.docs', 'search.pageindex', 'post.get-detail'],
  memoryScopes: ['agent', 'session'],
  secrets: ['TAVILY_API_KEY', 'EXA_API_KEY'],
  outboundDomains: ['*.tavily.com', '*.exa.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,
  async run(state, runtime) {
    const { syscallContext, syscall, runtimeOptions } = runtime as AgentRuntime
    return runResearch(state, {
      apiKeys: runtimeOptions?.providerApiKeys,
    }, createSyscallResearchRuntime(state, syscallContext, syscall, runtimeOptions?.providerApiKeys))
  },
})

async function runResearch(
  state: GraphState,
  options: ResearchRunOptions | undefined,
  runtime: ResearchRuntime
): Promise<Partial<GraphState>> {
  const maxSearchCalls = Math.max(1, Math.min(8, Math.round(options?.maxSearchCalls ?? 2)))
  const searchProfile = options?.searchProfile ?? {}
  const abstractLimit = clampProfileInt(searchProfile.maxAbstractResults, 4, 1, 20)
  const postLimit = clampProfileInt(searchProfile.maxPostResults, 8, 1, 30)
  const docLimit = clampProfileInt(searchProfile.maxDocResults, 5, 1, 30)
  const webLimit = clampProfileInt(searchProfile.maxWebSearchResults, state.config.searchToolMaxResults, 1, 20)
  const pageIndexSeedLimit = clampProfileInt(searchProfile.maxPageIndexSeeds, 3, 1, 6)
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage?.content === 'string' ? lastMessage.content : ''

  const baseQuery = state.plan.subtasks.length > 0
    ? `${query} ${state.plan.subtasks.join(' ')}`
    : query

  const searchQueries = [baseQuery]

  if (state.config.hydeEnabled && state.plan.complexity !== 'simple' && maxSearchCalls >= 2) {
    const hydeQuery = await generateHydeQuery(baseQuery, runtime, options).catch(() => null)
    if (hydeQuery) searchQueries.push(hydeQuery)
  }

  if (state.config.multiQueryEnabled && state.plan.complexity === 'complex' && maxSearchCalls >= 3) {
    const remainingSlots = Math.max(1, maxSearchCalls - searchQueries.length)
    const alternates = await generateQueryAlternatives(baseQuery, remainingSlots, runtime, options).catch(() => [])
    searchQueries.push(...alternates)
  }

  const queryVariants = Array.from(new Set(searchQueries.map(item => item.trim()).filter(Boolean)))

  const webSearchResults = state.config.searchToolsEnabled
    ? await runtime.searchExternal({
      query: baseQuery,
      limit: webLimit,
      timeoutMs: state.config.searchToolTimeoutMs,
      providers: state.config.searchToolProviders,
      apiKeys: options?.apiKeys,
    }).catch(() => [] as SearchResult[])
    : ([] as SearchResult[])

  const perQueryResults = await Promise.all(queryVariants.map(async searchQuery => {
    const [abstractResults, postResults, docResults] = await Promise.all([
      state.plan.complexity === 'simple'
        ? Promise.resolve([] as SearchResult[])
        : runtime.searchAbstract({ query: searchQuery, limit: abstractLimit }).catch(() => [] as SearchResult[]),
      runtime.searchPosts({
        query: searchQuery,
        limit: postLimit,
        shortCircuit: state.config.bm25ShortCircuitEnabled,
      }).catch(() => ({ results: [] as SearchResult[], metrics: null })),
      runtime.searchDocs({
        query: searchQuery,
        limit: docLimit,
        shortCircuit: state.config.bm25ShortCircuitEnabled,
      }).catch(() => ({ results: [] as SearchResult[], metrics: null })),
    ])

    return {
      results: [
        ...(abstractResults as SearchResult[]),
        ...postResults.results,
        ...docResults.results,
      ],
      metrics: [
        postResults.metrics,
        docResults.metrics,
      ].filter((metric): metric is SearchMetrics => Boolean(metric)),
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
        .slice(0, pageIndexSeedLimit)
        .map(result => runtime.searchPageIndex({
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

function createLegacyResearchRuntime(
  state: GraphState,
  options?: ResearchRunOptions
): ResearchRuntime {
  return {
    modelInvoke(messages, maxTokens) {
      return invokeModel(state.config, 'research', messages, maxTokens, options?.apiKeys)
    },
    searchExternal(input) {
      return searchExternalTools(input)
    },
    searchAbstract(input) {
      return searchAbstractIndex(input)
    },
    async searchPosts(input) {
      const results = await searchBlogPosts(input)
      return { results, metrics: collectSearchMetrics([results])[0] }
    },
    async searchDocs(input) {
      const results = await searchDocs(input)
      return { results, metrics: collectSearchMetrics([results])[0] }
    },
    searchPageIndex(input) {
      return pageIndexSearch(input)
    },
  }
}

function createSyscallResearchRuntime(
  state: GraphState,
  syscallContext: AgentRuntime['syscallContext'],
  syscall: AgentRuntime['syscall'],
  apiKeys?: ProviderApiKeys
): ResearchRuntime {
  return {
    async modelInvoke(messages, maxTokens) {
      return await syscall(syscallContext, 'model.invoke', {
        config: state.config,
        stage: 'research',
        messages,
        maxTokens,
        apiKeys,
      }) as ResearchModelResult
    },
    async searchExternal(input) {
      const output = await syscall(syscallContext, 'search.external', input) as { results: SearchResult[] }
      return output.results
    },
    async searchAbstract(input) {
      const output = await syscall(syscallContext, 'search.abstract-index', input) as { results: SearchResult[] }
      return output.results
    },
    async searchPosts(input) {
      const output = await syscall(syscallContext, 'search.posts', input) as SearchResultWithMetrics
      return output
    },
    async searchDocs(input) {
      const output = await syscall(syscallContext, 'search.docs', input) as SearchResultWithMetrics
      return output
    },
    async searchPageIndex(input) {
      const output = await syscall(syscallContext, 'search.pageindex', input) as { results: SearchResult[] }
      return output.results
    },
  }
}
