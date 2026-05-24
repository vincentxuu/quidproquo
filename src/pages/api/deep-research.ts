import type { APIRoute } from 'astro'
import { env as cloudflareEnv } from 'cloudflare:workers'
import { HumanMessage } from '@langchain/core/messages'
import { initialState, type GraphState, type RagRuntimeConfig, type SearchResult, type RagMessage } from '../../lib/rag/state'
import { verifySession } from '../../lib/auth/session'
import { plannerNode } from '../../lib/rag/agents/planner'
import { researchNode } from '../../lib/rag/nodes/research'
import { writerNode } from '../../lib/rag/agents/writer'
import { criticNode } from '../../lib/rag/agents/critic'
import { resolveProviderApiKeys } from '../../lib/rag/provider-key-store'
import { loadRagSettings, withConfigOverrides } from '../../lib/rag/settings'
import { SUPPORTED_PROVIDERS } from '../../lib/rag/providers'
import type { ProviderApiKeys } from '../../lib/rag/model'
import type { AgentSkill } from '../../lib/agent-skills'
import type { Env } from '@/lib/config/env'

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
    agentSkillsProfile?: unknown
    agentSkillsProfiles?: unknown
    agentSkillProfile?: unknown
    agentSkillProfiles?: unknown
    agentSkills?: unknown
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
type AgentSkillsProfile = {
  skills?: AgentSkill[]
}
type AgentSkillsProfiles = {
  planner?: AgentSkillsProfile
  research?: AgentSkillsProfile
  writer?: AgentSkillsProfile
  critic?: AgentSkillsProfile
}
type AgentSkillSpecEntry = {
  name: string
  description: string
  body?: string
}
type AgentSkillSpecs = {
  raw: string
  entries: AgentSkillSpecEntry[]
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
type DeepResearchStorageMode = 'auto' | 'd1' | 'deep_research_kv' | 'session'

const MAX_QUERIES = 10
const MAX_TOKENS = 4096
const MAX_SEARCH_CALLS = 8
const DEFAULT_TOKENS = 2048

export const POST: APIRoute = async (context) => {
  try {
    const { request, cookies } = context
    const routeEnv = (context as unknown as { env?: Env }).env
    const runtimeEnv = ((routeEnv as unknown as Env | undefined) ?? (cloudflareEnv as unknown as Env))
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
    const agentSkillsProfile = normalizeAgentSkillsProfile(userConfig.agentSkillsProfile ?? userConfig.agentSkillProfile)
    const agentSkillsProfiles = normalizeAgentSkillsProfiles(userConfig.agentSkillsProfiles ?? userConfig.agentSkillProfiles)
    const agentSkills = normalizeAgentSkills(userConfig.agentSkills)
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

    const db = runtimeEnv.DB
    const storageMode = await loadDeepResearchStorageMode(db)
    const storage = resolveDeepResearchStorage(runtimeEnv, storageMode)
    if (!storage.kv && !storage.db) {
      return new Response(
        JSON.stringify({ error: `Deep research storage is not configured for mode: ${storageMode}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const apiKeys = await loadProviderKeys(db)
    const ragSettings = await safeLoadRagSettings(db)
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
      messages: [new HumanMessage(brief)] as RagMessage[],
    }
    const skillInstructions = {
      planner: buildAgentSkillInstructions('planner', agentSkillsProfile, agentSkillsProfiles.planner, agentSkills),
      research: buildAgentSkillInstructions('research', agentSkillsProfile, agentSkillsProfiles.research, agentSkills),
      writer: buildAgentSkillInstructions('writer', agentSkillsProfile, agentSkillsProfiles.writer, agentSkills),
      critic: buildAgentSkillInstructions('critic', agentSkillsProfile, agentSkillsProfiles.critic, agentSkills),
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
        skillInstructions: skillInstructions.planner,
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
          messages: [new HumanMessage(question)] as RagMessage[],
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
        skillInstructions: skillInstructions.research,
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
        skillInstructions: skillInstructions.writer,
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
        skillInstructions: skillInstructions.critic,
      })
    }

    const summary = finalReport.slice(0, 200) + (finalReport.length > 200 ? '…' : '')
    const reportRecord = buildDeepResearchRecord({
      reportId,
      brief,
      finalReport,
      summary,
      provider,
      model,
      maxQueries,
      maxTokens,
      maxSearchCalls,
      enableFlags,
      tokenProfile,
      searchProfile,
      sourceProfile,
      resultProfile,
      searchToolProfile,
      searchToolProfiles,
      agentSkillsProfile,
      agentSkillsProfiles,
      agentSkills,
    })

    let cacheSaved = false
    let dbSaved = false
    try {
      if (storage.kv) {
        await storage.kv.put(reportId, finalReport)
        const currentCostStr = await storage.kv.get(costKey)
        const currentCost = currentCostStr ? parseFloat(currentCostStr) : 0
        const estimatedCost = 0.5
        await storage.kv.put(costKey, (currentCost + estimatedCost).toString())
        cacheSaved = true
      }
    } catch (error) {
      console.error('Deep research KV persistence failed:', error)
    }

    try {
      if (storage.db) {
        await saveDeepResearchReport(storage.db, reportRecord)
        dbSaved = true
      }
    } catch (error) {
      console.error('Deep research D1 persistence failed:', error)
    }

    if (!cacheSaved && !dbSaved) {
      return new Response(
        JSON.stringify({ error: 'Deep research result persistence failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const origin = runtimeEnv.URL || new URL(request.url).origin
    const reportUrl = `${origin}/api/deep-research/${reportId}`

    return new Response(JSON.stringify({
      runId: reportId,
      reportUrl,
      status: 'completed',
      summary,
      persisted: dbSaved,
      cached: cacheSaved,
      notes,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Deep research API error:', error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
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

function buildDeepResearchRecord(params: {
  reportId: string
  brief: string
  finalReport: string
  summary: string
  provider: Provider
  model: string
  maxQueries: number
  maxTokens: number
  maxSearchCalls: number
  enableFlags: EnableFlags
  tokenProfile: StageTokenProfile
  searchProfile: SearchProfile
  sourceProfile: SourceProfile
  resultProfile: ResultProfile
  searchToolProfile: SearchToolProfile
  searchToolProfiles: SearchToolProfiles
  agentSkillsProfile: AgentSkillsProfile
  agentSkillsProfiles: AgentSkillsProfiles
  agentSkills: AgentSkillSpecs
}) {
  const searchToolProfileWithAgentSkills = {
    ...params.searchToolProfile,
    agentSkills: params.agentSkillsProfile.skills,
    agentSkillsDefinitions: params.agentSkills,
  };
  const searchToolProfilesWithAgentSkills = {
    ...params.searchToolProfiles,
    planner: {
      ...params.searchToolProfiles.planner,
      agentSkills: params.agentSkillsProfiles.planner?.skills,
    },
    research: {
      ...params.searchToolProfiles.research,
      agentSkills: params.agentSkillsProfiles.research?.skills,
    },
    writer: {
      ...params.searchToolProfiles.writer,
      agentSkills: params.agentSkillsProfiles.writer?.skills,
    },
    critic: {
      ...params.searchToolProfiles.critic,
      agentSkills: params.agentSkillsProfiles.critic?.skills,
    },
  } as const;
  return {
    report_id: params.reportId,
    brief: params.brief,
    provider: params.provider,
    model: params.model,
    final_report: params.finalReport,
    summary: params.summary,
    max_queries: params.maxQueries,
    max_tokens: params.maxTokens,
    max_search_calls: params.maxSearchCalls,
    enable_flags: JSON.stringify(params.enableFlags),
    token_profile: JSON.stringify(params.tokenProfile),
    search_profile: JSON.stringify(params.searchProfile),
    source_profile: JSON.stringify(params.sourceProfile),
    result_profile: JSON.stringify(params.resultProfile),
    search_tool_profile: JSON.stringify(searchToolProfileWithAgentSkills),
    search_tool_profiles: JSON.stringify(searchToolProfilesWithAgentSkills),
  } as const
}

async function saveDeepResearchReport(db: D1Database, report: ReturnType<typeof buildDeepResearchRecord>): Promise<void> {
  await db.prepare(`
    INSERT OR REPLACE INTO deep_research_reports (
      report_id,
      brief,
      provider,
      model,
      final_report,
      summary,
      max_queries,
      max_tokens,
      max_search_calls,
      enable_flags,
      token_profile,
      search_profile,
      source_profile,
      result_profile,
      search_tool_profile,
      search_tool_profiles,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `)
    .bind(
      report.report_id,
      report.brief,
      report.provider,
      report.model,
      report.final_report,
      report.summary,
      report.max_queries,
      report.max_tokens,
      report.max_search_calls,
      report.enable_flags,
      report.token_profile,
      report.search_profile,
      report.source_profile,
      report.result_profile,
      report.search_tool_profile,
      report.search_tool_profiles,
    )
    .run()
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

async function loadDeepResearchStorageMode(db?: D1Database): Promise<DeepResearchStorageMode> {
  if (!db) return 'auto'
  try {
    const row = await db.prepare('SELECT value FROM admin_settings WHERE key = ?')
      .bind('deep_research_storage_mode')
      .first<{ value: string }>()
    return normalizeDeepResearchStorageMode(row?.value)
  } catch {
    return 'auto'
  }
}

function normalizeDeepResearchStorageMode(raw: unknown): DeepResearchStorageMode {
  return raw === 'd1' || raw === 'deep_research_kv' || raw === 'session' ? raw : 'auto'
}

function resolveDeepResearchStorage(runtimeEnv: Env, mode: DeepResearchStorageMode): {
  kv?: KVNamespace
  db?: D1Database
} {
  if (mode === 'd1') return { db: runtimeEnv.DB }
  if (mode === 'deep_research_kv') return { kv: runtimeEnv.DEEP_RESEARCH_KV }
  if (mode === 'session') return { kv: runtimeEnv.SESSION }
  return {
    kv: runtimeEnv.DEEP_RESEARCH_KV ?? runtimeEnv.SESSION,
    db: runtimeEnv.DB,
  }
}

function deriveTokenBudget(params: { stage: keyof typeof TOKEN_PROFILES; baseTokens: number }): number {
  const { stage, baseTokens } = params
  const profile = TOKEN_PROFILES[stage]
  const fallback = Math.round(baseTokens * profile.multiplier)
  return clampInt(
    fallback,
    fallback,
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
    return clampInt(Math.round(override), Math.round(baseTokens * profile.multiplier), profile.min, profile.max)
  }
  return deriveTokenBudget({ stage, baseTokens })
}

function normalizeTokenProfile(tokenProfile: unknown): StageTokenProfile {
  if (!tokenProfile || typeof tokenProfile !== 'object' || tokenProfile === null || Array.isArray(tokenProfile)) {
    return {}
  }
  const profile = tokenProfile as Record<string, unknown>
  return {
    planner: typeof profile.planner === 'number' ? profile.planner : undefined,
    research: typeof profile.research === 'number' ? profile.research : undefined,
    writer: typeof profile.writer === 'number' ? profile.writer : undefined,
    critic: typeof profile.critic === 'number' ? profile.critic : undefined,
  } as Partial<Record<keyof typeof TOKEN_PROFILES, number>>
}

function normalizeSearchProfile(searchProfile: unknown): SearchProfile {
  if (!searchProfile || typeof searchProfile !== 'object' || searchProfile === null || Array.isArray(searchProfile)) {
    return {}
  }
  const profile = searchProfile as Record<string, unknown>

  return {
    maxAbstractResults: numberIfFinite(profile.maxAbstractResults),
    maxPostResults: numberIfFinite(profile.maxPostResults),
    maxDocResults: numberIfFinite(profile.maxDocResults),
    maxWebSearchResults: numberIfFinite(profile.maxWebSearchResults),
    maxPageIndexSeeds: numberIfFinite(profile.maxPageIndexSeeds),
  }
}

function normalizeSourceProfile(sourceProfile: unknown): SourceProfile {
  if (!sourceProfile || typeof sourceProfile !== 'object' || sourceProfile === null || Array.isArray(sourceProfile)) {
    return {}
  }
  const profile = sourceProfile as Record<string, unknown>

  return {
    pageIndexMaxSteps: numberIfFinite(profile.pageIndexMaxSteps),
  }
}

function normalizeResultProfile(resultProfile: unknown): ResultProfile {
  if (!resultProfile || typeof resultProfile !== 'object' || resultProfile === null || Array.isArray(resultProfile)) {
    return {}
  }
  const profile = resultProfile as Record<string, unknown>

  return {
    writerContextSources: numberIfFinite(profile.writerContextSources),
  }
}

function normalizeSearchToolProfile(searchToolProfile: unknown): SearchToolProfile {
  if (!searchToolProfile || typeof searchToolProfile !== 'object' || searchToolProfile === null || Array.isArray(searchToolProfile)) {
    return {}
  }
  const profile = searchToolProfile as Record<string, unknown>

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
  if (!searchToolProfiles || typeof searchToolProfiles !== 'object' || searchToolProfiles === null || Array.isArray(searchToolProfiles)) {
    return {}
  }
  const profiles = searchToolProfiles as Record<string, unknown>
  return {
    planner: normalizeSearchToolProfile(profiles.planner),
    research: normalizeSearchToolProfile(profiles.research),
    writer: normalizeSearchToolProfile(profiles.writer),
    critic: normalizeSearchToolProfile(profiles.critic),
  }
}

function normalizeAgentSkillList(raw: unknown): AgentSkill[] {
  if (!Array.isArray(raw)) return []
  const normalized = new Set<AgentSkill>()
  for (const item of raw) {
    if (typeof item === 'string') {
      const candidate = item.trim().toLowerCase()
      if (candidate) {
        normalized.add(candidate as AgentSkill)
      }
    }
  }
  return Array.from(normalized)
}

function normalizeAgentSkillsProfile(rawProfile: unknown): AgentSkillsProfile {
  if (!rawProfile || typeof rawProfile !== 'object' || rawProfile === null || Array.isArray(rawProfile)) {
    return {}
  }
  const profile = rawProfile as Record<string, unknown>

  return {
    skills: normalizeAgentSkillList(profile.skills),
  }
}

function normalizeAgentSkillsProfiles(rawProfiles: unknown): AgentSkillsProfiles {
  if (!rawProfiles || typeof rawProfiles !== 'object' || rawProfiles === null || Array.isArray(rawProfiles)) {
    return {}
  }
  const profiles = rawProfiles as Record<string, unknown>
  return {
    planner: normalizeAgentSkillsProfile(profiles.planner),
    research: normalizeAgentSkillsProfile(profiles.research),
    writer: normalizeAgentSkillsProfile(profiles.writer),
    critic: normalizeAgentSkillsProfile(profiles.critic),
  }
}

function normalizeAgentSkills(rawSkills: unknown): AgentSkillSpecs {
  if (typeof rawSkills === 'string') {
    return parseAgentSkillsText(rawSkills)
  }
  if (!rawSkills || typeof rawSkills !== 'object' || Array.isArray(rawSkills)) {
    return {
      raw: '',
      entries: [],
    }
  }
  const candidate = rawSkills as Record<string, unknown>
  if (typeof candidate.raw === 'string') {
    return parseAgentSkillsText(candidate.raw)
  }
  return {
    raw: '',
    entries: [],
  }
}

function parseAgentSkillsText(raw: string): AgentSkillSpecs {
  const source = normalizeText(raw).trim()
  if (!source) {
    return {
      raw: '',
      entries: [],
    }
  }

  const entries: AgentSkillSpecEntry[] = []
  const metaBlockRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---/gm
  let match: RegExpExecArray | null
  const matches = Array.from(source.matchAll(metaBlockRegex))
  for (let index = 0; index < matches.length; index += 1) {
    match = matches[index] as RegExpExecArray
    const block = String(match[1] ?? '')
    const nameMatch = block.match(/(^|\r?\n)name:\s*(.+)\s*$/m)
    const descriptionMatch = block.match(/(^|\r?\n)description:\s*(.+)\s*$/m)
    if (!nameMatch || !descriptionMatch) continue

    const name = String(nameMatch[2] ?? '').trim()
    const description = String(descriptionMatch[2] ?? '').trim()
    if (!name || !description) continue

    const bodyStart = (match.index ?? 0) + match[0].length
    const nextMatch = matches[index + 1]
    const bodyEnd = nextMatch?.index ?? source.length
    const body = source.slice(bodyStart, bodyEnd).trim()
    entries.push({ name, description, body })
  }

  return { raw: source, entries }
}

function buildAgentSkillInstructions(
  stage: keyof AgentSkillsProfiles,
  globalProfile: AgentSkillsProfile,
  stageProfile: AgentSkillsProfile | undefined,
  specs: AgentSkillSpecs,
): string {
  const selected = new Set([...(globalProfile.skills ?? []), ...(stageProfile?.skills ?? [])])
  if (!selected.size || !specs.entries.length) return ''

  const blocks = specs.entries
    .filter((entry) => selected.has(entry.name.trim().toLowerCase()))
    .map((entry) => {
      const body = entry.body ? `\n${entry.body}` : ''
      return `Skill: ${entry.name}\nDescription: ${entry.description}${body}`
    })

  if (!blocks.length) return ''
  return [
    `Apply these agent skill instructions for the ${stage} stage when they are relevant.`,
    'They are operating guidance, not facts about the research topic.',
    blocks.join('\n\n---\n\n'),
  ].join('\n\n')
}

function normalizeText(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim() : ''
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
  if (!rawFlags || typeof rawFlags !== 'object' || rawFlags === null || Array.isArray(rawFlags)) {
    return {}
  }
  const flags = rawFlags as Record<string, unknown>

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
