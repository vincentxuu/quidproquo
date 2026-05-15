import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'
import { SUPPORTED_PROVIDERS } from './providers'
import { SUPPORTED_SEARCH_TOOL_PROVIDERS } from '../search-tools'

interface SettingsEnv {
  DB: D1Database
}

const DEFAULTS: RagRuntimeConfig = {
  pipelineEngine: 'langgraph',
  defaultProvider: 'groq',
  defaultModel: 'llama-3.3-70b-versatile',
  stageOverrides: {},
  fallbackProvider: null,
  fallbackModel: null,
  hydeEnabled: false,
  multiQueryEnabled: false,
  rerankerEnabled: false,
  criticEnabled: true,
  pageIndexEnabled: false,
  pageIndexMaxSteps: 5,
  bm25ShortCircuitEnabled: true,
  plannerEnabled: true,
  researchEnabled: true,
  writerEnabled: true,
  shadowModeEnabled: false,
  semanticCacheThreshold: 0.95,
  rerankerMinKeep: 3,
  mmrLambda: 0.7,
  checkpointThresholdRatio: 0.7,
  searchToolsEnabled: false,
  searchToolProviders: [...SUPPORTED_SEARCH_TOOL_PROVIDERS],
  searchToolMaxResults: 4,
  searchToolTimeoutMs: 8000,
}

const SETTINGS_KEYS = {
  pipelineEngine: 'rag_pipeline_engine',
  defaultProvider: 'rag_default_provider',
  defaultModel: 'rag_default_model',
  stageOverrides: 'rag_stage_overrides',
  fallbackProvider: 'rag_fallback_provider',
  fallbackModel: 'rag_fallback_model',
  hydeEnabled: 'rag_flag_hyde',
  multiQueryEnabled: 'rag_flag_multi_query',
  rerankerEnabled: 'rag_flag_reranker',
  criticEnabled: 'rag_flag_critic',
  plannerEnabled: 'rag_flag_planner',
  researchEnabled: 'rag_flag_research',
  writerEnabled: 'rag_flag_writer',
  pageIndexEnabled: 'rag_flag_pageindex',
  pageIndexMaxSteps: 'rag_pageindex_max_steps',
  bm25ShortCircuitEnabled: 'rag_flag_bm25_short_circuit',
  shadowModeEnabled: 'rag_shadow_mode',
  semanticCacheThreshold: 'semantic_cache_threshold',
  rerankerMinKeep: 'rag_reranker_min_keep',
  mmrLambda: 'rag_mmr_lambda',
  checkpointThresholdRatio: 'rag_checkpoint_threshold_ratio',
  searchToolsEnabled: 'rag_search_tools_enabled',
  searchToolProviders: 'rag_search_tool_providers',
  searchToolMaxResults: 'rag_search_tool_max_results',
  searchToolTimeoutMs: 'rag_search_tool_timeout_ms',
} as const

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback
  return value === '1' || value.toLowerCase() === 'true'
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (value == null) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function parseChoice<T extends string>(value: string | undefined, choices: readonly T[], fallback: T): T {
  return value != null && choices.includes(value as T) ? value as T : fallback
}

function parseNullableChoice<T extends string>(value: string | undefined, choices: readonly T[]): T | null {
  if (value == null || value === '') return null
  return choices.includes(value as T) ? value as T : null
}

function parseJsonRecord(value: string | undefined): RagRuntimeConfig['stageOverrides'] {
  if (value == null) return DEFAULTS.stageOverrides
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : DEFAULTS.stageOverrides
  } catch {
    return DEFAULTS.stageOverrides
  }
}

function parseSearchToolProviders(value: string | undefined, fallback: string[]): string[] {
  if (value == null || value.trim() === '') return fallback
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return fallback
    return parsed
      .map((item) => (typeof item === 'string' ? item.trim().toLowerCase() : ''))
      .filter((item) => item.length > 0)
  } catch {
    return fallback
  }
}

