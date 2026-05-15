import type { APIRoute } from 'astro'
import { HumanMessage } from '@langchain/core/messages'
import { initialState, type GraphState, type RagRuntimeConfig, type SearchResult } from '../../lib/rag/state'
import { verifySession } from '../../lib/auth/session'
import { plannerNode } from '../../lib/rag/agents/planner'
import { researchNode } from '../../lib/rag/agents/research'
import { writerNode } from '../../lib/rag/agents/writer'
import { criticNode } from '../../lib/rag/agents/critic'
import { resolveProviderApiKeys } from '../../lib/rag/provider-key-store'
import { loadRagSettings, withConfigOverrides } from '../../lib/rag/settings'
import { SUPPORTED_PROVIDERS } from '../../lib/rag/providers'
import type { ProviderApiKeys } from '../../lib/rag/model'

interface Env {
  URL: string
  DB?: D1Database
  SESSION?: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
}

type Provider = RagRuntimeConfig['defaultProvider']

type DeepResearchBody = {
  brief?: unknown
  config?: {
    model?: unknown
    maxQueries?: unknown
    maxTokens?: unknown
    providerPref?: unknown
    maxSearchCalls?: unknown
    tokenProfile?: unknown
    searchProfile?: unknown
    sourceProfile?: unknown
    enableFlags?: unknown
    searchToolProfile?: unknown
    searchToolProfiles?: unknown
    resultProfile?: unknown
  }
}

type StageTokenProfile = Partial<Record<'planner' | 'research' | 'writer' | 'critic', number>>
type SearchProfile = {
  maxAbstractResults?: number
  maxPostResults?: number
  maxDocResults?: number
  maxWebSearchResults?: number
  maxPageIndexSeeds?: number
}
type SourceProfile = {
  pageIndexMaxSteps?: number
}
type ResultProfile = {
  writerContextSources?: number
}
type SearchToolProfile = {
  providers?: string[]
  maxResults?: number
  timeoutMs?: number
  enabled?: boolean
}
type SearchToolProfiles = {
  planner?: SearchToolProfile
  research?: SearchToolProfile
  writer?: SearchToolProfile
  critic?: SearchToolProfile
}
type EnableFlags = {
  hydeEnabled?: boolean
  multiQueryEnabled?: boolean
  rerankerEnabled?: boolean
  searchToolsEnabled?: boolean
  bm25ShortCircuitEnabled?: boolean
  pageIndexEnabled?: boolean
  criticEnabled?: boolean
  plannerEnabled?: boolean
  researchEnabled?: boolean
  writerEnabled?: boolean
}

const MAX_QUERIES = 10
const MAX_TOKENS = 4096
const MAX_SEARCH_CALLS = 8
const DEFAULT_TOKENS = 2048

