import { describe, expect, it } from 'vitest'
import { buildShadowBaselineConfig, withConfigOverrides } from './settings'
import type { RagRuntimeConfig } from './state'
import { SUPPORTED_SEARCH_TOOL_PROVIDERS } from './search-tools'

const baseConfig: RagRuntimeConfig = {
  pipelineEngine: 'langgraph',
  defaultProvider: 'groq',
  defaultModel: 'llama-3.3-70b-versatile',
  stageOverrides: {},
  fallbackProvider: null,
  fallbackModel: null,
  hydeEnabled: true,
  multiQueryEnabled: true,
  rerankerEnabled: true,
  criticEnabled: true,
  plannerEnabled: true,
  researchEnabled: true,
  writerEnabled: true,
  pageIndexEnabled: true,
  pageIndexMaxSteps: 5,
  bm25ShortCircuitEnabled: true,
  shadowModeEnabled: true,
  semanticCacheThreshold: 0.95,
  rerankerMinKeep: 3,
  mmrLambda: 0.7,
  checkpointThresholdRatio: 0.7,
  searchToolsEnabled: true,
  searchToolProviders: [...SUPPORTED_SEARCH_TOOL_PROVIDERS],
  searchToolMaxResults: 4,
  searchToolTimeoutMs: 8000,
}

describe('rag settings helpers', () => {
  it('applies config overrides immutably', () => {
    const next = withConfigOverrides(baseConfig, { rerankerEnabled: false })
    expect(next.rerankerEnabled).toBe(false)
    expect(baseConfig.rerankerEnabled).toBe(true)
  })

  it('builds a shadow baseline with advanced features disabled', () => {
    const baseline = buildShadowBaselineConfig(baseConfig)
    expect(baseline.hydeEnabled).toBe(false)
    expect(baseline.multiQueryEnabled).toBe(false)
    expect(baseline.rerankerEnabled).toBe(false)
    expect(baseline.criticEnabled).toBe(false)
    expect(baseline.pageIndexEnabled).toBe(false)
    expect(baseline.bm25ShortCircuitEnabled).toBe(false)
    expect(baseline.semanticCacheThreshold).toBe(0.95)
  })
})