export async function loadRagSettings(): Promise<RagRuntimeConfig> {
  const { DB } = env as unknown as SettingsEnv
  const rows = await DB.prepare(
    `SELECT key, value FROM settings WHERE key IN (${Object.values(SETTINGS_KEYS).map(() => '?').join(', ')})`
  )
    .bind(...Object.values(SETTINGS_KEYS))
    .all<{ key: string; value: string }>()

  const byKey = new Map(rows.results.map(row => [row.key, row.value]))

  return {
    pipelineEngine: parseChoice(
      byKey.get(SETTINGS_KEYS.pipelineEngine),
      ['langgraph', 'manual', 'llamaindex'] as const,
      DEFAULTS.pipelineEngine,
    ),
    defaultProvider: parseChoice(
      byKey.get(SETTINGS_KEYS.defaultProvider),
      SUPPORTED_PROVIDERS,
      DEFAULTS.defaultProvider,
    ),
    defaultModel: byKey.get(SETTINGS_KEYS.defaultModel) ?? DEFAULTS.defaultModel,
    stageOverrides: parseJsonRecord(byKey.get(SETTINGS_KEYS.stageOverrides)),
    fallbackProvider: parseNullableChoice(byKey.get(SETTINGS_KEYS.fallbackProvider), SUPPORTED_PROVIDERS),
    fallbackModel: byKey.get(SETTINGS_KEYS.fallbackModel) || DEFAULTS.fallbackModel,
    hydeEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.hydeEnabled), DEFAULTS.hydeEnabled),
    multiQueryEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.multiQueryEnabled), DEFAULTS.multiQueryEnabled),
    rerankerEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.rerankerEnabled), DEFAULTS.rerankerEnabled),
    criticEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.criticEnabled), DEFAULTS.criticEnabled),
    plannerEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.plannerEnabled), DEFAULTS.plannerEnabled),
    researchEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.researchEnabled), DEFAULTS.researchEnabled),
    writerEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.writerEnabled), DEFAULTS.writerEnabled),
    pageIndexEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.pageIndexEnabled), DEFAULTS.pageIndexEnabled),
    pageIndexMaxSteps: parseNumber(byKey.get(SETTINGS_KEYS.pageIndexMaxSteps), DEFAULTS.pageIndexMaxSteps),
    bm25ShortCircuitEnabled: parseBoolean(
      byKey.get(SETTINGS_KEYS.bm25ShortCircuitEnabled),
      DEFAULTS.bm25ShortCircuitEnabled
    ),
    shadowModeEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.shadowModeEnabled), DEFAULTS.shadowModeEnabled),
    semanticCacheThreshold: parseNumber(byKey.get(SETTINGS_KEYS.semanticCacheThreshold), DEFAULTS.semanticCacheThreshold),
    rerankerMinKeep: parseNumber(byKey.get(SETTINGS_KEYS.rerankerMinKeep), DEFAULTS.rerankerMinKeep),
    mmrLambda: parseNumber(byKey.get(SETTINGS_KEYS.mmrLambda), DEFAULTS.mmrLambda),
    checkpointThresholdRatio: parseNumber(byKey.get(SETTINGS_KEYS.checkpointThresholdRatio), DEFAULTS.checkpointThresholdRatio),
    searchToolsEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.searchToolsEnabled), false),
    searchToolProviders: parseSearchToolProviders(
      byKey.get(SETTINGS_KEYS.searchToolProviders),
      DEFAULTS.searchToolProviders,
    ),
    searchToolMaxResults: parseNumber(byKey.get(SETTINGS_KEYS.searchToolMaxResults), 4),
    searchToolTimeoutMs: parseNumber(byKey.get(SETTINGS_KEYS.searchToolTimeoutMs), 8000),
  }
}

export function withConfigOverrides(
  config: RagRuntimeConfig,
  overrides: Partial<RagRuntimeConfig>
): RagRuntimeConfig {
  return { ...config, ...overrides }
}

export function buildShadowBaselineConfig(config: RagRuntimeConfig): RagRuntimeConfig {
  return {
    ...config,
    hydeEnabled: false,
    multiQueryEnabled: false,
    rerankerEnabled: false,
    criticEnabled: false,
    pageIndexEnabled: false,
    bm25ShortCircuitEnabled: false,
    shadowModeEnabled: false,
  }
}
