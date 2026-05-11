import { describe, expect, it } from 'vitest'
import { buildShadowBaselineConfig, withConfigOverrides } from './settings'
import type { RagRuntimeConfig } from './state'

const baseConfig: RagRuntimeConfig = {
  hydeEnabled: true,
  multiQueryEnabled: true,
  rerankerEnabled: true,
  criticEnabled: true,
  shadowModeEnabled: true,
  semanticCacheThreshold: 0.95,
  rerankerMinKeep: 3,
  mmrLambda: 0.7,
  checkpointThresholdRatio: 0.7,
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
    expect(baseline.semanticCacheThreshold).toBe(0.95)
  })
})