export const POST: APIRoute = async ({ request, env, cookies }) => {
  try {
    const sessionToken = cookies.get('session')?.value
    const authSuccess = sessionToken ? await verifySession(sessionToken) : false
    if (!authSuccess) {
      return new Response('Unauthorized', { status: 401 })
    }

    const payload = await request.json().catch(() => ({})) as DeepResearchBody
    const brief = typeof payload.brief === 'string' ? payload.brief.trim() : ''
    const userConfig = payload.config || {}

    if (!brief) {
      return new Response('Brief is required and must be a string', { status: 400 })
    }

    const maxQueries = clampInt(userConfig.maxQueries, 3, 1, MAX_QUERIES)
    const maxTokens = clampInt(userConfig.maxTokens, DEFAULT_TOKENS, 256, MAX_TOKENS)
    const maxSearchCalls = clampInt(userConfig.maxSearchCalls, 3, 1, MAX_SEARCH_CALLS)
    const tokenProfile = normalizeTokenProfile(userConfig.tokenProfile)
    const searchProfile = normalizeSearchProfile(userConfig.searchProfile)
    const sourceProfile = normalizeSourceProfile(userConfig.sourceProfile)
    const resultProfile = normalizeResultProfile(userConfig.resultProfile)
    const searchToolProfile = normalizeSearchToolProfile(userConfig.searchToolProfile)
    const searchToolProfiles = normalizeSearchToolProfiles(userConfig.searchToolProfiles)
    const enableFlags = normalizeEnableFlags(userConfig.enableFlags)
    const providerPref = normalizeProvider(typeof userConfig.providerPref === 'string' ? userConfig.providerPref : '')
    const preferredModel = typeof userConfig.model === 'string' ? userConfig.model.trim() : ''
    const isPlannerEnabled = enableFlags.plannerEnabled ?? true
    const isResearchEnabled = enableFlags.researchEnabled ?? true
    const isWriterEnabled = enableFlags.writerEnabled ?? true
    const isCriticEnabled = enableFlags.criticEnabled ?? true

    const reportId = `dr_report_${(typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`)}`
    const costKey = `dr_cost_${reportId}`

    const kv = (env as unknown as Env).DEEP_RESEARCH_KV ?? (env as unknown as Env).SESSION
    if (!kv) {
      return new Response(
        JSON.stringify({ error: 'Deep research KV namespace is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const apiKeys = await loadProviderKeys((env as unknown as Env).DB)
    const ragSettings = await safeLoadRagSettings((env as unknown as Env).DB)
    const provider = normalizeProvider(providerPref)
    const model = normalizeModel(preferredModel, ragSettings, provider)
    const resolvedResearchSearchTools = resolveSearchToolConfig({
      stage: 'research',
      globalProfile: searchToolProfile,
      stageProfiles: searchToolProfiles,
      globalSearchToolsEnabled: enableFlags.searchToolsEnabled ?? false,
      fallbackProviders: ragSettings.searchToolProviders,
      fallbackMaxResults: ragSettings.searchToolMaxResults,
      fallbackTimeoutMs: ragSettings.searchToolTimeoutMs,
    })
    const finalConfig: RagRuntimeConfig = withConfigOverrides(ragSettings, {
      ...enableFlags,
      searchToolsEnabled: resolvedResearchSearchTools.enabled,
      searchToolProviders: resolvedResearchSearchTools.providers,
      searchToolMaxResults: resolvedResearchSearchTools.maxResults,
      searchToolTimeoutMs: resolvedResearchSearchTools.timeoutMs,
      pageIndexMaxSteps: sourceProfile.pageIndexMaxSteps == null
        ? ragSettings.pageIndexMaxSteps
        : clampInt(sourceProfile.pageIndexMaxSteps, ragSettings.pageIndexMaxSteps, 1, 10),
      defaultProvider: provider,
      defaultModel: model,
    })

    const baseState = {
      ...initialState(),
      config: finalConfig,
      messages: [new HumanMessage(brief)],
    }

    const withSearchToolConfig = (stage: keyof SearchToolProfiles, state: GraphState): GraphState => {
      const resolved = resolveSearchToolConfig({
        stage,
        globalProfile: searchToolProfile,
        stageProfiles: searchToolProfiles,
        globalSearchToolsEnabled: finalConfig.searchToolsEnabled,
        fallbackProviders: finalConfig.searchToolProviders,
        fallbackMaxResults: finalConfig.searchToolMaxResults,
        fallbackTimeoutMs: finalConfig.searchToolTimeoutMs,
      })

      return {
        ...state,
        config: {
          ...state.config,
          searchToolsEnabled: resolved.enabled,
          searchToolProviders: resolved.providers,
          searchToolMaxResults: resolved.maxResults,
          searchToolTimeoutMs: resolved.timeoutMs,
        },
      }
    }

    const plannerResult = isPlannerEnabled ? await plannerNode(withSearchToolConfig('planner', baseState), {
      apiKeys,
      maxTokens: deriveStageTokens({
        stage: 'planner',
        baseTokens: maxTokens,
        override: tokenProfile.planner,
      }),
    }) : { plan: initialState().plan }
    const plan = plannerResult.plan ?? initialState().plan
    const subtasks = plan.subtasks?.length ? plan.subtasks : [brief]
    const selectedSubtasks = subtasks.slice(0, maxQueries)

    const notes: Record<string, SearchResult[]> = {}
    const allResults: SearchResult[] = []
    if (isResearchEnabled) {
      for (const question of selectedSubtasks) {
        const researchState = {
          ...baseState,
          messages: [new HumanMessage(question)],
          plan,
        } as GraphState

        const researchResult = await researchNode(withSearchToolConfig('research', researchState), {
          apiKeys,
          maxTokens: deriveStageTokens({
            stage: 'research',
            baseTokens: maxTokens,
            override: tokenProfile.research,
          }),
          maxSearchCalls,
          searchProfile,
        })
        const questionResults = researchResult.search_results ?? []
        allResults.push(...questionResults)
        notes[question] = questionResults
      }
    }

    const mergedResults = dedupeSearchResults(allResults)
    const writeState = {
      ...baseState,
      messages: [new HumanMessage(brief)],
      plan,
      search_results: mergedResults,
    } as GraphState
    let finalReport = `研究主題：${brief}\n\n${selectedSubtasks.join('\n')}`
    if (isWriterEnabled) {
      const writeResult = await writerNode(withSearchToolConfig('writer', writeState), {
        apiKeys,
        maxTokens: deriveStageTokens({
          stage: 'writer',
          baseTokens: maxTokens,
          override: tokenProfile.writer,
        }),
        resultProfile,
      })
      finalReport = typeof writeResult.final_response === 'string' ? writeResult.final_response : finalReport
    }

    if (isCriticEnabled && isWriterEnabled) {
      const critiqueState = {
        ...writeState,
        draft: finalReport,
      } as GraphState
      await criticNode(withSearchToolConfig('critic', critiqueState), {
        apiKeys,
        maxTokens: deriveStageTokens({
          stage: 'critic',
          baseTokens: maxTokens,
          override: tokenProfile.critic,
        }),
      })
    }

    await kv.put(reportId, finalReport)
    const reportUrl = `${env.URL}/api/deep-research/${reportId}`

    const currentCostStr = await kv.get(costKey)
    const currentCost = currentCostStr ? parseFloat(currentCostStr) : 0
    const estimatedCost = 0.5
    await kv.put(costKey, (currentCost + estimatedCost).toString())

    return new Response(JSON.stringify({
      runId: reportId,
      reportUrl,
      status: 'completed',
      summary: finalReport.slice(0, 200) + (finalReport.length > 200 ? '…' : ''),
      notes,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Deep research API error:', error)
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function dedupeSearchResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const deduped: SearchResult[] = []
  for (const result of results) {
    if (seen.has(result.chunk_id)) continue
    seen.add(result.chunk_id)
    deduped.push(result)
  }
  return deduped
}

function safeLoadRagSettings(db?: D1Database): Promise<RagRuntimeConfig> {
  if (!db) return Promise.resolve(initialState().config)
  try {
    return loadRagSettings()
  } catch {
    return Promise.resolve(initialState().config)
  }
}

function normalizeProvider(raw: string): Provider {
  const provider = raw.toLowerCase().trim()
  if (SUPPORTED_PROVIDERS.includes(provider as Provider)) return provider as Provider
  return SUPPORTED_PROVIDERS[0] ?? 'groq'
}

function normalizeModel(
  requestedModel: string,
  settings: RagRuntimeConfig,
  provider: Provider,
): string {
  if (requestedModel) {
    return requestedModel
  }
  if (provider === settings.defaultProvider && settings.defaultModel) {
    return settings.defaultModel
  }
  return defaultModelForProvider(provider)
}

function defaultModelForProvider(provider: Provider): string {
  if (provider === 'openai') return 'gpt-4.1-mini'
  if (provider === 'google') return 'gemini-2.0-flash'
  return 'llama-3.3-70b-versatile'
}

function clampInt(raw: unknown, fallback: number, min: number, max: number): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    const value = Math.round(raw)
    return Math.max(min, Math.min(max, value))
  }
  return fallback
}

async function loadProviderKeys(db?: D1Database): Promise<ProviderApiKeys> {
  if (!db) return {}
  return resolveProviderApiKeys(db)
}

function deriveTokenBudget(params: { stage: keyof typeof TOKEN_PROFILES; baseTokens: number }): number {
  const { stage, baseTokens } = params
  const profile = TOKEN_PROFILES[stage]
  return clampInt(
    Math.round(baseTokens * profile.multiplier),
    profile.min,
    profile.max,
  )
}

function deriveStageTokens(params: {
  stage: keyof typeof TOKEN_PROFILES
  baseTokens: number
  override?: number
}): number {
  const { stage, baseTokens, override } = params
  if (typeof override === 'number' && Number.isFinite(override)) {
    const profile = TOKEN_PROFILES[stage]
    return clampInt(Math.round(override), profile.min, profile.max)
  }
  return deriveTokenBudget({ stage, baseTokens })
}

function normalizeTokenProfile(tokenProfile: unknown): StageTokenProfile {
  const profile = tokenProfile as Record<string, unknown> | null
  if (!tokenProfile || typeof tokenProfile !== 'object' || tokenProfile === null || Array.isArray(tokenProfile)) {
    return {}
  }
  return {
    planner: typeof profile.planner === 'number' ? profile.planner : undefined,
    research: typeof profile.research === 'number' ? profile.research : undefined,
    writer: typeof profile.writer === 'number' ? profile.writer : undefined,
    critic: typeof profile.critic === 'number' ? profile.critic : undefined,
  } as Partial<Record<keyof typeof TOKEN_PROFILES, number>>
}

function normalizeSearchProfile(searchProfile: unknown): SearchProfile {
  const profile = searchProfile as Record<string, unknown> | null
  if (!searchProfile || typeof searchProfile !== 'object' || searchProfile === null || Array.isArray(searchProfile)) {
    return {}
  }

  return {
    maxAbstractResults: numberIfFinite(profile.maxAbstractResults),
    maxPostResults: numberIfFinite(profile.maxPostResults),
    maxDocResults: numberIfFinite(profile.maxDocResults),
    maxWebSearchResults: numberIfFinite(profile.maxWebSearchResults),
    maxPageIndexSeeds: numberIfFinite(profile.maxPageIndexSeeds),
  }
}

function normalizeSourceProfile(sourceProfile: unknown): SourceProfile {
  const profile = sourceProfile as Record<string, unknown> | null
  if (!sourceProfile || typeof sourceProfile !== 'object' || sourceProfile === null || Array.isArray(sourceProfile)) {
    return {}
  }

  return {
    pageIndexMaxSteps: numberIfFinite(profile.pageIndexMaxSteps),
  }
}

function normalizeResultProfile(resultProfile: unknown): ResultProfile {
  const profile = resultProfile as Record<string, unknown> | null
  if (!resultProfile || typeof resultProfile !== 'object' || resultProfile === null || Array.isArray(resultProfile)) {
    return {}
  }

  return {
    writerContextSources: numberIfFinite(profile.writerContextSources),
  }
}

function normalizeSearchToolProfile(searchToolProfile: unknown): SearchToolProfile {
  const profile = searchToolProfile as Record<string, unknown> | null
  if (!searchToolProfile || typeof searchToolProfile !== 'object' || searchToolProfile === null || Array.isArray(searchToolProfile)) {
    return {}
  }

  const rawProviders = Array.isArray(profile.providers)
    ? Array.from(new Set(profile.providers.map((provider) => String(provider ?? '').trim().toLowerCase()).filter(Boolean)))
    : []

  return {
    providers: rawProviders.length > 0 ? rawProviders : undefined,
    enabled: typeof profile.enabled === 'boolean' ? profile.enabled : undefined,
    maxResults: numberIfFinite(profile.maxResults),
    timeoutMs: numberIfFinite(profile.timeoutMs),
  }
}

function normalizeSearchToolProfiles(searchToolProfiles: unknown): SearchToolProfiles {
  const profiles = searchToolProfiles as Record<string, unknown> | null
  if (!searchToolProfiles || typeof searchToolProfiles !== 'object' || searchToolProfiles === null || Array.isArray(searchToolProfiles)) {
    return {}
  }
  return {
    planner: normalizeSearchToolProfile(profiles.planner),
    research: normalizeSearchToolProfile(profiles.research),
    writer: normalizeSearchToolProfile(profiles.writer),
    critic: normalizeSearchToolProfile(profiles.critic),
  }
}

function resolveSearchToolConfig(params: {
  stage: keyof SearchToolProfiles
  globalProfile: SearchToolProfile
  stageProfiles: SearchToolProfiles
  globalSearchToolsEnabled: boolean
  fallbackProviders: string[]
  fallbackMaxResults: number
  fallbackTimeoutMs: number
}) {
  const {
    stage,
    globalProfile,
    stageProfiles,
    globalSearchToolsEnabled,
    fallbackProviders,
    fallbackMaxResults,
    fallbackTimeoutMs,
  } = params
  const stageProfile = stageProfiles[stage] ?? {}
  const providers = stageProfile.providers?.length ? stageProfile.providers : (globalProfile.providers ?? fallbackProviders)
  const resolvedProfile = {
    enabled: typeof stageProfile.enabled === 'boolean' ? stageProfile.enabled : (globalSearchToolsEnabled || Boolean(globalProfile.enabled)),
    providers,
    maxResults: clampInt(stageProfile.maxResults ?? globalProfile.maxResults, fallbackMaxResults, 1, 20),
    timeoutMs: clampInt(stageProfile.timeoutMs ?? globalProfile.timeoutMs, fallbackTimeoutMs, 1000, 60000),
  }
  return {
    enabled: Boolean(resolvedProfile.enabled),
    providers: resolvedProfile.providers,
    maxResults: clampInt(resolvedProfile.maxResults, fallbackMaxResults, 1, 20),
    timeoutMs: clampInt(resolvedProfile.timeoutMs, fallbackTimeoutMs, 1000, 60000),
  }
}

function normalizeEnableFlags(rawFlags: unknown): EnableFlags {
  const flags = rawFlags as Record<string, unknown> | null
  if (!rawFlags || typeof rawFlags !== 'object' || rawFlags === null || Array.isArray(rawFlags)) {
    return {}
  }

  return {
    hydeEnabled: booleanIfBoolean(flags.hydeEnabled),
    multiQueryEnabled: booleanIfBoolean(flags.multiQueryEnabled),
    rerankerEnabled: booleanIfBoolean(flags.rerankerEnabled),
    searchToolsEnabled: booleanIfBoolean(flags.searchToolsEnabled),
    bm25ShortCircuitEnabled: booleanIfBoolean(flags.bm25ShortCircuitEnabled),
    pageIndexEnabled: booleanIfBoolean(flags.pageIndexEnabled),
    criticEnabled: booleanIfBoolean(flags.criticEnabled),
    plannerEnabled: booleanIfBoolean(flags.plannerEnabled),
    researchEnabled: booleanIfBoolean(flags.researchEnabled),
    writerEnabled: booleanIfBoolean(flags.writerEnabled),
  }
}

function booleanIfBoolean(raw: unknown): boolean | undefined {
  return typeof raw === 'boolean' ? raw : undefined
}

function numberIfFinite(raw: unknown): number | undefined {
  return typeof raw === 'number' && Number.isFinite(raw) ? Math.round(raw) : undefined
}

const TOKEN_PROFILES = {
  planner: {
    multiplier: 0.25,
    min: 256,
    max: 1024,
  },
  research: {
    multiplier: 0.5,
    min: 256,
    max: 2048,
  },
  writer: {
    multiplier: 1,
    min: 1024,
    max: 4096,
  },
  critic: {
    multiplier: 0.5,
    min: 512,
    max: 2048,
  },
} as const
