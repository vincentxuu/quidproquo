import { env } from 'cloudflare:workers'
import type { RagRuntimeConfig } from './state'

interface SettingsEnv {
  DB: D1Database
}

const DEFAULTS: RagRuntimeConfig = {
  hydeEnabled: false,
  multiQueryEnabled: false,
  rerankerEnabled: false,
  criticEnabled: true,
  shadowModeEnabled: false,
  semanticCacheThreshold: 0.95,
  rerankerMinKeep: 3,
  mmrLambda: 0.7,
  checkpointThresholdRatio: 0.7,
}

const SETTINGS_KEYS = {
  hydeEnabled: 'rag_flag_hyde',
  multiQueryEnabled: 'rag_flag_multi_query',
  rerankerEnabled: 'rag_flag_reranker',
  criticEnabled: 'rag_flag_critic',
  shadowModeEnabled: 'rag_shadow_mode',
  semanticCacheThreshold: 'semantic_cache_threshold',
  rerankerMinKeep: 'rag_reranker_min_keep',
  mmrLambda: 'rag_mmr_lambda',
  checkpointThresholdRatio: 'rag_checkpoint_threshold_ratio',
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

export async function loadRagSettings(): Promise<RagRuntimeConfig> {
  const { DB } = env as unknown as SettingsEnv
  const rows = await DB.prepare(
    `SELECT key, value FROM settings WHERE key IN (${Object.values(SETTINGS_KEYS).map(() => '?').join(', ')})`
  )
    .bind(...Object.values(SETTINGS_KEYS))
    .all<{ key: string; value: string }>()

  const byKey = new Map(rows.results.map(row => [row.key, row.value]))

  return {
    hydeEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.hydeEnabled), DEFAULTS.hydeEnabled),
    multiQueryEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.multiQueryEnabled), DEFAULTS.multiQueryEnabled),
    rerankerEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.rerankerEnabled), DEFAULTS.rerankerEnabled),
    criticEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.criticEnabled), DEFAULTS.criticEnabled),
    shadowModeEnabled: parseBoolean(byKey.get(SETTINGS_KEYS.shadowModeEnabled), DEFAULTS.shadowModeEnabled),
    semanticCacheThreshold: parseNumber(byKey.get(SETTINGS_KEYS.semanticCacheThreshold), DEFAULTS.semanticCacheThreshold),
    rerankerMinKeep: parseNumber(byKey.get(SETTINGS_KEYS.rerankerMinKeep), DEFAULTS.rerankerMinKeep),
    mmrLambda: parseNumber(byKey.get(SETTINGS_KEYS.mmrLambda), DEFAULTS.mmrLambda),
    checkpointThresholdRatio: parseNumber(byKey.get(SETTINGS_KEYS.checkpointThresholdRatio), DEFAULTS.checkpointThresholdRatio),
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
    shadowModeEnabled: false,
  }
}
